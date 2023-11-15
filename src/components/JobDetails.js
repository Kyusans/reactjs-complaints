import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Card, Container, Form, Spinner, Row, Col, FloatingLabel, Button, ListGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import "./css/site.css";
import ConfirmModal from './ConfirmModal';
import MessageList from './MessageList';

export function formatDate(inputDate) {
  const date = new Date(inputDate);
  const currentDate = new Date();
  const timeDifference = Math.floor((currentDate - date) / 1000); // Time difference in seconds

  if (timeDifference < 120) {
    return 'Just now';
  } else if (timeDifference < 3600) {
    // Less than an hour ago
    return `${Math.floor(timeDifference / 60)} minute${Math.floor(timeDifference / 60) > 1 ? 's' : ''} ago`;
  } else if (
    date.getDate() === currentDate.getDate() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  ) {
    // Today
    return `${Math.floor(timeDifference / 3600)} hour${Math.floor(timeDifference / 3600) > 1 ? 's' : ''} ago`;
  } else if (
    date.getDate() === currentDate.getDate() - 1 &&
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  ) {
    // Yesterday
    return 'Yesterday';
  } else {
    // A specific date format for other dates
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}`;
  }
}

export default function JobDetails() {
  const { compId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState({});
  const [assignedPersonnel, setAssignedPersonnel] = useState([]);
  const [comment, setComment] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isPersonnel, setIsPersonnel] = useState(false);

  const openConfirmModal = () =>{setShowConfirmModal(true);}
  const closeConfirmModal = () =>{
    setShowConfirmModal(false);
  }

  const navigateTo = useNavigate();

  const handleBackButtonClick = () => {
    navigateTo(-1);
  };

  const addComment = () => {
    console.log("new comment: ", newComment);
    if(newComment !== ""){
      const url = localStorage.getItem("url") + "users.php";
      const userId = localStorage.getItem("facultyLoggedIn") === "true" ? localStorage.getItem("facCode") : localStorage.getItem("userId");
      const jsonData = { compId: compId, userId: userId, commentText: newComment };
      const formData = new FormData();
      formData.append("operation", "addComment");
      formData.append("json", JSON.stringify(jsonData));
      axios({ url: url, data: formData, method: "post" })
        .then((res) => {
          if (res.data === 1) {
            getComment();
            setNewComment('');
          }
        })
        .catch((err) => {
          alert("Error: " + err);
        });
    }
  }

  const getComment = useCallback(async () => {
    try {
      const url = localStorage.getItem("url") + "users.php";
      const jsonData = { compId: compId };
      const formData = new FormData();
      formData.append("operation", "getComment");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios({ url: url, data: formData, method: "post" });
      console.log("comment axios: " + JSON.stringify(res.data));
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
        getAssignedPersonnel(res.data.job_id);
        setDetails(res.data);
        setIsLoading(false);
      }
    } catch (err) {
      alert("There was an unexpected error: " + err);
    }
  }, [compId])

  const getAssignedPersonnel = async (jobId) =>{
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const jsonData = {jobId: jobId};
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "getAssignedPersonnel");
      const res = await axios({url: url, data: formData, method: "post"});
      console.log("res ni personnel: " + JSON.stringify(res.data));
      if(res.data !== 0){
        setAssignedPersonnel(res.data);
      }  
    } catch (error) {
      alert("There was an error occured: " + error.message);
    }
  }
  
  useEffect(() => {
    setIsPersonnel(localStorage.getItem("userLevel") === "90" ? true : false);
    getJobDetails();
    getComment(); 
    const interval = setInterval(() => {getComment()}, 5000);
    return () => clearInterval(interval);
  }, [compId, getComment, getJobDetails, isPersonnel]);

  return (
    <>
      {isLoading ?
        <Container className='mt-3 text-center'>
          <Spinner animation='border' variant='success' />
        </Container>
        :
        <div className='mt-3'>
          <Card border='secondary'>
            <Card.Body>
              <Button variant='outline-danger button-m' onClick={() => handleBackButtonClick()}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </Button>
              <h3 className='text-center mt-3'>Job details</h3>
              <Form>
                <Row className='mt-3'>
                  <Col>
                    <FloatingLabel controlId="subject" label="Subject">
                      <Form.Control type="text" value={details.comp_subject} readOnly />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col>
                    <FloatingLabel controlId="status" label="Status">
                      <Form.Control type="text" value={details.joStatus_name} readOnly />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col>
                    <FloatingLabel controlId="location" label="Location">
                      <Form.Control type="text" value={details.location_name} readOnly />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col>
                    <FloatingLabel controlId="priority" label="Priority">
                      <Form.Control type="text" value={details.priority_name} readOnly />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col>
                    <FloatingLabel controlId="Submitted By" label="Submitted By">
                      <Form.Control type="text" value={details.fac_name} readOnly />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col>
                    <FloatingLabel controlId="user" label="Job Created By">
                      <Form.Control type="text" value={details.user_full_name} readOnly />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col>
                    <FloatingLabel controlId="createDate" label="Date Created">
                      <Form.Control type="text" value={formatDate(details.job_createDate)} readOnly />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col>
                    <FloatingLabel controlId="description" label="Description">
                      <Form.Control as="textarea" style={{ height: '200px' }} value={details.job_description} readOnly />
                    </FloatingLabel>
                  </Col>
                </Row>
              </Form>

            <Row className='mt-3'>
              <Col xs={12} md={6}>
                <ListGroup>
                  <ListGroup.Item className='green-header'>Assigned Personnel</ListGroup.Item>
                  {assignedPersonnel.map((person, index) => (
                    <ListGroup.Item key={index}>{`${index + 1}. ${person.user_full_name}`}</ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            </Row>

            </Card.Body>
            {
                isPersonnel && parseInt(details.joStatus_id, 10) === 2 ? (
                <Card.Footer className='text-center'>
                  <Button className='mt-2' variant='outline-success' onClick={openConfirmModal}>
                    Mark as done
                  </Button>
                </Card.Footer>
              ) : (
                <></>
              )
            }
          </Card>
          <Card className='mt-3' border='secondary'>
            <Card.Body>
              <Form className='mb-5'>
                <FloatingLabel label="Add a comment..">
                  <Form.Control as="textarea" style={{ height: '75px' }} value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder='Add a comment..' required/>
                </FloatingLabel>
                <div className='mt-3'>
                  <Button variant='outline-primary' onClick={addComment}>Submit</Button>
                </div>
              </Form>
              {comment.length <= 0 ? 
                <Container className='text-secondary text-center'>
                  <p>There is no comment yet..</p>
                </Container>
              :
              <div>
                {comment.map((comments, index) => (
                  <Row key={index}>
                    <Col xs={12} md={4}>
                      <MessageList userId={comments.user_id} username={comments.full_name} message={comments.comment_commentText} date={formatDate(comments.comment_date)} />
                    </Col>
                  </Row>
                ))}
              </div>
              }
            </Card.Body>
          </Card>
        </div>
      }
      <ConfirmModal show={showConfirmModal} hide={closeConfirmModal} compId={details.comp_id}/>
    </>
  )
}
