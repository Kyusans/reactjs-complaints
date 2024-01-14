import React, { useState } from 'react'
import { Button, Card, Container, FloatingLabel, Form, Modal, Spinner } from 'react-bootstrap';
import AlertScript from './AlertScript';
import axios from 'axios';

function AddPersonnel(props) {
  const { show, onHide } = props;
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //for alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleBackButtonClick = () => {
    onHide();
  };

  function getAlert(variantAlert, messageAlert) {
    setShowAlert(true);
    setAlertVariant(variantAlert);
    setAlertMessage(messageAlert);
  }

  const addPersonnel = async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const jsonData = {
        username: userId,
        password: password,
        userFullname: fullName,
        email: email,
        contact: contact
      }
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "addPersonnel");
      const res = await axios.post(url, formData);
      if (res.data === 2) {
        getAlert("danger", "User Id already exists")
      } else if (res.data === 1) {
        getAlert("success", "Successfully added");
        setTimeout(() => {
          setShowAlert(false);
          setUserId("");
          setPassword("");
          setEmail("");
          setFullName("");
          setContact("");
          setValidated(false);
        }, 1500);
      }
    } catch (error) {
      getAlert("danger", "There was an unexpected error: \n" + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = (e) => {
    setValidated(true);
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    if (form.checkValidity()) {
      addPersonnel();
    }
  }

  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered>
      <Container className='centered'>
        <Card className="card-thin" border='success'>

          <Form noValidate validated={validated} autoComplete="off" onSubmit={handleSubmit}>
            <Card.Header>
              <h4>Add Personnel</h4>
            </Card.Header>
            <Card.Body>
              <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
              <Form.Group className='mt-3 mb-3 fatter-text centered-label'>
                <FloatingLabel label="Id">
                  <Form.Control
                    type='text'
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder='Id'
                    autoFocus
                    required
                    autoComplete="none"
                  />
                </FloatingLabel>
              </Form.Group>

              <Form.Group className='mb-4 fatter-text centered-label'>
                <FloatingLabel label="Password">
                  <Form.Control
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                    required
                    autoComplete="none"
                  />
                </FloatingLabel>
              </Form.Group>

              <Form.Group className='mb-4 fatter-text centered-label'>
                <FloatingLabel label="Full Name">
                  <Form.Control
                    type='text'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder='Full Name'
                    required
                    autoComplete="none"
                  />
                </FloatingLabel>
              </Form.Group>

              <Form.Group className='mb-4 fatter-text centered-label'>
                <FloatingLabel label="Email">
                  <Form.Control
                    type='text'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Email'
                    required
                    autoComplete="none"
                  />
                </FloatingLabel>
              </Form.Group>

              <Form.Group className='mb-4 fatter-text centered-label'>
                <FloatingLabel label="Contact Number">
                  <Form.Control
                    type='text'
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder='Contact Number'
                    required
                    autoComplete="none"
                  />
                </FloatingLabel>
              </Form.Group>
            </Card.Body>

            <Card.Footer>
              <Container className='text-end'>
                <Button variant='outline-secondary' onClick={() => handleBackButtonClick()} className='me-1'>
                  Close
                </Button>
                <Button
                  type='submit'
                  variant='outline-success'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Spinner
                      as='span'
                      animation='border'
                      size='sm'
                      role='status'
                      aria-hidden='true'
                      className='me-2'
                    />
                  ) : null}
                  {isLoading ? 'Submitting...' : 'Submit'}
                </Button>
              </Container>
            </Card.Footer>
          </Form>
        </Card>
      </Container>
    </Modal>
  )
}

export default AddPersonnel