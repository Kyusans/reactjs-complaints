import { Col, Row } from "react-bootstrap";
import Location from "./Location";
import LocationCategory from "./LocationCategory";

export default function AdminDashboard() {

  return (
    <div>
      <Row className="mt-5">
        <Col>
          <LocationCategory />
        </Col>
        <Col>
          
          <Location />
        </Col>
        
      </Row>
    </div>
  )
} 