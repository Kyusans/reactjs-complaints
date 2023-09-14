import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Col, Form, Modal, Row } from 'react-bootstrap'

function JobOrderModal(props) {
  const {show, onHide, ticketId} = props;
  const [selectedTicket, setSelectedTicket] = useState([]);
  // const [ticketNumber, setTickerNumber] = useState("");
  // const [facultyName, setFacultyName] = useState("");
  
  useEffect(() => {
    if(show){
      const getSelectedTicket = () => {
        const url = localStorage.getItem("url") + "admin.php";
        console.log("ticketId: " + ticketId);
        console.log("url: " + url);
        const jsonData = {
          compId : ticketId
        }
        const formData = new FormData();
        formData.append("json", JSON.stringify(jsonData));
        formData.append("operation", "getSelectedTicket");
        axios({ url: url, data: formData, method: "post" })
          .then((res) => {
            console.log( JSON.stringify(res.data));
            if (res.data !== 0) {
              setSelectedTicket(res.data);
            }
          })
          .catch((err) => {
            alert("There was an unexpected error: " + err);
          });
      }
      getSelectedTicket();
    }
  }, [setSelectedTicket, show, ticketId])
  

  return (
    <div>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton><h3>Job order creation</h3></Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group as={Row}> 
              <Form.Label column sm="2">Ticket#: </Form.Label>
              <Col sm="10">
                <div>{selectedTicket.comp_id}</div>
              </Col>
            </Form.Group>
          </Modal.Body>
        </Form>
      </Modal>
    </div>
  )
}

export default JobOrderModal