import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      console.log(email, password);
    };
    return (
        <Container>
          <Row className="justify-content-center">
            <Col md={6} className="login-form-wrapper">
              <h2>Kirjaudu sisään</h2>
              <hr />
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Sähköposti</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Sähköposti"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
    
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Salasana</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Salasana"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    <Link to="/salasanaPalautus">Unohditko salasanan?</Link>
                  </Form.Text>
                </Form.Group>
    
                <Button variant="primary" type="submit">
                  Kirjaudu
                </Button>
              </Form>
              <div className="register-link">
                <p>Etkö vielä omista tiliä? <Link to="/rekisteroidy">Rekisteröidy</Link></p>
              </div>
            </Col>
            <Col md={6} className="login-image-wrapper">
            </Col>
          </Row>
        </Container>
      );
    };
    
    export default Login;