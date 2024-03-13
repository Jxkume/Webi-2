import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Login.css';
import { setCookie } from 'typescript-cookie'

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const loginMutation = `
      mutation {login(credentials:{email: "${email}", password: "${password}"})
      {
        message
        token
        user {
          email
          username
          id
        }
      }}
      `;

      const request = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: loginMutation }),
      });
      const response = await request.json();

      if (response.errors !== undefined) {
        alert('Väärä sähköposti tai salasana!');
      } else {
        setCookie('token', response.data.login.token, { expires: 1 });
        setCookie('userID', response.data.login.user.id, { expires: 1 });
        alert('Kirjautuminen onnistui!');
        window.location.href = '/';
      }
    };
    return (
        <div className="login-background">
          <div className={"login-overlay"}>
            <Container>
              <Row className="justify-content-center">
                <Col md={4} className="login-form-col">
                  <Form className={"login-form"} onSubmit={handleLogin}>
                    <h2>Kirjaudu sisään</h2>
                    <hr/>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>Sähköposti</Form.Label>
                      <Form.Control
                          type="email"
                          placeholder="Sähköposti"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>Salasana</Form.Label>
                      <Form.Control
                          type="password"
                          placeholder="Salasana"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                      <Form.Text className="text-muted">
                        <Link className={"login-link"} to="/salasanaPalautus">Unohditko salasanan?</Link>
                      </Form.Text>
                    </Form.Group>

                    <Button className={"btn-custom"} type="submit">
                      Kirjaudu
                    </Button>
                  </Form>
                  <div className="register-link">
                  <p>Etkö vielä omista tiliä? <Link className={"login-link"} to="/rekisteroidy">Rekisteröidy</Link></p>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      );
    };

    export default Login;
