import axios from 'axios';
import React, { useState } from 'react';
import { Button, Card, Col, Container, FloatingLabel, Form } from 'react-bootstrap';
import AlertScript from './AlertScript';


function LocationCategory() {
  const [validated, setValidated] = useState(false);
  const [locationCategoryText , setLocationCategoryText] = useState("");

    	//for alert
	const [showAlert, setShowAlert] = useState(false);
	const [alertVariant, setAlertVariant] = useState("");
	const [alertMessage, setAlertMessage] = useState("");

	function getAlert(variantAlert, messageAlert){
		setShowAlert(true);
		setAlertVariant(variantAlert);
		setAlertMessage(messageAlert);
	}
  const submitLocationCategory = () =>{
    const url = localStorage.getItem("url") + "admin.php";
    const jsonData = {
      locationCategory : locationCategoryText
    }
    const formData = new FormData();
    formData.append("json", JSON.stringify(jsonData));
    formData.append("operation", "addLocationCategory");
    axios({
      url: url,
      data: formData,
      method: "post",
    })
    .then((res)=>{
      if(res.data !== 0){
        getAlert("success", "Success!");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    })
    .catch((err)=>{
      getAlert("danger", "There was an unexpected error: " + err);
    })
  }
  const formValidation = (e) =>{
		const form = e.currentTarget;
		if(form.checkValidity() === false){
			e.preventDefault();
			e.stopPropagation();
		}else{
			submitLocationCategory();
			e.preventDefault();
			e.stopPropagation();
		}
		setValidated(true);
	}
  return (
    <div>
        <Col>
          <Container fluid="md" className='text-center'>
            <Card border='dark'>
              <Card.Header className='green-header'><h3>Location Category</h3></Card.Header>
              <Card.Body>    
                <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
                <Form noValidate validated={validated} onSubmit={formValidation}>
                  <Form.Group>
                    <FloatingLabel label="Location Category">
                      <Form.Control type='text' value={locationCategoryText} 
                        onChange={(e) => setLocationCategoryText(e.target.value)} 
                        placeholder='Location Category' 
                        required
                      />
                      <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                  <Container className='mt-3'>
                    <Button type="submit" variant='outline-success'>Submit</Button>
                  </Container>
                </Form>
              </Card.Body>
            </Card>
          </Container>
        </Col>
    </div>
  )
}

export default LocationCategory