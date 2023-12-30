import React, { useEffect, useState } from 'react'
import { Container, Dropdown } from 'react-bootstrap';
import "./css/site.css";
import JobDetails, { formatDate } from './JobDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowRight, faArrowUp, faCheck, faPlay, faThList } from '@fortawesome/free-solid-svg-icons';
import TicketCard from './TicketCard';
import AlertScript from './AlertScript';

export default function PersonnelJobCardView({ allData, refreshData }) {
  const [compId, setCompId] = useState(0);
  const [ticket, setTicket] = useState([]);
  const [statusType, setStatusType] = useState(parseInt(localStorage.getItem("selectedStatus")));
  const [priorityType, setPriorityType] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [firstTime, setFirstTime] = useState(true);

  const hideJobDetails = async () => {
    setCompId(0);
    await refreshData();
    // getTicketsByStatus(statusType);
    setShowJobDetails(false)
  };

  //priority ni siya
  const getSelectedPriority = async (priority) => {
    setPriorityType(priority);
    if (priority === 0) {
      setTicket(allData);
    } else {
      const filterData = allData.filter(item => item.priority_id === priority);
      setTicket(filterData);
    }
  }

  const handleNavigate = (id) => {
    setCompId(id);
    setShowJobDetails(true);
  }

  const handleSetStatus = (status) => {
    localStorage.setItem("selectedStatus", status);
    setStatusType(status);
  }

  useEffect(() => {
    if (firstTime && allData) {
      setStatusType(2);
      setFirstTime(false);
    }

    if (allData) {
      const filterData = allData.filter(item => item.comp_status === 2);
      setTicket(filterData);
      if (statusType === 0) {
        setTicket(allData);
      } else {
        const filteredTickets = allData.filter(item => item.comp_status === statusType);
        setTicket(filteredTickets);
      }
    }
    setPriorityType(0);
    console.log("allData", allData);
  }, [allData, statusType, firstTime])

  return (
    <>
      <Container className='d-flex align-content-sm-start justify-content-start'>
        <Dropdown className="ms-2 mt-2">
          <Dropdown.Toggle variant={statusType === 0 ? "primary" : statusType === 1 ? "dark" : statusType === 2 ? "warning text-dark" : statusType === 3 ? "success" : "primary"}>
            {statusType === 0 ? "All Tickets" : statusType === 1 ? "Pending Tickets" : statusType === 2 ? "On-going Tickets" : statusType === 3 ? "Completed Tickets" : "Select Ticket Type"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSetStatus(0)}>
              <FontAwesomeIcon icon={faThList} className="me-2" />All Ticket
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSetStatus(2)} className="text-warning">
              <FontAwesomeIcon icon={faPlay} className="me-2 text-warning" />On-going
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSetStatus(3)} className="text-success">
              <FontAwesomeIcon icon={faCheck} className="me-2" />Completed
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="mb-2 mx-2 mt-2">
          <Dropdown.Toggle variant={priorityType === 1 ? "danger" : priorityType === 2 ? "warning" : priorityType === 3 ? "secondary" : "primary"}>
            {priorityType === 1 ? "High" : priorityType === 2 ? "Medium" : priorityType === 3 ? "Low" : "All Priority"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => getSelectedPriority(0)} className="text-primary">
              <FontAwesomeIcon icon={faCheck} className="text-primary me-2" />All Priority
            </Dropdown.Item>
            <Dropdown.Item onClick={() => getSelectedPriority(1)} className="text-danger">
              <FontAwesomeIcon icon={faArrowUp} className="text-danger me-2" />High
            </Dropdown.Item>
            <Dropdown.Item onClick={() => getSelectedPriority(2)} className="text-warning">
              <FontAwesomeIcon icon={faArrowRight} className="text-warning me-1" />Medium
            </Dropdown.Item>
            <Dropdown.Item onClick={() => getSelectedPriority(3)} className="text-dark">
              <FontAwesomeIcon icon={faArrowDown} className="text-dark me-2" />Low
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

      </Container>

      <Container className='scrollable-container vh-100 mt-3'>
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

      <JobDetails show={showJobDetails} onHide={hideJobDetails} compId={compId} />
    </>
  )
}
