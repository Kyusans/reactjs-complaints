import { NavLink, Navbar} from "react-bootstrap";

function NavBar() {
  return (
    <>
      <Navbar className="nav-background" expand="lg" text="light">
          <Navbar.Brand className="brand">IT Days 2023</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav "/>
          <Navbar.Collapse className="brand" id="basic-navbar-nav">
            <NavLink style={{color: "white", marginRight: "10px"}} href="/itdays/">Home</NavLink>
            <NavLink style={{color: "white", marginRight: "10px"}} href="/itdays/games">Games</NavLink>
          </Navbar.Collapse>
      </Navbar>

    </>
  );
}

export default NavBar;  