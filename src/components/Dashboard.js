import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Col, Row, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const navigateTo = useNavigate();

  const getLocationCategory = () => {
    const url = localStorage.getItem("url") + "users.php";
    console.log("userId: " + localStorage.getItem("userId"))
    const jsonData = {userId: localStorage.getItem("userId")};
    const formData = new FormData();
    formData.append("operation", "getComplaints");
    formData.append("json", JSON.stringify(jsonData));
    axios({ url: url, data: formData, method: "post" })
      .then((res) => {
        console.log(JSON.stringify(res.data));
        if (res.data !== 0) {
          setTickets(res.data);
        }
      })
      .catch((err) => {
        alert("There was an unexpected error: " + err);
      });
  };
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
    if(localStorage.getItem("isLoggedIn") !== "1"){
      setTimeout(() => {
        navigateTo("/");
      }, 1500);
    }else{
      getLocationCategory();
    }
  }, [navigateTo])
  
  return (
    <>
      {localStorage.getItem("isLoggedIn") === "1" ? 
        (
          <Table striped bordered hover size='sm'>
            <thead className='text-center'>
              <tr>
                <th>Tickets</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, index) => (
                <tr key={index}>
                    <td className={`ticket-cell ${ticket.read ? 'read-ticket' : 'unread-ticket'}`}>
                      <Row>
                        <Col><strong>{ticket.comp_subject}</strong></Col>
                        <Col className="ticket-description">
                            {ticket.comp_description.length > 30
                              ? `${ticket.comp_description.slice(0, 30)}...`
                              : ticket.comp_description}
                        </Col>
                        <Col className='text-end'>{formatDate(ticket.comp_date)}</Col>
                      </Row>
                  </td>
                </tr>))
              }
            </tbody>
          </Table>
    ):
        <h3 className='text-center'>You need to login first</h3>
      }
    </>
  )
}

export default Dashboard