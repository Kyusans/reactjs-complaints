import axios from 'axios';
import React, { useState } from 'react'
import { Button, FloatingLabel, Form, Modal, Spinner } from 'react-bootstrap'
import AlertScript from './AlertScript';

export default function AdminAddEquipment({ show, onHide }) {
  const [equipmentName, setEquipmentName] = useState("");
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

  const addEquipment = async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "admin.php";

      const jsonData = { equipmentName: equipmentName }

      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "addEquipment");

      const res = await axios.post(url, formData);
      console.log("res ni addEquipment", JSON.stringify(res.data));

      if (res.data === 1) {
        getAlert("success", "Successfully added!");
        setTimeout(() => {
          setEquipmentName("");
          setShowAlert(false);
          setValidated(false);
        }, 1200);
      } else {
        getAlert("danger", "Unsuccesful");
      }
    } catch (error) {
      getAlert("danger", "There was an error occured: " + error);
    }finally{
      setIsLoading(false);
    }
  }

  const handleAddEquipment = (e) => {
    const form = e.currentTarget;
    setValidated(true);
    e.preventDefault();
    e.stopPropagation();
    if (form.checkValidity()) {
      addEquipment();
    }
  }

  const handleHide = () => {
    setValidated(false);
    setEquipmentName("");
    setShowAlert(false);
    setIsLoading(false);
    onHide();
  }
  return (
    <>
      <Modal show={show} onHide={handleHide} backdrop="static" centered>
        <Modal.Header>
          <h4>Add Equipment</h4>
        </Modal.Header>

        <Form noValidate validated={validated} onSubmit={handleAddEquipment}>
          <Modal.Body>
            <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
            <FloatingLabel label="Equipment name">
              <Form.Control
                type='text'
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
                placeholder='Equipment name'
                required
              />
            </FloatingLabel>
          </Modal.Body>

          <Modal.Footer>
            <Button variant='outline-secondary' onClick={handleHide}>Close</Button>
            <Button variant='outline-success' type='submit'>{isLoading && <Spinner animation="border" size="sm" />} Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
