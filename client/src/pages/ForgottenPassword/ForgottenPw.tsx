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
  <div className="fp-background">
    <div className="fp-overlay">
      <Container>
        <Row className="justify-content-center">
          <Col md={4} className="fp-form-col">
            <h2>Unohdettu salasana</h2>
            <hr />
            <Form className={"pw-form"} onSubmit={handleSubmit}>
              <Form.Group controlId="passwordResetEmail">
                <Form.Label>Sähköposti</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Sähköposti"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </Form.Group>

              <Button className={"btn-custom"} type="submit">
                Lähetä linkki
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  </div>
  );
};

export default ForgottenPassword;
