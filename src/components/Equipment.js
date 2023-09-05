import React, { useState } from 'react'
import { Card, Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap'

function Equipment() {
  const [equipment, setEquipment] = useState("");
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                 <Form>
                    <FloatingLabel label="Equipment Category">
                      <Form.Control type='text' value={equipment} onChange={(e) => setEquipment(e.target.value)}/>
                    </FloatingLabel>
                  </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                 <Form>
                    <FloatingLabel label="Equipment Category">
                      <Form.Control type='text' value={equipment} onChange={(e) => setEquipment(e.target.value)}/>
                    </FloatingLabel>
                  </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

      </Container>
    </div>
  )
}

export default Equipment