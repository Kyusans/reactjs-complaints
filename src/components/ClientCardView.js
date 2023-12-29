import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClock, faPlay, faPlus, faThList } from '@fortawesome/free-solid-svg-icons';
import { Button, Container, Dropdown } from 'react-bootstrap'
import ComplaintForm from './ComplaintForm';
import "./css/site.css";
import JobDetails, { formatDate } from './JobDetails';
import UpdateTicketModal from './UpdateTicketModal';
import TicketCard from './TicketCard';
import AlertScript from './AlertScript';
import { statusFormatter } from './ClientCalendarView';

function ClientCardView({ allData, refreshData }) {
  const [tickets, setTickets] = useState([]);
  const [compId, setCompId] = useState(0);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [statusType, setStatusType] = useState(parseInt(localStorage.getItem("selectedStatus")));

  const openComplaintModal = () => { setShowComplaintModal(true); }
  const closeComplaintModal = async () => {
    await refreshData();
    setShowComplaintModal(false);
  }

  const [showJobDetails, setShowJobDetails] = useState(false);
  const hideJobDetails = async () => {
    await refreshData();
    setShowJobDetails(false);
  };

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const openUpdateModal = () => { setShowUpdateModal(true) };
  const closeUpdateModal = async () => {
    await refreshData(); 
    setShowUpdateModal(false) 
  };

  const handleNavigate = (id, status) => {
    if (status === 1) {
      setCompId(id);
      openUpdateModal();
    } else {
      setCompId(id);
      setShowJobDetails(true);
    }
  }

  const handleSetStatus = (status) => {
    localStorage.setItem("selectedStatus", status);
    setStatusType(status);
  }

  useEffect(() => {
    if (allData) {
      console.log("allData sa ClientCard:", allData);
      if(statusType === 0){
        setTickets(allData);
      }else{
        const filteredTickets = allData.filter(item => item.comp_status === statusType);
        setTickets(filteredTickets);
      }
      console.log("statusType: " + statusType);
    }
  }, [allData, statusType])

  return (
    <>
      {localStorage.getItem("isLoggedIn") === "1" ? (
        <Container fluid className="mt-3">
          <>
            <Container fluid className='mb-2 mt-2 d-flex align-content-sm-start justify-content-start'>

              <Dropdown className="me-1">
                <Dropdown.Toggle variant={statusType === 0 ? "primary" : statusType === 1 ? "secondary" : statusType === 2 ? "warning text-dark" : statusType === 3 ? "success" : "primary"}>
                  {statusType === 0 ? "All Tickets" : statusType === 1 ? "Pending Tickets" : statusType === 2 ? "On-going Tickets" : statusType === 3 ? "Completed Tickets" : "Select Ticket Type"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleSetStatus(0)}>
                    <FontAwesomeIcon icon={faThList} className="me-2" />All Ticket
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSetStatus(1)} className="text-dark">
                    <FontAwesomeIcon icon={faClock} className="me-2 text-dark" />Pending
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSetStatus(2)} className="text-warning">
                    <FontAwesomeIcon icon={faPlay} className="me-2 text-warning" />On-going
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSetStatus(3)} className="text-success">
                    <FontAwesomeIcon icon={faCheck} className="me-2" />Completed
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Button className='btn btn-success me-1' onClick={openComplaintModal}>
                <FontAwesomeIcon icon={faPlus} /> Add Ticket
              </Button>
            </Container>

            {tickets.length === 0 ? (
              <AlertScript show={true} variant={"dark"} message={"No tickets yet"} />
            ) : (
              tickets.map((ticket, index) => (
                <div key={index} className='p-1 clickable' onClick={() => handleNavigate(ticket.comp_id, ticket.comp_status)}>
                  <TicketCard subject={ticket.comp_subject} status={statusFormatter(ticket.comp_status)} priority={null} date={formatDate(ticket.comp_date)} lastUser={ticket.comp_lastUser} />
                </div>
              ))
            )}

          </>
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