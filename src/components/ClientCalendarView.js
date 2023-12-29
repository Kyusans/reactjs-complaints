import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Container, Spinner } from 'react-bootstrap'
import axios from 'axios';
import JobDetails from './JobDetails'
import { colorFormatter } from './PersonnelJobCalendarView'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import ComplaintForm from './ComplaintForm'
import UpdateTicketModal from './UpdateTicketModal'

function ClientCalendarView({allData, refreshData}) {
  const [eventsWithoutEndDate, setEventsWithoutEndDate] = useState([]);
  const [events, setEvents] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startDateOnly, setStartDateOnly] = useState(false);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const closeUpdateModal = async () => { 
    await getComplaints();
    setShowUpdateModal(false); 
  };

  const openComplaintModal = () => { setShowComplaintModal(true); }
  const closeComplaintModal = async () => {
    await getComplaints();
    setShowComplaintModal(false);
  }
  const [showJobDetails, setShowJobDetails] = useState(false);
  const hideJobDetails = () => {
    getComplaints();
    setShowJobDetails(false);
  }

  const getComplaints = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "users.php";
      const userId = localStorage.getItem("userId");
      const jsonData = { userId: userId }
      const formData = new FormData();
      formData.append("operation", "getComplaints");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios({ url: url, data: formData, method: "post" });
      console.log("res ni getComplaints", JSON.stringify(res.data));
      if (res.data !== 0) {
        // with end dates (default)
        const formattedEvents = res.data.map((comp) => ({
          id: comp.comp_id,
          status: comp.comp_status,
          title: comp.comp_subject,
          start: new Date(comp.comp_date),
          end: new Date(comp.comp_end_date),
          color: colorFormatter(statusFormatter(comp.comp_status)),
        }));
        setEvents(formattedEvents);

        // without end date para sa switch 
        const withoutEndDate = res.data.map((comp) => ({
          id: comp.comp_id,
          status: comp.comp_status,
          title: comp.comp_subject,
          date: new Date(comp.comp_date),
          color: colorFormatter(statusFormatter(comp.comp_status)),
        }));
        setEventsWithoutEndDate(withoutEndDate);
      }
    } catch (error) {
      alert("There was an unexpected error: " + error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleStartDateOnly = (status) => {
    setStartDateOnly(status === 1);
  }

  function handleEventClick(info) {
    setTicketId(info.event.id);
    if (info.event.extendedProps.status === 1) {
      setShowUpdateModal(true);
    } else {
      setShowJobDetails(true);
    }
  };

  useEffect(() => {
    getComplaints()
  }, [getComplaints]);

  const maxEventsToShow = 4;

  return (
    <>
      {isLoading
        ?
        <Container className='text-center'>
          <Spinner animation='border' variant='success' />
        </Container>
        :
        <Container fluid className="vh-100 text-white scrollable-container">
          <Button className='btn btn-success mt-3 ms-2' onClick={openComplaintModal}>
            <FontAwesomeIcon icon={faPlus} /> Add Ticket
          </Button>
          {!startDateOnly ?
            (<Button onClick={() => handleStartDateOnly(1)} className='mt-3 ms-1'>Show Start Date Only</Button>)
            :
            (<Button onClick={() => handleStartDateOnly(0)} className='btn-info mt-3 ms-1'>Include Deadline</Button>)
          }
          {isLoading ?
            <Container className='text-center mt-3'>
              <Spinner animation='border' variant='success' />
            </Container>
            :
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView='dayGridMonth'
              weekends={true}
              allDaySlot={false}
              events={startDateOnly ? eventsWithoutEndDate : events || []}
              dayMaxEvents={events && events.length >= maxEventsToShow ? maxEventsToShow : false}
              eventClick={handleEventClick}
              headerToolbar={{
                left: 'title',
                center: '',
                right: 'today,prev,next dayGridMonth,timeGridWeek,timeGridDay'
              }}
              height={'90vh'}
            />

          }
          <JobDetails show={showJobDetails} onHide={hideJobDetails} compId={ticketId} />
          <ComplaintForm show={showComplaintModal} onHide={closeComplaintModal} />
          <UpdateTicketModal show={showUpdateModal} onHide={closeUpdateModal} compId={ticketId} />
        </Container>
      }
    </>

  )
}

export default ClientCalendarView

export function statusFormatter(status) {
  var statusName = "";

  switch (status) {
    case 1:
      statusName = "Pending";
      break;
    case 2:
      statusName = "On-Going";
      break;
    default:
      statusName = "Completed";
      break;
  }

  return statusName;
}