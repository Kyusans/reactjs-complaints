import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import React, { useCallback, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import axios from 'axios';
import JobDetails from './JobDetails'
import { colorFormatter } from './PersonnelJobCalendarView'
import { statusFormatter } from './ClientCalendarView'

function AdminCalendarView() {
  const [events, setEvents] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [showJobDetails, setShowJobDetails] = useState(false);

  const hideJobDetails = () => {
    getAllTickets();
    setShowJobDetails(false);
  }

  const getAllTickets = useCallback(async () => {
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const userId = localStorage.getItem("userId");
      const jsonData = { userId: userId }
      const formData = new FormData();
      formData.append("operation", "getAllTickets");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios({ url: url, data: formData, method: "post" });
      if (res.data !== 0) {
        const formattedEvents = res.data.map((comp) => ({
          id: comp.comp_id,
          title: comp.comp_subject,
          start: new Date(comp.comp_date),
          end: new Date(comp.comp_end_date),
          color: colorFormatter(statusFormatter(comp.comp_status)),
        }));
        setEvents(formattedEvents);
      }
    } catch (error) {
      alert("There was an unexpected error: " + error);
    }
  }, []);

  function handleEventClick(info) {
    setTicketId(info.event.id);
    setShowJobDetails(true);
  };

  useEffect(() => {
    getAllTickets()
  }, [getAllTickets])

  return (
    <Container fluid className="vh-100 text-white scrollable-container">
      <FullCalendar
        className="clickable"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        weekends={true}
        events={events}
        dayMaxEvents={true}
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'title',
          center: '',
          right: 'today,prev,next dayGridMonth,timeGridWeek,timeGridDay'
        }}
        height={'90vh'}
      />
      <JobDetails show={showJobDetails} onHide={hideJobDetails} compId={ticketId} />
    </Container>
  )
}

export default AdminCalendarView