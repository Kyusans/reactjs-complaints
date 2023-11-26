import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { Container, Dropdown, Spinner, Table } from 'react-bootstrap';
import "./css/site.css";
import { useNavigate } from 'react-router-dom';
import { formatDate } from './JobDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowRight, faArrowUp, faCheck, faPlay, faThList } from '@fortawesome/free-solid-svg-icons';
import AlertScript from './AlertScript';

export default function PersonnelDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOnGoing, setIsOnGoing] = useState(true);
  const [ticket, setTicket] = useState([]);
  const navigateTo = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");


  function getAlert(variantAlert, messageAlert) {
    setShowAlert(true);
    setAlertVariant(variantAlert);
    setAlertMessage(messageAlert);
  }

  const getJobTicket = async () => {
    try {
      const url = localStorage.getItem("url") + "personnel.php";
      const userId = localStorage.getItem("userId");
      const jsonData = { userId: userId }
      const formData = new FormData();
      formData.append("operation", "getJobTicket");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios({ url: url, data: formData, method: "post" });
      if (res.data !== 0) {
        setTicket(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      alert("There was an unexpected error: " + error);
    }
  }

  const getSelectedStatus = async (priority) => {
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
      } else {
        getAlert("danger", "No ticket found");
      }
      setIsLoading(false);
    } catch (error) {
      alert("There was an error: " + error.message);
    }
  }, [])

  const handleNavigate = (id) => {
    navigateTo(`/job/details/${id}`);
  }

  useEffect(() => {
    setIsLoading(true);
    getTicketsByStatus(2);
  }, [getTicketsByStatus])

  return (
    <>
      <Container className='d-flex align-content-sm-start justify-content-start'>
        <Dropdown className="mb-2 mt-2">
          <Dropdown.Toggle variant="primary" id="typeDropdown">
            Select Ticket Type
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => getTicketsByStatus(0)}><FontAwesomeIcon icon={faThList} className="me-2" />All Ticket</Dropdown.Item>
            <Dropdown.Item onClick={() => getTicketsByStatus(2)} className="text-warning"><FontAwesomeIcon icon={faPlay} className="me-2 text-warning" />On-going</Dropdown.Item>
            <Dropdown.Item onClick={() => getTicketsByStatus(3)} className="text-success"><FontAwesomeIcon icon={faCheck} className="me-2" />Completed</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {isOnGoing && (
          <Dropdown className="mb-2 mx-2 mt-2">
            <Dropdown.Toggle variant="warning" id="statusDropdown">
              Select Status
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
            <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
            <Table bordered responsive striped hover variant='success' className='border-1'>
              <thead>
                <tr>
                  <th className="green-header">Subject</th>
                  <th className="green-header">Priority</th>
                  <th className="green-header">Status</th>
                  <th className="green-header">Date</th>
                </tr>
              </thead>
              <tbody>
                {ticket.map((tickets, index) => (
                  <tr key={index} className={`ticket-cell`} onClick={() => handleNavigate(tickets.job_complaintId)}>
                    <td>{tickets.job_title}</td>
                    <td>
                      {tickets.priority_name === "High" ? (
                        <FontAwesomeIcon icon={faArrowUp} className="text-danger me-2" />
                      ) : tickets.priority_name === "Medium" ? (
                        <FontAwesomeIcon icon={faArrowRight} className="text-warning me-2" />
                      ) : tickets.priority_name === "Low" ? (
                        <FontAwesomeIcon icon={faArrowDown} className="text-dark me-2" />
                      ) : (
                        null
                      )}
                      {tickets.priority_name}
                    </td>
                    <td>
                      {tickets.joStatus_name === "On-Going" ? (
                        <FontAwesomeIcon icon={faPlay} className="text-warning me-2" />
                      ) : tickets.joStatus_name === "Completed" ? (
                        <FontAwesomeIcon icon={faCheck} className="text-success me-2" />
                      ) : (
                        null
                      )}
                      {tickets.joStatus_name}
                    </td>
                    <td className={`ticket-date`}>{formatDate(tickets.job_createDate)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Container>
      }
    </>
  )
}
