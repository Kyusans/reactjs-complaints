import React, { useCallback, useEffect, useState } from 'react'
import "./css/site.css";
import { Button, Card, Container, FloatingLabel, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AlertScript from './AlertScript';

function ChangePassword() {
  const [currentPass, setCurrentPass] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  // const [isCurrentPassword, setIsCurrentPassword] = useState(true);
  const [validated, setValidated] = useState(false);
  const [showInvalidCurrent, setShowInvalidCurrent] = useState(false);

  const navigateTo = useNavigate();

  	//for alert
	const [showAlert, setShowAlert] = useState(false);
	const [alertVariant, setAlertVariant] = useState("");
	const [alertMessage, setAlertMessage] = useState("");


	function getAlert(variantAlert, messageAlert){
		setShowAlert(true);
		setAlertVariant(variantAlert);
		setAlertMessage(messageAlert);
	}

  const getCurrentPassword = useCallback(async () => {
    try {
      const userId = localStorage.getItem("facultyLoggedIn") === "true" ? localStorage.getItem("facCode") : localStorage.getItem("userId");
      const url = localStorage.getItem("url") + "users.php";
      const jsonData = { userId: userId };
      const formData = new FormData();
      formData.append("operation", "getCurrentPassword");
      formData.append("json", JSON.stringify(jsonData));
      const response = await axios({url: url, data: formData, method: 'post'});
      if (response.data !== 0) {
        setShowInvalidCurrent(false);
        setCurrentPass(localStorage.getItem("facultyLoggedIn") === "true" ? response.data.fac_password : response.data.user_password);
      }
    } catch (error) {
      alert("There was an error: " + error);
    }
  },[]);
  
  const changePassword = () =>{
    const userId = localStorage.getItem("facultyLoggedIn") === "true" ? localStorage.getItem("facCode") : localStorage.getItem("userId");
    const url = localStorage.getItem("url") + "users.php";
    const jsonData = { userId: userId, password: newPassword };
    const formData = new FormData();
    formData.append("json", JSON.stringify(jsonData));
    formData.append("operation", "changePassword");
    axios({url: url, data: formData, method: "post"})
    .then((res) =>{
      if(res.data !== 0){
        setTimeout(()=>{
          navigateTo(-1);
        }, 1000);
        getAlert("success", "Success!");
      }else{
        getAlert("danger", "New password is same as current.");
        setNewPassword("");
      }
    })
    .catch((err) =>{
      getAlert("danger","There was an error: " + err);
     
    })
  }

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    getCurrentPassword();
    if(currentPass !== currentPassword){
      setCurrentPassword("");
      setTimeout(() => {setShowInvalidCurrent(true);}, 1000);
      e.preventDefault();
      e.stopPropagation();
    }else if(form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }else if(form.checkValidity() === true) {
      e.preventDefault();
      e.stopPropagation();
      changePassword();
    }

    setValidated(true);
  }
  useEffect(() => {
    getCurrentPassword();
  },[getCurrentPassword])
  

  return (
    <Container className='centered'>
    <Card className="card-thin" border='success'>
      <Card.Body>
        <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className='mt-3 mb-3 fatter-text centered-label'>
            <FloatingLabel label="Current Password">
              <Form.Control type='password' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder='Current Password' autoFocus required/>
            </FloatingLabel>
            {showInvalidCurrent && <Form.Text className='text-danger'>Invalid current password</Form.Text>}
          </Form.Group>
          <Form.Group className='mb-4 fatter-text centered-label'>
            <FloatingLabel label="New Password">
              <Form.Control type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='New Password' required/>
            </FloatingLabel>
          </Form.Group>

          <Container className='text-center'>
            <Button type="submit" className='button-large btn-lg' variant='outline-success' >Change Password</Button>
          </Container>
        </Form>
      </Card.Body>
    </Card>
  </Container>
  )
}


export default ChangePassword