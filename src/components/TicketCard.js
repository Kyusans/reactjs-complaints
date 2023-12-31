import { faCheck, faClock, faDownLong, faExclamationTriangle, faPlay, faRightLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { useMediaQuery } from 'react-responsive';

function TicketCard(props) {
  const { subject, status, priority, date, lastUser } = props;
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return (
    <>
      <Card
        border='dark'
        className={status === "On-Going" ? "text-dark" : "text-white"}
        bg={status === "On-Going" ? "warning" : status === "Completed" ? "success" : "secondary"}
      >
        <Container className='p-4'>
          <Row className='d-flex align-content-center justify-content-between'>
            <Col xs={12} md={3}><b>Subject: </b>{!isMobile && <br />}
              {subject}
            </Col>

            {priority === null ? <></> :
              <Col xs={12} md={2}><b className='me-2'>Priority:</b> {!isMobile && <br />}
                {
                  priority === "High" ?
                    <FontAwesomeIcon icon={faExclamationTriangle} className={`text-danger ${!isMobile ? "ms-4" : null} `} />
                    :
                    priority === "Medium" ?
                      <FontAwesomeIcon icon={faRightLong} className={`${!isMobile ? "ms-4" : null} ${status === "On-Going" ? "text-dark" : "text-warning"} `} />
                      :
                      <FontAwesomeIcon icon={faDownLong} className={`text-dark ${!isMobile ? "ms-4" : null} `} />
                }
              </Col>
            }

            <Col xs={12} md={2}><b className='me-1 '>Status:</b> {!isMobile && <br />}
              {
                status === "Completed" ?
                  <FontAwesomeIcon icon={faCheck} className={`${!isMobile ? "ms-3" : null}`} />
                  :
                  status === "Pending" ?
                    <FontAwesomeIcon icon={faClock} className={`${!isMobile ? "ms-3" : null}`} />
                    :
                    <FontAwesomeIcon icon={faPlay} className={`text-dark ${!isMobile ? "ms-3" : null}`} />
              }
            </Col>

            <Col xs={12} md={3}><b>Last Updated By:</b> {!isMobile && <br />}
              {status === "Pending" ? <div className='ms-5'>N/A</div> : lastUser === "" ? "GSD Administrator" : lastUser}
            </Col>

            <Col xs={12} md={2}><b>Date:{!isMobile && <br />}</b> {date}</Col>
          </Row>
        </Container>
      </Card>
    </>
  )
}

export default TicketCard
