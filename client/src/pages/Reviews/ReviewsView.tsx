import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCookie } from 'typescript-cookie';
import {Container, Row, Col, Button, Form, Card, CardTitle, ListGroup} from 'react-bootstrap';
import './ReviewsView.css';
import { User } from '../../Types/User';

const ReviewView = () => {
    const { id } = useParams();
    const [review, setReview] = useState(null);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [author, setAuthor] = useState(null);


    const fetchReview = async () => {
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
                    query Review($id: ID!) {
                        review(id: $id) {
                            id
                            header
                            text
                            filename
                            publicationDate
                            rating
                            author {
                              username
                              id
                            }
                            category { id }
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
        setReview(responseData.data.review);
        setComments(responseData.data.review.comments);
        setAuthor(responseData.data.review.author);
    };

    useEffect(() => {
        fetchReview();
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
            fetchReview();
            sendNotification()
        } else {
            alert('Failed to create comment');
        }
    }

    const sendNotification = async () => {
      const authorId = (author as unknown as User).id;
      const notificationMutation = `
        mutation {addNotification(input: {
          receiver: "${authorId}",
          text: "Uusi kommentti arvosteluusi",
          link: "/nakymaArvostelu/${id}"}
          ){
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
      await request.json();
    };

    if (!review) {
        return <div>Loading...</div>;
    }

    return (
        <Container  className="container-review">
            <Row className="justify-content-center my-4">
                <Col>
                    <h2>Arvostelu</h2>
                    <Card>
                        <Card.Body>
                            <Card.Title>{(review as { header: string }).header}</Card.Title>
                            <Card.Text>
                                <p><b>Kuvaus:</b> {(review as { text: string }).text}</p>
                                <p><b>Arvosana:</b> {(review as { rating: number }).rating}</p>
                                <p><b>Tekijä:</b> {(review as { author: { username: string } }).author.username}</p>
                                <p><b>Kuva:</b> {(review as { filename: string }).filename.endsWith('.png') ? (review as {
                                    filename: string
                                }).filename : 'None'}</p>
                                <p><b>Julkaisupäivämäärä:</b> {(review as { publicationDate: string }).publicationDate}</p>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h3>Kommentit</h3>
                    {isLoggedIn && (
                        <Button className=" btn-custom" onClick={handleCommentButtonClick}>Kommentoi</Button>
                    )}
                    {showCommentForm && (
                        <Form onSubmit={handleCommentSubmit}>
                            <Form.Group controlId="comment">
                                <Form.Label>Kommentti:</Form.Label>
                                <Form.Control className="kommenttikent" as="textarea" rows={3} value={commentText}
                                              onChange={handleCommentChange}/>
                            </Form.Group>
                            <Button className={"btn-custom"} type="submit">
                                Lähetä
                            </Button>
                        </Form>
                    )}
                    <ListGroup className={"reviewbackground"}>
                        {comments.map((comment: { id: string, text: string, author: { username: string } }) => (
                            <ListGroup.Item>
                                <strong> {comment.author.username}</strong>
                                <p>{comment.text}</p>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default ReviewView;

