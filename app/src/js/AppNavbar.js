import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

function AppNavbar() {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">Year in Pixels</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#features">Features</Nav.Link>
                <Nav.Link href="#pricing">Pricing</Nav.Link>
            </Nav>
        </Navbar>
    );
}

export default AppNavbar;