import React, { useEffect, useState } from 'react';
import { Card, Form, FloatingLabel, Container, Button, Image} from 'react-bootstrap';
import "./css/site.css";
import cocLogo from "./images/coclogo.jpg";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AlertScript from './AlertScript';


export default function Login() {
	if(localStorage.getItem("url") !== "http://192.168.1.5/gsd/api/") {
		localStorage.setItem("url", "http://192.168.1.5/gsd/api/");
		// localStorage.setItem("url", "http://www.shareatext.com/gsd/api/");
	}
	
  const [permission, setPermission] = useState(Notification.permission);
	const [userId, setUserId] = useState("");
	const [password, setPassword] = useState("");
	const navigateTo = useNavigate();

	//for alert
	const [showAlert, setShowAlert] = useState(false);
	const [alertVariant, setAlertVariant] = useState("");
	const [alertMessage, setAlertMessage] = useState("");


	function getAlert(variantAlert, messageAlert){
		setShowAlert(true);
		setAlertVariant(variantAlert);
		setAlertMessage(messageAlert);
	}

	const login = () =>{
		const url = localStorage.getItem("url") + "users.php";
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
			if(res.data !== 0){
				localStorage.setItem("isLoggedIn", "1");
				getAlert("success", "Success!");
				console.log("ressss : " + res.data.user_level);
				if(res.data.user_level === 100){
					localStorage.setItem("adminLoggedIn", "true");
					setTimeout(() => {navigateTo("/admin/dashboard");}, 1500);
					localStorage.setItem("userId", res.data.user_id);
				}else if(res.data.user_level === 90){
					localStorage.setItem("userId", res.data.user_id);
					localStorage.setItem("userLevel", res.data.user_level);
					setTimeout(() => {navigateTo("/personnel/dashboard")}, 1500);
				}else{
					setTimeout(() => {
						localStorage.setItem("userId", res.data.fac_id);
						localStorage.setItem("userLevel", "80"); 	
						navigateTo("/user/dashboard")
					}, 1500);
				}
			}else{
				getAlert("danger" ,"Invalid id or password");
			}
		})
		.catch((err)=>{
			alert("There was an unexpected error: " + err);
		})
	}
	const handleRequestPermission = () => {
    Notification.requestPermission().then(permission => setPermission(permission));
  };

	useEffect(() => {
		alert("Permission: " + permission);
		if(permission !== "granted"){
			handleRequestPermission();
		}
		if(localStorage.getItem("adminLoggedIn") === "true"){
			navigateTo("/admin/dashboard");
		}else if(localStorage.getItem("userLevel") === "90"){
			navigateTo("/personnel/dashboard")
		}else if(localStorage.getItem("userLevel") === "80"){
			navigateTo("/user/dashboard")
		}
	}, [navigateTo, permission])
	return (
		<>
			<Container fluid="md" className='centered'>
				<Card className="card-thin" border='success'>
					<Card.Body>
						<Container className='text-center'>	
							<Image src={cocLogo} className='small-image' rounded />
						</Container>
						<AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
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
