import React from "react";
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Header.css';
import Logo from '../../logo.svg';

const Header = () => {
    return (
      <Navbar expand="lg" className="header">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src={Logo} alt="Logo" className="logo" />
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to={"/arvostelut"}>Arvostelut</Nav.Link>
            <Nav.Link as={Link} to={"/tarjoukset"}>Tarjoukset</Nav.Link>
            <Nav.Link as={Link} to={"/profiili"}>Profiili</Nav.Link>
            <Nav.Link as={Link} to={"/meista"}>Meistä</Nav.Link>
            <Nav.Link as={Link} to={"/kirjaudu"}>Kirjaudu</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to={"/rekisteroidy"}>Rekisteröidy</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    );
  };
  
  export default Header;