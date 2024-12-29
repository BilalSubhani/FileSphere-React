import React from 'react';
import { useNavigate } from 'react-router-dom';
import './pagenotfound.css';

const PageNotFound = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="page-not-found">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for does not exist.</p>
      <button className="go-home-btn" onClick={goHome}>
        Go to Home Page
      </button>
    </div>
  );
};

export default PageNotFound;
