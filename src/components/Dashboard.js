import React, { useEffect } from 'react'
import { Container, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigateTo = useNavigate();
  useEffect(() => {
    if(localStorage.getItem("isLoggedIn") !== "1"){
      setTimeout(() => {
        navigateTo("/");
      }, 1500);
    }
  })
  
  return (
    <>
      {localStorage.getItem("isLoggedIn") === "1" ? 
        (<Container>
          <h3 className='text-center'>Tickets</h3>
          <Table>
            <thead>
              <th></th>
            </thead>
          </Table>
        </Container>):
        <h3 className='text-center'>You need to login first</h3>
      }
    </>
  )
}

export default Dashboard