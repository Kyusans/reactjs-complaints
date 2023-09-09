import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Row, Col, FloatingLabel, Form, Modal, Button } from 'react-bootstrap'
import AlertScript from './AlertScript';

function ComplaintForm(props) {
  const {show, onHide} = props;
  const [subject, setSubject] = useState("");
  const [clientId, setClientId] = useState(0);
  const [locationId, setLocationId] = useState("");
  const [locationCategoryId, setLocationCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [locationCategory, setLocationCategory] = useState([]);
  const [locationName, setLocationName] = useState([]);

  //for alert
	const [showAlert, setShowAlert] = useState(false);
	const [alertVariant, setAlertVariant] = useState("");
	const [alertMessage, setAlertMessage] = useState("");


	function getAlert(variantAlert, messageAlert){
		setShowAlert(true);
		setAlertVariant(variantAlert);
		setAlertMessage(messageAlert);
	}

  const addComplaint = () => {
    const url = localStorage.getItem("url") + "admin.php";
    const jsonData = {
      subject: subject,
      clientId: clientId,
      locationId: locationId,
      locationCategoryId: locationCategoryId,
      description: description
    };
    const formData = new FormData();
    formData.append("json", JSON.stringify(jsonData));
    formData.append("operation", "addComplaint");
    axios({ url: url, data: formData, method: "post" })
     .then((res) => {
        if (res.data !== 0) {
          getAlert("");
          handleClose();
        }
      })
     .catch((err) => {
        getAlert("There was an unexpected error: " + err);
      });
  }
  const getLocation = (id) => {
    const url = localStorage.getItem("url") + "admin.php";
    const jsonData = { categoryId: id };
    const formData = new FormData();
    formData.append("json", JSON.stringify(jsonData));
    formData.append("operation", "getLocations");
    axios({ url: url, data: formData, method: "post" })
      .then((res) => {
        if (res.data !== 0) {
          setLocationName(res.data);
        }
      })
      .catch((err) => {
        alert("There was an unexpected error: " + err);
      });
  };
  const getLocationCategory = () => {
    const url = localStorage.getItem("url") + "admin.php";
    const formData = new FormData();
    formData.append("operation", "getLocationCategory");
    axios({ url: url, data: formData, method: "post" })
      .then((res) => {
        if (res.data !== 0) {
          setLocationCategory(res.data);
        }
      })
      .catch((err) => {
        getAlert("There was an unexpected error: " + err);
      });
  };

  const handleSelectChange = (e) =>{
    setLocationCategoryId(e.target.value)
    console.log("LocationId:" + locationId)
    getLocation(locationCategoryId);
  }

  function handleClose(){
    setSubject("");
    setClientId(0);
    setLocationId(0);
    setLocationCategoryId(0);
    setDescription("");
    onHide();
  }

  useEffect(() => {
    getLocationCategory();
  },)
  
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>Complaint Form</Modal.Header>
        <Modal.Body>
          <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
          <Form>
            <Form.Group className='mb-3'>
              <FloatingLabel label="Subject">
                <Form.Control type='text' value={subject} onChange={(e) => setSubject(e.target.value)} placeholder='Subject' autoFocus required/>
              </FloatingLabel>
            </Form.Group>
            <Form.Group className='mb-3'>
              <FloatingLabel label="Description">
                <Form.Control
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder='Description' 
                  style={{ height: '100px' }}
                  as='textarea'
                  required
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className='mb-4'>
              <Row className='g2'>
                <Col>
                  <FloatingLabel controlId="floatingSelect" label="Location Category">
                    <Form.Select value={locationCategoryId} onChange={handleSelectChange} aria-label="Floating label select example">
                      <option value={0}>Open this select menu</option>
                      {locationCategory.map((locationCateg, index) => (
                        <option key={index} value={locationCateg.locCateg_id}>{locationCateg.locCateg_name}</option>
                      ))}
                    </Form.Select>
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel controlId="floatingSelect" label="Location">
                    <Form.Select value={locationId} onChange={(e) => setLocationId(e.target.value)} aria-label="Floating label select example" disabled={locationId !== "" ? false : true}>
                      <option>Open this select menu</option>
                      {locationName.map((location, index) =>(
                        <option key={index} value={location.location_id}>{location.location_name}</option>
                      ))}
                    </Form.Select>
                  </FloatingLabel>
                </Col>
              </Row>
            </Form.Group>
            <Modal.Footer>
              <Button variant='outline-danger' onClick={handleClose}>Close</Button>
              <Button variant='outline-success' onClick={addComplaint}>Submit</Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ComplaintForm