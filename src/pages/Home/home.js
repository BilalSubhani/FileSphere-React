import React from "react";
import "./home.css";

const Home = () => {
  return (
    <main>
      <div className="main-card">
        <section className="home-section">
          <h1>Welcome to FileSphere</h1>
          <p>Your one-stop solution for managing documents efficiently.</p>
          <img src="images/filesphere-favicon-color.png" alt="FileSphere Logo" />
          <br />

          <div className="search-container">
            <input
              type="text"
              placeholder="Search for documents..."
              className="search-bar"
            />
            <button className="search-btn">Search</button>
          </div>

          <div className="category-highlight">
            <h2>Document Categories</h2>
            <ul>
              <li>
                <div className="category-card">
                  <a href="#">Reports</a>
                </div>
              </li>
              <li>
                <div className="category-card">
                  <a href="#">Invoices</a>
                </div>
              </li>
              <li>
                <div className="category-card">
                  <a href="#">Proposals</a>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
