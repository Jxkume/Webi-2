import { Form, Button } from 'react-bootstrap';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { getCookie } from 'typescript-cookie';
import './ReviewsNew.css';


const NewReview = () => {

    const [inputs, setInputs] = useState({
        reviewName: '',
        reviewRating: '',
        reviewDescription: '',
        reviewCategory: '',
        reviewFile: '',
    });

    //const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch('http://localhost:3000/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: '{categories {id name}}' }),
            });
            const responseData = await response.json();
            setCategories(responseData.data.categories);
        };
        fetchCategories();
    }, []);


    const [reviewCreatedResponse, setReviewCreatedResponse] = useState(null);

    const updateInput: any = (inputAttribute: any) => (event: any) => {
        setInputs({...inputs, [inputAttribute]: event.target.value});
    }



  const createReview = async (event: any) => {
    event.preventDefault();

    if (inputs.reviewName.trim() === '' || inputs.reviewRating.trim() === '' || inputs.reviewDescription.trim() === '' || inputs.reviewCategory.trim() === '' || inputs.reviewFile.trim() === '') {
        alert('Täytä kaikki kentät!');
        return;
    }

    const mutation = `
      mutation AddReview($input: InputReview!) {
        addReview(input: $input) {
            id
            author {
                username
                id
                email
            }
            category {
                name
            }
            header
            text
            filename
            publicationDate
            rating
          }
       }
     `;
        const variables = {
            input: {
                header: inputs.reviewName,
                rating: parseInt(inputs.reviewRating),
                text: inputs.reviewDescription,
                category: inputs.reviewCategory,
                filename: inputs.reviewFile
            }
        };

        const token = getCookie('token');

        const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

        },
        body: JSON.stringify({ query: mutation, variables }),
     });
        const responseData = await response.json();
        console.log(responseData);

        if (responseData.errors !== undefined) {
            setReviewCreatedResponse(responseData.errors[0].message);
            alert('Ainoastaan kirjautuneet käyttäjät voivat lisätä arvosteluja!')
        } else {
            sendNotifications(responseData.data.addReview.category.name);
            setReviewCreatedResponse(responseData);
            alert('Arvostelu luotu onnistuneesti!');
            window.location.href = '/arvostelut';
        }
  };

  const sendNotifications = async (categoryName: string) => {
    const category = inputs.reviewCategory;
    let userIds = [];
    const getUsersQuery = `
      query {usersByCategory(categoryId: "${category}") {
        id
      }}
    `;
    const getUsersRequest = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ query: getUsersQuery }),
    });
    const getUsersResponse = await getUsersRequest.json();
    console.log(getUsersResponse);
    userIds = getUsersResponse.data.usersByCategory.map((user: {id: string}) => user.id);

    const sendNotificationsMutation = `
      mutation {sendNotificationToManyUsers(userIds: "${userIds}", text: "Uusi arvostelu kategoriassa ${categoryName}!") {
        id
      }}
    `;
    const sendNotificationsRequest = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ query: sendNotificationsMutation }),
    });
    const sendNotificationsResponse = await sendNotificationsRequest.json();
    console.log(sendNotificationsResponse);
  }

  return (
    <div className="form-container">
        <Form onSubmit={createReview}>
        <Form.Group controlId="reviewName">
            <Form.Label>Tuotteen nimi</Form.Label>
            <Form.Control type="text" placeholder="Syötä tuotteen nimen" onChange={updateInput("reviewName")}/>
        </Form.Group>

        <Form.Group controlId="reviewCategory">
            <Form.Label>Kategoria</Form.Label>
            <Form.Control as="select" onChange={updateInput("reviewCategory")}>
                {categories.map((category: { id: string, name: string }) => (
                    <option value={category.id}>{category.name}</option>
                ))}
            </Form.Control>
        </Form.Group>

        <Form.Group controlId="reviewRating">
            <Form.Label>Arvosana</Form.Label>
            <Form.Control type="number" min="1" max="5" placeholder="Arvosana (1-5)" onChange={updateInput("reviewRating")} />
        </Form.Group>

        <Form.Group controlId="reviewDescription">
            <Form.Label>Kuvaus</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Syötä kuvaus" onChange={updateInput("reviewDescription")}/>
        </Form.Group>

        <Form.Group>
            <Form.Label>Lataa kuva </Form.Label>
            <Form.Control type="file" onChange={updateInput("reviewFile")}/>
        </Form.Group>

        <Button variant="primary" type="submit">
            Lähetä
        </Button>
        </Form>
    </div>
  );
}

export default NewReview;

