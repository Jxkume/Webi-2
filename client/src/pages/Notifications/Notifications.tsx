import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Notifications.css';
import checkToken from '../../Functions/GetUserFromToken';
import { getCookie } from 'typescript-cookie';
import { Link } from 'react-router-dom';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const token = getCookie('token');

  const removeNotification = async(id: string) => {
    const deleteMutation = `
      mutation {deleteNotification(id: "${id}") {
        id
        text
        publicationDate
      }}
    `;
    const request = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
      body: JSON.stringify({ query: deleteMutation }),
    });

    await request.json();
  }

  const fetchNotifications = useCallback(async () => {
    const tokenUser = await checkToken();

    const notificationsQuery = `
      query {notificationsByReceiver(receiverId: "${tokenUser.id}") {
        expire
        id
        publicationDate
        text
        link
      }}
    `;
    const request = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify({ query: notificationsQuery }),
    });

    const response = await request.json();
    setNotifications(response.data.notificationsByReceiver);
  }, [token]);


  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <Container fluid className="notifications-background">
      <Row className="justify-content-center">
        <Col md={6} className="notifications-col">
          <h1 className='header-title'>Ilmoitukset</h1>
          {[...notifications].reverse().map((notification: {id: string, text: string, publicationDate: string, link: string}) => (
            <div key={notification.id} className="notification">
              <p><Link to={`${notification.link}`}>{notification.text}</Link></p>
              <p className='notificationDate'>{notification.publicationDate}</p>
              <Button onClick={async() =>{
                await removeNotification(notification.id);
                fetchNotifications();
              }}>Merkitse luetuksi</Button>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default NotificationsPage;
