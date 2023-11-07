import { NavLink, Navbar, Container } from "react-bootstrap";

function NavBar() {
  const handleSignout = () => {
    localStorage.setItem("userId", "");
    localStorage.setItem("userLevel", "");
    localStorage.setItem("isLoggedIn", "");
  }

  return (
    <Navbar className="nav-background" expand="lg" text="light">
      <Container>
        <Navbar.Brand className="brand">GSD</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <NavLink style={{ color: "white", marginRight: "10px" }} href="/user/dashboard/">
            Home
          </NavLink>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <NavLink style={{ color: "white", marginRight: "10px" }} href="/gsd" onClick={handleSignout}>
            Signout
          </NavLink>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
