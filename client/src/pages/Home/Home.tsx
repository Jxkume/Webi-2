import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import './Home.css';
import HeroTitleImage from './hero-title.png';
import { getCookie} from "typescript-cookie";

const Home = () => {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const isLoggedin = !!getCookie('token');

  const handleButtonClick = () => {
    if (isLoggedin) {
      navigate('/uusiArvostelu');
    } else  {
      navigate('/rekisteroidy');
    }
  }

  const handleSearchInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchInput(event.target.value);
  }

  const handleSearchClick = () => {
    navigate(`/haku/${searchInput}`);
  }

  return (
    <div className="hero-section">
      <div className="overlay">
        <Container className="text-center">
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6} className="text-center">
              <img src={HeroTitleImage} alt="Delightful Insights" className="logo-image mb-3" />
            </Col>
          </Row>

          <Row className="justify-content-center mb-4">
            <Col xs={12} md={8} lg={6}>
              <Form className="d-flex justify-content-center">
                <div className="d-flex">
                  <Form.Control type="text" placeholder="Hae tuotetta..." className="me-2 search-input" value={searchInput} onChange={handleSearchInputChange} />
                  <Button variant="primary" className="btn-custom" onClick={handleSearchClick}>Hae</Button>
                </div>
              </Form>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6} className="text-center">
              <Button className="btn-custom mt-3" onClick={handleButtonClick}>{isLoggedin ? 'Kirjoita arvostelu!' : 'Rekisteröidy nyt!'}</Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;
