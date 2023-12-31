import { Button, Container, Spinner } from "react-bootstrap";
import PersonnelJobCalendarView from "./PersonnelJobCalendarView";
import PersonnelJobCardView from "./PersonnelJobCardView";
import "./css/site.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faSync, faTh } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function PersonnelDashboard() {
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [allTicket, setAllTicket] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigateTo = useNavigate();

  const getJobTicket = async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "personnel.php";
      const userId = localStorage.getItem("userId");
      const jsonData = { userId: userId }
      const formData = new FormData();
      formData.append("operation", "getJobTicket");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios({ url: url, data: formData, method: "post" });
      if (res.data !== 0) {
        setAllTicket(res.data);
      }
    } catch (error) {
      alert("There was an unexpected error: " + error);
    } finally {
      setIsLoading(false);
    }
  }

  const refreshData = async () => {
    await getJobTicket();
  }

  useEffect(() => {
    if (localStorage.getItem("personnelLoggedIn") !== "true") {
      navigateTo(-1)
    } else {
      getJobTicket();
    }

  }, [navigateTo])


  return (
    <>
      <Container className="p-2" fluid>
        <Container>
          <Button variant="info" onClick={() => setIsCalendarView(false)} className="me-1 ms-2">
            <FontAwesomeIcon icon={faTh} />
          </Button>
          <Button variant="light" onClick={() => setIsCalendarView(true)}>
            <FontAwesomeIcon icon={faCalendar} />
          </Button>
          <Button onClick={getJobTicket} className='ms-1'>
            <FontAwesomeIcon icon={faSync} /> Refresh
          </Button>
        </Container>
        {isLoading ?
          <Container className="text-center mt-3">
            <Spinner variant="success" />
          </Container> :
          isCalendarView ?
            <PersonnelJobCalendarView allData={allTicket} refreshData={refreshData} /> :
            <PersonnelJobCardView allData={allTicket} refreshData={refreshData} />
        }
      </Container>
    </>
  )
}
