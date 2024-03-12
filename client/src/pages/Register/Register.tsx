import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import './Register.css';

const RegisterPage = () => {

  const [inputs, setInputs] = useState({
    email: '',
    username: '',
    password: '',

  });

  const [userCreatedResponse, setUserCreatedResponse] = useState(null);

  const updateInput: any = (inputAttribute: any) => (event: any) => {
    setInputs({...inputs, [inputAttribute]: event.target.value});
  }

  const createAccount = async (event: any) => {
    if (inputs.password.length < 8) {
      alert('Salasanan minimipituus on 8 merkkiä');
      return;
    }
    event.preventDefault();
      const mutation =
    `
      mutation {
        register(user: {
          password: "${inputs.password}"
          username: "${inputs.username}"
          email: "${inputs.email}"
        }) {
          message
          user {
            email
            username
            id
          }
        }
      }
    `;
    // Tehdään myöhemmin fetchistä muuttujan azuren takia!!!!
    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: mutation }),
    });
    const responseData = await response.json();
    if (responseData.errors !== undefined) {
      setUserCreatedResponse(responseData.errors[0].message);
    } else {
      setUserCreatedResponse(responseData);
      alert('Käyttäjä luotu onnistuneesti!');
      window.location.href = '/kirjaudu';

    }
  }
    return (
      <Container fluid className="register-background">
        <Row className="justify-content-center">
          <Col md={6} className="register-form-col">
            <Form
            className="register-form"
            onSubmit={createAccount}
            >
              <h2>Rekisteröidy</h2>
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Käyttäjänimi</Form.Label>
                <Form.Control
                type="text"
                placeholder="Käyttäjänimi"
                onChange={updateInput("username")}/>
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Label>Sähköposti</Form.Label>
                <Form.Control
                type="email"
                placeholder="Sähköposti"
                onChange={updateInput("email")} />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Salasana</Form.Label>
                <Form.Control
                type="password"
                placeholder="Salasana"
                onChange={updateInput("password")} />
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


export default RegisterPage;
