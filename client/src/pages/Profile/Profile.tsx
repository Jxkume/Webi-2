import React from "react";
import { observer } from "mobx-react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Profile.css';
import { useState, useEffect } from "react";
import { getCookie } from "typescript-cookie";
import { get } from "http";
import { User, UserInput } from "../../Types/User";
import userStore from "../../Store/UserStore";
import bcrypt from 'bcryptjs';

const Profile = observer(() => {
  const [isEditing, setIsEditing] = useState(false);
  let {init, user, updateUser, deleteUser} = userStore;
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(user.username);

  React.useEffect(() => {
    init();
  }, [init]);

  const renderProfileEdit = () => (
    <Container>
      <Row className="justify-content-center">
        <Col md={6} className="profile-form-wrapper">
          <Form className="edit-profile-form">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Sähköposti</Form.Label>
              <Form.Control
                type="email"
                placeholder="Sähköposti"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Käyttäjänimi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Käyttäjänimi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );

  const renderProfile = () => (
    <Container>
      <Row className="justify-content-center">
      <p><b>Käyttäjänimi:</b> {user.username}</p>
        <p><b>Sähköposti:</b> {user.email}</p>
      </Row>
    </Container>
  );

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6} className="profile-wrapper">
          <div className="profile-info">
            <h2>Profiili</h2>
            <hr />
            {isEditing ? renderProfileEdit() : renderProfile()}
          </div>
          <div className="profile-action">
            {isEditing && (
              <div>
                <Button
                  variant="outlined-primary"
                  className="profileButton"
                  onClick={async () => {
                    const encryptedPassword = await bcrypt.hash(password, 10);
                    console.log(username, email, encryptedPassword);
                    await updateUser({username: username, email: email, password: encryptedPassword});
                    setIsEditing(false);
                  }}>
                    Tallenna
                </Button>
                <Button variant="outlined-secondary" className="profileButton" onClick={() => setIsEditing(false)}>
                  Peruuta
                </Button>
              </div>
            )}
            {!isEditing && (
              <div>
                <Button variant="outlined-primary" className="profileButton" onClick={() => setIsEditing(true)}>
                  Muokkaa
                </Button>
                <Button variant="outlined-primary" className="profileButton" onClick={async () => {
                  await deleteUser();
                  setIsEditing(true)}}>
                  Poista käyttäjä
                </Button>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
});

export default Profile;
