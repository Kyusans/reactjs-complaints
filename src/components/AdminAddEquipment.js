import axios from 'axios';
import React, { useState } from 'react'
import { Button, Col, Container, FloatingLabel, Form, Modal, Nav, Row, Spinner } from 'react-bootstrap'
import AlertScript from './AlertScript';
import AdminShowEquipment from './AdminShowEquipment';

export default function AdminAddEquipment({ show, onHide }) {
  const [equipmentName, setEquipmentName] = useState("");
  const [isShowEquipment, setIsShowEquipment] = useState(false);
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

      // console.log("jsonData: ", JSON.stringify(jsonData));

      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "addEquipment");

      const res = await axios.post(url, formData);
      // console.log("res ni addEquipment", JSON.stringify(res.data));
      if (res.data === -1) {
        getAlert("danger", "Equipment name already exist!");
      } else if (res.data === 1) {
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
    } finally {
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

  const handleShowEquipmentSwitch = (status) => {
    setShowAlert(false);
    setIsShowEquipment(status === 0 ? false : true);
  }
  return (
    <>
      <Modal show={show} onHide={handleHide} centered size='xl'>
        <Form noValidate validated={validated} onSubmit={handleAddEquipment}>

          <Modal.Body>
            <Container fluid className='mb-3'>
              <Nav variant="tabs text-center">
                <Row>
                  <Nav.Item as={Col} >
                    <Nav.Link eventKey="link-1" onClick={() => handleShowEquipmentSwitch(0)}><h5 className='p-2'>Add Equipment</h5></Nav.Link>
                  </Nav.Item>
                  <Nav.Item as={Col}>
                    <Nav.Link eventKey="link-2" onClick={() => handleShowEquipmentSwitch(1)}> <h5 className='p-2'>Show Equipments</h5> </Nav.Link>
                  </Nav.Item>
                </Row>
              </Nav>
            </Container>
            <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
            {isShowEquipment ? <AdminShowEquipment />
              :
              <Container className='d-flex justify-content-center mb-3 mt-4'>
                <FloatingLabel label="Equipment name" className='w-75'>
                  <Form.Control
                    type='text'
                    value={equipmentName}
                    onChange={(e) => setEquipmentName(e.target.value)}
                    placeholder='Equipment name'
                    required
                  />
                </FloatingLabel>
              </Container>
            }
          </Modal.Body>

          <Modal.Footer>
            <Button variant='outline-secondary' onClick={handleHide}>Close</Button>
            {!isShowEquipment &&
              <Button variant='outline-success' type='submit'>{isLoading && <Spinner animation="border" size="sm" />} Submit</Button>
            }
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
