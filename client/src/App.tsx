import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import SearchResults from './components/Header/SearchResults';
import { Home, Register, Login, ForgottenPassword, Reviews, NewReview, ViewReview, Profile, Notifications} from './pages';

function App() {
  return (
    <div className="App"> 
        <Router>
        <Header />
          <Routes>
            <Route path="/arvostelut" element={<Reviews/>}></Route>
            <Route path="/tarjoukset"></Route>
            <Route path="/profiili" element={<Profile/>}></Route>
            <Route path="/meista"></Route>
            <Route path="/kirjaudu" element={<Login/>}></Route>
            <Route path="/rekisteroidy" element={<Register/>}></Route>
            <Route path="/salasanaPalautus" element={<ForgottenPassword/>}></Route>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/uusiArvostelu" element={<NewReview/>}></Route>
            <Route path="/nakymaArvostelu/:id" element={<ViewReview/>}></Route>
            <Route path="/ilmoitukset" element={<Notifications/>}></Route>
            <Route path="/haku/:searchTerm" element={<SearchResults />} />
          </Routes>
        </Router>
      <Footer />
    </div>
  );
}

export default App;
