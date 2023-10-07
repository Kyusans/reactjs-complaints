import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container, Spinner, Table } from 'react-bootstrap';

export default function PersonnelDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [ticket, setTicket] = useState([]);

  const getJobTicket = async () =>{
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "personnel.php";
      const userId = localStorage.getItem("userId");
      const jsonData = {userId: userId}
      const formData = new FormData();
      formData.append("operation", "getJobTicket");
      formData.append("json", jsonData);
      const res = await axios({url: url, data: formData, method:"post"});
      console.log("res: " + JSON.stringify(res.data));
      if(res.data !== 0){
        setTicket(res.data);
        setIsLoading(false);
      }else{
        //no job ticket found
      }
    } catch (error) {
      alert("There was an unexpected error: " + error);
    }
  }

  useEffect(()=>{
    getJobTicket();
  },[])
  return (
    <>
      {isLoading ? 
        <Container className='text-center mt-3'>
          <Spinner animation='border' variant='success' /> 
        </Container>
      : 
        <Container>
          <Table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {ticket.map((tickets, index) => (
                <tr key={index}>
                  <td>{tickets.job_title}</td>
                  <td>
                  {ticket.comp_description.length > 50
                    ? `${ticket.comp_description.slice(0, 50)}...`
                    : ticket.comp_description}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      }
    </>
  )
}
