import { NavLink, Navbar, Container, NavDropdown } from "react-bootstrap";

function NavBar() {
  const userFullName = localStorage.getItem("userFullName");
  const handleSignout = () => {
    localStorage.setItem("userId", "");
    localStorage.setItem("userLevel", "");
    localStorage.setItem("isLoggedIn", "");
    localStorage.setItem("facultyLoggedIn", "");
    localStorage.setItem("facCode", "");
    localStorage.setItem("userCommentId", "");

  }

  return (
    <Navbar className="nav-background" expand="lg" text="light">
      <Container>
        <Navbar.Brand className="brand">GSD Support Ticket System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <NavLink style={{ color: "white", marginRight: "10px" }} href="/gsd/user/dashboard/">
            Home
          </NavLink>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <NavDropdown title={userFullName} style={{ color: "white"}}>
            <NavDropdown.Item href="/gsd/account/password">Change Password</NavDropdown.Item>
            <NavDropdown.Item href="/gsd" onClick={handleSignout}>Signout</NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
