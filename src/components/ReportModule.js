import React, { useState } from 'react'
import { Table } from 'react-bootstrap'
import { formatDate } from './JobDetails';

function ReportModule() {
  const [tickets, setTickets] = useState([]);
  return (
    <>
      <Table striped bordered hover responsive variant="success" className="border-1">
        <thead>
          <tr>
            <th className="green-header">Subject</th>
            <th className="green-header">Status</th>
            <th className="green-header">Date</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(tickets) ? (
            tickets.map((ticket, index) => (
              <tr key={index}className="ticket-cell">
                <td className={ticket.joStatus_name === "Pending" ? "ticket-unread" : ""}>{ticket.comp_subject}</td>
                <td className={`${ticket.joStatus_name === "Pending" ? "ticket-unread" : ""} ${ticket.joStatus_name === "Completed" ? "text-success" : ticket.joStatus_name === "On-Going" ? "text-warning" : ""} text-outline`}>
                  {ticket.joStatus_name}
                </td>
                <td className={`ticket-date ${ticket.joStatus_name === "Pending" ? "ticket-unread" : ""}`}>{formatDate(ticket.comp_date)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No tickets to display.</td>
            </tr>
          )}
        </tbody>

      </Table>
    </>
  )
}

export default ReportModule