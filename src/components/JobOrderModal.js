import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Col, Container, FloatingLabel, Form, Modal, Row, Spinner } from 'react-bootstrap'

function JobOrderModal(props) {
  const {show, onHide, ticketId} = props;
  const [isLoading, setIsLoading] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [locationCategory, setLocationCategory] = useState("");
  const [location, setLocation] = useState("");
  
  useEffect(() => {
    if(show){
      const getSelectedTicket = async () => {
        setIsLoading(true);
        try {
          const url = localStorage.getItem("url") + "admin.php";
          const jsonData = {compId: ticketId};
          const formData = new FormData();
          formData.append("json", JSON.stringify(jsonData));
          formData.append("operation", "getSelectedTicket");
          const response = await axios({url: url, data: formData, method: "post"});
          setIsLoading(false);
          if (response.data !== 0) {
            const resData = response.data[0];
            setTicketNumber(resData.comp_id);
            setFacultyName(resData.fac_name);
            setSubject(resData.comp_subject);
            setDescription(resData.comp_description);
            setLocationCategory(resData.locCateg_name);
            setLocation(resData.location_name);
          }
        } catch (error) {
          alert("There was an unexpected error: " + error);
        }
      };
      getSelectedTicket();
    }
  }, [show, ticketId])
  

  return (
    <div>
      <Modal show={show} onHide={onHide}>
        
          {!isLoading ?
            <> 
              <Modal.Header closeButton><h3>Job order creation</h3></Modal.Header>
              <Form>
                <Modal.Body>
                  <Row className='mb-3'>
                    <Col>Ticket number:</Col>
                    <Col>
                      <Form.Control type="text" placeholder={ticketNumber} readOnly />
                    </Col>
                  </Row>

                  <Row className='mb-3'>
                    <Col>Complaint by:</Col>
                    <Col><Form.Control type="text" placeholder={facultyName} readOnly /></Col>
                  </Row>

                  <Row className='mb-3'>
                    <Col>Subject:</Col>
                    <Col><Form.Control type="text" placeholder={subject} readOnly /></Col>
                  </Row>

                  <Row className='mb-3'>
                    <Col>Location Category:</Col>
                    <Col><Form.Control type="text" placeholder={locationCategory} readOnly /></Col>
                  </Row>

                  <Row className='mb-3'>
                    <Col>Location:</Col>
                    <Col><Form.Control type="text" placeholder={location} readOnly /></Col>
                  </Row>

                  <Row className='mb-3'>
                    <FloatingLabel label="Description">
                      <Form.Control 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      placeholder='Description' 
                      style={{ height: '200px' }}
                      as='textarea'
                      required/>
                    </FloatingLabel>
                  </Row>
                </Modal.Body>
              </Form>
            </>
          : 
            <Container className='text-center mt-5 mb-5'>
              <Spinner animation="border" variant='success'/> 
            </Container>
          }
      </Modal>
    </div>
  )
}

export default JobOrderModal