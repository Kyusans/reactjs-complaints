import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pagination, Table } from "react-bootstrap";
import JobOrderModal from "./JobOrderModal";
import {handleShowNotification} from "./NotificationComponent";

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
          const adminTickets = res.data.length;
          if(localStorage.getItem("adminTickets") !== adminTickets.toString()){
            handleShowNotification()
            localStorage.setItem("adminTickets", adminTickets.toString());
          }
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

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const formattedDate = `${month} ${day}`;
    return formattedDate;
  }

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      setTimeout(() => {
        navigateTo("/");
      }, 1500);
    } else {
      getAllTickets();

      const interval = setInterval(() => {
        getAllTickets();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [getAllTickets, navigateTo]);

  return (
    <div>
      <Table striped bordered hover size="sm" variant="success" className="text-center">
        <thead className="text-center">
          <tr>
            <th className="green-header">Subject</th>
            <th className="green-header">Description</th>
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
              <td className={ticket.joStatus_name === "Pending" ? "ticket-unread" : ""}>
                {ticket.comp_description.length > 50
                  ? `${ticket.comp_description.slice(0, 50)}...`
                  : ticket.comp_description}
              </td>
              <td className={`${ticket.joStatus_name === "Pending" ? "ticket-unread" : ""} ${ticket.joStatus_name === "Completed" ? "text-success" : `${ticket.joStatus_name === "On-Going" ? "text-secondary":""}`}`}>{ticket.joStatus_name}</td>
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
    </div>
  );
}

export default AdminComplaintTable;

