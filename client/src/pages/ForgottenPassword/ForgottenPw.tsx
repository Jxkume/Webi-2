import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './ForgottenPw.css';

const ForgottenPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(email);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6} className="password-reset-form-wrapper">
          <h2>Unohdettu salasana</h2>
          <hr />
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="passwordResetEmail">
              <Form.Label>Sähköposti</Form.Label>
              <Form.Control
                type="email"
                placeholder="Sähköposti"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Lähetä linkki
            </Button>
          </Form>
        </Col>
        <Col md={6} className="password-reset-image-wrapper">
        </Col>
      </Row>
    </Container>
  );
};

export default ForgottenPassword;