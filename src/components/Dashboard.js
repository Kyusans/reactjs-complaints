import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPlay, faCheck, faPlus, faSync } from '@fortawesome/free-solid-svg-icons';
import { Button, Container, Spinner, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import ComplaintForm from './ComplaintForm';
import "./css/site.css";
import JobDetails, { formatDate } from './JobDetails';
import UpdateTicketModal from './UpdateTicketModal';

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
  const hideJobDetails = () =>{setShowJobDetails(false)};

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
  },[]);


  const handleNavigate = (id, status) => {
    if (status === 1) {
      setCompId(id);
      openUpdateModal();
    } else {
      setCompId(id);
      setShowJobDetails(true);
      // navigateTo(`/job/details/${id}`);
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
            <Button className='btn btn-success me-1' onClick={openComplaintModal}><FontAwesomeIcon icon={faPlus} /> Add Ticket</Button>
            <Button onClick={getComplaints}><FontAwesomeIcon icon={faSync} /> Refresh</Button>
          </Container>

          {isLoading ? (
            <Container className='text-center'>
              <Spinner animation='border' variant='success' />
            </Container>
          ) : (
            <>
              <Table striped bordered hover responsive variant='success' className='border-1'>
                <thead>
                  <tr>
                    <th className="green-header">Subject</th>
                    <th className="green-header">Status</th>
                    <th className="green-header">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center">No tickets available</td>
                    </tr>
                  ) : (
                    tickets.map((ticket, index) => (
                      <tr key={index} className='ticket-cell' onClick={() => handleNavigate(ticket.comp_id, ticket.comp_status)}>
                        <td>{ticket.comp_subject}</td>
                        <td>
                          {ticket.comp_status === 1 ? (
                            <span>
                              <FontAwesomeIcon icon={faClock} className="me-2 pending" />
                              Pending
                            </span>
                          ) : ticket.comp_status === 2 ? (
                            <span>
                              <FontAwesomeIcon icon={faPlay} className="me-2 ongoing" />
                              On-Going
                            </span>
                          ) : (
                            <span>
                              <FontAwesomeIcon icon={faCheck} className="me-2 completed" />
                              Completed
                            </span>
                          )}
                        </td>
                        <td className='ticket-date'>{formatDate(ticket.comp_date)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

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