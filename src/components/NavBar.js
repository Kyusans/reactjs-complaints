import { NavLink, Navbar, Container } from "react-bootstrap";

function NavBar() {
  return (
    <>
      <Navbar className="nav-background" expand="lg" text="light">
        <Container>
          <Navbar.Brand className="brand">-Brand Name-</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <NavLink
              style={{ color: "white", marginRight: "10px" }}
              href="/itdays/"
            >
              Home
            </NavLink>
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            <NavLink
              style={{ color: "white", marginRight: "10px" }}
              href="/itdays/"
            >
              Signout
            </NavLink>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
