import React, { useState } from 'react'
import { Card, Form, FloatingLabel, Container, Button} from 'react-bootstrap'
import "./css/site.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
	sessionStorage.setItem("url", "http://localhost/complaint/php-complaints-backend/");
	if(sessionStorage.getItem("url") === null) {
		sessionStorage.setItem("url", "http://localhost/complaint/php-complaints-backend/");
		// sessionStorage.setItem("url", "http://www.shareatext.com/gsd/api/");
	}
	const [userId, setUserId] = useState("");
	const [password, setPassword] = useState("");
	const navigateTo = useNavigate();

	const login = () =>{
		const url = sessionStorage.getItem("url") + "users.php";
		const jsonData = {
			userId: userId,
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
			console.log("Res: " + JSON.stringify(res.data));
			if(res.data !== 0){
				sessionStorage.setItem("userId", res.data.user_id);
				navigateTo("admin/dashboard");
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
