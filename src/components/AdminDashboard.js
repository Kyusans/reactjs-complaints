import { Card, Container, Row } from "react-bootstrap";
import AdminComplaintTable from "./AdminComplaintTable";
import AdminAddLocation from "./AdminAddLocation";


export default function AdminDashboard() {
  return (
    <>
      {localStorage.getItem("adminLoggedIn") === "true" ? (
        <Container className="mt-2">
          <Row>
            <Card>
              <Card.Header className="text-center"><h3>Complaint Ticket</h3></Card.Header>
              <Card.Body>
                <AdminComplaintTable />
              </Card.Body>
            </Card>
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
