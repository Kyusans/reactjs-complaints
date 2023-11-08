import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Pagination, Table } from "react-bootstrap";
import JobOrderModal from "./JobOrderModal";
import "./css/site.css";
import { formatDate } from "./JobDetails";

function AdminComplaintTable() {
  const navigateTo = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 20;
  const [showJobOrderModal, setShowJobOrderModal] = useState(false);
  const showPagination = tickets.length > ticketsPerPage;

  const handleClose = () => setShowJobOrderModal(false);
  const handleShow = (id, status) => {
    if (status === 1) {
      setTicketId(id);
      setShowJobOrderModal(true);
    } else {
      navigateTo(`/job/details/${id}`);
    }
  };

  const getAllTickets = useCallback(() => {
    const url = localStorage.getItem("url") + "admin.php";
    const formData = new FormData();
    formData.append("operation", "getAllTickets");
    axios({ url, data: formData, method: "post" })
      .then((res) => {
        if (res.data !== 0) {
          setTickets(res.data);
        }
      })
      .catch((err) => {
        alert("There was an unexpected error: " + err);
      });
  },[]);

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
    setCurrentPage(currentPage -1);
  }
  const handleFirstPage = () => {
    setCurrentPage(1);
  };
  const handleLastPage = () => {
    const lastPage = Math.ceil(tickets.length / ticketsPerPage);
    setCurrentPage(lastPage);
  };

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      setTimeout(() => {
        navigateTo("/");
      }, 1500);
    } else {
      getAllTickets();

      const interval = setInterval(() => {
        getAllTickets();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [getAllTickets, navigateTo]);

  return (
    <Container className='scrollable-container'>
      <Table striped bordered hover responsive variant="success" size="sm" className="text-center border-1">
        <thead className="text-center">
          <tr>
            <th className="green-header">Subject</th>
            <th className="green-header">Status</th>
            <th className="green-header">Date</th>
          </tr>
        </thead>
        <tbody>
          {displayedTickets.map((ticket, index) => (
            <tr
              key={index}
              className="ticket-cell"
              onClick={() => handleShow(ticket.comp_id, ticket.comp_status)}
            >
              <td className={ticket.joStatus_name === "Pending" ? "ticket-unread" : ""}>{ticket.comp_subject}</td>
              <td className={`${ticket.joStatus_name === "Pending" ? "ticket-unread" : ""} ${ticket.joStatus_name === "Completed" ? "text-success" : ticket.joStatus_name === "On-Going" ? "text-warning" : ""} text-outline`}>
                {ticket.joStatus_name}
              </td>
              <td className={`ticket-date ${ticket.joStatus_name === "Pending" ? "ticket-unread" : ""}`}>{formatDate(ticket.comp_date)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {showPagination && (
        <div className="d-flex justify-content-end mt-2">
          <Pagination>
            <Pagination.First onClick={handleFirstPage}/>
            <Pagination.Prev onClick={handlePreviousPage}/>
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
            <Pagination.Last onClick={handleLastPage}/>
          </Pagination>
        </div>
      )}
      <JobOrderModal show={showJobOrderModal} onHide={handleClose} ticketId={ticketId} />
    </Container>
  );
}

export default AdminComplaintTable;

