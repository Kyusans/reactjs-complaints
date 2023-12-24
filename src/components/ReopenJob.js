import axios from 'axios';
import React, { useState } from 'react';
import { Button, FloatingLabel, Form, Modal, Spinner } from 'react-bootstrap';
import AlertScript from './AlertScript';

function ReopenJob(props) {
  const { show, onHide, compId } = props;
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  //for alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");


  function getAlert(variantAlert, messageAlert) {
    setShowAlert(true);
    setAlertVariant(variantAlert);
    setAlertMessage(messageAlert);
  }

  const reopenJob = async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const userId = localStorage.getItem("userId");
      const jsonData = { compId: compId, userId: userId, comment: note };
      const formData = new FormData();
      formData.append("operation", "reopenJob");
      formData.append("json", JSON.stringify(jsonData));

      console.log("json data: " + JSON.stringify(jsonData));

      const res = await axios({
        url: url,
        data: formData,
        method: "post"
      });
      console.log("res ni reopenjob", res.data);
      if (res.data === 1) {
        getAlert("success", "Success!");
      }
    } catch (err) {
      alert("There was an unexpected error: " + err);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        handleOnHide();
      }, 1200);   
    }
  };


  const handleOnHide = () => {
    setNote("");
    onHide();
    setValidated(false);
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity()) {
      reopenJob();
    }

    setValidated(true);
  }

  return (
    <Modal className='bg-dark' show={show} onHide={onHide} backdrop={'static'} centered>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Header>
          <h3>Reopen Job</h3>
        </Modal.Header>
        <Modal.Body>
          <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
          <FloatingLabel label="Note">
            <Form.Control type='text' value={note} onChange={(e) => setNote(e.target.value)} placeholder='Note' required />
          </FloatingLabel>

        </Modal.Body>
        <Modal.Footer>
          <Button variant='outline-secondary' onClick={handleOnHide}>Close</Button>
          <Button type='submit' variant='outline-success' disabled={isLoading}>
            {isLoading && <Spinner animation="border" variant="success me-1" size='sm' />}
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ReopenJob;
