import React, { useState } from "react";
import { Button, Card, Col, Container, FloatingLabel, Form, Row, Spinner, Table } from "react-bootstrap";
import generatePDF, { usePDF } from "react-to-pdf";
import * as XLSX from 'xlsx';
import axios from "axios";
import AlertScript from "./AlertScript";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf, faFilter } from "@fortawesome/free-solid-svg-icons";

export function formatDates(inputDate) {
  const date = new Date(inputDate);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

function ReportModule() {
  const [tickets, setTickets] = useState([]); const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  //for alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  function getAlert(variantAlert, messageAlert) {
    setShowAlert(true);
    setAlertVariant(variantAlert);
    setAlertMessage(messageAlert);
  }

  // month only


  const getTicketsByDate = async () => {
    setTickets([]);
    setShowAlert(false);
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const jsonData = { startDate: startDate, endDate: endDate }
      console.log("JSON data: ", JSON.stringify(jsonData))
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData))
      formData.append("operation", "getTicketsByDate");
      const res = await axios({ url: url, data: formData, method: "post" });
      console.log("Res ni getTicketsByDate: " + JSON.stringify(res.data));
      if (res.data !== 0) {
        setTickets(res.data);
      } else {
        getAlert("danger", "No tickets found");
      }
      setIsLoading(false);
    } catch (err) {
      getAlert("danger", "There was an unexpected error: " + err);
    }
  };

  const { targetRef } = usePDF({ filename: 'gsdReport.pdf' });
  const exportToExcel = () => {
    try {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(tickets);
      XLSX.utils.book_append_sheet(wb, ws, "Tickets");
      XLSX.writeFile(wb, "tickets.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };
  const pdfOption = {
    method: 'open'
  }

  const handleGeneratePDF = () => {
    generatePDF(targetRef, pdfOption);
  };
  return (
    <>
      {isLoading ?
        <Container className='text-center'>
          <Spinner animation='border' variant='success' />
        </Container>
        :
        <>
          <Card>
            <Card.Header>
              <Button variant="outline-primary" onClick={() => handleGeneratePDF()}>
                <FontAwesomeIcon icon={faFilePdf} /> Get PDF
              </Button>
              <Button variant="outline-success" onClick={exportToExcel} className="ms-1">
                <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
              </Button>
            </Card.Header>
            <Card.Body>

              <Container className="mt-3 mb-2">
                <Form>
                  <Row className='d-flex align-items-start'>
                    <Col xs={12} md={4} className='mb-2'>
                      <FloatingLabel controlId="startDateLabel" label="Start Date">
                        <Form.Control type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                      </FloatingLabel>
                    </Col>
                    <Col xs={12} md={4} className='mb-2'>
                      <FloatingLabel controlId="endDateLabel" label="End Date">
                        <Form.Control type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                      </FloatingLabel>
                    </Col>
                    <Col xs={12} md={4} className='d-flex align-items-end'>
                      <Button variant="outline-primary" onClick={getTicketsByDate} className='button-m button-large'>
                        <FontAwesomeIcon icon={faFilter} /> Filter
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Container>

              <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
              <div />

              <Container fluid ref={targetRef} className="mt-3 scrollable-container">
                <Container className="text-center mt-3">
                  <h3>CAGAYAN DE ORO COLLEGE</h3>
                  <h5>PHINMA EDUCATION NETWORK</h5>
                  <h6>GSD SUPPORT TICKET SYSTEM</h6>
                </Container>
                <Table bordered hover variant="light" className="border-1 mx-auto mt-3">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Location</th>
                      <th>Personnels</th>
                      <th>Submitted by</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(tickets) ? (
                      tickets.map((ticket, index) => (
                        <tr key={index}>
                          <td>{ticket.Subject}</td>
                          <td>{ticket.Location}</td>
                          <td>{ticket.Personnel}</td>
                          <td>{ticket.Submitted_By}</td>
                          <td>{ticket.Status}</td>
                          <td>{formatDates(ticket.Date)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">No tickets to display.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Container>

            </Card.Body>
          </Card>
        </>
      }
    </>
  );
}

export default ReportModule;
