import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Row, Col, FloatingLabel, Form, Modal, Button, Spinner, Container } from 'react-bootstrap';
import AlertScript from './AlertScript';

function ComplaintForm(props) {
  const { show, onHide } = props;
  const [locationId, setLocationId] = useState("");
  const [locationCategoryId, setLocationCategoryId] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [locationCategory, setLocationCategory] = useState([]);
  const [location, setLocation] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState(null);
  const [validated, setValidated] = useState(false);
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

  const addComplaint = async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "users.php";
      const clientId = localStorage.getItem("userId");
      const jsonData = {
        subject: subject,
        clientId: clientId,
        locationId: locationId,
        locationCategoryId: locationCategoryId,
        description: description,
        startDate: startDate,
        endDate: endDate,
      };

      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "addComplaint");
      formData.append('file', image);

      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("response: " + JSON.stringify(response));
      switch (response.data) {
        case 1:
          getAlert("success", "Success");
          setTimeout(() => {
            handleClose();
          }, 1500);
          break;
        case 2:
          getAlert("danger", "You cannot Upload files of this type!");
          break;
        case 3:
          getAlert("danger", "There was an error uploading your file!");
          break;
        case 4:
          getAlert("danger", "Your file is too big (25mb maximum)");
          break;
        default:
          getAlert("danger", "Unsuccessful");
          break;
      }
    } catch (err) {
      getAlert("There was an unexpected error: " + err);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocation = (id) => {
    const url = localStorage.getItem("url") + "admin.php";
    const jsonData = { categoryId: id };
    const formData = new FormData();
    formData.append("json", JSON.stringify(jsonData));
    formData.append("operation", "getLocations");
    axios({ url: url, data: formData, method: "post" })
      .then((res) => {
        if (res.data !== 0) {
          setLocation(res.data);
        }
      })
      .catch((err) => {
        alert("There was an unexpected error: " + err);
      });
  };

  function handleClose() {
    setValidated(false);
    setSubject("");
    setLocationId("");
    setLocationCategoryId("");
    setDescription("");
    setShowAlert(false);
    setStartDate("");
    setEndDate("");
    onHide();
  }
  const formValidation = (e) => {
    setValidated(true);
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    if (form.checkValidity() === true) {
      addComplaint();
    }
  }
  useEffect(() => {
    if (show) {
      const getLocationCategory = async () => {
        try {
          const url = localStorage.getItem("url") + "admin.php";
          const formData = new FormData();
          formData.append("operation", "getLocationCategory");
          const response = await axios({
            url: url,
            data: formData,
            method: "post"
          });
          if (response.data !== 0) {
            setLocationCategory(response.data);
          }
        } catch (error) {
          getAlert("danger", "There was an unexpected error: " + error);
        }
      };
      getLocationCategory();
      if (locationCategoryId !== "") {
        setLocationId("");
        getLocation(locationCategoryId);
      }
    }
  }, [locationCategoryId, show])

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static">

        <Modal.Header closeButton><h4>Ticket Form</h4></Modal.Header>

        <Modal.Body>

          <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />

          <Form noValidate validated={validated} onSubmit={formValidation}>
            <Row className='g2'>

              <Form.Group as={Col} className='mb-4'>

                <FloatingLabel label="Location Category">
                  <Form.Select value={locationCategoryId} onChange={e => setLocationCategoryId(e.target.value)} required>
                    <option disabled={locationCategoryId !== "" ? true : false} value="">Open this select menu</option>
                    {locationCategory.map((locationCateg, index) => (
                      <option key={index} value={locationCateg.locCateg_id}>{locationCateg.locCateg_name}</option>
                    ))}
                  </Form.Select>

                  <Form.Control.Feedback type='invalid'>This field is required</Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>

              <Form.Group as={Col}>
                  <>
                    <FloatingLabel label="Location">
                      <Form.Select value={locationId} onChange={e => setLocationId(e.target.value)} required disabled={locationCategoryId === ""}>
                        <option value={""}>Open this select menu</option>
                        {location.map((locations, index) => (
                          <option key={index} value={locations.location_id}>{locations.location_name}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type='invalid'>This field is required</Form.Control.Feedback>
                    </FloatingLabel>
                  </>
              </Form.Group>

            </Row>

            <Form.Group className='mb-3'>
              <FloatingLabel label="Subject">
                <Form.Control type='text' value={subject} onChange={(e) => setSubject(e.target.value)} placeholder='Subject' autoFocus required />
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

            <Form.Group className="mt-3 mb-2">
              <Row>
                <Col xs={12} md={6} className='mb-2'>
                  <Container>
                    <FloatingLabel controlId="startDateLabel" label="Start Date">
                      <Form.Control type='datetime-local' value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                    </FloatingLabel>
                  </Container>
                </Col>

                <Col xs={12} md={6}>
                  <Container>
                    <FloatingLabel controlId="endDateLabel" label="End Date (optional)">
                      <Form.Control type='datetime-local' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </FloatingLabel>
                  </Container>
                </Col>
              </Row>
            </Form.Group>

            <Form.Group>
              <FloatingLabel label="Image (optional)">
                <Form.Control type='file' name='file' onChange={(e) => setImage(e.target.files[0])} />
              </FloatingLabel>
            </Form.Group>

            <Modal.Footer>
              <Button variant='outline-danger' onClick={handleClose}>Close</Button>
              <Button variant='outline-success' type='submit' name="submit" disabled={isLoading}>
                {isLoading ? (
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                ) : (
                  "Submit"
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ComplaintForm