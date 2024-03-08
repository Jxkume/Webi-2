import React from 'react';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Notifications.css';
import checkToken from '../../Functions/GetUserFromToken';
import { getCookie } from 'typescript-cookie';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const token = getCookie('token');

  const fetchNotifications = async () => {
    const tokenUser = await checkToken();
    /* const notificationsQuery = `
      query {notificationsByReceiver($receiverId: ${tokenUser.id}) {
        expire
        id
        publicationDate
        text
      }}
    `; */

    const notificationsQuery = `
      query {notificationsByReceiver(receiverId: "${tokenUser.id}") {
        expire
        id
        publicationDate
        text
      }}
    `;
    const request = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify({ query: notificationsQuery }),
    });

    const response = await request.json();
    //console.log(response);
    setNotifications(response.data.notificationsByReceiver);
    console.log(notifications);
  };


  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Container fluid className="notifications-background">
      <Row className="justify-content-center">
        <Col md={6} className="notifications-col">
          <h1 className='header-title'>Ilmoitukset</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default NotificationsPage;
