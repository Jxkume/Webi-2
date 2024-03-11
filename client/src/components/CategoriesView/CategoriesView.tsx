import { useState, useEffect, useCallback } from 'react';
import './CategoriesView.css';
import { Container, Row, Col, Button, Form} from 'react-bootstrap';
import { getCookie } from 'typescript-cookie';

const CategoriesView = () => {
  const [categories, setCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = getCookie('token');

  const fetchCategories = useCallback(async () => {
    const categoriesQuery = `
      query {
        categories {
          name
        }
      }
    `;

    const request = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ query: categoriesQuery }),
    });

    const response = await request.json();
    console.log(response);
    setCategories(response.data.categories);
  }, [token])

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    fetchCategories();
    //console.log(categories);
  }, [token, fetchCategories]);

  const followButton = () => {

  }

  return (
    <Container fluid className='categories-background'>
      <Row className='justify-content-center'>
        <Col md={2} className='categories-col'>
          <h2>Kategoriat</h2>
            {
              categories.map((category: {name: string}) => (
                <div key={category.name} className='category-row'>
                  <p>{category.name}</p>
                </div>
              ))
            }
        </Col>
      </Row>
    </Container>
  );
}

export default CategoriesView;
