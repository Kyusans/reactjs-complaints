import axios from 'axios';
import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import AlertScript from './AlertScript';

export default function ConfirmModal(props) {
  const {show, hide, compId} = props;
  const [isJobComplete, setIsJobComplete] = useState(false);

  	//for alert
	const [showAlert, setShowAlert] = useState(false);
	const [alertVariant, setAlertVariant] = useState("");
	const [alertMessage, setAlertMessage] = useState("");


	function getAlert(variantAlert, messageAlert){
		setShowAlert(true);
		setAlertVariant(variantAlert);
		setAlertMessage(messageAlert);
	}

  const jobDone = () =>{
    const url = localStorage.getItem("url") + "personnel.php";
    const jsonData = {compId: compId};
    const formData = new FormData();
    formData.append("operation", "jobDone");
    formData.append("json", JSON.stringify(jsonData));
    axios({url: url, data: formData, method: "post"})
    .then((res) =>{
      if(res.data === 1){
        getAlert("success","Job Complete!");
        setIsJobComplete(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    })
    .catch((err) =>{
      alert("There was an unexpected error: " + err);
    })
  }

  const handleHide = () =>{
    setIsJobComplete(false);
    hide();
  }

  return (
    <>
      <Modal show={show} onHide={handleHide} centered>
        <Modal.Header><h4>Confirmation</h4></Modal.Header>
        <Modal.Body>
          {!isJobComplete ? 
            "Are you sure you want to mark this job as completed?"
          :
            <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant='outline-danger' onClick={handleHide}>Close</Button>
          <Button variant='outline-success' onClick={jobDone}>Mark as done</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
