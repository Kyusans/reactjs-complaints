import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Container, Spinner, Table } from 'react-bootstrap';
import "./css/site.css";
import { useNavigate } from 'react-router-dom';
import { formatDate } from './JobDetails';

export default function PersonnelDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOnGoing, setIsOnGoing] = useState(true);
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

  const getSelectedStatus = async (priority) => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "personnel.php";
      const userId = localStorage.getItem("userId");
      const jsonData = { priority: priority, userId: userId }
      const formData = new FormData();
      formData.append("operation", "getSelectedStatus");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios({ url: url, data: formData, method: "post" });
      if (res.data !== 0) {
        setTicket(res.data);
        setIsLoading(false);
      }else{
        alert("No ticket found");
        setIsLoading(false);
      }
    } catch (error) {
      alert("There was an unexpected error: " + error);
    }
  }


  const getTicketsByStatus = useCallback(async (status) =>{
    setIsLoading(true);
    if(status === 2){
      setIsOnGoing(true);
    }else if(status === 0){
      setIsOnGoing(false);
      getJobTicket();
    }else{
      setIsOnGoing(false);
    }

    try {
      setTicket([]);
      const url = localStorage.getItem("url") + "personnel.php";
      const userId = localStorage.getItem("userId");
      const jsonData = {status: status, userId: userId};
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "getJobsByStatus");
      const res = await axios({url: url, data: formData, method: "post"});
      if(res.data !== 0){
        setTicket(res.data);
      }else{
        // no tickets found
      }
      setIsLoading(false);
    } catch (error) {
      alert("There was an error: " + error.message);
    }
  },[])

  const handleNavigate = (id) =>{
    navigateTo(`/job/details/${id}`);
  }

  useEffect(() => {
    setIsLoading(true);
    getTicketsByStatus(2);
  }, [getTicketsByStatus])

  return (
    <>
      {isLoading ?
        <Container className='text-center mt-3'>
          <Spinner animation='border' variant='success' />
        </Container>
        :
        <Container className='scrollable-container'>
          <div className="d-flex flex-wrap mt-2">
            <Button onClick={() => getTicketsByStatus(0)} className="mx-1 mb-2">All Ticket</Button>
            <Button onClick={() => getTicketsByStatus(2)} className="btn-warning mb-2">On-Going</Button>
            <Button onClick={() => getTicketsByStatus(3)} className="btn-success mx-1 mb-2">Completed</Button>
          </div>
          {isOnGoing ? 
            <div className='d-flex flex-wrap mt-2 '>
              <Button onClick={() => getSelectedStatus(3)} className="btn-dark mx-1 mb-2">Low</Button>
              <Button onClick={() => getSelectedStatus(2)} className="btn-warning mb-2">Medium</Button>
              <Button onClick={() => getSelectedStatus(1)} className="btn-danger mx-1 mb-2">High</Button>
            </div>:
            <></>
          }
          <div>
            <Table bordered responsive striped hover variant='success' className='border-1'>
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
                    <td className={tickets.joStatus_name === "On-Going" ? "text-warning" : "text-success"}>{tickets.joStatus_name}</td>
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
