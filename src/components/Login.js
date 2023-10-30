import React, { useEffect, useState } from 'react';
import { Card, Form, FloatingLabel, Container, Button, Image} from 'react-bootstrap';
import "./css/site.css";
import cocLogo from "./images/coclogo.jpg";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AlertScript from './AlertScript';
import { requestPermission } from '../FirebaseConfig';
// import NotificationComponent from './NotificationComponent';


export default function Login() {
	if(localStorage.getItem("url") !== "http://192.168.1.7/gsd/api/") {
		localStorage.setItem("url", "http://192.168.1.7/gsd/api/");
		// localStorage.setItem("url", "http://www.shareatext.com/gsd/api/");
	}

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
		const permission = Notification.permission;
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
				if(res.data.user_level === 100){
					localStorage.setItem("userId", res.data.user_id);
					localStorage.setItem("adminLoggedIn", "true");
					if(permission !== "granted"){
						requestPermission();
					}
					setTimeout(() => {navigateTo("/admin/dashboard");}, 1500);
				}else if(res.data.user_level === 90){
					localStorage.setItem("userId", res.data.user_id);
					localStorage.setItem("userLevel", res.data.user_level);
					if(permission !== "granted"){
						requestPermission();
					}
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

	// function sendSubscriptionToServer(subscription) {
	// 	const url = localStorage.getItem("url") + 'users.php'; 
	// 	const jsonData = {subscription: subscription}
	// 	const formData = new FormData();
	// 	formData.append("json", JSON.stringify(jsonData));
	// 	formData.append("operation", "sendNotification");
	// 	axios({url: url, data: formData, formData: jsonData})
	// 	.then((res)=>{
	// 		console.log("res ni send subscription: " + res);
	// 	})
	// 	.catch((err)=>{
	// 		alert("There was an error sending the notification: " + err);
	// 	})
	// }

	// const requestPermission = useCallback(() =>{
	// 	Notification.requestPermission().then((permission) => {
	// 		setPermission(permission);
	// 		if (permission === 'granted') {
	// 			getMessaging
	// 				.getToken({
	// 					vapidKey: 'BEqUmBJbzkKg3aeldL4K98XmxX6SF2qMhsJ93W2ZRFMYU6l6oRMykHAXlVondJ9N40bV5be34lwcPDj0do91d20',
	// 				})
	// 				.then((currentToken) => {
	// 					if (currentToken) {
	// 						// Send this token to your server and associate it with the user.
	// 						sendSubscriptionToServer(currentToken);
	// 					} else {
	// 						console.log('No registration token available.');
	// 					}
	// 				})
	// 				.catch((err) => {
	// 					console.log('An error occurred while retrieving token:', err);
	// 				});
	// 		}
	// 	});
	// }, [])

	useEffect(() => {
		if(localStorage.getItem("adminLoggedIn") === "true"){
			navigateTo("/admin/dashboard");
		}else if(localStorage.getItem("userLevel") === "90"){
			navigateTo("/personnel/dashboard")
		}else if(localStorage.getItem("userLevel") === "80"){
			navigateTo("/user/dashboard")
		}
	}, [navigateTo])
	return (
		<>
			<Container className='centered'>
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
