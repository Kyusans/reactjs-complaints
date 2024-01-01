import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Form, FloatingLabel, Container, Button, Spinner } from 'react-bootstrap';
import AlertScript from './AlertScript';
import LocationModal from './LocationModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEye, faSync } from '@fortawesome/free-solid-svg-icons';

function Location() {
  const [location, setLocation] = useState("");
  const [locationCategory, setLocationCategory] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [validated, setValidated] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openLocationModal = () => { setShowLocationModal(true); }
  const closeLocationModal = () => { setShowLocationModal(false); }

  // For alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  function getAlert(variantAlert, messageAlert) {
    setShowAlert(true);
    setAlertVariant(variantAlert);
    setAlertMessage(messageAlert);
  }

  const submitLocation = async () => {
    setValidated(true);
    setIsLoading(true);
    getAlert(false);
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const jsonData = {
        location: location,
        categoryId: categoryId,
      };

      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "addLocation");

      const response = await axios.post(url, formData);
      if(response.data === 2){
        setIsLoading(false);
        getAlert("danger", location + " already exists");
        setLocation("");
      }else if (response.data !== 0) {
        getAlert("success", "Success!");
        setTimeout(() => {
          setValidated(false);
          setShowAlert(false);
          setLocation("");
          setIsLoading(false);
        }, 1500);
      }
    } catch (err) {
      getAlert("danger", "There was an unexpected error: " + err);
    }
  };

  const getLocationCategory = async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const formData = new FormData();
      formData.append("operation", "getLocationCategory");
      const response = await axios.post(url, formData);
      if (response.data !== 0) {
        setLocationCategory(response.data);
      }
    } catch (err) {
      alert("There was an unexpected error: " + err);
    } finally {
      setIsLoading(false);
    }
  };

  const formValidation = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      submitLocation();
    }
  };

  useEffect(() => {
    getLocationCategory();
  }, []);

  return (
    <>
      <Container className="text-center mt-3">
        <Card border="dark">
          <Card.Header className="green-header">
            <h3>Location</h3>
          </Card.Header>
          <Card.Body>

            <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
            <div>
              <Container className='mb-3'>
                <Button onClick={getLocationCategory} variant='outline-success'>
                  <FontAwesomeIcon icon={faSync} /> Refresh
                </Button>
              </Container>
              <Form noValidate validated={validated} onSubmit={formValidation}>
                <Form.Group className="mb-3">
                  <Form.Select
                    onChange={(e) => setCategoryId(e.target.value)}
                    value={categoryId}
                    required
                  >
                    <option value={""}>Location Category</option>
                    {locationCategory.map((items, index) => (
                      <option key={index} value={items.locCateg_id}>
                        {items.locCateg_name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                  <FloatingLabel label="Location">
                    <Form.Control
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location"
                      required
                    />
                    <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Container>
                  <Button className='mt-3' type="submit" variant='outline-success' disabled={isLoading}>
                    {!isLoading && <FontAwesomeIcon icon={faCheck} className='me-2'/>}
                    {isLoading && <Spinner animation='border' size='sm' className='me-2' />}
                    Submit
                  </Button>
                  <Button className='ms-1 mt-3' variant='outline-secondary' onClick={openLocationModal}>
                    <FontAwesomeIcon icon={faEye} /> See all location
                  </Button>
                </Container>
              </Form>
            </div>
          </Card.Body>
        </Card>
      </Container>

      <LocationModal show={showLocationModal} onHide={closeLocationModal} />
    </>
  );
}

export default Location;
