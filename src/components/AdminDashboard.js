import { Container } from "react-bootstrap";
import AdminComplaintTable from "./AdminComplaintTable";


export default function AdminDashboard() {
  return (
    <>
      {localStorage.getItem("adminLoggedIn") === "true" ? (
        <Container className="mt-3">
          <AdminComplaintTable />
        </Container>
      ) : (
        <h2 className="text-center text-danger">You are not admin</h2>
      )}
    </>
  );
}
