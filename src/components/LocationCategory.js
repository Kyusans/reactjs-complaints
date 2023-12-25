import axios from 'axios';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Col, Container, FloatingLabel, Form, Spinner } from 'react-bootstrap';
import AlertScript from './AlertScript';

function LocationCategory() {
  const [validated, setValidated] = useState(false);
  const [locationCategoryText, setLocationCategoryText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // for alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  function getAlert(variantAlert, messageAlert) {
    setShowAlert(true);
    setAlertVariant(variantAlert);
    setAlertMessage(messageAlert);
  }

  const submitLocationCategory = () => {
    setIsLoading(true);
    const url = localStorage.getItem("url") + "admin.php";
    const jsonData = { locationCategory: locationCategoryText };
    const formData = new FormData();
    formData.append("json", JSON.stringify(jsonData));
    formData.append("operation", "addLocationCategory");

    axios({
      url: url,
      data: formData,
      method: "post",
    })
      .then((res) => {
        if (res.data === 2) {
          getAlert("danger" , locationCategoryText + " already exists")
          setIsLoading(false);
          setLocationCategoryText("");
        }else if (res.data !== 0) {
          getAlert("success", "Success!");
          setTimeout(() => {
            setValidated(false);
            setShowAlert(false);
            setLocationCategoryText("");
            setIsLoading(false);
          }, 1500);
        }
      })
      .catch((err) => {
        getAlert("danger", "There was an unexpected error: " + err);
        setIsLoading(false);
      });
  };

  const formValidation = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      submitLocationCategory();
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
  };

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
                    <Form.Control
                      type='text'
                      value={locationCategoryText}
                      onChange={(e) => setLocationCategoryText(e.target.value)}
                      placeholder='Location Category'
                      required
                    />
                    <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Container className='mt-3'>
                  <Button type="submit" variant='outline-success' disabled={isLoading}>
                    {isLoading ? (
                      <Spinner animation='border' size='sm' role='status' className='me-2' />
                    ) : null}
                    {isLoading ? 'Submitting...' : <><FontAwesomeIcon icon={faCheck} /> Submit</>}
                  </Button>
                </Container>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </Col>
    </div>
  );
}

export default LocationCategory;
