import { Col, Pagination, Row, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;
  const navigateTo = useNavigate();

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
    <>
      {localStorage.getItem("adminLoggedIn") === "true" ? (
        <Table striped bordered hover size='sm' variant='success'>
          <thead className='text-center'>
            <tr>
              <th>Tickets</th>
            </tr>
          </thead>
          <tbody>
            {displayedTickets.map((ticket, index) => (
              <tr key={index}>
                  <td className={`ticket-cell ${ticket.read ? 'read-ticket' : 'unread-ticket'}`}>
                    <Row>
                      <Col><strong>{ticket.comp_subject}</strong></Col>
                      <Col className="ticket-description">
                          {ticket.comp_description.length > 50
                            ? `${ticket.comp_description.slice(0, 50)}...`
                            : ticket.comp_description}
                      </Col>
                      <Col className='text-end ticket-date'>{formatDate(ticket.comp_date)}</Col>
                    </Row>
                </td>
              </tr>
            ))}
            <div className="d-flex justify-content-center">
            <Pagination>
              <Pagination.First/>
              <Pagination.Prev/>
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
              <Pagination.Next/>
              <Pagination.Last/>
            </Pagination>
          </div>
          </tbody>
        </Table>
      ) : (
        <h2 className="text-center text-danger">You are not admin</h2>
      )}
    </>
  );
}
