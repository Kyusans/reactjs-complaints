import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import React, { useCallback, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import axios from 'axios';

function PersonnelJobCalendarView() {
  const [events, setEvents] = useState([]);

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
        const formattedEvents = res.data.map((job, index) => ({
          title: job.job_title,
          start: new Date(job.job_createDate),
          end: new Date(job.job_end_date),
          backgroundColor: getColorByIndex(index), // Use eventBackgroundColor
        }));
        setEvents(formattedEvents);
      }
    } catch (error) {
      alert("There was an unexpected error: " + error);
    }
  },[])

  const getColorByIndex = (index) => {
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"];
    return colors[index % colors.length];
  };

  useEffect(() => {
    getJobTicket()
  }, [getJobTicket])

  return (
    <Container fluid>
      <Row className='vh-100'>
        <Col className='p-3 bg-dark text-white'>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView='dayGridMonth'
            weekends={true}
            events={events}
            selectMirror={true}
            dayMaxEvents={true}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek'
            }}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default PersonnelJobCalendarView;
