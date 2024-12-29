import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src="images/Logo-No-BG.png" alt="Logo" />
        </Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/" className="btn">
            <i className="fas fa-home"></i> Home
          </Link>
        </li>
        <li>
          <Link to="/documents" className="btn">
            <i className="fas fa-folder"></i> Documents Listing
          </Link>
        </li>
        <li>
          <Link to="/login" className="btn">
            <i className="fas fa-user"></i> Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
