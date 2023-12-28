import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { Container, Dropdown, Pagination, Table } from "react-bootstrap";
import JobOrderModal from "./JobOrderModal";
import "./css/site.css";
import JobDetails, { formatDate } from "./JobDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock, faPlay, faThList } from "@fortawesome/free-solid-svg-icons";
import AlertScript from "./AlertScript";
import axios from "axios";

function AdminComplaintTable({ allData }) {
  // const navigateTo = useNavigate();
  const [allTickets, setAllTickets] = useState(allData);
  const [pageStatus, setPageStatus] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 20;
  const [showJobOrderModal, setShowJobOrderModal] = useState(false);
  const showPagination = tickets.length > ticketsPerPage;
  const [showJobDetails, setShowJobDetails] = useState(false);
  // const [defaultTicket, setDefaultTicket] = useState([]);

  const hideJobDetails = async () => {
    await getAllTickets();
    setShowJobDetails(false);
  }

  const handleClose = async () => {
    await getAllTickets();
    setShowJobOrderModal(false)
  };
  const handleShow = (id, status) => {
    if (status === 1) {
      setTicketId(id);
      setShowJobOrderModal(true);
    } else {
      setTicketId(id);
      setShowJobDetails(true);
      // navigateTo(`/job/details/${id}`);
    }
  };

  const getAllTickets = async () => {
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const formData = new FormData();
      formData.append("operation", "getAllTickets");
      const res = await axios({ url: url, data: formData, method: "post" });
      console.log("res ni getAllTickets", JSON.stringify(res.data));
      if (res.data !== 0) {
        setAllTickets(res.data);
        getTicketsByStatus(pageStatus);
      }
    } catch (err) {
      alert("There was an unexpected error: " + err);
    }

  };

  const getTicketsByStatus = (status) => {
    var statusNumber = 0;
    handleFirstPage();
    setPageStatus(status);
    switch (status) {
      case 1:
        // pending
        statusNumber = 1;
        break;
      case 2:
        // on-going
        statusNumber = 2;
        break;
      case 3:
        // complete
        statusNumber = 3;
        break;
      default:
        setTickets(allTickets);
        return;
    }
    const filteredTickets = allData.filter(item => item.comp_status === statusNumber);
    setTickets(filteredTickets);
  }

  useEffect(() => {
    if (allTickets) {
      const filterdData = allTickets.filter(item => item.comp_status < 3);
      setTickets(filterdData);
    }
    console.log("alldata: " + allTickets);
  }, [allTickets]);

  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;
  const displayedTickets = tickets ? tickets.slice(startIndex, endIndex) : 0;
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  }
  const handleFirstPage = () => {
    setCurrentPage(1);
  };
  const handleLastPage = () => {
    const lastPage = Math.ceil(tickets.length / ticketsPerPage);
    setCurrentPage(lastPage);
  };



  return (
    <>
      <Dropdown className="mb-2 ms-3">
        <Dropdown.Toggle variant={pageStatus === 0 ? "primary" : pageStatus === 1 ? "dark" : pageStatus === 2 ? "warning text-dark" : pageStatus === 3 ? "success" : "primary"}>
          {pageStatus === 0 ? "All Tickets" : pageStatus === 1 ? "Pending Tickets" : pageStatus === 2 ? "On-going Tickets" : pageStatus === 3 ? "Completed Tickets" : "Select Ticket Type"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => getTicketsByStatus(0)}><FontAwesomeIcon icon={faThList} className="me-2" />All Ticket</Dropdown.Item>
          <Dropdown.Item onClick={() => getTicketsByStatus(1)} className="text-dark"><FontAwesomeIcon icon={faClock} className="me-2 text-dark" />Pending</Dropdown.Item>
          <Dropdown.Item onClick={() => getTicketsByStatus(2)} className="text-warning"><FontAwesomeIcon icon={faPlay} className="me-2 text-warning" />On-going</Dropdown.Item>
          <Dropdown.Item onClick={() => getTicketsByStatus(3)} className="text-success"><FontAwesomeIcon icon={faCheck} className="me-2" />Completed</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Container fluid>

        {displayedTickets.length <= 0 ?
          <AlertScript show={true} variant={"dark"} message={"No tickets yet"} />
          :
          <Table striped bordered hover responsive variant="success" className="border-1">
            <thead>
              <tr>
                <th className="green-header">Subject</th>
                <th className="green-header">Status</th>
                <th className="green-header">Date</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(displayedTickets) && displayedTickets.map((ticket, index) => (
                <tr
                  key={index}
                  onClick={() => handleShow(ticket.comp_id, ticket.comp_status)}
                  className="clickable"
                >
                  <td>{ticket.comp_subject}</td>
                  <td>
                    {ticket.joStatus_name === "Pending" ? (
                      <span><FontAwesomeIcon icon={faClock} className="me-2 text-dark" />Pending</span>
                    ) : ticket.joStatus_name === "On-Going" ? (
                      <span><FontAwesomeIcon icon={faPlay} className="me-2 text-warning" />On-Going</span>
                    ) : (
                      <span><FontAwesomeIcon icon={faCheck} className="me-2 text-success" />Completed</span>
                    )}
                  </td>

                  <td className={`ticket-date ${ticket.joStatus_name === "Pending" ? "ticket-unread" : ""}`}>
                    {formatDate(ticket.comp_date)}
                  </td>
                </tr>
              )
              )}
            </tbody>
          </Table>
        }

        {showPagination && (
          <div className="d-flex justify-content-end mt-2">
            <Pagination>
              <Pagination.First onClick={handleFirstPage} />
              <Pagination.Prev onClick={handlePreviousPage} />
              {Array.from({ length: Math.ceil(tickets.length / ticketsPerPage) }, (_, index) => (
                <Pagination.Item
                  key={index}
                  active={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={handleNextPage} />
              <Pagination.Last onClick={handleLastPage} />
            </Pagination>
          </div>
        )}
        <JobOrderModal show={showJobOrderModal} onHide={handleClose} ticketId={ticketId} />
        <JobDetails show={showJobDetails} onHide={hideJobDetails} compId={ticketId} />
      </Container>

    </>
  );
}

export default AdminComplaintTable;
