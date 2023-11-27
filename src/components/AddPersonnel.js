import React, { useState } from 'react'
import { Button, Card, Container, FloatingLabel, Form } from 'react-bootstrap';
import AlertScript from './AlertScript';

function AddPersonnel() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");

  //for alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");


  function getAlert(variantAlert, messageAlert) {
    setShowAlert(true);
    setAlertVariant(variantAlert);
    setAlertMessage(messageAlert);
  }

  const addPersonnel = async () => {
    try {

    } catch (error) {
      getAlert("danger", "There was an unexpected error:", error);
    }
  }

  return (
    <div>
      <Container className='centered'>
        <Card className="card-thin" border='success'>
          <Card.Body>
            <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
            <Form autocomplete="off">
              <Form.Group className='mt-3 mb-3 fatter-text centered-label'>
                <FloatingLabel label="Id">
                  <Form.Control
                    type='text'
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder='Id'
                    autoFocus
                    required
                    autocomplete="none"
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
                    autocomplete="none"
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
                    autocomplete="none"
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
                    autocomplete="none"
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
                    autocomplete="none"
                  />
                </FloatingLabel>
              </Form.Group>

              <Container className='text-center'>
                <Button className='button-large btn-lg' variant='outline-success' onClick={addPersonnel}>Add Personnel</Button>
              </Container>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default AddPersonnel