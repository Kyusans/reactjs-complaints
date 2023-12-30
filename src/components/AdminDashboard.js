import AdminComplaintTable from "./AdminComplaintTable";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminCalendarView from "./AdminCalendarView";
import { Button, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faSync, faTh } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";


export default function AdminDashboard() {
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [allTickets, setAllTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigateTo = useNavigate();

  const getAllTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const formData = new FormData();
      formData.append("operation", "getAllTickets");
      const res = await axios({ url: url, data: formData, method: "post" });
      console.log("res ni getAllTickets", JSON.stringify(res.data));
      if (res.data !== 0) {
        setAllTickets(res.data);
        // const filterdData = res.data.filter(item => item.comp_status < 3);
      }
    } catch (err) {
      alert("There was an unexpected error: " + err);
    } finally {
      setIsLoading(false);
    }

  }, []);

  const refreshData = async () => {
    await getAllTickets();
  }

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      navigateTo(-1);
    } else {
      getAllTickets();
    }
  }, [getAllTickets, navigateTo]);

  return (
    <>
      {localStorage.getItem("adminLoggedIn") === "true" ? (
        <div className="p-2" >
          <div className="p-2">
            <Button variant="info" onClick={() => setIsCalendarView(false)} className="me-1 ms-2">
              <FontAwesomeIcon icon={faTh} />
            </Button>
            <Button variant="secondary" onClick={() => setIsCalendarView(true)}>
              <FontAwesomeIcon icon={faCalendar} />
            </Button>
            <Button onClick={getAllTickets} className='ms-1'>
              <FontAwesomeIcon icon={faSync} /> Refresh
            </Button>
          </div>
          {isLoading ?
            <Container className="text-center">
              <Spinner variant="success" />
            </Container> :
            isCalendarView ?
              <AdminCalendarView allData={allTickets} refreshData={refreshData} />
              :
              <AdminComplaintTable allData={allTickets} refreshData={refreshData} />
          }
        </div>
      ) : (
        <h2 className="text-center text-danger">You are not admin</h2>
      )}
    </>
  );
}