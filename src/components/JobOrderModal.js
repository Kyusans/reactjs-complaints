import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, FloatingLabel, Form, ListGroup, Modal, Row, Spinner } from 'react-bootstrap'
import AlertScript from './AlertScript';

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
  const [jobPersonnelId, setJobPersonnelId] = useState([]);

  	//for alert
	const [showAlert, setShowAlert] = useState(false);
	const [alertVariant, setAlertVariant] = useState("");
	const [alertMessage, setAlertMessage] = useState("");

	function getAlert(variantAlert, messageAlert){
		setShowAlert(true);
		setAlertVariant(variantAlert);
		setAlertMessage(messageAlert);
	}

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

  const submitJobOrder = () => {
    const url = localStorage.getItem("url") + "admin.php";
    const userId = localStorage.getItem("userId");
    const master = {ticketNumber: ticketNumber, jobCreatedBy: userId, subject: subject, description: description, locationCategory: locationCategory,
    location: location, priority: jobPriority};
    const detail = {jobPersonnelId: jobPersonnelId};
    const jsonData = {master: master, detail: detail};
    console.log('JSON Data:', jsonData);
    const formData = new FormData();
    formData.append("operation", "submitJobOrder");
    formData.append("json", JSON.stringify(jsonData));
    axios({url: url, data: formData, method: "post"})
    .then((res) => {
      if(res.data === 1){
        getAlert("success", "Success");
        setTimeout(() => {
          handleHide();
        }, 1500);
      }
    })
    .catch((err) => {
      getAlert("danger", "There was an unexpected error: " + err);
    })
  }

  const addJobPersonnel = (e) => {
    const newPersonnelValue = e.target.value;
    const [userId, username] = newPersonnelValue.split(',');
  
    if (newPersonnelValue !== "" && !jobPersonnelId.includes(userId)) {
      const updatedJobPersonnel = [...jobPersonnel, username];
      const updatedJobPersonnelId = [...jobPersonnelId, userId];
  
      setJobPersonnel(updatedJobPersonnel);
      setJobPersonnelId(updatedJobPersonnelId);
    }
  }

  function handleHide(){
    setJobPersonnel([]);
    setDescription("");
    setPersonnel([]);
    setJobPersonnel([]);
    setPriorities([]);
    setJobPersonnelId([]);
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
          getAlert("danger", "There was an error: " + error);
        }
        setIsLoading(false);
      }

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
                  <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
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
                        <Form.Select onChange={(e) => setJobPriority(e.target.value)}>
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
                          {personnel.map((person, index) => (
                            <option key={index} value={`${person.user_id},${person.user_full_name}`}>{person.user_full_name}</option>
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
                  <Button variant='outline-success' onClick={()=>submitJobOrder()}>Submit</Button>
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