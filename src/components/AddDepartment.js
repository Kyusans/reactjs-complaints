import React, { useState } from 'react'
import { Button, Col, Container, FloatingLabel, Form, Modal, Nav, Row, Spinner } from 'react-bootstrap'
import AlertScript from './AlertScript'
import AdminShowDepartment from './AdminShowDepartment';
import axios from 'axios';

function AddDepartment({ show, onHide }) {
  const [departmentName, setDepartmentName] = useState("");
  const [isShowDepartment, setIsShowDepartment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  //for alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");


  const addDepartment = async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const jsonData = {
        "departmentName": departmentName
      }
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "addDepartment");
      const res = await axios.post(url, formData);
      if(res.data === -1){
        getAlert("danger", "Department name already exist!");
      }else if (res.data === 1) {
        getAlert("success", "Successfully added");
        setTimeout(() => {
          setDepartmentName("");
          setShowAlert(false);
          setValidated(false);
        }, 1200);
      }else{
        getAlert("danger", "Unsuccesful");
        console.log(JSON.stringify(res.data));
      }
    } catch (error) {
      getAlert("danger", "There was an error occured: " + error);
    } finally{
      setIsLoading(false);
    }
  }

  const handleAddDepartment = (e) => {
    const form = e.currentTarget;
    setValidated(true);
    e.preventDefault();
    e.stopPropagation();
    if (form.checkValidity()) {
      addDepartment();
    }
  }


  function getAlert(variantAlert, messageAlert) {
    setShowAlert(true);
    setAlertVariant(variantAlert);
    setAlertMessage(messageAlert);
  }

  const handleShowDepartmentSwitch = (value) => {
    setShowAlert(false);
    setIsShowDepartment(value === 0 ? false : true);
  }

  const handleHide = () => {
    setValidated(false);
    setDepartmentName("");
    setShowAlert(false);
    setIsLoading(false);
    onHide();
  }

  return (
    <Modal show={show} onHide={handleHide} centered size='xl'>
      <Form noValidate validated={validated} onSubmit={handleAddDepartment}>

        <Modal.Body>
          <Container fluid className='mb-3'>
            <Nav variant="tabs text-center">
              <Row>
                <Nav.Item as={Col} >
                  <Nav.Link eventKey="link-1" onClick={() => handleShowDepartmentSwitch(0)}><h5 className='p-2'>Add Department</h5></Nav.Link>
                </Nav.Item>
                <Nav.Item as={Col}>
                  <Nav.Link eventKey="link-2" onClick={() => handleShowDepartmentSwitch(1)}> <h5 className='p-2'>Show Departments</h5> </Nav.Link>
                </Nav.Item>
              </Row>
            </Nav>
          </Container>
          <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
          {isShowDepartment ? <AdminShowDepartment />
            :
            <Container className='d-flex justify-content-center mb-3 mt-4'>
              <FloatingLabel label="Department name" className='w-75'>
                <Form.Control
                  type='text'
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  placeholder='Department name'
                  required
                />
              </FloatingLabel>
            </Container>
          }
        </Modal.Body>

        <Modal.Footer>
          <Button variant='outline-secondary' onClick={handleHide}>Close</Button>
          {!isShowDepartment &&
            <Button variant='outline-success' type='submit'>{isLoading && <Spinner animation="border" size="sm" />} Submit</Button>
          }
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default AddDepartment