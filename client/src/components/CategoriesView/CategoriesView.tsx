import { useState, useEffect, useCallback } from 'react';
import './CategoriesView.css';
import { Container, Row, Col, Button, Form} from 'react-bootstrap';
import { getCookie } from 'typescript-cookie';
import { getUserId } from '../../Functions/GetUserFromToken';

const CategoriesView = () => {
  const [categories, setCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categoriesByUser, setCategoriesByUser] = useState([]);
  const token = getCookie('token');
  //const [userId, setUserId] = useState('');

  const fetchCategories = useCallback(async () => {
    const categoriesQuery = `
      query {
        categories {
          name
          _id
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

  const fetchCategoriesByUser = useCallback(async() => {
    const userId = await getUserId();
    const categoriesByUserQuery = `
      query {
        categoriesByUser(userId: "${userId}") {
          name
          _id
        }
      }
    `;

    const request = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ query: categoriesByUserQuery }),
    });
    const response = await request.json();
    console.log(response);
    setCategoriesByUser(response.data.categoriesByUser);
  }, [token])

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchCategoriesByUser();
    } else {
      setIsLoggedIn(false);
    }
    fetchCategories();
    //console.log(categories);
  }, [token, fetchCategories, fetchCategoriesByUser]);

  const addCategoryToUser = async (categoryId: string) => {
    const addCategoryMutation = `
      mutation {
        addCategoryToUser(categoryId: "${categoryId}") {
          username
          id
        }
      }
    `;
    const request = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ query: addCategoryMutation }),
    });
    const response = await request.json();
    console.log(response);
    fetchCategoriesByUser();
  }

  const deleteCategoryFromUser = async (categoryId: string) => {
    const deleteCategoryMutation = `
      mutation {
        removeCategoryFromUser(categoryId: "${categoryId}") {
          username
          id
        }
      }
    `;
    const request = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ query: deleteCategoryMutation }),
    });
    const response = await request.json();
    console.log(response);
    fetchCategoriesByUser();
  }

  const followButton = (categoryname: string, categoryid: string) => {
    if (categoriesByUser.find((category: {name: string, _id: string}) => category.name === categoryname)) {
      return (
        <Button onClick={
          async () => {
            deleteCategoryFromUser(categoryid)
          }
        } className='followButton'>Lopeta seuraaminen</Button>
      )
    } else {
      return (
        <Button onClick={
          async () => {
            addCategoryToUser(categoryid)
          }
        } className='followButton'>Seuraa</Button>
      )
    }
  }

  return (
    <Container fluid className='categories-background'>
      <Row className='justify-content-center'>
        <Col md={3} className='categories-col'>
          <h2 className='categories-header'>Kategoriat</h2>
            {
              categories.map((category: {name: string, _id: string}) => (
                <div key={category.name} className='category-row'>
                  {category.name} {followButton(category.name, category._id)}
                </div>
              ))
            }
        </Col>
      </Row>
    </Container>
  );
}

export default CategoriesView;
