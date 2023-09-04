import axios from 'axios';
import React, { useState } from 'react'
import { Card, Form , FloatingLabel, Container, Button} from 'react-bootstrap'

export default function AdminDashboard() {
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
      <Container fluid="md" className='text-center'>
        <Card>
          <Card.Body>
            <Form>
              <Form.Group>
                <FloatingLabel label="Location">
                  <Form.Control type='text' value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Location' />
                </FloatingLabel>
              </Form.Group>
            </Form>
            <Container className='mt-3'>
              <Button variant='outline-success' onClick={submitLocation}>Submit</Button>
            </Container>
          </Card.Body>
        </Card>
      </Container>


    </div>
  )
}
