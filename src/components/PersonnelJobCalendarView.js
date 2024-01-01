import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import React, { useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import JobDetails from './JobDetails'

function PersonnelJobCalendarView({ allData, refreshData }) {
  const [eventsWithoutEndDate, setEventsWithoutEndDate] = useState([]);
  const [events, setEvents] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [startDateOnly, setStartDateOnly] = useState(false);

  const hideJobDetails = async () => {
    await refreshData();
    setShowJobDetails(false);
  }

  const handleStartDateOnly = (status) => {
    setStartDateOnly(status === 1);
  }

  function handleEventClick(info) {
    setTicketId(info.event.id);
    setShowJobDetails(true);
  };

  useEffect(() => {
    if (allData) {
      // console.log('allData sa calendar: ', allData);
      // with end dates (default)
      const formattedEvents = allData.map((job) => ({
        id: job.job_complaintId,
        title: job.job_title,
        start: new Date(job.job_createDate),
        end: new Date(job.comp_end_date),
        color: colorFormatter(job.joStatus_name),
      }));
      setEvents(formattedEvents);

      // without end date para sa switch 
      const withoutEndDate = allData.map((job) => ({
        id: job.job_complaintId,
        title: job.job_title,
        date: new Date(job.job_createDate),
        color: colorFormatter(job.joStatus_name),
      }));
      setEventsWithoutEndDate(withoutEndDate);
    }
  }, [allData])

  const maxEventsToShow = 4;

  return (
    <Container fluid className="mt-2 vh-100 text-white scrollable-container">
      <Container>
        {!startDateOnly ?
          (<Button onClick={() => handleStartDateOnly(1)} className='ms-2'>Show Start Date Only</Button>)
          :
          (<Button onClick={() => handleStartDateOnly(0)} className='btn-info ms-2'>Include Deadline</Button>)
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
      colorCode = "#228b22"
      break;
  }
  return colorCode;
}