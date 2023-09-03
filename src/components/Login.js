import React, { useState } from 'react'
import { Card, Form, FloatingLabel, Container, Button} from 'react-bootstrap'
import "./css/site.css";
import axios from 'axios';

export default function Login() {
	if(localStorage.getItem("url") === null) {
		localStorage.setItem("url", "http://localhost/contact/");
	}
	const [userId, setUserId] = useState("");
	const [password, setPassword] = useState("");

	const login = () =>{
		const url = localStorage.getItem("url") + "users.php";
		const jsonData = {
			//username for now
			username: userId,
			password: password,
		}
		const formData = new FormData();
		formData.append("json", JSON.stringify(jsonData));
		formData.append("operation", "login");
		axios({
			url: url,
			data: formData,
			method: "post",
		})
		.then((res)=>{
			console.log("Res: " + res.data);
			if(res.data !== 0){
				//login 
				console.log("nag login na siya");
			}else{
				alert("Invalid id or password");
			}
		})
		.catch((err)=>{
			alert("There was an unexpected error: " + err);
		})
	}

	return (
		<>
			<Container fluid="md" className='centered'>
				<Card className="card-thin" border='success'>
					<Card.Header><h2>Login</h2></Card.Header>
					<Card.Body>
						<Form>
							<Form.Group className='mt-3 mb-3 fatter-text centered-label'>
								<FloatingLabel label="Id">
									<Form.Control type='text' value={userId} onChange={(e) => setUserId(e.target.value)} placeholder='Id' autoFocus required/>
								</FloatingLabel>
							</Form.Group>
							<Form.Group className='mb-4 fatter-text centered-label'>
								<FloatingLabel label="Password">
									<Form.Control type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' required/>
								</FloatingLabel>
							</Form.Group>

							<Container className='text-center'>
								<Button className='button-large btn-lg' variant='outline-success' onClick={login}>Login</Button>
							</Container>
						</Form>
					</Card.Body>
				</Card>
			</Container>
		</>
	)
}
