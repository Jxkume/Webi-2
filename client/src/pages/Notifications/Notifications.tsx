import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Notifications.css';
import checkToken from '../../Functions/GetUserFromToken';
import { getCookie } from 'typescript-cookie';

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

    const response = await request.json();
    console.log(response);
  }

  const fetchNotifications = useCallback(async () => {
    const tokenUser = await checkToken();

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
  }, []);


  useEffect(() => {
    fetchNotifications();
    //console.log(notifications);
  }, [fetchNotifications]);

  return (
    <Container fluid className="notifications-background">
      <Row className="justify-content-center">
        <Col md={6} className="notifications-col">
          <h1 className='header-title'>Ilmoitukset</h1>
          {notifications.map((notification: {id: string, text: string, publicationDate: string}) => (
            <div key={notification.id} className="notification">
              <p>{notification.text}</p>
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