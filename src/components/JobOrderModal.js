import React from 'react'
import { Col, Form, Modal, Row } from 'react-bootstrap'

function JobOrderModal(props) {
  const {show, onHide, ticketId} = props;

  return (
    <div>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton><h3>Job order creation</h3></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}> 
              <Form.Label column sm="2">{ticketId}</Form.Label>
              <Col sm="10">
                <Form.Control plaintext readOnly defaultValue="#69" />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default JobOrderModal