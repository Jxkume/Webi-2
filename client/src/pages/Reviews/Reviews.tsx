import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { getCookie } from 'typescript-cookie';
import CategoriesView from '../../components/CategoriesView/CategoriesView';
import './Reviews.css';
import { set } from 'mobx';

const ReviewsPage = () => {

    const [reviews, setReviews] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            const token = getCookie('token');
            setIsLoggedIn(!!token);
            const response = await fetch('http://localhost:3000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ${token}'
                },
                body: JSON.stringify({ query: `{ reviews { id header text rating author { username } } }` }),
            });
            const responseData = await response.json();
            setReviews(responseData.data.reviews);
        };
        fetchReviews();
    }, []);


    return (
      <div>
        <Container fluid className="reviews-background">
            <Row className="justify-content-center">
                <Col md={6} className="reviews-col">
                    <h2 className='header-title'>Arvostelut</h2>
                    <hr />
                    {isLoggedIn && (
                        <Button className="newreviewbutton btn-custom" onClick={() => window.location.href = '/uusiArvostelu'}>
                            Lisää uusi arvostelu!
                        </Button>
                    )}
                    {[...reviews].reverse().map((review: { id: string, header: string, text: string, rating: number, author: { username: string } }) => (
                        <div key={review.id} className="review-box">
                            <h3>{review.header}</h3>
                            <p>Kuvaus: {review.text}</p>
                            <p>Arvosana: {review.rating}</p>
                            <p>Tekijä: {review.author.username}</p>
                            <Link to={`/nakymaArvostelu/${review.id}`}>
                                <Button className={"btn-custom"}>Katso arvostelu</Button>
                            </Link>
                        </div>

                    ))}
                </Col>
              <Col md={2} className="categories-col">
                <CategoriesView />
              </Col>
            </Row>
        </Container>
      </div>
    );
};


export default ReviewsPage;
