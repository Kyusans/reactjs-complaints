import axios from 'axios';
import React, { useState } from 'react';
import { Card, Form , FloatingLabel, Container, Button, Row, Col} from 'react-bootstrap';

function Location() {
  const [location, setLocation] = useState("");

  const submitLocation = () =>{
    const url = localStorage.getItem("url") + "users.php";
		const jsonData = {
			userId: sessionStorage.getItem("userId"),
			location: location
		}
		const formData = new FormData();
		formData.append("json", JSON.stringify(jsonData));
		formData.append("operation", "addLocation");
		axios({
			url: url,
			data: formData,
			method: "post",
		})
		.then((res)=>{
			console.log("Res: " + res.data);
			if(res.data !== 0){
        alert("Success!");
			}else{
				alert("Invalid id or password");
			}
		})
		.catch((err)=>{
			alert("There was an unexpected error: " + err);
		})
  }
  return (
    <div>
      <Row>
        <Col>
          <Container fluid="md" className='text-center'>
            <Card border='success'>
              <Card.Header><h3>Location Category</h3></Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group>
                    <FloatingLabel label="Location Category">
                      <Form.Control type='text' value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Location Category' />
                    </FloatingLabel>
                  </Form.Group>
                </Form>
                <Container className='mt-3'>
                  <Button variant='outline-success' onClick={submitLocation}>Submit</Button>
                </Container>
              </Card.Body>
            </Card>
          </Container>
        </Col>
        <Col>
          <Container fluid="md" className='text-center'>
            <Card border='success'>
            <Card.Header><h3>Location</h3></Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group>
                    <FloatingLabel label="Category">
                      <Form.Control type='text' value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Category'/>
                    </FloatingLabel>
                  </Form.Group>
                </Form>
                <Container className='mt-3'>
                  <Button variant='outline-success' onClick={submitLocation}>Submit</Button>
                </Container>
              </Card.Body>
            </Card>
          </Container>
        </Col>
      </Row>
    </div>
  )
}

export default Location
