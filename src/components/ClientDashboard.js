import React, { useEffect, useState } from 'react'
import ClientCardView from './ClientCardView'
import ClientCalendarView from './ClientCalendarView'
import { Button, Container, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faSync, faTh } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ClientDashboard() {
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [tickets, setTickets] = useState([]);

  const navigateTo = useNavigate();

  const getComplaints = async () => {
    setIsloading(true);
    try {
      const url = localStorage.getItem("url") + "users.php";
      const jsonData = { userId: localStorage.getItem("userId") };
      const formData = new FormData();
      formData.append("operation", "getComplaints");
      formData.append("json", JSON.stringify(jsonData));

      const response = await axios.post(url, formData);
      if (response.data !== 0) {
        setTickets(response.data);
      }
    } catch (error) {
      alert("There was an unexpected error: " + error);
    } finally {
      setIsloading(false);
    }
  };

  const refreshData = async () => {
    await getComplaints();
  }

  useEffect(() => {
    if (localStorage.getItem("facultyLoggedIn") !== "true") {
      setTimeout(() => {
        navigateTo(-1);
      }, 1500);
    } else {
      getComplaints();
    }
  }, [navigateTo])


  return (
    <div className="gray-body p-2">
      <div className='ms-2'>
        <Button variant="info" onClick={() => setIsCalendarView(false)} className="me-1 ms-2">
          <FontAwesomeIcon icon={faTh} />
        </Button>
        <Button variant="light" onClick={() => setIsCalendarView(true)}>
          <FontAwesomeIcon icon={faCalendar} />
        </Button>
        <Button onClick={getComplaints} className='ms-1'>
          <FontAwesomeIcon icon={faSync} /> Refresh
        </Button>
      </div>
      {isLoading ?
        <Container className='text-center mt-3'>
          <Spinner variant='success' />
        </Container> :
        isCalendarView ?
          <ClientCalendarView allData={tickets} refreshData={refreshData} /> :
          <ClientCardView allData={tickets} refreshData={refreshData} />
      }
    </div>
  )
}

export default ClientDashboard