import React, { useCallback, useRef, useState } from 'react';
import { Button, Container, FloatingLabel, Form, Modal, Row } from 'react-bootstrap';
import Webcam from 'react-webcam';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function WebcamModal(props) {
  const { show, onHide, compId } = props;
  const [commentText, setCommentText] = useState("");
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [videoConstraints, setVideoConstraints] = useState({
    facingMode: 'user',
  });

  const handleCaptureSubmit = async () => {
    try {
      const url = localStorage.getItem("url") + "users.php";
      const userId = localStorage.getItem("facultyLoggedIn")
        ? localStorage.getItem("facCode")
        : localStorage.getItem("userId");
      const fullName = localStorage.getItem("userFullName");
      const jsonData = { compId: compId, userId: userId, fullName: fullName, commentText: commentText };

      const formData = new FormData();
      formData.append("operation", "addComment");
      formData.append("json", JSON.stringify(jsonData));

      if (capturedImage) {
        const blob = await fetch(capturedImage).then((res) => res.blob());
        const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
        formData.append('file', file);
      }

      const res = await axios({
        url: url,
        data: formData,
        method: "post",
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Comment mo to: " + JSON.stringify(res.data));

      switch (res.data) {
        case 1:
          break;
        case 2:
          alert("You cannot Upload files of this type!");
          break;
        case 3:
          alert("There was an error uploading your file!");
          break;
        case 4:
          alert("Your file is too big (25mb maximum)");
          break;
        default:
          alert("Unsuccessful");
          break;
      }
    } catch (error) {
      // Handle errors
      console.error(error);
    } finally {
      handleOnHide();
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const switchCamera = () => {
    setVideoConstraints({
      ...videoConstraints,
      facingMode: videoConstraints.facingMode === 'user' ? 'environment' : 'user',
    });
  };

  const handleOnHide = () => {
    setCommentText("");
    setCapturedImage(null);
    onHide();
  }

  return (
    <>
      <Modal show={show} onHide={onHide} size='lg' className='bg-dark' backdrop="static" centered>
        <Form>
          <Modal.Body>
            <Button variant='outline-danger button-m' onClick={onHide}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <hr/>
            <Container className='text-center mt-3'>
              {capturedImage ? (
                <img src={capturedImage} alt="Captured" className="img-fluid" />
              ) : (
                <Row className='d-flex  justify-content-center'>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-100"
                    videoConstraints={videoConstraints}
                  />
                </Row>
              )}
              <Row className='d-flex justify-content-center mt-3'>
                {capturedImage ? (
                  <>
                    <Container className='mt-3 mb-3'>
                      <FloatingLabel label="Add comment">
                        <Form.Control type='text' value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder='Add comment'
                        />
                      </FloatingLabel>
                    </Container>

                    <Button variant='outline-success big-height w-50 me-1' onClick={handleCaptureSubmit}>
                      Submit
                    </Button>
                    <Button variant='outline-danger big-height w-50 mt-2' onClick={handleRetake}>
                      Retake
                    </Button>

                  </>
                ) : (
                  <Button variant='outline-success big-height w-50' onClick={capture}>
                    Capture Photo
                  </Button>
                )}
              </Row>
              {!capturedImage && (
                <Row className='d-flex justify-content-center mt-2'>
                  <Button variant='outline-info big-height w-50' onClick={switchCamera}>
                    Switch Camera
                  </Button>
                </Row>
              )}
            </Container>
          </Modal.Body>
        </Form>
      </Modal>
    </>
  );
}

export default WebcamModal;
