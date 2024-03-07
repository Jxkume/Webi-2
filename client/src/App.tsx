import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Home, Register, Login, ForgottenPassword, Reviews, NewReview, ViewReview} from './pages';

function App() {
  return (
    <div className="App">
        <Router>
        <Header />
          <Routes>
            <Route path="/arvostelut" element={<Reviews/>}></Route>
            <Route path="/tarjoukset"></Route>
            <Route path="/profiili"></Route>
            <Route path="/meista"></Route>
            <Route path="/kirjaudu" element={<Login/>}></Route>
            <Route path="/rekisteroidy" element={<Register/>}></Route>
            <Route path="/salasanaPalautus" element={<ForgottenPassword/>}></Route>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/uusiArvostelu" element={<NewReview/>}></Route>
            <Route path="/nakymaArvostelu/:id" element={<ViewReview/>}></Route>
          </Routes>
        </Router>
      <Footer />
    </div>
  );
}

export default App;