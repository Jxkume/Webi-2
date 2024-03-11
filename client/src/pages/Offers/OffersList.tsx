import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import './OffersList.css'; 
import { Link } from 'react-router-dom';

const OffersList: React.FC = () => {
  // Testilista tarjouksista
  const offers = [
    { id: 1, title: '80% ALE mehusta', user: 'käyttäjä2' },
    { id: 2, title: '5% ALE taffel sipsit', user: 'käyttäjä4' },
    { id: 3, title: 'HUKKA-ALE vihanneksia', user: 'käyttäjä2' },
  ];

  // Testilista suosituista tarjouksista
  const popular = [
    'HUKKA-ALE', '100% sipsit', '80% mehut', '20% makeisia', '5% karamellit', 'POISTOMYYNTI',
  ];

  return (
    <Container>
      <Row className="my-4">
        <Col xs={12} md={8}>
          <h2>Tarjoukset</h2>
          <hr />
          {offers.map((offer) => (
            <Card key={offer.id} className="my-3">
              <Card.Body>
                <Card.Title>{offer.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{offer.user}</Card.Subtitle>
                <Link to={"/tarjous"}>Lue tarjous →</Link>
              </Card.Body>
            </Card>
          ))}
        </Col>
        <Col xs={12} md={4}>
          <Card className="popular-card">
            <Card.Header>Suositut</Card.Header>
            <ListGroup variant="flush">
              {popular.map((popular, idx) => (
                <ListGroup.Item key={idx} action>
                  {popular}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OffersList;
