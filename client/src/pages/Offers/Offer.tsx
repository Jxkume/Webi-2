import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
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
          query Offer($id: ID!) {
            offer(id: $id) {
              id
              header
              text
              author {
                username
                id
              }
              comments {
                id
                text
                author { username }
              }
            }
          }`,
        variables: {
          id
        }
      }),
    });
    const responseData = await response.json();
    setOffer(responseData.data.offer);
    setComments(responseData.data.offer.comments);
    setAuthor(responseData.data.offer.user);
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
        alert('Kommentti ei voi olla tyhjä');
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
        fetchOffer();
        sendNotification();
      } else {
        alert('Kommentin luominen epäonnistui');
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
    <Container>
      <Row className="my-4">
        <Col>
          <h2>Tarjous</h2>
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
              <button onClick={handleCommentButtonClick}>Kommentoi</button>
          )}
          {showCommentForm && (
              <form onSubmit={handleCommentSubmit}>
                    <textarea
                        value={commentText}
                        onChange={handleCommentChange}
                    />
                <button type="submit">Lähetä kommentti</button>
              </form>
          )}
          <ListGroup>
            {comments.map((comment: {id: string, text: string, author: {username: string}}) => (
              <ListGroup.Item key={comment.id}>
                <strong>{comment.author.username}</strong>
                <p>{comment.text}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Offer;
