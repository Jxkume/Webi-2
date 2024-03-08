import { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const NotificationsPage = () => {
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
