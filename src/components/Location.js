import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Form , FloatingLabel, Container, Button, Row, Col} from 'react-bootstrap';

function Location() {
  const [location, setLocation] = useState("");
  const [locationCategory, setLocationCategory] = useState([]);
	sessionStorage.setItem("url", "http://localhost/complaint/php-complaints-backend/");
  useEffect(() => {
    getLocationCategory();
  },[])

  const submitLocation = () =>{
    const url = localStorage.getItem("url") + "users.php";
		const jsonData = {
			location: location
		}
		const formData = new FormData();
		formData.append("json", JSON.stringify(jsonData));
		formData.append("operation", "getLocationCategory");
		axios({
			url: url,
			data: formData,
			method: "post",
		})
		.then((res)=>{
			if(res.data !== 0){
        alert("Success!");
			}
		})
		.catch((err)=>{
			alert("There was an unexpected error: " + err);
		})
  }

  const getLocationCategory = () => {
    const url = sessionStorage.getItem("url") + "users.php";
    const formData = new FormData();
    formData.append("operation", "getLocationCategory");
    axios({url: url, data: formData, method: "post"})
    .then((res)=>{
      if(res.data !== 0){
        setLocationCategory(res.data);
      }
    })
    .catch((err)=>{
      alert("There was an unexpected error: " + err);
    })
  }
  return (
    <div>
      <Row>
        <Col className='mb-4'>
          <Container fluid="md" className='text-center'>
            <Card border='dark'>
              <Card.Header className='green-header'><h3>Location Category</h3></Card.Header>
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
            <Card border='dark'>
            <Card.Header className='green-header'><h3>Location</h3></Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className='mb-3'>
                    <Form.Select>
                      <option>Open this selection</option>
                      {locationCategory.map((items,index) => 
                      <option key={index}>{items.locCateg_name}</option>
                      )}
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group>
                    <FloatingLabel label="Location">
                      <Form.Control type='text' value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Location'/>
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
