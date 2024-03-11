import React from 'react';
import './AboutUs.css';
import { Container, Row, Col } from 'react-bootstrap';
import { FaReact, FaNodeJs } from 'react-icons/fa';
import { SiMongodb, SiApollographql } from 'react-icons/si';

const AboutUs = () => {
    return (
        <Container className="content-page">
            <Row className="justify-content-center">
                <Col md={8}>
                    <h1 className="content-heading">Delightful Insights</h1>
                    <hr />
                    <div className="action-icons">
                        <FaReact />
                        <FaNodeJs />
                        <SiMongodb />
                        <SiApollographql />
                    </div>
                    <p className="content-text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam blandit arcu sed tortor commodo, vel aliquam nisl fermentum. Quisque at dignissim felis. Mauris cursus eget lacus dignissim semper. Vestibulum nec orci orci. Duis viverra egestas est, pellentesque luctus nibh imperdiet eu. Cras eget nisi orci. Integer volutpat aliquet augue, viverra varius metus cursus et. Aenean dui velit, ultrices eget venenatis ac, tempus quis lacus. Pellentesque semper quis quam nec facilisis. Nulla non ante a sapien facilisis dictum.
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default AboutUs;
