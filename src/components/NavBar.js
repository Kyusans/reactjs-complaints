import { NavLink, Navbar, Container } from "react-bootstrap";

function NavBar() {
  const handleSignout = () => {
    localStorage.setItem("userId", "");
    localStorage.setItem("userLevel", "");
    localStorage.setItem("isLoggedIn", "");
  }

  return (
    <div className="navbar-wrapper">
      <Navbar className="nav-background" expand="lg" text="light">
        <Container fluid>
          <Navbar.Brand className="brand">GSD</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <NavLink style={{ color: "white", marginRight: "10px" }} href="/user/dashboard/">
              Home
            </NavLink>
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            <NavLink style={{ color: "white", marginRight: "10px" }} href="/" onClick={handleSignout}>
              Signout
            </NavLink>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBar;
