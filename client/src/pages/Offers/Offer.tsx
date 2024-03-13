import React, { useState, useEffect } from 'react';
import {Container, Row, Col, Card, ListGroup, Form} from 'react-bootstrap';
import './Offer.css';
import { User } from '../../Types/User';
import {useParams} from "react-router-dom";
import {getCookie} from "typescript-cookie";


const Offer: React.FC = () => {
  const { id } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [offer, setOffer] = useState(null);
  const [comments, setComments] = useState([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [author, setAuthor] = useState(null);

  const fetchOffer = async () => {
    const token = getCookie('token');
    setIsLoggedIn(!!token);
    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: `
            query OfferById($offerByIdId: ID!) {
              offerById(id: $offerByIdId) {
                id
                header
                text
                author {
                  id
                  username
                }
                comments {
                  id
                  text
                  author { username }
            }
          }
        }`,
        variables: {
          offerByIdId: id
        }
      }),
    });
    const responseData = await response.json();
    console.log('Response data:', responseData);
    const fetchedOffer = responseData.data.offerById;

    if (fetchedOffer) {
      setOffer(fetchedOffer);
      console.log('Fetched offer:', fetchedOffer);
      console.log('Fetched comments:', fetchedOffer.comments);
      console.log(fetchedOffer.comments);
      setComments(fetchedOffer.comments);
      setAuthor(fetchedOffer.author);
    }
  };

    useEffect(() => {
        fetchOffer();
    }, [id]);

    const handleCommentButtonClick = () => {
      setShowCommentForm(!showCommentForm);
    }

    const handleCommentChange = (event: any) => {
      setCommentText(event.target.value);
    }

    const handleCommentSubmit = async (event: any) => {
      event.preventDefault();
      if (commentText.trim() === '') {
          alert('Kommentti ei voi olla tyhjä!');
          return;
      }
      const token = getCookie('token');
      const response = await fetch('http://localhost:3000/graphql', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
              query: `mutation { createComment(input: { text: "${commentText}", post: "${id}" }) { id } }`
          }),
      });
      const responseData = await response.json();
      if (responseData.data.createComment.id) {
          setCommentText('');
          setShowCommentForm(false);
          fetchOffer();
          sendNotification()
      } else {
          alert('Failed to create comment');
      }
  }

  const sendNotification = async () => {
      const authorId = (author as unknown as User).id;
    const notificationMutation = `
        mutation {addNotification(input: {receiver: "${authorId}", text: "Uusi kommentti arvosteluusi"}){
          id
        }}
      `;
    const request = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: notificationMutation }),
    });
    const response = await request.json();
    console.log(response);
  };

  return (
    <Container className={"offer"}>
      <Row className="my-4">
        <Col>
          <h2 >Tarjous</h2>
          <Card>
            <Card.Body>
              <Card.Title>{offer && (offer as { header: string }).header}</Card.Title>
              <Card.Text>{offer && (offer as {text: string}).text}</Card.Text>
              <Card.Subtitle className="mb-2 text-muted">{offer && (offer as {author: {username: string}}).author.username}</Card.Subtitle>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Kommentit</h3>
          {isLoggedIn && (
              <button className={"btn-custom"} onClick={handleCommentButtonClick}>Kommentoi</button>
          )}
          {showCommentForm && (
              <Form onSubmit={handleCommentSubmit}>
                <Form.Label>Kommentti:</Form.Label>
                    <Form.Control as="textarea" rows={3} value={commentText} onChange={handleCommentChange} />

                <button className={"btn-custom"} type="submit">Lähetä</button>
              </Form>
          )}
            <ListGroup>
                {comments.length > 0 ? (
                    comments.map((comment: {id: string, text: string, author: {username: string}}) => {
                        console.log('Rendering comment:', comment);
                        return (
                            <ListGroup.Item key={comment.id}>
                                <strong>{comment.author.username}</strong>
                                <p>{comment.text}</p>
                            </ListGroup.Item>
                        );
                    })
                ) : (
                    <p>Ei vielä kommentteja</p>
                )}
            </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Offer;
