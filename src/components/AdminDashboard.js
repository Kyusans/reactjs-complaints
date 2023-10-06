import { Container, Row } from "react-bootstrap";
import AdminComplaintTable from "./AdminComplaintTable";
import AdminAddLocation from "./AdminAddLocation";


export default function AdminDashboard() {
  return (
    <>
      {localStorage.getItem("adminLoggedIn") === "true" ? (
        <Container className="mt-4">
          <Row>
            <AdminComplaintTable />
          </Row>

          <Row>
            <AdminAddLocation />
          </Row>
          
        </Container>
      ) : (
        <h2 className="text-center text-danger">You are not admin</h2>
      )}
    </>
  );
}
