import { faArrowDown, faArrowRight, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'

function TicketCard(props) {
  const { subject, status, priority, date } = props;
  return (
    <>
      <Card
        border='dark'
        className="text-light"
        bg={status === "On-Going" ? "secondary" : "success"}
      >
        <Container className='p-3'>
          <Row>
            <Col xs={12} md={3}><b>Subject:</b> {subject}</Col>
            <Col xs={12} md={3}><b className='me-2'>Priority:</b>
              {
                priority === "High" ?
                  <FontAwesomeIcon icon={faArrowUp} className="text-danger me-2" /> :
                  priority === "Medium" ?
                    <FontAwesomeIcon icon={faArrowRight} className="text-warning me-2" /> :
                    <FontAwesomeIcon icon={faArrowDown} className="text-light me-2" />
              }
            </Col>
            <Col xs={12} md={3}><b>Status:</b> {status}</Col>
            <Col xs={12} md={3}><b>Date:</b> {date}</Col>
          </Row>
        </Container>

      </Card>
    </>
  )
}

export default TicketCard

// {tickets.priority_name === "High" ? (
//   <FontAwesomeIcon icon={faArrowUp} className="text-danger me-2" />
// ) : tickets.priority_name === "Medium" ? (
//   <FontAwesomeIcon icon={faArrowRight} className="text-warning me-2" />
// ) : tickets.priority_name === "Low" ? (
//   <FontAwesomeIcon icon={faArrowDown} className="text-dark me-2" />
// ) : (
//   null
// )}