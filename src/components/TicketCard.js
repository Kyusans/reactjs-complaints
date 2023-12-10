import { faArrowDown, faArrowRight, faArrowUp, faCheck, faClock, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'

function TicketCard(props) {
  const { subject, status, priority, date, lastUser } = props;
  return (
    <>
      <Card
        border='dark'
        className={status === "On-Going" ? "text-dark" : "text-white"}
        bg={status === "On-Going" ? "warning" : status === "Completed" ? "success" : "dark"}
      >
        <Container className='p-3'>
          <Row>
            <Col xs={12} md={3}><b>Subject: </b>
              {subject}
            </Col>

            {priority === null ? <></> :
              <Col xs={12} md={2}><b className='me-2'>Priority:</b>
                {
                  priority === "High" ?
                    <FontAwesomeIcon icon={faArrowUp} className="text-danger me-2" />
                    :
                    priority === "Medium" ?
                      <FontAwesomeIcon icon={faArrowRight} className="text-dark me-2" />
                      :
                      <FontAwesomeIcon icon={faArrowDown} className="text-secondary me-2" />
                }
              </Col>
            }
            <Col xs={12} md={2}><b className='me-2'>Status:</b>
              {
                status === "Completed" ?
                  <FontAwesomeIcon icon={faCheck} />
                  :
                  status === "Pending" ?
                    <FontAwesomeIcon icon={faClock} />
                    :
                    <FontAwesomeIcon icon={faPlay} className='text-dark' />
              }
            </Col>
            <Col xs={12} md={2}><b>Date:</b> {date}</Col>
            {status !== "Pending" && <Col xs={12} md={2}><b>Last Updated By:</b> {lastUser}</Col>}
          </Row>
        </Container>
      </Card>
    </>
  )
}

export default TicketCard
