import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, FloatingLabel, Form, ListGroup, Modal, Row, Spinner } from 'react-bootstrap'

function JobOrderModal(props) {
  const {show, onHide, ticketId} = props;
  const [isLoading, setIsLoading] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [locationCategory, setLocationCategory] = useState("");
  const [location, setLocation] = useState("");
  const [personnel, setPersonnel] = useState([]);
  const [jobPersonnel, setJobPersonnel] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [jobPriority, setJobPriority] = useState("");

  const getAllPersonnel = () =>{
    const url = localStorage.getItem("url") + "admin.php";
    const formData = new FormData();
    formData.append("operation", "getAllPersonnel");
    axios({ url: url, data: formData, method: "post" })
      .then((res) => {
        if (res.data !== 0) {
          setPersonnel(res.data);
        }
      })
      .catch((err) => {
        alert("There was an unexpected error: " + err);
      });
  }

  const getPriority = async () =>{
    try{
      const url = localStorage.getItem("url") + "admin.php";
      const formData = new FormData();
      formData.append("operation",  "getPriority");
      const res = await axios({url: url, data: formData, method: "post"});
      if(res.data !== 0){
        setPriorities(res.data);
      }
    }catch(error){
      alert("There was an error: " + error);
    }
    setIsLoading(false);
  }

  const addJobPersonnel = (e) => {
    const newPersonnel = e.target.value;
    if(newPersonnel !== "" && !jobPersonnel.includes(newPersonnel)){
      const updatedJobPersonnel = [...jobPersonnel, newPersonnel];
      setJobPersonnel(updatedJobPersonnel);
    }
  }

  function handleHide(){
    setJobPersonnel([]);
    setDescription("");
    onHide();
  }
  
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
          if (response.data !== 0) {
            const resData = response.data[0];
            setTicketNumber(resData.comp_id);
            setFacultyName(resData.fac_name);
            setSubject(resData.comp_subject);
            setDescription(resData.comp_description);
            setLocationCategory(resData.locCateg_name);
            setLocation(resData.location_name);
            getAllPersonnel();
          }
        } catch (error) {
          alert("There was an unexpected error: " + error);
        }
      };
      getPriority();
      getSelectedTicket();
    }
  }, [show, ticketId])
  

  return (
    <div>
      <Modal show={show} onHide={handleHide}>
        
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

                  <Row className='mb-3'>
                    <Col>
                      <FloatingLabel label="Select Priority">
                        <Form.Select onChange={(e) => jobPriority(e.target.value)}>
                          <option value={""}>Open this select menu</option>
                          {priorities.map((priority, index) => (
                            <option key={index} value={priority.priority_id}>{priority.priority_name}</option>
                          ))}
                        </Form.Select>
                      </FloatingLabel>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <FloatingLabel label="Select Personnel">
                        <Form.Select onChange={addJobPersonnel}>
                          <option value={""}>Open this select menu</option>
                          {personnel.map((personnel, index) => (
                            <option key={index} value={personnel.user_full_name}>{personnel.user_full_name}</option>
                          ))}
                        </Form.Select>
                      </FloatingLabel>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col>
                      {jobPersonnel && (
                        <>
                          <ListGroup>
                            {jobPersonnel.map((personnel, index) =>(
                              <ListGroup.Item key={index} variant="success">{personnel}</ListGroup.Item>
                            ))}
                          </ListGroup>
                        </>
                      )}
                    </Col>
                  </Row>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant='outline-secondary' onClick={()=>handleHide()}>Close</Button>
                  <Button variant='outline-success'>Submit</Button>
                </Modal.Footer>
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