// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import './App.css';

// Components
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';

// Pages
import Home from './pages/Home/home';
import Document from './pages/Document/document';
import UserProfile from './pages/UserProfile/userprofile';
import UploadDocument from './pages/UploadDocument/uploaddocument';
import Dashbord from './pages/Dashboard/dashboard';
import Login from './pages/LoginPage/loginpage';
import DocumentDetail from './pages/DocumentDetails/documentdetails';
import PageNotFound from './pages/pagenotfound/pagenotfound';



const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/documents" element={<Document />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/upload" element={<UploadDocument />} />
          <Route path="/dashboard" element={<Dashbord />} />
          <Route path="/login" element={<Login />} />
          <Route path="/document-details/:documentId" element={<DocumentDetail />} /> {/* Updated route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
