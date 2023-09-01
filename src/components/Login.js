import React, { useState } from 'react'
import { Card, Form, FloatingLabel, Container, Button} from 'react-bootstrap'
import "./css/site.css";

export default function Login() {
	const [userId, setUserId] = useState("");
	const [password, setPassword] = useState("");

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
									<Form.Control type='text' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' required/>
								</FloatingLabel>
							</Form.Group>

							<Container className='text-center'>
								<Button className='button-large btn-lg' variant='outline-success'>Login</Button>
							</Container>
						</Form>
					</Card.Body>
				</Card>
			</Container>
		</>
	)
}
