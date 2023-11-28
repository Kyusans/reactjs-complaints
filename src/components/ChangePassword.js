import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Container, FloatingLabel, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AlertScript from './AlertScript';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function ChangePassword() {
  const [currentPass, setCurrentPass] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [showInvalidCurrent, setShowInvalidCurrent] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigateTo = useNavigate();
  // for alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  function getAlert(variantAlert, messageAlert) {
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
      const response = await axios({ url: url, data: formData, method: 'post' });
      if (response.data !== 0) {
        setCurrentPass(localStorage.getItem("facultyLoggedIn") === "true" ? response.data.fac_password : response.data.user_password);
      }
    } catch (error) {
      alert("There was an error: " + error);
    }
  }, []);

  const changePassword = () => {
    setIsLoading(true);
    const userId = localStorage.getItem("facultyLoggedIn") === "true" ? localStorage.getItem("facCode") : localStorage.getItem("userId");
    const url = localStorage.getItem("url") + "users.php";
    const jsonData = { userId: userId, password: newPassword };
    const formData = new FormData();
    formData.append("json", JSON.stringify(jsonData));
    formData.append("operation", "changePassword");
    axios({ url: url, data: formData, method: "post" })
      .then((res) => {
        if (res.data !== 0) {
          setTimeout(() => {
            navigateTo(-1);
          }, 1000);
          getAlert("success", "Success!");
        } else {
          getAlert("danger", "New password is the same as the current password.");
          setNewPassword("");
        }
      })
      .catch((err) => {
        getAlert("danger", "There was an error: " + err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = (e) => {
    setShowInvalidCurrent(false);
    setPasswordsMatch(true);
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;

    // Trim leading and trailing spaces from current password
    const trimmedCurrentPassword = currentPassword.trim();
    setCurrentPassword(trimmedCurrentPassword);

    getCurrentPassword();

    if (newPassword !== confirmPassword && currentPass !== trimmedCurrentPassword) {
      setCurrentPassword("");
      setShowInvalidCurrent(true);
      setConfirmPassword("");
      setPasswordsMatch(false);
    } else if (currentPass !== trimmedCurrentPassword) {
      setCurrentPassword("");
      setShowInvalidCurrent(true);
    } else if (newPassword !== confirmPassword) {
      setConfirmPassword("");
      setPasswordsMatch(false);
    } else if (form.checkValidity()) {
      changePassword();
    }

    setValidated(true);
  };

  const handleBackButtonClick = () => {
    navigateTo(-1);
  };

  useEffect(() => {
    getCurrentPassword();
  }, [getCurrentPassword]);

  return (
    <Container className='centered'>
      <Card className="card-thin" border='success'>
        <Card.Footer>
          <Button variant='outline-danger button-m' onClick={() => handleBackButtonClick()}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
        </Card.Footer>
        <Card.Body>
          <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
          <Form noValidate validated={validated} onSubmit={handleSubmit} autoComplete="off">
            <Form.Group className='mb-4 fatter-text centered-label'>
              <FloatingLabel label="Current Password">
                <Form.Control
                  type='password'
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder='Current Password'
                  required
                  autoComplete="none"
                />
              </FloatingLabel>
              {showInvalidCurrent && <Form.Text className='text-danger'>Invalid current password</Form.Text>}
            </Form.Group>

            <Form.Group className='mb-4 fatter-text centered-label'>
              <FloatingLabel label="New Password">
                <Form.Control
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder='New Password'
                  required
                  autoComplete="none"
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className='mb-4 fatter-text centered-label'>
              <FloatingLabel label="Confirm Password">
                <Form.Control
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Confirm Password'
                  required
                  autoComplete="none"
                />
              </FloatingLabel>
              {!passwordsMatch && <Form.Text className='text-danger'>Passwords do not match</Form.Text>}
            </Form.Group>

            <Container className='text-center'>
              <Button type="submit" className='button-large btn-lg' variant='outline-success' disabled={isLoading}>
                {isLoading ? <Spinner animation="border" size="sm" /> : 'Change Password'}
              </Button>
            </Container>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ChangePassword;
