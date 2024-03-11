import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './NewOffer.css';
import {getCookie} from "typescript-cookie";

const NewOffer: React.FC = () => {

  const [input, setInput] = useState({
    productName: '',
    store: '',
    deletionDate: new Date(),
    additionalInfo: '',
  });

  const [offerResponse, setOfferResponse] = useState('');

  const createOffer = async (event: any) => {
    event.preventDefault();
    if (input.productName.trim() === '' || input.store.trim() === '') {
      alert('Täytä kaikki kentät!');
      return;
    }
    const mutation = `
      mutation CreateOffer($input: OfferInput!) {
        createOffer(input: $input) {
          author {
            username
          }
          deletionDate
          header
          text
          id
          publicationDate
        }
      }
    `;

    const variables = {
      input: {
        header: input.productName,
        text: input.store,
        deletionDate: input.deletionDate,
        //additionalInfo: input.additionalInfo,
      },
    };

    const token = getCookie('token');

    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({query: mutation, variables}),
    });
    const responseData = await response.json();
    console.log(responseData);

    if (responseData.errors !== undefined) {
      setOfferResponse(responseData.errors[0].message);
      alert('Ilmoituksen luonti epäonnistui');
    } else {
      //sendNotification();
      setOfferResponse(responseData);
      alert('Ilmoitus luotu!');
      window.location.href = '/tarjoukset';
    }
  };


  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Form onSubmit={createOffer}>
            <Form.Group className="mb-3" controlId="productName">
              <Form.Label>Tuotteen nimi ja valmistaja</Form.Label>
              <Form.Control
                type="text"
                placeholder={"Tuotteen nimi ja valmistaja"}
                value={input.productName}
                onChange={(e) => setInput({...input, productName: e.target.value})}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="store">
                  <Form.Label>Kauppa</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Kaupan nimi"
                    value={input.store}
                    onChange={(e) => setInput({...input, store: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="deletionDate">
                  <Form.Label>Ilmoituksen poistopäivä</Form.Label>
                  <DatePicker
                    selected={input.deletionDate}
                    onChange={(date: Date) => setInput({...input, deletionDate: date})}
                    dateFormat="dd.MM.yyyy"
                    minDate={new Date()}
                    placeholderText="Valitse päivä"
                    className="form-control"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit">
              Lähetä ilmoitus
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default NewOffer;
