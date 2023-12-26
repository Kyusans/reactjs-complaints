import { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Dropdown, Pagination, Spinner, Table } from "react-bootstrap";
import JobOrderModal from "./JobOrderModal";
import "./css/site.css";
import JobDetails, { formatDate } from "./JobDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock, faPlay, faThList } from "@fortawesome/free-solid-svg-icons";
import AlertScript from "./AlertScript";

function AdminComplaintTable() {
  // const navigateTo = useNavigate();
  const [pageStatus, setPageStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 20;
  const [showJobOrderModal, setShowJobOrderModal] = useState(false);
  const showPagination = tickets.length > ticketsPerPage;
  const [showJobDetails, setShowJobDetails] = useState(false);
  const hideJobDetails = () => { setShowJobDetails(false); }

  const handleClose = () => {
    getTicketsByStatus(pageStatus);
    setShowJobOrderModal(false)
  };
  const handleShow = (id, status) => {
    if (status === 1) {
      setTicketId(id);
      setShowJobOrderModal(true);
    } else {
      setTicketId(id);
      setShowJobDetails(true);
      // navigateTo(`/job/details/${id}`);
    }
  };

  const getAllTickets = useCallback(async () => {
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const formData = new FormData();
      formData.append("operation", "getAllTickets");
      const res = await axios({ url: url, data: formData, method: "post" });
      console.log("res ni getAllTickets", JSON.stringify(res.data));
      if (res.data !== 0) {
        setTickets(res.data);
      } else {
        //no ticket found
      }
      setIsLoading(false);
    } catch (err) {
      alert("There was an unexpected error: " + err);
    }

  }, []);

  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;
  const displayedTickets = tickets ? tickets.slice(startIndex, endIndex) : 0;
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  }
  const handleFirstPage = () => {
    setCurrentPage(1);
  };
  const handleLastPage = () => {
    const lastPage = Math.ceil(tickets.length / ticketsPerPage);
    setCurrentPage(lastPage);
  };

  const getTicketsByStatus = useCallback(async (status) => {
    handleFirstPage();
    setIsLoading(true);
    setPageStatus(status);
    if (status === 0) {
      getAllTickets();
    }
    try {
      setTickets([]);
      const url = localStorage.getItem("url") + "admin.php";
      const jsonData = { compStatus: status };
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "getTicketsByStatus");
      const res = await axios({ url: url, data: formData, method: "post" });
      if (res.data !== 0) {
        setTickets(res.data);
      } else {
        // no tickets found
      }
      setIsLoading(false);
    } catch (error) {
      alert("There was an error: " + error.message);
    }
  }, [getAllTickets])

  useEffect(() => {
    getAllTickets();
  }, [getAllTickets]);

  return (
    <>
      <Dropdown className="mb-2 ms-3">
        <Dropdown.Toggle variant={pageStatus === 0 ? "primary" : pageStatus === 1 ? "dark" : pageStatus === 2 ? "warning text-dark" : pageStatus === 3 ? "success" : "primary"}>
          {pageStatus === 0 ? "All Tickets" : pageStatus === 1 ? "Pending Tickets" : pageStatus === 2 ? "On-going Tickets" : pageStatus === 3 ? "Completed Tickets" : "Select Ticket Type"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => getTicketsByStatus(0)}><FontAwesomeIcon icon={faThList} className="me-2" />All Ticket</Dropdown.Item>
          <Dropdown.Item onClick={() => getTicketsByStatus(1)} className="text-dark"><FontAwesomeIcon icon={faClock} className="me-2 text-dark" />Pending</Dropdown.Item>
          <Dropdown.Item onClick={() => getTicketsByStatus(2)} className="text-warning"><FontAwesomeIcon icon={faPlay} className="me-2 text-warning" />On-going</Dropdown.Item>
          <Dropdown.Item onClick={() => getTicketsByStatus(3)} className="text-success"><FontAwesomeIcon icon={faCheck} className="me-2" />Completed</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {isLoading ?
        <Container className='text-center mt-3'>
          <Spinner animation='border' variant='success' />
        </Container>
        :
        <Container fluid>

          {displayedTickets.length <= 0 ?
            <AlertScript show={true} variant={"dark"} message={"No tickets yet"} />
            :
            <Table striped bordered hover responsive variant="success" className="border-1">
              <thead>
                <tr>
                  <th className="green-header">Subject</th>
                  <th className="green-header">Status</th>
                  <th className="green-header">Date</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(displayedTickets) && displayedTickets.map((ticket, index) => (
                  <tr
                    key={index}
                    onClick={() => handleShow(ticket.comp_id, ticket.comp_status)}
                    className="clickable"
                  >
                    <td>{ticket.comp_subject}</td>
                    <td>
                      {ticket.joStatus_name === "Pending" ? (
                        <span><FontAwesomeIcon icon={faClock} className="me-2 text-dark" />Pending</span>
                      ) : ticket.joStatus_name === "On-Going" ? (
                        <span><FontAwesomeIcon icon={faPlay} className="me-2 text-warning" />On-Going</span>
                      ) : (
                        <span><FontAwesomeIcon icon={faCheck} className="me-2 text-success" />Completed</span>
                      )}
                    </td>

                    <td className={`ticket-date ${ticket.joStatus_name === "Pending" ? "ticket-unread" : ""}`}>
                      {formatDate(ticket.comp_date)}
                    </td>
                  </tr>
                )
                )}
              </tbody>
            </Table>
          }

          {showPagination && (
            <div className="d-flex justify-content-end mt-2">
              <Pagination>
                <Pagination.First onClick={handleFirstPage} />
                <Pagination.Prev onClick={handlePreviousPage} />
                {Array.from({ length: Math.ceil(tickets.length / ticketsPerPage) }, (_, index) => (
                  <Pagination.Item
                    key={index}
                    active={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={handleNextPage} />
                <Pagination.Last onClick={handleLastPage} />
              </Pagination>
            </div>
          )}
          <JobOrderModal show={showJobOrderModal} onHide={handleClose} ticketId={ticketId} />
          <JobDetails show={showJobDetails} onHide={hideJobDetails} compId={ticketId} />
        </Container>
      }
    </>
  );
}

export default AdminComplaintTable;

