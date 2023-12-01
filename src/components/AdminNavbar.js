import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './css/site.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBars, faKey, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import AddPersonnel from './AddPersonnel';

function AdminNavbar() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showAddPersonnel, setShowAddPersonnel] = useState(false);
  const hideAddPersonnel = () =>{setShowAddPersonnel(false)}
  const openAddPersonnel = () =>{setShowAddPersonnel(true)}

  const userFullName = localStorage.getItem("userFullName");
  const handleSignout = () => {
    localStorage.setItem("adminLoggedIn", "false");
    localStorage.setItem("userId", "");
    localStorage.setItem("userLevel", "");
    localStorage.setItem("userCommentId", "");
    localStorage.setItem("userFullName", "");
    localStorage.setItem("isLoggedIn", "");
  }

  const handleToggleOffcanvas = () => {
    setShowOffcanvas((prev) => !prev);
  };

  return (
    <Navbar className="navbar-dark bg-dark">
      <Container fluid>
        <Button variant="outline-light" onClick={handleToggleOffcanvas}>
          <FontAwesomeIcon icon={faBars} size='lg' />
        </Button>

        <Navbar.Brand href="/gsd/admin/dashboard/">GSD Support Ticket System</Navbar.Brand>
        <Offcanvas
          className="custom-offcanvas"
          show={showOffcanvas}
          onHide={() => setShowOffcanvas(false)}
          placement="start"
        >

          <Offcanvas.Header closeButton={false} className='mt-1'>
            <Navbar.Brand><h5>{userFullName}</h5></Navbar.Brand>
            <div className="custom-close-button" onClick={() => setShowOffcanvas(false)}>
              <Button variant='outline-light'><FontAwesomeIcon icon={faArrowLeft} size='lg' /> </Button>
            </div>
          </Offcanvas.Header>

          <Offcanvas.Body className='mt-4'>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link href="/gsd/admin/dashboard/">Home</Nav.Link>
              <Nav.Link href="/gsd/admin/addlocation/">Add Location</Nav.Link>
              <Nav.Link href="/gsd/report/">Report</Nav.Link>
              <Nav.Link onClick={openAddPersonnel}>Add Personnel</Nav.Link>
            </Nav>

            <Container className='offCanvas-footer'>
              <NavDropdown title="Account" drop='up'>
                <NavDropdown.Item href="/gsd/account/password"><FontAwesomeIcon icon={faKey} /> Change Password</NavDropdown.Item>
                <NavDropdown.Item href="/gsd" onClick={handleSignout}><FontAwesomeIcon icon={faSignOutAlt} /> Signout</NavDropdown.Item>
              </NavDropdown>
            </Container>
          </Offcanvas.Body>
        
        </Offcanvas>
        <AddPersonnel show={showAddPersonnel} onHide={hideAddPersonnel} />
      </Container>
    </Navbar>
  );
}

export default AdminNavbar;