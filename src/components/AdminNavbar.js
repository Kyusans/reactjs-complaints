import { Container, NavDropdown, NavLink, Navbar } from "react-bootstrap";

const AdminNavbar = () => {
  const userFullName = localStorage.getItem("userFullName");
  const handleSignout = () =>{
    localStorage.setItem("adminLoggedIn", "false");
    localStorage.setItem("userId", "");
		localStorage.setItem("userLevel", "");
    localStorage.setItem("userCommentId", "");
  }

  return ( 
    <>
      <Navbar className="nav-background" expand="lg" text="light">
        <Container>
          <Navbar.Brand className="brand">GSD Support Ticket System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <NavLink style={{ color: "white", marginRight: "10px" }} href="/gsd/admin/dashboard/">Home</NavLink>
            <NavLink style={{ color: "white", marginRight: "10px" }} href="/gsd/admin/addlocation/">Location</NavLink>
            <NavLink style={{ color: "white", marginRight: "10px" }} href="/gsd/report/">Report</NavLink>
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
          <NavDropdown title={userFullName} style={{ color: "white"}}>
            <NavDropdown.Item href="/gsd/account/password">Change Password</NavDropdown.Item>
            <NavDropdown.Item href="/gsd" onClick={handleSignout}>Signout</NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
   );
}
 
export default AdminNavbar;