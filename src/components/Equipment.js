import React, { useState } from 'react'
import { Button, Card, Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap'

function Equipment() {
  const [equipment, setEquipment] = useState("");
  return (
    <div>
        <Row>
          <Col>
            <Container>
              <Card border='success'>
                <Card.Header className='text-center'><h3>Equipment Category</h3></Card.Header>
                <Card.Body>
                  <Form>
                    <FloatingLabel label="Equipment Category">
                      <Form.Control type='text' value={equipment} onChange={(e) => setEquipment(e.target.value)} placeholder='Equipment Category'/>
                    </FloatingLabel>
                  </Form>
                <Container className='text-center mt-3'>
                  <Button variant='outline-success'>Submit</Button>
                </Container>
                </Card.Body>
              </Card>
            </Container>
          </Col>
          <Col>
          <Container>
            <Card border='success'>
              <Card.Header className='text-center'><h3>Equipment</h3></Card.Header>
              <Card.Body>
                 <Form>
                    <FloatingLabel label="Equipment">
                      <Form.Control type='text' value={equipment} onChange={(e) => setEquipment(e.target.value)} placeholder='Equipment'/>
                    </FloatingLabel>
                  </Form>
                <Container className='text-center mt-3'>
                  <Button variant='outline-success'>Submit</Button>
                </Container>
              </Card.Body>
            </Card>
            </Container>           
          </Col>
        </Row>

      
    </div>
  )
}

export default Equipment