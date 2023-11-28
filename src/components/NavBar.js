import { Navbar, Container, NavDropdown } from "react-bootstrap";

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
        <Navbar.Brand className="brand" href="/gsd">GSD Support Ticket System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
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
