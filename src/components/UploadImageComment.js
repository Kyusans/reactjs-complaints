import axios from 'axios';
import React, { useState } from 'react'
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import AlertScript from './AlertScript';

function UploadImageComment(props) {
  const { show, onHide, compId } = props;

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  //for alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");


  function getAlert(variantAlert, messageAlert) {
    setShowAlert(true);
    setAlertVariant(variantAlert);
    setAlertMessage(messageAlert);
  }

  const addImageComment = async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "users.php";
      const userId = localStorage.getItem("facultyLoggedIn") === "true" ? localStorage.getItem("facCode") : localStorage.getItem("userId");
      const fullName = localStorage.getItem("userFullName");
      const jsonData = { compId: compId, userId: userId, commentImage: image, fullName: fullName };

      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "addImageComment");
      formData.append('file', image);

      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("response: " + JSON.stringify(response));
      switch (response.data) {
        case 1:
          getAlert("success", "Success");
          setTimeout(() => {
            onHide();
          }, 1500);
          break;
        case 2:
          getAlert("danger", "You cannot Upload files of this type!");
          break;
        case 3:
          getAlert("danger", "There was an error uploading your file!");
          break;
        case 4:
          getAlert("danger", "Your file is too big (25mb maximum)");
          break;
        default:
          getAlert("danger", "Unsuccessful");
          break;
      }
    } catch (err) {
      getAlert("There was an unexpected error: " + err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size='lg' backdrop="static">
        <Modal.Body>
          <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
          <Form onSubmit={addImageComment}>
            <Form.Group>
              <FloatingLabel label="Image (optional)">
                <Form.Control type='file' name='file' onChange={(e) => setImage(e.target.files[0])} />
              </FloatingLabel>
            </Form.Group>
          </Form>
          <Modal.Footer>
            <Button variant='outline-danger'onClick={onHide} >Close</Button>
            <Button variant='outline-success'>Submit</Button>
          </Modal.Footer>
        </Modal.Body>

      </Modal>
    </>
  )
}

export default UploadImageComment