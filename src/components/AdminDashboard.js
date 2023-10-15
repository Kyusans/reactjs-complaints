import { Container, Row } from "react-bootstrap";
import AdminComplaintTable from "./AdminComplaintTable";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function AdminDashboard() {
  const navigateTo = useNavigate();
  useEffect(()=>{
    if(localStorage.getItem("adminLoggedIn") !== "true"){
      navigateTo("/")
    }
  }, [navigateTo])
  return (
    <>
      {localStorage.getItem("adminLoggedIn") === "true" ? (
        <Container className="mt-4">
          <Row>
            <AdminComplaintTable />
          </Row>
          
        </Container>
      ) : (
        <h2 className="text-center text-danger">You are not admin</h2>
      )}
    </>
  );
}
