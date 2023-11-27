import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import LocationCategory from './LocationCategory'
import Location from './Location'

function AdminAddLocation() {
  return (
    <div>        
       <Container className="mt-2">
        <Row className="mt-2">
          <Col className="mt-3">
            <LocationCategory />
          </Col>
          <Col>
            <Location />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AdminAddLocation