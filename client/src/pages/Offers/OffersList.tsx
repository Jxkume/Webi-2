import React, {useEffect} from 'react';
import {Container, Row, Col, Card, ListGroup, Button} from 'react-bootstrap';
import './OffersList.css';
import { Link } from 'react-router-dom';
import {getCookie} from "typescript-cookie";

const OffersList = () => {

  const [offers, setOffers] = React.useState([]);
  //const popular = [
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      const token = getCookie('token');
      setIsLoggedIn(!!token);

      try {
      console.log('Request details:', {
        url: 'http://localhost:3000/graphql',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({query: `{ offers { id header user } }`}),
      });

      const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${token}'
        },
        body: JSON.stringify({query: `
        query{offers {
            id
            header
            text
            author {
              username
            }
          }}`
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (!responseData.data) {
        console.log('Server response:', responseData);
        throw new Error('Server response does not include data');
      }
      setOffers(responseData.data.offers);
    } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };
    fetchOffers();
  },[]);

  // Testilista suosituista tarjouksista
  const popular = [
    'HUKKA-ALE', '100% sipsit', '80% mehut', '20% makeisia', '5% karamellit', 'POISTOMYYNTI',
  ];

  return (
    <Container className={"offerlist"}>
      <Row className="my-4">
        <Col xs={12} md={8}>
          <h2>Tarjoukset</h2>
          <hr />
          {offers.map((offer: { id: string, header: string, author: {username: string} }) => (
            <Card key={offer.id} className="my-3">
              <Card.Body>
                <Card.Title>{offer.header}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{offer.author.username}</Card.Subtitle>
                <Link to={`/tarjous/${offer.id}`} className={"link"}>Lue tarjous →</Link>
              </Card.Body>
            </Card>
          ))}
        </Col>
        <Col xs={12} md={4}>
          {isLoggedIn && (
              <Button className={"btn-custom"} onClick={() => window.location.href = '/uusitarjous'}>
                Lisää tarjous
              </Button>
          )}
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
