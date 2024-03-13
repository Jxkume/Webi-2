import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import './SearchResults.css';
import {Card, Col, Container, Row} from "react-bootstrap";

const SEARCH_REVIEWS = gql`
  query SearchReviews($searchTerm: String!) {
    searchReviews(searchTerm: $searchTerm) {
      id
      header
    }
  }
`;

const SEARCH_OFFERS = gql`
  query SearchOffers($searchTerm: String!) {
    searchOffers(searchTerm: $searchTerm) {
      id
      header
    }
  }
`;

const SEARCH_CATEGORIES = gql`
  query SearchCategories($searchTerm: String!) {
    searchCategories(searchTerm: $searchTerm) {
      id
      name
    }
  }
`;

const SearchResults = () => {
  const { searchTerm } = useParams();

  const { loading: loadingReviews, error: errorReviews, data: dataReviews } = useQuery(SEARCH_REVIEWS, {
    variables: { searchTerm },
  });

  const { loading: loadingOffers, error: errorOffers, data: dataOffers } = useQuery(SEARCH_OFFERS, {
    variables: { searchTerm },
  });

  const { loading: loadingCategories, error: errorCategories, data: dataCategories } = useQuery(SEARCH_CATEGORIES, {
    variables: { searchTerm },
  });



  if (loadingReviews || loadingOffers || loadingCategories ) return <p>Loading...</p>;
  if (errorReviews || errorOffers || errorCategories ) return <p>Error :</p>;

  return (
      <Container className="search-results">
        <Row className={"justify-content-center"}>
          <Col md={8}>
            <h3>Hakutulokset</h3>
            <hr/>

            <Card className="mb-4">
              <Card.Header>
                <h5>Arvostelut</h5>
              </Card.Header>
              <Card.Body>
                {dataReviews.searchReviews.map((review: any) => (
                    <Link to={`/nakymaArvostelu/${review.id}`} key={review.id} className="text-decoration-none">
                      <Card className="mb-2">
                        <Card.Body>{review.header}</Card.Body>
                      </Card>
                    </Link>
                ))}
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header>
                <h5>Tarjoukset</h5>
              </Card.Header>
              <Card.Body>
                {dataOffers.searchOffers.map((offer: any) => (
                    <Link to={`/tarjous/${offer.id}`} key={offer.id} className="text-decoration-none">
                      <Card className="mb-2">
                        <Card.Body>{offer.header}</Card.Body>
                      </Card>
                    </Link>
                ))}
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <h5>Kategoriat</h5>
              </Card.Header>
              <Card.Body>
                {dataCategories.searchCategories.map((category: any) => (
                    <Card className="mb-2" key={category.id}>
                      <Card.Body>{category.name}</Card.Body>
                    </Card>
                ))}
              </Card.Body>
            </Card>

          </Col>
        </Row>
      </Container>
  );
};

export default SearchResults;
