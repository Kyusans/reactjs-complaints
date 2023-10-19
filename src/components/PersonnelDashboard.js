import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container, Spinner, Table } from 'react-bootstrap';
import "./css/site.css";
import { useNavigate } from 'react-router-dom';

export default function PersonnelDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [ticket, setTicket] = useState([]);
  const navigateTo = useNavigate();

  const getJobTicket = async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "personnel.php";
      const userId = localStorage.getItem("userId");
      const jsonData = { userId: userId }
      const formData = new FormData();
      formData.append("operation", "getJobTicket");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios({ url: url, data: formData, method: "post" });
      console.log("res: " + JSON.stringify(res.data))
      if (res.data !== 0) {
        setTicket(res.data);
        setIsLoading(false);
      } else {
        //no job ticket found
      }
    } catch (error) {
      alert("There was an unexpected error: " + error);
    }
  }

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const formattedDate = `${month} ${day}`;
    return formattedDate;
  }

  const handleNavigate = (id) =>{
    navigateTo(`/job/details/${id}`);
  }

  useEffect(() => {
    getJobTicket();
  }, [])

  return (
    <Container>
      {isLoading ?
        <Container className='text-center mt-3'>
          <Spinner animation='border' variant='success' />
        </Container>
        :
        <Container className='mt-3'>
          <Table bordered striped hover variant='success'>
            <thead>
              <tr>
                <th className="green-header">Subject</th>
                <th className="green-header">Description</th>
                <th className="green-header">Priority</th>
                <th className="green-header">Status</th>
                <th className="green-header">Date</th>
              </tr>
            </thead>
            <tbody>
              {ticket.map((tickets, index) => (
                <tr key={index} className={`ticket-cell`} onClick={() => handleNavigate(tickets.job_complaintId)}>
                  <td>{tickets.job_title}</td>
                  <td>
                    {tickets.job_description.length > 50
                      ? `${tickets.job_description.slice(0, 50)}...`
                      : tickets.job_description}
                  </td>
                  <td className={`${tickets.priority_name === "High" ? "text-danger" : `${tickets.priority_name === "Medium" ? "text-warning" : ""}`}`}>{tickets.priority_name}</td>
                  <td className={tickets.joStatus_name === "On-Going" ? "text-dark" : "text-success"}>{tickets.joStatus_name}</td>
                  <td className={`ticket-date`}>{formatDate(tickets.job_createDate)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      }
    </Container>
  )
}
