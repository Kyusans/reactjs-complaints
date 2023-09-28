import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Row, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import ComplaintForm from './ComplaintForm';

function Dashboard() {
  const navigateTo = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  
  const openComplaintModal = () => {setShowComplaintModal(true);}

  const closeComplaintModal = () => {
    getComplaints();
    setShowComplaintModal(false);
  }

  const getComplaints = () => {
    const url = localStorage.getItem("url") + "users.php";
    const jsonData = {userId: localStorage.getItem("userId")};
    const formData = new FormData();
    formData.append("operation", "getComplaints");
    formData.append("json", JSON.stringify(jsonData));
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
      getComplaints();
    }
  }, [navigateTo])
  
  return (
    <>
      {localStorage.getItem("isLoggedIn") === "1" ? 
        (
          <Container className="mt-3">
            <Card border="secondary">
              <Card.Body>
                <Row className='mb-2 mt-2'>
                  <Col className='text-end'>
                    <Button className='btn btn-success' onClick={openComplaintModal}>Add Complaint</Button>
                  </Col>
                </Row>
                <Table striped bordered hover size='sm' variant='success'>
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
                                  {ticket.comp_description.length > 50
                                    ? `${ticket.comp_description.slice(0, 50)}...`
                                    : ticket.comp_description}
                              </Col>
                              <Col className='text-end ticket-date'>{formatDate(ticket.comp_date)}</Col>
                            </Row>
                        </td>
                      </tr>))
                    }
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Container>
        ):
        <h3 className='text-center'>You need to login first</h3>
      }
      <ComplaintForm show={showComplaintModal} onHide={closeComplaintModal} />
    </>
  )
}

export default Dashboard