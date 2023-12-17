import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import React from 'react'
import { Container } from 'react-bootstrap'

function PersonnelJobCalendarView() {
  const events = [
    { title: 'Meeting', start: new Date() }
  ]
  
  return (
    <Container className='p-3'>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridMonth'
        weekends={false}
        events={events}
        eventContent={renderEventContent}
      />
    </Container>
  )
}

export default PersonnelJobCalendarView;

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}