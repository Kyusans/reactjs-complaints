import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Container, Form, Spinner, Row, Col, FloatingLabel } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export default function JobDetails() {
  const { compId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState({});

  useEffect(() => {
    const getJobDetails = async () => {
      console.log("compId: " + compId)
      setIsLoading(true);
      try {
        const url = localStorage.getItem("url") + "admin.php";
        const jsonData = { compId: compId };
        const formData = new FormData();
        formData.append("json", JSON.stringify(jsonData));
        formData.append("operation", "getJobDetails");
        const res = await axios({ url: url, data: formData, method: "post" });
        if (res.data !== 0) {
          setDetails(res.data);
          setIsLoading(false);
        }
      } catch (err) {
        alert("There was an unexpected error: " + err);
      }
    };

    getJobDetails();
  }, [compId]);

  return (
    <>
      {isLoading ?
        <Container className='mt-3 text-center'>
          <Spinner animation='border' variant='success' />
        </Container>
        :
        <Container className='mt-3'>
          <Card>
            <Card.Header className='text-center'><h3>Job Details</h3></Card.Header>
            <Card.Body>
              <Form>
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
                    <FloatingLabel controlId="locationCategory" label="Location Category">
                      <Form.Control type="text" value={details.locCateg_name} readOnly />
                    </FloatingLabel>
                  </Col>
                  <Col>
                    <FloatingLabel controlId="createDate" label="Create Date">
                      <Form.Control type="text" value={details.job_createDate} readOnly />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col>
                    <FloatingLabel controlId="priority" label="Priority">
                      <Form.Control type="text" value={details.priority_name} readOnly />
                    </FloatingLabel>
                  </Col>
                  <Col>
                    <FloatingLabel controlId="facility" label="Facility">
                      <Form.Control type="text" value={details.fac_name} readOnly />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col>
                    <FloatingLabel controlId="user" label="User">
                      <Form.Control type="text" value={details.user_full_name} readOnly />
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
            </Card.Body>
          </Card>
        </Container>
      }
    </>
  )
}
