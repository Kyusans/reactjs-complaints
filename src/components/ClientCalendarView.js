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

function ClientCalendarView() {
  const [events, setEvents] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const closeUpdateModal = () => { setShowUpdateModal(false) };

  const openComplaintModal = () => { setShowComplaintModal(true); }
  const closeComplaintModal = () => {
    getComplaints();
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
        const formattedEvents = res.data.map((comp) => ({
          id: comp.comp_id,
          status: comp.comp_status,
          title: comp.comp_subject,
          start: new Date(comp.comp_date),
          end: new Date(comp.comp_end_date),
          color: colorFormatter(statusFormatter(comp.comp_status)),
        }));
        setEvents(formattedEvents);
      }
    } catch (error) {
      alert("There was an unexpected error: " + error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
          <FullCalendar
            className="clickable"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView='dayGridMonth'
            weekends={true}
            events={events || []}
            dayMaxEvents={events && events.length >= maxEventsToShow ? maxEventsToShow : false}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'title',
              center: '',
              right: 'today,prev,next dayGridMonth,timeGridWeek,timeGridDay'
            }}
            height={'90vh'}
          />
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