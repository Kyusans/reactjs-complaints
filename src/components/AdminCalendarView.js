import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Container, Spinner } from 'react-bootstrap'
import axios from 'axios';
import JobDetails from './JobDetails'
import { colorFormatter } from './PersonnelJobCalendarView'
import { statusFormatter } from './ClientCalendarView'
import JobOrderModal from './JobOrderModal'

function AdminCalendarView() {
  const [events, setEvents] = useState(null);
  const [ticketId, setTicketId] = useState("");
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showJobOrderModal, setShowJobOrderModal] = useState(false);
  const [startDateOnly, setStartDateOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = async () => {
    setEvents(null);
    await getAllTickets();
    setShowJobOrderModal(false)
  };

  const hideJobDetails = () => {
    getAllTickets();
    setShowJobDetails(false);
  }

  const getAllTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const userId = localStorage.getItem("userId");
      const jsonData = { userId: userId }
      const formData = new FormData();
      formData.append("operation", "getAllTickets");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios({ url: url, data: formData, method: "post" });
      if (res.data !== 0) {
        console.log("getalltickets res.data: " + JSON.stringify(res.data));
        const formattedEvents = res.data.map((comp) => ({
          id: comp.comp_id,
          status: comp.comp_status,
          title: comp.comp_subject,
          start: new Date(comp.comp_date),
          end: startDateOnly ? null : new Date(comp.comp_end_date),
          color: colorFormatter(statusFormatter(comp.comp_status)),
        }));
        setEvents(formattedEvents);
      }
    } catch (error) {
      alert("There was an unexpected error: " + error);
    }finally{
      setIsLoading(false);
    }
  }, [startDateOnly]);

  const handleStartDateOnly = (status) => {
    setStartDateOnly(status === 1);
    getAllTickets();
  }

  function handleEventClick(info) {
    console.log("status: " + info.event.extendedProps.status)
    setTicketId(info.event.id);
    if (info.event.extendedProps.status === 1) {
      setShowJobOrderModal(true);
    } else {
      setShowJobDetails(true);
    }
  };

  useEffect(() => {
    getAllTickets()
  }, [getAllTickets])

  const maxEventsToShow = 4;

  return (
    <Container fluid className="vh-100 text-white scrollable-container">
      {!startDateOnly ?
        (<Button onClick={() => handleStartDateOnly(1)}>Start date only</Button>)
        :
        (<Button onClick={() => handleStartDateOnly(0)} className='btn-secondary'>Include end date</Button>)
      }
      {isLoading ?
        <Container className='text-center'>
          <Spinner animation='border' variant='success' />
        </Container>
        :
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

      }

      <JobOrderModal show={showJobOrderModal} onHide={handleClose} ticketId={ticketId} />
      <JobDetails show={showJobDetails} onHide={hideJobDetails} compId={ticketId} />
    </Container>
  );

}

export default AdminCalendarView