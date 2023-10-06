import { Pagination, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import JobOrderModal from "./JobOrderModal";

function AdminComplaintTable() {
  const navigateTo = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;
  const [showJobOrderModal, setShowJobOrderModal] = useState(false);
  const showPagination = tickets.length > ticketsPerPage;
  
  const handleClose = () => setShowJobOrderModal(false);
  const handleShow = (id) => {
    setTicketId(id);
    setShowJobOrderModal(true)
  };

  const getAllTickets = () => {
    const url = localStorage.getItem("url") + "admin.php";
    const formData = new FormData();
    formData.append("operation", "getAllTickets");
    axios({ url: url, data: formData, method: "post" })
      .then((res) => {
        if (res.data !== 0) {
          setTickets(res.data);
        }
      })
      .catch((err) => {
        alert("There was an unexpected error: " + err);
      });
  };

  //para sa page
  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;
  const displayedTickets = tickets.slice(startIndex, endIndex);
  const handlePageChange = (newPage) => {setCurrentPage(newPage);};

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const formattedDate = `${month} ${day}`;
    return formattedDate;
  }
  
  useEffect(() => {
    if(localStorage.getItem("adminLoggedIn") !== "true"){
      setTimeout(() => {
        navigateTo("/");
      }, 1500);
    }else{
      getAllTickets();
      const interval = setInterval(() =>{
        getAllTickets();
      }, 2000);
      return () => clearInterval(interval);
    }
  },[navigateTo])
  return (
    <div>
      <Table striped bordered hover size='sm' variant='success' className="text-center">
        <thead className='text-center'>
          <tr>
            <th className="green-header">Subject</th>
            <th className="green-header">Description</th>
            <th className="green-header">Status</th>
            <th className="green-header">Date</th>
          </tr>
        </thead>
        <tbody>
          {displayedTickets.map((ticket, index) => (
            <tr key={index} className={`ticket-cell ${ticket.read ? 'read-ticket' : 'unread-ticket'}`} onClick={() => handleShow(ticket.comp_id)}>
                <td>{ticket.comp_subject}</td>
                <td className="ticket-description">
                  {ticket.comp_description.length > 50
                    ? `${ticket.comp_description.slice(0, 50)}...`
                    : ticket.comp_description}
                </td>
                <td>{ticket.joStatus_name}</td>
                <td className='ticket-date'>{formatDate(ticket.comp_date)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {showPagination && (
        <div className="d-flex justify-content-end mt-2">
          <Pagination>
            <Pagination.First />
            <Pagination.Prev />
            {Array.from({ length: Math.ceil(tickets.length / ticketsPerPage) }, (_, index) => (
              <Pagination.Item
                className="mx-1"
                key={index}
                active={currentPage === index + 1}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next />
            <Pagination.Last />
          </Pagination>
        </div>
      )}
      <JobOrderModal show={showJobOrderModal} onHide={handleClose} ticketId={ticketId} />
    </div>
  )
}

export default AdminComplaintTable