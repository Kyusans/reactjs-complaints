import React, { useState } from 'react'
import "./css/site.css";
import { Button, Card, Container, FloatingLabel, Form } from 'react-bootstrap';

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const handleSubmit = (e) => {
    const form = e.currentTarget;

    if(form.checkValidity()) {

    }
  }

  return (
    <Container className='centered'>
    <Card className="card-thin" border='success'>
      <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className='mt-3 mb-3 fatter-text centered-label'>
            <FloatingLabel label="Current Password">
              <Form.Control type='password' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder='Current Password' autoFocus required/>
            </FloatingLabel>
          </Form.Group>
          <Form.Group className='mb-4 fatter-text centered-label'>
            <FloatingLabel label="New Password">
              <Form.Control type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='New Password' required/>
            </FloatingLabel>
          </Form.Group>

          <Container className='text-center'>
            <Button className='button-large btn-lg' variant='outline-success' >Change Password</Button>
          </Container>
        </Form>
      </Card.Body>
    </Card>
  </Container>
  )
}

export default ChangePassword