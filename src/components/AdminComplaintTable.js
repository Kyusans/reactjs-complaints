import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Container, Pagination, Spinner, Table } from "react-bootstrap";
import JobOrderModal from "./JobOrderModal";
import "./css/site.css";
import { formatDate } from "./JobDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock, faPlay, faThList } from "@fortawesome/free-solid-svg-icons";

function AdminComplaintTable() {
  const navigateTo = useNavigate();
  const [pageStatus, setPageStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 20;
  const [showJobOrderModal, setShowJobOrderModal] = useState(false);
  const showPagination = tickets.length > ticketsPerPage;

  const handleClose = () => {
    getTicketsByStatus(pageStatus);
    setShowJobOrderModal(false)
  };
  const handleShow = (id, status) => {
    if (status === 1) {
      setTicketId(id);
      setShowJobOrderModal(true);
    } else {
      navigateTo(`/job/details/${id}`);
    }
  };

  const getAllTickets = useCallback(async () => {
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const formData = new FormData();
      formData.append("operation", "getAllTickets");
      const res = await axios({ url: url, data: formData, method: "post" });
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
  const displayedTickets = tickets.slice(startIndex, endIndex);
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
      <div className="d-flex flex-wrap">
        <Button onClick={() => getTicketsByStatus(0)} className="mb-2"><FontAwesomeIcon icon={faThList} className="me-2" />All Ticket</Button>
        <Button onClick={() => getTicketsByStatus(1)} className="btn-dark mx-1 mb-2"><FontAwesomeIcon icon={faClock} className="me-2" />Pending</Button>
        <Button onClick={() => getTicketsByStatus(2)} className="btn-warning mb-2"><FontAwesomeIcon icon={faPlay} className="me-2" />On-Going</Button>
        <Button onClick={() => getTicketsByStatus(3)} className="btn-success mx-1 mb-2"><FontAwesomeIcon icon={faCheck} className="me-2" />Completed</Button>
      </div>
      {isLoading ?
        <Container className='text-center mt-3'>
          <Spinner animation='border' variant='success' />
        </Container>
        :
        <Container className='scrollable-container'>

          <Table striped bordered hover responsive variant="success" className="border-1">
            <thead>
              <tr>
                <th className="green-header">Subject</th>
                <th className="green-header">Status</th>
                <th className="green-header">Date</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(displayedTickets) ? (
                displayedTickets.map((ticket, index) => (
                  <tr
                    key={index}
                    className="ticket-cell"
                    onClick={() => handleShow(ticket.comp_id, ticket.comp_status)}
                  >
                    <td className={ticket.joStatus_name === "Pending" ? "ticket-unread" : ""}>
                      {ticket.comp_subject}
                    </td>
                    <td
                      className="ticket-status"
                    >
                      {ticket.joStatus_name === "Pending" ? (
                        <span><FontAwesomeIcon icon={faClock} className="me-2 text-dark" />Pending</span>
                      ) : ticket.joStatus_name === "On-Going" ? (
                        <span><FontAwesomeIcon icon={faPlay} className="me-2 text-warning"/>On-Going</span>
                      ) : (
                        <span><FontAwesomeIcon icon={faCheck} className="me-2 text-success"/>Completed</span>
                      )}
                    </td>

                    <td className={`ticket-date ${ticket.joStatus_name === "Pending" ? "ticket-unread" : ""}`}>
                      {formatDate(ticket.comp_date)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No tickets to display.</td>
                </tr>
              )}
            </tbody>

          </Table>
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
        </Container>
      }
    </>
  );
}

export default AdminComplaintTable;

