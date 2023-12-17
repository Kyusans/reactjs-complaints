import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { Container, Dropdown, Spinner } from 'react-bootstrap';
import "./css/site.css";
import JobDetails, { formatDate } from './JobDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowRight, faArrowUp, faCheck, faPlay, faThList } from '@fortawesome/free-solid-svg-icons';
import TicketCard from './TicketCard';
import AlertScript from './AlertScript';

export default function PersonnelJobCardView() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOnGoing, setIsOnGoing] = useState(true);
  const [compId, setCompId] = useState(0);
  const [ticket, setTicket] = useState([]);
  const [statusType, setStatusType] = useState(null);
  const [priorityType, setPriorityType] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const hideJobDetails = () => {
    setCompId(0);
    getTicketsByStatus(statusType);
    setShowJobDetails(false)
  };

  const getJobTicket = async () => {
    try {
      const url = localStorage.getItem("url") + "personnel.php";
      const userId = localStorage.getItem("userId");
      const jsonData = { userId: userId }
      const formData = new FormData();
      formData.append("operation", "getJobTicket");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios({ url: url, data: formData, method: "post" });
      console.log("res ni get job ticket: ", JSON.stringify(res.data))
      if (res.data !== 0) {
        setTicket(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      alert("There was an unexpected error: " + error);
    }
  }

  //priority ni siya
  const getSelectedStatus = async (priority) => {
    setPriorityType(priority);
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "personnel.php";
      const userId = localStorage.getItem("userId");
      const jsonData = { priority: priority, userId: userId }
      const formData = new FormData();
      formData.append("operation", "getSelectedStatus");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios({ url: url, data: formData, method: "post" });
      if (res.data !== 0) {
        setTicket(res.data);
        setIsLoading(false);
      } else {
        alert("No ticket found");
        setIsLoading(false);
      }
    } catch (error) {
      alert("There was an unexpected error: " + error);
    }
  }

  const getTicketsByStatus = useCallback(async (status) => {
    setStatusType(status);
    setIsLoading(true);
    if (status === 2) {
      setIsOnGoing(true);
    } else if (status === 0) {
      setIsOnGoing(false);
      getJobTicket();
    } else {
      setIsOnGoing(false);
    }

    try {
      setTicket([]);
      const url = localStorage.getItem("url") + "personnel.php";
      const userId = localStorage.getItem("userId");
      const jsonData = { status: status, userId: userId };
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "getJobsByStatus");
      const res = await axios({ url: url, data: formData, method: "post" });
      if (res.data !== 0) {
        setTicket(res.data);
      }
      setIsLoading(false);
    } catch (error) {
      alert("There was an error: " + error.message);
    }
  }, [])

  const handleNavigate = (id) => {
    setCompId(id);
    setShowJobDetails(true);
  }

  useEffect(() => {
    setIsLoading(true);
    getTicketsByStatus(2);
  }, [getTicketsByStatus])

  return (
    <>
      <Container className='d-flex align-content-sm-start justify-content-start'>
        <Dropdown className="ms-2 mt-2">
          <Dropdown.Toggle variant={statusType === 0 ? "primary" : statusType === 1 ? "dark" : statusType === 2 ? "warning text-dark" : statusType === 3 ? "success" : "primary"}>
            {statusType === 0 ? "All Tickets" : statusType === 1 ? "Pending Tickets" : statusType === 2 ? "On-going Tickets" : statusType === 3 ? "Completed Tickets" : "Select Ticket Type"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => getTicketsByStatus(0)}><FontAwesomeIcon icon={faThList} className="me-2" />All Ticket</Dropdown.Item>
            <Dropdown.Item onClick={() => getTicketsByStatus(2)} className="text-warning"><FontAwesomeIcon icon={faPlay} className="me-2 text-warning" />On-going</Dropdown.Item>
            <Dropdown.Item onClick={() => getTicketsByStatus(3)} className="text-success"><FontAwesomeIcon icon={faCheck} className="me-2" />Completed</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {isOnGoing && (
          <Dropdown className="mb-2 mx-2 mt-2">
            <Dropdown.Toggle variant={priorityType === 1 ? "danger" : priorityType === 2 ? "warning" : priorityType === 3 ? "dark" : "primary"}>
              {priorityType === 1 ? "High" : priorityType === 2 ? "Medium" : priorityType === 3 ? "Low" : "Select Priority"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => getSelectedStatus(1)} className="text-danger"><FontAwesomeIcon icon={faArrowUp} className="text-danger me-2" />High</Dropdown.Item>
              <Dropdown.Item onClick={() => getSelectedStatus(2)} className="text-warning"><FontAwesomeIcon icon={faArrowRight} className="text-warning me-1" />Medium</Dropdown.Item>
              <Dropdown.Item onClick={() => getSelectedStatus(3)} className="text-dark"><FontAwesomeIcon icon={faArrowDown} className="text-dark me-2" />Low</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Container>
      {isLoading ?
        <Container className='text-center mt-3'>
          <Spinner animation='border' variant='success' />
        </Container>
        :
        <Container className='scrollable-container'>
          <div>
            {ticket.length === 0 && <AlertScript show={true} variant={"dark"} message={"No tickets yet"} />}

            {ticket.map((tickets, index) => (
              <div className='p-1 clickable' key={index} onClick={() => handleNavigate(tickets.job_complaintId)}>
                <TicketCard
                  subject={tickets.job_title}
                  priority={tickets.priority_name}
                  status={tickets.joStatus_name}
                  date={formatDate(tickets.job_createDate)}
                  lastUser={tickets.comp_lastUser}
                />
              </div>
            ))
            }
          </div>

        </Container>
      }
      <JobDetails show={showJobDetails} onHide={hideJobDetails} compId={compId} />
    </>
  )
}
