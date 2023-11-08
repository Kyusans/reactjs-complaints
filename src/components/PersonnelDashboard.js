import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container, Spinner, Table } from 'react-bootstrap';
import "./css/site.css";
import { useNavigate } from 'react-router-dom';
import { formatDate } from './JobDetails';

export default function PersonnelDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [ticket, setTicket] = useState([]);
  const navigateTo = useNavigate();

  const getJobTicket = async () => {
    try {
      const url = localStorage.getItem("url") + "personnel.php";
      const userId = localStorage.getItem("userId");
      const jsonData = { userId: userId }
      const formData = new FormData();
      formData.append("operation", "getJobTicket");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios({ url: url, data: formData, method: "post" });
      if (res.data !== 0) {
        setTicket(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      alert("There was an unexpected error: " + error);
    }
  }

  const handleNavigate = (id) =>{
    navigateTo(`/job/details/${id}`);
  }

  useEffect(() => {
    setIsLoading(true);
    const intervalId = setInterval(() => {getJobTicket()}, 5000);
    return () => clearInterval(intervalId);
  }, [])

  return (
    <>
      {isLoading ?
        <Container className='text-center mt-3'>
          <Spinner animation='border' variant='success' />
        </Container>
        :
        <Container className='scrollable-container'>
          <div className='mt-3'>
            <Table bordered responsive striped hover size="sm" variant='success' className='border-1'>
              <thead>
                <tr>
                  <th className="green-header">Subject</th>
                  <th className="green-header">Priority</th>
                  <th className="green-header">Status</th>
                  <th className="green-header">Date</th>
                </tr>
              </thead>
              <tbody>
                {ticket.map((tickets, index) => (
                  <tr key={index} className={`ticket-cell`} onClick={() => handleNavigate(tickets.job_complaintId)}>
                    <td>{tickets.job_title}</td>
                    <td className={`${tickets.priority_name === "High" ? "text-danger" : `${tickets.priority_name === "Medium" ? "text-warning" : ""}`}`}>{tickets.priority_name}</td>
                    <td className={tickets.joStatus_name === "On-Going" ? "" : "text-success"}>{tickets.joStatus_name}</td>
                    <td className={`ticket-date`}>{formatDate(tickets.job_createDate)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Container>
      }
    </>
  )
}
