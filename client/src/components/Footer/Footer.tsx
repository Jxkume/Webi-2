import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('.footer');
      if (window.scrollY > 100) { 
        footer?.classList.add('show');
      } else {
        footer?.classList.remove('show');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className="footer">
      <Container>
        <span>© 2024 Vera Finogenova, Jhon Rastrojo López & Korpi Tolonen</span>
      </Container>
    </footer>
  );
};

export default Footer;