import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import './SearchResults.css';

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
    <div className="search-results">
      <div className="search-sectionA">
        <h2>Arvostelut</h2>
        {dataReviews.searchReviews.map((review: any) => (
          <Link to={`/nakymaArvostelu/${review.id}`} key={review.id}>
            <div className="search-item">
              <h3>{review.header}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="search-sectionT">
    <h2>Tarjoukset</h2>
    {dataOffers.searchOffers.map((offer: any) => (
      <Link to={`/tarjous/${offer.id}`} key={offer.id}>
        <div className="search-item" key={offer.id}>
          <h3>{offer.header}</h3>
        </div>
      </Link>
      ))}
    </div>

    <div className="search-sectionK">
      <h2>Kategoriat</h2>
      {dataCategories.searchCategories.map((category: any) => (
        <div className="search-item" key={category.id}>
          <h3>{category.name}</h3>
        </div>
      ))}
    </div>
</div>
  );
};

export default SearchResults;
