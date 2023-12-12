import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Container, Form, Spinner, Row, Col, FloatingLabel, Button, ListGroup, Modal, Image } from 'react-bootstrap';
// import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faUpload } from '@fortawesome/free-solid-svg-icons';
import "./css/site.css";
import ConfirmModal from './ConfirmModal';
import MessageList from './MessageList';
import UploadImageComment from './UploadImageComment';

export function formatDate(inputDate) {
  const date = new Date(inputDate);
  const currentDate = new Date();
  const timeDifference = Math.floor((currentDate - date) / 1000);

  if (timeDifference < 120) {
    return 'Just now';
  } else if (timeDifference < 3600) {
    return `${Math.floor(timeDifference / 60)} minute${Math.floor(timeDifference / 60) > 1 ? 's' : ''} ago`;
  } else if (
    date.getDate() === currentDate.getDate() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  ) {
    return `${Math.floor(timeDifference / 3600)} hour${Math.floor(timeDifference / 3600) > 1 ? 's' : ''} ago`;
  } else if (
    date.getDate() === currentDate.getDate() - 1 &&
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  ) {
    return 'Yesterday';
  } else {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}`;
  }
}

export default function JobDetails(props) {
  const { show, onHide, compId } = props;
  // const { compId } = useParams();
  const [isGoingToUpload, setIsGoingToUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState({});
  const [assignedPersonnel, setAssignedPersonnel] = useState([]);
  const [comment, setComment] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isPersonnel, setIsPersonnel] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [image, setImage] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const isAdmin = localStorage.getItem("adminLoggedIn") === "true" ? true : false;

  const openConfirmModal = () => { setShowConfirmModal(true); }
  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  }

  const openImageModal = () => { setShowImageModal(true); }
  const closeImageModal = () => {
    setShowImageModal(false);
  }

  // const navigateTo = useNavigate();

  // const handleBackButtonClick = () => {
  //   navigateTo(-1);
  // };

  const addComment = async () => {
    setIsAddingComment(true);
    try {
      if (newComment !== "") {
        const url = localStorage.getItem("url") + "users.php";
        const userId = localStorage.getItem("facultyLoggedIn")
          ? localStorage.getItem("facCode")
          : localStorage.getItem("userId");
        const fullName = localStorage.getItem("userFullName");
        const jsonData = { compId: compId, userId: userId, commentText: newComment, fullName: fullName };
        const formData = new FormData();
        console.log("jsondata ni addcomment: ", JSON.stringify(jsonData))
        formData.append("operation", "addComment");
        formData.append("json", JSON.stringify(jsonData));

        const res = await axios({
          url: url,
          data: formData,
          method: "post",
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log("Comment mo to: " + JSON.stringify(res.data));

        if (res.data === 1) {
          getComment();
          setNewComment('');
        }
      }
    } catch (err) {
      alert("Error: " + err);
    }finally{
      setIsAddingComment(false);
    }
  };


  const getComment = useCallback(async () => {
    try {
      const url = localStorage.getItem("url") + "users.php";
      const jsonData = { compId: compId };
      const formData = new FormData();
      formData.append("operation", "getComment");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios({ url: url, data: formData, method: "post" });
      if (res.data !== 0) {
        setComment(res.data);
      }
    } catch (error) {
      alert("There was an unexpected error: " + error);
    }
  }, [compId]);

  const getJobDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const jsonData = { compId: compId };
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "getJobDetails");
      const res = await axios({ url: url, data: formData, method: "post" });
      if (res.data !== 0) {
        if (res.data.joStatus_name === "Completed") {
          setIsCompleted(true);
        }
        getAssignedPersonnel(res.data.job_id);
        setDetails(res.data);
        setImage(res.data.comp_image);
      }
    } catch (err) {
      alert("There was an unexpected error: " + err);
    } finally {
      setIsLoading(false);
    }
  }, [compId])

  const getAssignedPersonnel = async (jobId) => {
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const jsonData = { jobId: jobId };
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "getAssignedPersonnel");
      const res = await axios({ url: url, data: formData, method: "post" });
      if (res.data !== 0) {
        setAssignedPersonnel(res.data);
      }
    } catch (error) {
      alert("There was an error occured: " + error.message);
    }
  }

  const reopenJob = () => {
    const url = localStorage.getItem("url") + "admin.php";
    const jsonData = { compId: compId };
    const formData = new FormData();
    formData.append("operation", "reopenJob");
    formData.append("json", JSON.stringify(jsonData));
    axios({ url: url, data: formData, method: "post" })
      .then((res) => {
        if (res.data === 1) {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      })
      .catch((err) => {
        alert("There was an unexpected error: " + err);
      })
  }

  useEffect(() => {
    if (show) {
      setIsAddingComment(false);
      setIsGoingToUpload(false);
      setIsPersonnel(localStorage.getItem("userLevel") === "90" ? true : false);
      getJobDetails();
      getComment();
    }
  }, [compId, getComment, getJobDetails, isPersonnel, show]);

  return (
    <>
      <Modal show={show} onHide={onHide} size='lg' centered backdrop="static">
        <Modal.Body>
          {isLoading ?
            <Container className='text-center'>
              <Spinner animation='border' variant='success' />
            </Container>
            :
            <div>

              <Button variant='outline-danger button-m' onClick={onHide}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </Button>

              <h3 className='text-center mt-3'>Job details</h3>
              <Row className='mt-3'>
                <Col>
                  <FloatingLabel controlId="subject" label="Subject">
                    <Form.Control type="text" value={details.comp_subject} readOnly />
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel controlId="location" label="Location">
                    <Form.Control type="text" value={details.location_name} readOnly />
                  </FloatingLabel>
                </Col>
              </Row>

              <Row className='mt-3'>
                <Col>
                  <FloatingLabel controlId="Submitted By" label="Submitted By">
                    <Form.Control type="text" value={details.fac_name} readOnly />
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel controlId="user" label="Job Order Created By">
                    <Form.Control type="text" value={details.user_full_name} readOnly />
                  </FloatingLabel>
                </Col>
              </Row>

              <Row className='mt-3'>
                <Col>
                  <Form.Label>Description:</Form.Label>
                  <Form.Control as="textarea" style={{ height: "100px" }} value={details.job_description} readOnly />
                </Col>
              </Row>

              <Row className='mt-3'>
                <Col>
                  <FloatingLabel controlId="status" label="Status">
                    <Form.Control type="text" value={details.joStatus_name} readOnly />
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel controlId="priority" label="Priority">
                    <Form.Control type="text" value={details.priority_name} readOnly />
                  </FloatingLabel>
                </Col>
              </Row>

              <Row className='mt-3'>
                <Col>
                  <FloatingLabel controlId="createDate" label="Job Order Date Created">
                    <Form.Control type="text" value={formatDate(details.job_createDate)} readOnly />
                  </FloatingLabel>
                </Col>
              </Row>

              <Row className='mt-3'>
                <Col>
                  <Container className='image-border'>
                    {image ? (
                      <>
                        <p className='text-secondary'>Image submitted</p>
                        <Image src={localStorage.getItem("url") + "/images/" + image} className='card-image' rounded />
                      </>
                    ) : (
                      <p className='text-secondary mt-2'>No image submitted</p>
                    )}
                  </Container>
                </Col>
              </Row>

              <Row className='mt-3 justify-content-center'>
                <Col xs={12} md={6}>
                  <ListGroup>
                    <ListGroup.Item className='green-header'>Assigned Personnel</ListGroup.Item>
                    {assignedPersonnel.map((person, index) => (
                      <ListGroup.Item key={index}>{`${index + 1}. ${person.user_full_name}`}</ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
              </Row>

              <Container className='text-center mt-3'>
                {
                  isPersonnel && parseInt(details.joStatus_id, 10) === 2 ? (
                    <Button className='mt-2' variant='outline-success' onClick={openConfirmModal}>Mark as done</Button>
                  ) : (isAdmin && isCompleted) ? (
                    <Button className='mt-2' variant='outline-success' onClick={reopenJob}>Reopen Job</Button>
                  ) : null
                }
              </Container>
              <hr />
              <Container>
                {!isCompleted ?
                  (<Form className='mb-5'>
                    <FloatingLabel label="Add a comment..">
                      <Form.Control as="textarea" style={{ height: '75px' }} value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder='Add a comment..' required />
                    </FloatingLabel>
                    {isGoingToUpload &&
                      <Form.Group className='mt-2'>
                        <FloatingLabel label="Image (optional)">
                          <Form.Control type='file' name='file' onChange={(e) => setImage(e.target.files[0])} />
                        </FloatingLabel>
                      </Form.Group>
                    }
                    <div className='mt-3'>
                      <Button variant='outline-primary' onClick={addComment} disabled={isAddingComment}>
                        {isAddingComment ? <Spinner size='sm' /> : <FontAwesomeIcon icon={faCheck} />} Submit
                      </Button>
                      {" "}
                      <Button variant='outline-secondary' onClick={() => setIsGoingToUpload(true)}><FontAwesomeIcon icon={faUpload} /> Upload an image</Button>
                    </div>
                  </Form>) : null}
                {comment.length <= 0 ?
                  <Container className='text-secondary text-center'>
                    <p>There is no comment yet..</p>
                  </Container>
                  :
                  <div>
                    {comment.map((comments, index) => (
                      <Row key={index}>
                        <Col xs={12} md={12}>
                          <MessageList userId={comments.user_id} username={comments.full_name} message={comments.comment_commentText} date={formatDate(comments.comment_date)} />
                        </Col>
                      </Row>
                    ))}
                  </div>
                }
              </Container>
            </div>
          }
        </Modal.Body>

      </Modal>
      <UploadImageComment show={showImageModal} onHide={closeImageModal} compId={compId} />
      <ConfirmModal show={showConfirmModal} hide={closeConfirmModal} compId={details.comp_id} />
    </>
  )
}
