import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import React, { useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import JobDetails from './JobDetails'
import { colorFormatter } from './PersonnelJobCalendarView'
import { statusFormatter } from './ClientCalendarView'
import JobOrderModal from './JobOrderModal'

function AdminCalendarView({ allData, refreshData }) {
  const [eventsWithoutEndDate, setEventsWithoutEndDate] = useState([]);
  const [events, setEvents] = useState(null);
  const [ticketId, setTicketId] = useState("");
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showJobOrderModal, setShowJobOrderModal] = useState(false);
  const [startDateOnly, setStartDateOnly] = useState(false);

  const handleClose = async () => {
    setEvents(null);
    await refreshData();
    setShowJobOrderModal(false)
  };

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
      setShowJobOrderModal(true);
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
  }, [allData,])

  const maxEventsToShow = 4;

  return (
    <Container fluid className="vh-100 text-white scrollable-container">
      {!startDateOnly ?
        (<Button onClick={() => handleStartDateOnly(1)}>Show Start Date Only</Button>)
        :
        (<Button onClick={() => handleStartDateOnly(0)} className='btn-info'>Include Deadline</Button>)
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

      <JobOrderModal show={showJobOrderModal} onHide={handleClose} ticketId={ticketId} />
      <JobDetails show={showJobDetails} onHide={hideJobDetails} compId={ticketId} />
    </Container>
  );

}

export default AdminCalendarView