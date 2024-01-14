import axios from 'axios';
import React, { useState } from 'react';
import { Button, Container, FloatingLabel, Form, Modal, Spinner } from 'react-bootstrap';
import AlertScript from './AlertScript';

export default function ConfirmModal(props) {
  const { show, hide, compId } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState("");
  const [remarks, setRemarks] = useState("");
  const [item, setItem] = useState("");
  const [validated, setValidated] = useState(false);
  const operationData = [
    { "operation_name": "Replaced" },
    { "operation_name": "Repaired" },
    { "operation_name": "Destroyed" },
  ];

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
      const jsonData = { compId: compId, fullName: fullName, item: item, jobOperation: selectedOperation, remarks: remarks };
      const formData = new FormData();
      formData.append("operation", "jobDone");
      formData.append("json", JSON.stringify(jsonData));

      const response = await axios.post(url, formData);

      // console.log("response", JSON.stringify(response));

      if (response.data === 1) {
        getAlert("success", "Job Complete!");
        setTimeout(() => {
          handleHide();
        }, 1000);
      } else {
        getAlert("danger", "Unsuccessful!");

      }
    } catch (err) {
      getAlert("danger", "There was an unexpected error: " + err);
    } finally {
      setIsLoading(false);

    }
  };

  const handleJobDone = (e) => {
    const form = e.currentTarget;

    e.preventDefault();
    e.stopPropagation();
    if (form.checkValidity()) {
      jobDone();
    }
    setValidated(true);
  }

  const handleHide = () => {
    setShowAlert(false);
    setIsLoading(false);
    setRemarks("");
    setSelectedOperation("");
    setItem("");
    setValidated(false);
    hide();
  };

  return (
    <>
      <Modal show={show} className='bg-dark' onHide={handleHide} centered backdrop="static">
        <Form noValidate validated={validated} onSubmit={handleJobDone}>
          <Modal.Header>
            <h4>Confirmation</h4>
          </Modal.Header>
          <Modal.Body>
            <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
            <Container>
              <FloatingLabel label="Operation">
                <Form.Select className='mb-3' value={selectedOperation} onChange={(e) => setSelectedOperation(e.target.value)} placeholder='Operation' required>
                  <option value={""}>Select operation</option>
                  {operationData.map((operation, index) => (
                    <option key={index} value={operation.operation_name}>{operation.operation_name}</option>
                  ))}
                </Form.Select>
              </FloatingLabel>

              <FloatingLabel label='Item'>
                <Form.Control placeholder='Item' value={item} onChange={(e) => setItem(e.target.value)} required />
              </FloatingLabel>
              <Form.Text className="text-muted ms-2">
                For multiple items, use commas (e.g., 'chair, table').
              </Form.Text>

              <FloatingLabel className='mt-3' label="Remarks">
                <Form.Control placeholder='Remarks' value={remarks} onChange={(e) => setRemarks(e.target.value)} required />
              </FloatingLabel>
            </Container>

          </Modal.Body>
          <Modal.Footer>
            <Button variant='outline-danger' onClick={handleHide}>Close</Button>

            <Button type='submit' variant='outline-success' disabled={isLoading}>
              {isLoading &&
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />}
              Mark as done
            </Button>
          </Modal.Footer>

        </Form>
      </Modal>
    </>
  );
}
