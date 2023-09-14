import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Row, Col, FloatingLabel, Form, Modal, Button } from 'react-bootstrap'
import AlertScript from './AlertScript';

function ComplaintForm(props) {
  const {show, onHide} = props;
  const [subject, setSubject] = useState("");
  const [locationId, setLocationId] = useState("");
  const [locationCategoryId, setLocationCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [locationCategory, setLocationCategory] = useState([]);
  const [location, setLocation] = useState([]);
  const [validated, setValidated] = useState(false);
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
    const url = localStorage.getItem("url") + "users.php";
    const clientId = localStorage.getItem("userId");
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
        console.log("response complaint: " + JSON.stringify(res.data))
        if (res.data !== 0) {
          getAlert("success", "Success");
          setTimeout(() => {
            handleClose();
          }, 1500);
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
        console.log("res.data ni getLocations: " + JSON.stringify(res.data));
        if (res.data !== 0) {
          setLocation(res.data);
        }
      })
      .catch((err) => {
        alert("There was an unexpected error: " + err);
      });
  };

  function handleClose(){
    setValidated(false);
    setSubject("");
    setLocationId("");
    setLocationCategoryId("");
    setDescription("");
    setShowAlert(false);
    onHide();
  }
	const formValidation = (e) =>{
		const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
		if(form.checkValidity() === true){
      addComplaint();
		}
		setValidated(true);
	}
  useEffect(() => {
    const getLocationCategory = async () => {
      try {
        const url = localStorage.getItem("url") + "admin.php";
        const clientId = localStorage.getItem("userId");
        console.log("clientId: " + clientId);
        const formData = new FormData();
        formData.append("operation", "getLocationCategory");
        const response = await axios({
          url: url,
          data: formData,
          method: "post"
        });
        console.log("location category: " + JSON.stringify(response.data));
        if (response.data !== 0) {
          setLocationCategory(response.data);
        }
      } catch (error) {
        getAlert("danger", "There was an unexpected error: " + error);
      }
    };
    getLocationCategory();
    if(locationCategoryId !== ""){
      setLocationId("");
      getLocation(locationCategoryId);
    }
  }, [locationCategoryId])
  
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>Complaint Form</Modal.Header>
        <Modal.Body>
          <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
          <Form noValidate validated={validated} onSubmit={formValidation}>
            <Form.Group className='mb-3'>
              <FloatingLabel label="Subject">
                <Form.Control type='text' value={subject} onChange={(e) => setSubject(e.target.value)} placeholder='Subject' autoFocus required/>
                <Form.Control.Feedback type='invalid'>This field is required</Form.Control.Feedback>
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
                <Form.Control.Feedback type='invalid'>This field is required</Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Row className='g2'>
              <Form.Group as={Col} className='mb-4'>
                <FloatingLabel label="Location Category">
                  <Form.Select value={locationCategoryId} onChange={e=>setLocationCategoryId(e.target.value)} required>
                    <option disabled={locationCategoryId !== "" ? true : false} value="">Open this select menu</option>
                    {locationCategory.map((locationCateg, index) => (
                      <option key={index} value={locationCateg.locCateg_id}>{locationCateg.locCateg_name}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>This field is required</Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <Form.Group as={Col}>
                {locationCategoryId && (
                  <>
                    <FloatingLabel label="Location">
                      <Form.Select value={locationId} onChange={e => setLocationId(e.target.value)} required>
                        <option value={""}>Open this select menu</option>
                        {location.map((locations, index) => (
                          <option key={index} value={locations.location_id}>{locations.location_name}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type='invalid'>This field is required</Form.Control.Feedback>
                    </FloatingLabel>
                  </>
                )}
              </Form.Group>
            </Row>
            <Modal.Footer>
              <Button variant='outline-danger' onClick={handleClose}>Close</Button>
              <Button variant='outline-success' type='submit'>Submit</Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ComplaintForm