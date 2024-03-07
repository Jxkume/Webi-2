import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './NewOfferPage.css'; // Make sure to create a corresponding CSS file

const NewOffer: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [store, setStore] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [deletionDate, setDeletionDate] = useState<Date | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const offerData = {
      productName,
      store,
      additionalInfo,
      deletionDate,
    };
    console.log(offerData);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="productName">
              <Form.Label>Tuotteen nimi ja valmistaja</Form.Label>
              <Form.Control
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="store">
                  <Form.Label>Kauppa</Form.Label>
                  <Form.Control
                    type="text"
                    value={store}
                    onChange={(e) => setStore(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="deletionDate">
                  <Form.Label>Ilmoituksen poistopäivä</Form.Label>
                  <DatePicker
                    selected={deletionDate}
                    onChange={(date: Date) => setDeletionDate(date)}
                    dateFormat="dd.MM.yyyy"
                    minDate={new Date()}
                    placeholderText="Valitse päivä"
                    className="form-control"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="additionalInfo">
              <Form.Label>Lisätietoja</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </Form.Group>

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