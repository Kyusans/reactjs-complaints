import AdminComplaintTable from "./AdminComplaintTable";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminCalendarView from "./AdminCalendarView";
import { Button, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faTh } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";


export default function AdminDashboard() {
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [allTickets, setAllTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigateTo = useNavigate();

  const fetchData = useCallback((data) => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      navigateTo(-1);
    } else {
      setIsLoading(true);
      try {
        setAllTickets(data);
      } catch (error) {
        alert("There was an unexpected error: " + error);
      } finally {
        setIsLoading(false);
      }
    }
  },[navigateTo]);

  useEffect(() => {
    getAllTickets(fetchData);
  }, [fetchData])
  return (
    <>
      {localStorage.getItem("adminLoggedIn") === "true" ? (
        <div className="p-2" >
          <div className="p-2">
            <Button variant="info" onClick={() => setIsCalendarView(false)} className="me-1 ms-2"><FontAwesomeIcon icon={faTh} /> </Button>
            <Button variant="light" onClick={() => setIsCalendarView(true)}><FontAwesomeIcon icon={faCalendar} /> </Button>
          </div>
          {isLoading ?
            <Container className="text-center">
              <Spinner variant="success" />
            </Container> :
            isCalendarView ? <AdminCalendarView allData={allTickets} /> : <AdminComplaintTable allData={allTickets} />}
        </div>
      ) : (
        <h2 className="text-center text-danger">You are not admin</h2>
      )}
    </>
  );
}

export async function getAllTickets(fetchData) {
  try {
    const url = localStorage.getItem("url") + "admin.php";
    const formData = new FormData();
    formData.append("operation", "getAllTickets");
    const res = await axios({ url: url, data: formData, method: "post" });
    console.log("res ni getAllTickets", JSON.stringify(res.data));
    fetchData(res.data);
  } catch (err) {
    alert("There was an unexpected error: " + err);
  }
}