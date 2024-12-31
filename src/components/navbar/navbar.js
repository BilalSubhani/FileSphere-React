import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Correct import of AuthContext
import "./navbar.css";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext); // Access currentUser and logout from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Use logout method from context
    navigate("/login"); // Redirect to login after logout
  };

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
        {currentUser ? ( // Check for currentUser instead of user
          <>
            <li>
              <Link to="/userprofile" className="btn">
                <i className="fas fa-user"></i> Profile
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="btn logout-btn">
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login" className="btn">
              <i className="fas fa-sign-in-alt"></i> Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
