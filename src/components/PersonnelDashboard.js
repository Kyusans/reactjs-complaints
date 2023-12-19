import { Button, Container } from "react-bootstrap";
import PersonnelJobCalendarView from "./PersonnelJobCalendarView";
import PersonnelJobCardView from "./PersonnelJobCardView";
import "./css/site.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faTh } from "@fortawesome/free-solid-svg-icons";


export default function PersonnelDashboard() {
  const [isCalendarView, setIsCalendarView] = useState(false);

  return (
    <>
      <Container className="p-2" fluid>
        <Container>
          <Button variant="info" onClick={() => setIsCalendarView(false)} className="me-1 ms-2"><FontAwesomeIcon icon={faTh} /> </Button>
          <Button variant="light" onClick={() => setIsCalendarView(true)}><FontAwesomeIcon icon={faCalendar}/> </Button>
        </Container>
        {isCalendarView ? <PersonnelJobCalendarView/> : <PersonnelJobCardView /> }
      </Container>
    </>
  )
}
 