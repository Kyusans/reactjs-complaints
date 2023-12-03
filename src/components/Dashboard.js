import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSync } from '@fortawesome/free-solid-svg-icons';
import { Button, Container, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import ComplaintForm from './ComplaintForm';
import "./css/site.css";
import JobDetails, { formatDate } from './JobDetails';
import UpdateTicketModal from './UpdateTicketModal';
import TicketCard from './TicketCard';

function Dashboard() {
  const navigateTo = useNavigate();
  const [isLoading, setIsloading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [compId, setCompId] = useState(0);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const openComplaintModal = () => { setShowComplaintModal(true); }
  const closeComplaintModal = () => {
    getComplaints();
    setShowComplaintModal(false);
  }

  const [showJobDetails, setShowJobDetails] = useState(false);
  const hideJobDetails = () => { setShowJobDetails(false) };

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const openUpdateModal = () => { setShowUpdateModal(true) };
  const closeUpdateModal = () => { setShowUpdateModal(false) };

  const getComplaints = useCallback(async () => {
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
  }, []);

  const handleNavigate = (id, status) => {
    if (status === 1) {
      setCompId(id);
      openUpdateModal();
    } else {
      setCompId(id);
      setShowJobDetails(true);
    }
  }

  function formatStatus(status) {
    if (status === 1) {
      return "Pending"
    } else if (status === 2) {
      return "On-Going"
    } else {
      return "Completed"
    }
  }

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "1") {
      setTimeout(() => {
        navigateTo("/gsd");
      }, 1500);
    } else {
      getComplaints();
    }
  }, [getComplaints, navigateTo])

  return (
    <>
      {localStorage.getItem("isLoggedIn") === "1" ? (
        <Container className="mt-3">
          <Container className='mb-2 mt-2 d-flex align-content-sm-start justify-content-start'>
            <Button className='btn btn-success me-1' onClick={openComplaintModal}>
              <FontAwesomeIcon icon={faPlus} /> Add Ticket
            </Button>
            <Button onClick={getComplaints}>
              <FontAwesomeIcon icon={faSync} /> Refresh
            </Button>
          </Container>

          {isLoading ? (
            <Container className='text-center'>
              <Spinner animation='border' variant='success' />
            </Container>
          ) : (
            <>
              {tickets.map((ticket, index) => (
                <div key={index} className='p-1 clickable' onClick={() => handleNavigate(ticket.comp_id, ticket.comp_status)}>
                  <TicketCard subject={ticket.comp_subject} status={formatStatus(ticket.comp_status)} priority={null} date={formatDate(ticket.comp_date)} lastUser={ticket.comp_lastUser} />
                </div>
              ))}
            </>
          )}
        </Container>
      ) : (
        <h3 className='text-center'>You need to login first</h3>
      )}
      <ComplaintForm show={showComplaintModal} onHide={closeComplaintModal} />
      <UpdateTicketModal show={showUpdateModal} onHide={closeUpdateModal} compId={compId} />
      <JobDetails show={showJobDetails} onHide={hideJobDetails} compId={compId} />
    </>
  );

}
export default Dashboard;