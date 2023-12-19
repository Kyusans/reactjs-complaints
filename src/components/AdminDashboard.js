import AdminComplaintTable from "./AdminComplaintTable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminCalendarView from "./AdminCalendarView";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faTh } from "@fortawesome/free-solid-svg-icons";


export default function AdminDashboard() {
  const [isCalendarView, setIsCalendarView] = useState(false);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      navigateTo(-1);
    }
  }, [navigateTo])
  return (
    <>
      {localStorage.getItem("adminLoggedIn") === "true" ? (
        <div className="p-2" >
          <div className="p-2">
            <Button variant="info" onClick={() => setIsCalendarView(false)} className="me-1 ms-2"><FontAwesomeIcon icon={faTh} /> </Button>
            <Button variant="light" onClick={() => setIsCalendarView(true)}><FontAwesomeIcon icon={faCalendar} /> </Button>
          </div>
          {isCalendarView ? <AdminCalendarView /> : <AdminComplaintTable />}
        </div>
      ) : (
        <h2 className="text-center text-danger">You are not admin</h2>
      )}
    </>
  );
}
