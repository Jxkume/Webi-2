import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import './Offer.css';

// DB tyypit niiden haku kannasta idk
type Offer = {
  id: string;
  title: string;
  description: string;
};

type Comment = {
  id: string;
  username: string;
  content: string;
};

const Offer: React.FC = () => {
  const [offer, setOffer] = useState<Offer | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  // Lisää logiikka
  /*useEffect(() => {
    const fetchedOffer: Offer = {
      id: 'offer1',
      title: '80% ALE mehusta',
      description: 'Tosi hyvä tarjous käykää ostaa...',
    };
    setOffer(fetchedOffer);

    // Fetch comments for the offer
    const fetchedComments: Comment[] = [
      { id: 'comment1', username: 'käyttäjä2', content: 'TÄMÄ ON HUIJAUS ÄLKÄÄ OSTAKO TÄTÄ!!!!!!!!!!!!!!!!!!!1' },
    ];
    setComments(fetchedComments);
  }, []);*/

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h2>Tarjous</h2>
          <Card>
            <Card.Body>{offer?.description}</Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Kommentit</h3>
          <ListGroup>
            {comments.map((comment) => (
              <ListGroup.Item key={comment.id}>
                <strong>{comment.username}</strong>
                <p>{comment.content}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Offer;