import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Container, Spinner } from 'react-bootstrap'
import axios from 'axios';
import JobDetails from './JobDetails'

function PersonnelJobCalendarView() {
  const [originalEvents, setOriginalEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [startDateOnly, setStartDateOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hideJobDetails = () => {
    getJobTicket();
    setShowJobDetails(false);
  }

  const getJobTicket = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "personnel.php";
      const userId = localStorage.getItem("userId");
      const jsonData = { userId: userId }
      const formData = new FormData();
      formData.append("operation", "getJobTicket");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios({ url: url, data: formData, method: "post" });
      if (res.data !== 0) {
        console.log("Res.data ni getJobTicket", JSON.stringify(res.data));
        setOriginalEvents(res.data);
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
    } finally {
      // setIsLoading(false);
    }
  }, []);

  const handleStartDateOnly = (status) => {
    setStartDateOnly(status === 1);
    updateEvent();
  }

  function updateEvent() {
    const updateEvent = originalEvents.map((job) => ({
      id: job.job_complaintId,
      title: job.job_title,
      start: new Date(job.job_createDate),
      end: startDateOnly ? null : new Date(job.comp_end_date),
      color: colorFormatter(job.joStatus_name),
    }));
    setEvents(updateEvent);
  }

  function handleEventClick(info) {
    setTicketId(info.event.id);
    setShowJobDetails(true);
  };

  useEffect(() => {
    getJobTicket()
  }, [getJobTicket])

  const maxEventsToShow = 4;

  return (
    <Container fluid className="mt-2 vh-100 text-white scrollable-container">
      <Container>
        {!startDateOnly ?
          (<Button onClick={() => handleStartDateOnly(1)} className='ms-2'>Show Start Date Only</Button>)
          :
          (<Button onClick={() => handleStartDateOnly(0)} className='btn-secondary ms-2'>Include Deadline</Button>)
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

      </Container>
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