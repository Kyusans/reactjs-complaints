import React, { useCallback, useState, useEffect } from "react";
import { Button, Card, Col, Container, FloatingLabel, Form, Row, Spinner, Table } from "react-bootstrap";
import generatePDF, { usePDF } from "react-to-pdf";
import * as XLSX from 'xlsx';
import axios from "axios";
import AlertScript from "./AlertScript";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf, faFilter } from "@fortawesome/free-solid-svg-icons";

function ReportModule() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allData, setAllData] = useState([]);
  const [location, setLocation] = useState([]);
  const [operationData, setOperationData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedOperation, setSelectedOperation] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const { targetRef } = usePDF({ filename: 'gsdReport.pdf' });
  const [selectedEquipment, setSelectedEquipment] = useState("");

  const getAlert = (variantAlert, messageAlert) => {
    setShowAlert(true);
    setAlertVariant(variantAlert);
    setAlertMessage(messageAlert);
  };

  const getReport = useCallback(async () => {
    setTickets([]);
    setShowAlert(false);
    try {
      const url = localStorage.getItem("url") + "admin.php";
      // const jsonData = { startDate: startDate, endDate: endDate }
      //console.log("JSON data: ", JSON.stringify(jsonData))
      const formData = new FormData();
      // formData.append("json", JSON.stringify(jsonData))
      formData.append("operation", "getReport");
      const res = await axios({ url: url, data: formData, method: "post" });
      console.log("Res ni getReport: " + JSON.stringify(res.data));
      if (res.data !== 0) {
        setAllData(res.data);
      } else {
        getAlert("danger", "No tickets found");
      }
      setIsLoading(false);
    } catch (err) {
      getAlert("danger", "There was an unexpected error: " + err);
    }
  }, []);

  const getLocation = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const formData = new FormData();
      formData.append("operation", "getAllLocation");

      const response = await axios({ url: url, data: formData, method: "post" });

      if (response.data !== 0) {
        setLocation(response.data);
      }
    } catch (error) {
      getAlert("danger", "There was an unexpected error: " + error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getOperation = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const formData = new FormData();
      formData.append("operation", "getOperation");

      const res = await axios.post(url, formData);

      if (res.data !== 0) {
        setOperationData(res.data);
      } else {
        getAlert("danger", "No operation found");
        console.log("There was an unexpected error: " + res.data);
      }
    } catch (error) {
      getAlert("danger", "There was an error occurred: " + error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
  };

  const handleGeneratePDF = () => {
    generatePDF(targetRef, pdfOption);
  };

  const filterData = () => {
    const filteredTickets = allData.filter((ticket) => {
      const isLocationMatch = selectedLocation === "" || ticket.Location === selectedLocation;
      const isOperationMatch = selectedOperation === "" || ticket.Operation === selectedOperation;
      const isEquipmentMatch = selectedEquipment === "" || ticket.Equipment.includes(selectedEquipment);
      
      const ticketDate = new Date(ticket.Date);
      const isStartDateMatch = startDate === "" || ticketDate >= new Date(startDate);
      const isEndDateMatch = endDate === "" || ticketDate <= new Date(endDate);
  
      return isLocationMatch && isOperationMatch && isEquipmentMatch && isStartDateMatch && isEndDateMatch;
    });
  
    setTickets(filteredTickets);
  };

  useEffect(() => {
    getReport();
    getLocation();
    getOperation();
  }, [getLocation, getOperation, getReport]);

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
                  </Row>
                  <Row className='d-flex align-items-start'>
                    <Col xs={12} md={4} className='mb-2'>
                      <FloatingLabel controlId="locationFilter" label="Location">
                        <Form.Select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                          <option value="">All Locations</option>
                          {location.map((loc, index) => (
                            <option key={index} value={loc.location_name}>
                              {loc.location_name}
                            </option>
                          ))}
                        </Form.Select>
                      </FloatingLabel>
                    </Col>
                    <Col xs={12} md={4} className='mb-2'>
                      <FloatingLabel controlId="operationFilter" label="Operation">
                        <Form.Select value={selectedOperation} onChange={(e) => setSelectedOperation(e.target.value)}>
                          <option value="">All Operations</option>
                          {operationData.map((operation, index) => (
                            <option key={index} value={operation.operation_name}>
                              {operation.operation_name}
                            </option>
                          ))}
                        </Form.Select>
                      </FloatingLabel>
                    </Col>

                    <Col xs={12} md={4} className='d-flex align-items-end'>
                      <Button variant="outline-primary" onClick={filterData} className='button-m button-large'>
                        <FontAwesomeIcon icon={faFilter} /> Filter
                      </Button>
                    </Col>

                    <Col xs={12} md={4} className='mb-2'>
                      <FloatingLabel controlId="equipmentFilter" label="Equipment">
                        <Form.Select
                          value={selectedEquipment}
                          onChange={(e) => setSelectedEquipment(e.target.value)}
                        >
                          <option value="">All Equipment</option>
                          {allData
                            .map((ticket) => ticket.Equipment.split(","))
                            .flat()
                            .filter((equipment, index, self) => equipment && self.indexOf(equipment) === index)
                            .map((equipment, index) => (
                              <option key={index} value={equipment}>
                                {equipment.trim()}
                              </option>
                            ))}
                        </Form.Select>
                      </FloatingLabel>
                    </Col>
                  </Row>
                </Form>
              </Container>

              <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />

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
                      <th>Operation</th>
                      <th>Equipment</th>
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
                          <td>{ticket.Operation}</td>
                          <td>{ticket.Equipment}</td>
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
