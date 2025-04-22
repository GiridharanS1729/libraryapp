import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

const NavBar = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container className="d-flex justify-content-between">
                <Navbar.Brand as={Link} to="/" className="brand-logo">LibraryApp</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="w-100"                >
                    <div className="d-flex">
                        <Nav className="d-flex">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/add">Add Book</Nav.Link>
                        </Nav>
                        <div className="d-flex">
                            <SearchBar />
                        </div>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;