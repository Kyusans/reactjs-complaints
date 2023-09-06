import { NavLink, Navbar} from "react-bootstrap";

function NavBar() {
  return (
    <>
      <Navbar className="nav-background" expand="lg" text="light">
          <Navbar.Brand className="brand">-Brand Name-</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav "/>
          <Navbar.Collapse className="brand" id="basic-navbar-nav">
            <NavLink style={{color: "white", marginRight: "10px"}} href="/itdays/">Home</NavLink>
          </Navbar.Collapse>
      </Navbar>

    </>
  );
}

export default NavBar;  