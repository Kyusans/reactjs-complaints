import { Row } from "react-bootstrap";
import Location from "./Location";
import Equipment from "./Equipment";

export default function AdminDashboard() {

  return (
    <div>
      <Row className="mt-5 mb-5">
        <Location />
      </Row>
      <Row>
        <Equipment />
      </Row>
    </div>
  )
}
 