import React, { useState } from 'react'
import ClientCardView from './ClientCardView'
import ClientCalendarView from './ClientCalendarView'
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTh } from '@fortawesome/free-solid-svg-icons';

function ClientDashboard() {
  const [isCalendarView, setIsCalendarView] = useState(false);
  return (
    <div className="gray-body p-2">
      <div className='ms-2'>
        <Button variant="info" onClick={() => setIsCalendarView(false)} className="me-1 ms-2"><FontAwesomeIcon icon={faTh} /> </Button>
        <Button variant="light" onClick={() => setIsCalendarView(true)}><FontAwesomeIcon icon={faCalendar} /> </Button>
      </div>
      {isCalendarView ? <ClientCalendarView /> : <ClientCardView />}
    </div>
  )
}

export default ClientDashboard