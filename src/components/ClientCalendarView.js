import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import React, { useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import JobDetails from './JobDetails'
import { colorFormatter } from './PersonnelJobCalendarView'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import ComplaintForm from './ComplaintForm'
import UpdateTicketModal from './UpdateTicketModal'

function ClientCalendarView({ allData, refreshData }) {
  const [eventsWithoutEndDate, setEventsWithoutEndDate] = useState([]);
  const [events, setEvents] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [startDateOnly, setStartDateOnly] = useState(false);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const closeUpdateModal = async () => {
    await refreshData();
    setShowUpdateModal(false);
  };

  const openComplaintModal = () => { setShowComplaintModal(true); }
  const closeComplaintModal = async () => {
    await refreshData();
    setShowComplaintModal(false);
  }
  const [showJobDetails, setShowJobDetails] = useState(false);
  const hideJobDetails = async () => {
    await refreshData();
    setShowJobDetails(false);
  }

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
    if (allData) {
      // with end dates (default)
      const formattedEvents = allData.map((comp) => ({
        id: comp.comp_id,
        status: comp.comp_status,
        title: comp.comp_subject,
        start: new Date(comp.comp_date),
        end: new Date(comp.comp_end_date),
        color: colorFormatter(statusFormatter(comp.comp_status)),
      }));
      setEvents(formattedEvents);

      // without end date para sa switch 
      const withoutEndDate = allData.map((comp) => ({
        id: comp.comp_id,
        status: comp.comp_status,
        title: comp.comp_subject,
        date: new Date(comp.comp_date),
        color: colorFormatter(statusFormatter(comp.comp_status)),
      }));
      setEventsWithoutEndDate(withoutEndDate);
    }
  }, [allData]);

  const maxEventsToShow = 4;

  return (
    <Container fluid className="vh-100 text-white scrollable-container">
      <Button className='btn btn-success mt-3 ms-2' onClick={openComplaintModal}>
        <FontAwesomeIcon icon={faPlus} /> Add Ticket
      </Button>
      {!startDateOnly ?
        (<Button onClick={() => handleStartDateOnly(1)} className='mt-3 ms-1'>Show Start Date Only</Button>)
        :
        (<Button onClick={() => handleStartDateOnly(0)} className='btn-info mt-3 ms-1'>Include Deadline</Button>)
      }

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
      <JobDetails show={showJobDetails} onHide={hideJobDetails} compId={ticketId} />
      <ComplaintForm show={showComplaintModal} onHide={closeComplaintModal} />
      <UpdateTicketModal show={showUpdateModal} onHide={closeUpdateModal} compId={ticketId} />
    </Container>
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