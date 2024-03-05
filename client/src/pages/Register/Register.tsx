import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Register.css';

const Register = () => {
    return (
        <Container fluid className="register-background">
          <Row className="justify-content-center">
            <Col md={6} className="register-form-col">
              <Form className="register-form">
                <h2>Rekisteröidy</h2>
                <Form.Group controlId="formBasicUsername">
                  <Form.Label>Käyttäjänimi</Form.Label>
                  <Form.Control type="text" placeholder="Käyttäjänimi" />
                </Form.Group>
    
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Sähköposti</Form.Label>
                  <Form.Control type="email" placeholder="Sähköposti" />
                </Form.Group>
    
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Salasana</Form.Label>
                  <Form.Control type="password" placeholder="Salasana" />
                </Form.Group>
    
                <Button variant="primary" type="submit">
                  Rekisteröidy
                </Button>
    
                <div className="login-link">
                  Löytyykö sinulta jo tili? <br/><Link to="/kirjaudu">Kirjaudu sisään</Link>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      );
};

export default Register;