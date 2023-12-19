import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClock, faPlay, faPlus, faThList } from '@fortawesome/free-solid-svg-icons';
import { Button, Container, Dropdown, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import ComplaintForm from './ComplaintForm';
import "./css/site.css";
import JobDetails, { formatDate } from './JobDetails';
import UpdateTicketModal from './UpdateTicketModal';
import TicketCard from './TicketCard';
import AlertScript from './AlertScript';

function ClientCardView() {
  const navigateTo = useNavigate();
  const [isLoading, setIsloading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [compId, setCompId] = useState(0);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [statusType, setStatusType] = useState(0);
  const openComplaintModal = () => { setShowComplaintModal(true); }
  const closeComplaintModal = () => {
    getComplaints();
    setShowComplaintModal(false);
  }

  const [showJobDetails, setShowJobDetails] = useState(false);
  const hideJobDetails = () => {
    getTicketsByStatus(statusType);
    setShowJobDetails(false);
  };

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

  const getTicketsByStatus = async (status) => {
    setIsloading(true);
    setStatusType(status);
    if (status === 0) {
      getComplaints();
      return;
    }
    try {
      setTickets([]);
      const url = localStorage.getItem("url") + "users.php";
      const userId = localStorage.getItem("userId");
      const jsonData = { status: status, userId: userId };
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "getSelectedStatus");
      const res = await axios({ url: url, data: formData, method: "post" });
      console.log("res ni getTioasdkjwqd: ", JSON.stringify(res.data));
      if (res.data !== 0) {
        setTickets(res.data);
      }
      setIsloading(false);
    } catch (error) {
      alert("There was an error: " + error.message);
    }
  }

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
        navigateTo("/");
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
            <Dropdown className="me-1">
              <Dropdown.Toggle variant={statusType === 0 ? "primary" : statusType === 1 ? "dark" : statusType === 2 ? "warning text-dark" : statusType === 3 ? "success" : "primary"}>
                {statusType === 0 ? "All Tickets" : statusType === 1 ? "Pending Tickets" : statusType === 2 ? "On-going Tickets" : statusType === 3 ? "Completed Tickets" : "Select Ticket Type"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => getTicketsByStatus(0)}><FontAwesomeIcon icon={faThList} className="me-2" />All Ticket</Dropdown.Item>
                <Dropdown.Item onClick={() => getTicketsByStatus(1)} className="text-dark"><FontAwesomeIcon icon={faClock} className="me-2 text-dark" />Pending</Dropdown.Item>
                <Dropdown.Item onClick={() => getTicketsByStatus(2)} className="text-warning"><FontAwesomeIcon icon={faPlay} className="me-2 text-warning" />On-going</Dropdown.Item>
                <Dropdown.Item onClick={() => getTicketsByStatus(3)} className="text-success"><FontAwesomeIcon icon={faCheck} className="me-2" />Completed</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button className='btn btn-success me-1' onClick={openComplaintModal}>
              <FontAwesomeIcon icon={faPlus} /> Add Ticket
            </Button>
          </Container>

          {isLoading ? (
            <Container className='text-center'>
              <Spinner animation='border' variant='success' />
            </Container>
          ) : (
            <>
              {tickets.length === 0 ? (
                <AlertScript show={true} variant={"dark"} message={"No tickets yet"} />
              ) : (
                tickets.map((ticket, index) => (
                  <div key={index} className='p-1 clickable' onClick={() => handleNavigate(ticket.comp_id, ticket.comp_status)}>
                    <TicketCard subject={ticket.comp_subject} status={formatStatus(ticket.comp_status)} priority={null} date={formatDate(ticket.comp_date)} lastUser={ticket.comp_lastUser} />
                  </div>
                ))
              )}

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
export default ClientCardView;