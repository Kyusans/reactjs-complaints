import axios from 'axios';
import React, { useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import AlertScript from './AlertScript';

export default function ConfirmModal(props) {
  const { show, hide, compId } = props;
  const [isJobComplete, setIsJobComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // for alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  function getAlert(variantAlert, messageAlert) {
    setShowAlert(true);
    setAlertVariant(variantAlert);
    setAlertMessage(messageAlert);
  }

  const jobDone = async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "personnel.php";
      const fullName = localStorage.getItem("userFullName");
      const jsonData = { compId: compId, fullName: fullName };
      const formData = new FormData();
      formData.append("operation", "jobDone");
      formData.append("json", JSON.stringify(jsonData));

      const response = await axios.post(url, formData);

      if (response.data === 1) {
        getAlert("success", "Job Complete!");
        setIsJobComplete(true);
        setTimeout(() => {
          handleHide();
        }, 1500);
      }
    } catch (err) {
      getAlert("danger", "There was an unexpected error: " + err);
    } finally {
      setIsLoading(false);
    }
  };


  const handleHide = () => {
    setIsJobComplete(false);
    hide();
  };

  return (
    <>
      <Modal show={show} className='bg-dark' onHide={handleHide} centered backdrop="static">
        <Modal.Header>
          <h4>Confirmation</h4>
        </Modal.Header>
        <Modal.Body>
          {!isJobComplete ? (
            "Are you sure you want to mark this job as completed?"
          ) : (
            <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='outline-danger' onClick={handleHide}>Close</Button>
          {!isJobComplete && (
            <Button variant='outline-success' onClick={jobDone} disabled={isLoading}>
              {isLoading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                "Mark as done"
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
