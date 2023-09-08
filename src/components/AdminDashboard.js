import { Col, Row } from "react-bootstrap";
import Location from "./Location";
import LocationCategory from "./LocationCategory";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigateTo = useNavigate();
  useEffect(() => {
    if(localStorage.getItem("adminLoggedIn") !== "true"){
      setTimeout(() => {
        navigateTo("/");
      }, 1500);
    }
  })
  return (
    <div>
      {localStorage.getItem("adminLoggedIn") === "true" ? (
        <Row className="mt-5">
          <Col>
            <LocationCategory />
          </Col>
          <Col>
            <Location />
          </Col>
        </Row>
      ) : (
        <h2 className="text-center text-danger">You are not admin</h2>
      )}
    </div>
  );
}
