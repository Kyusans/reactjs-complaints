import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Container, FloatingLabel, Form, Modal, Spinner } from 'react-bootstrap'
import AlertScript from './AlertScript';

function AdminAddClient({ show, onHide }) {
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [deptId, setDeptId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validated, setValidated] = useState(false);
  const [department, setDepartment] = useState([]);

  //for alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");


  function getAlert(variantAlert, messageAlert) {
    setShowAlert(true);
    setAlertVariant(variantAlert);
    setAlertMessage(messageAlert);
  }

  const getDepartment = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const formData = new FormData();
      formData.append("operation", "getDepartment");
      const res = await axios.post(url, formData);
      if (res !== 0) {
        setDepartment(res.data);
      } else {
        getAlert("danger", "No departments yet");
      }
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  }, []);

  const addClient = async () => {
    setIsSubmitted(true);
    try {
      const url = localStorage.getItem("url") + "admin.php";

      const jsonData = {
        fullName: fullName,
        userId: userId,
        password: password,
        deptId: deptId,
      }

      //console.log("jsonData: " + JSON.stringify(jsonData));
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "addClient");

      const res = await axios.post(url, formData);
      // console.log("res ni addClient ko to : " + JSON.stringify(res));

      if (res.data === 1) {
        getAlert("success", "Successfully added!");
        setTimeout(() => {
          setShowAlert(false);
          setValidated(false);
          setUserId("");
          setFullName("");
          setPassword("");
          setDeptId("");
        }, 1200);
      } else {
        getAlert("danger", "Unsuccesful");
      }
    } catch (error) {
      getAlert("danger", "There was an unexpected error: " + error);
    } finally {
      setIsSubmitted(false);
    }
  }

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    setValidated(true);
    if (form.checkValidity()) {
      addClient();
    }
    e.preventDefault();
    e.stopPropagation();
  }

  const handleHide = () => {
    setShowAlert(false);
    setValidated(false);
    setUserId("");
    setFullName("");
    setPassword("");
    setDeptId("");
    onHide();
  }

  useEffect(() => {
    if (show) {
      getDepartment();
    }
  }, [getDepartment, show])

  return (
    <div>

      <Modal show={show} onHide={handleHide} backdrop="static" centered>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Header>
            <Modal.Title>
              Add Client
            </Modal.Title>
          </Modal.Header>

          {isLoading ?
            <Container className='text-center'>
              <Spinner variant='success' />
            </Container>
            :
            <Modal.Body>
              <Container>
                <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
                <FloatingLabel className='mb-3' label="Id">
                  <Form.Control
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder='Id'
                    required
                  />
                  <Form.Control.Feedback type='invalid'></Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel className='mb-3' label="Full name">
                  <Form.Control
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder='Full name'
                    required
                  />
                </FloatingLabel>

                <FloatingLabel className='mb-3' label="Password">
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Full name'
                    required
                  />
                </FloatingLabel>

                <FloatingLabel className='mb-3' label="Select department">
                  <Form.Select
                    type="text"
                    value={deptId}
                    onChange={(e) => setDeptId(e.target.value)}
                    placeholder='Full name'
                    required
                  >
                    <option value={""}>Open this select menu</option>
                    {department.map((departments, index) => (
                      <option key={index} value={departments.dept_id}>{departments.dept_name}</option>
                    ))}
                  </Form.Select>
                </FloatingLabel>

              </Container>
            </Modal.Body>
          }
          <Modal.Footer>
            <Button variant='outline-secondary' onClick={handleHide}>Close</Button>
            <Button type='submit' variant='outline-success' >{isSubmitted && <Spinner variant='success' size="sm" />} Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </div>
  )
}

export default AdminAddClient