import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import React, { useCallback, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import axios from 'axios';
import JobDetails from './JobDetails'

function PersonnelJobCalendarView() {
  const [events, setEvents] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [showJobDetails, setShowJobDetails] = useState(false);

  const hideJobDetails = () => {
    getJobTicket();
    setShowJobDetails(false);
  }

  const getJobTicket = useCallback(async () => {
    try {
      const url = localStorage.getItem("url") + "personnel.php";
      const userId = localStorage.getItem("userId");
      const jsonData = { userId: userId }
      const formData = new FormData();
      formData.append("operation", "getJobTicket");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios({ url: url, data: formData, method: "post" });
      if (res.data !== 0) {
        const formattedEvents = res.data.map((job) => ({
          id: job.job_complaintId,
          title: job.job_title,
          start: new Date(job.job_createDate),
          end: new Date(job.comp_end_date),
          color: colorFormatter(job.joStatus_name),
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
    getJobTicket()
  }, [getJobTicket])

  const maxEventsToShow = 4;

  return (
    <Container fluid className="vh-100 text-white scrollable-container">
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
    </Container>
  )
}

export default PersonnelJobCalendarView;

export function colorFormatter(status) {
  var colorCode = "";
  switch (status) {
    case "Pending":
      colorCode = "#080808";
      break;
    case "On-Going":
      colorCode = "#ffa500";
      break;
    default:
      colorCode = "#006400"
      break;
  }
  return colorCode;
}