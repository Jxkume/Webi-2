import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCookie } from 'typescript-cookie';
import { Container, Row, Col, Button, Form} from 'react-bootstrap';
import './ReviewsView.css';

const ReviewView = () => {
    const { id } = useParams();
    const [review, setReview] = useState(null);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');

    const fetchReview = async () => {
        const token = getCookie('token'); 
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
                            author { username } 
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
        } else {
            alert('Failed to create comment');
        }
    }


    if (!review) {
        return <div>Loading...</div>;
    }

    return (
        <Container fluid>
            <Row className="justify-content-center">
                <Col md={6} className="review-detail-container">
                    <h1>{(review as { header: string }).header}</h1>
                    <p>Kuvaus: {(review as { text: string }).text}</p>
                    <p>Arvosana: {(review as { rating: number }).rating}</p>
                    <p>Tekijä: {(review as { author: { username: string } }).author.username}</p>
                    <p>Kuva: {(review as { filename: string }).filename.endsWith('.png') ? (review as { filename: string }).filename : 'None'}</p>
                    <p>Julkaisupäivämäärä: {(review as { publicationDate: string }).publicationDate}</p>
                    <Button variant="primary" className="mt-3" onClick={handleCommentButtonClick}>Uusi kommentti</Button>
                    {showCommentForm && (
                        <Form onSubmit={handleCommentSubmit}>
                            <Form.Group controlId="comment">
                                <Form.Label>Kommentti</Form.Label>
                                <Form.Control className="kommenttikent" as="textarea" rows={3} value={commentText} onChange={handleCommentChange} />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Lähetä
                            </Button>
                        </Form>
                    )}
                    <h1 className="mt-5">Kommentit</h1>
                    {comments.map((comment: { id: string, text: string, author: { username: string } }) => (
                        <div key={comment.id} className='comment'>
                            <p><strong> {comment.author.username}</strong></p>
                            <hr />
                            <p>{comment.text}</p>
                        </div>
                    ))}
                </Col>
            </Row>
        </Container>
    );
};

export default ReviewView;

