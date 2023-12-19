import React, { useState } from 'react'
import ClientCardView from './ClientCardView'
import ClientCalendarView from './ClientCalendarView'
import { Button, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTh } from '@fortawesome/free-solid-svg-icons';

function ClientDashboard() {
  const [isCalendarView, setIsCalendarView] = useState(false);
  return (
    <Container className="gray-body p-2" fluid>
      <Container fluid className='ms-2'>
        <Button variant="info" onClick={() => setIsCalendarView(false)} className="me-1 ms-2"><FontAwesomeIcon icon={faTh} /> </Button>
        <Button variant="light" onClick={() => setIsCalendarView(true)}><FontAwesomeIcon icon={faCalendar} /> </Button>
      </Container>
      {isCalendarView ? <ClientCalendarView /> : <ClientCardView />}
    </Container>
  )
}

export default ClientDashboard