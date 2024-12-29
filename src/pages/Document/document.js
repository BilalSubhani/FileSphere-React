import React from "react";
import { useNavigate } from "react-router-dom";
import "./document.css"; // Import the CSS for this component

const Document = () => {
  const navigate = useNavigate();

  // Function to navigate to the upload page
  const goToUploadDocument = () => {
    navigate("/upload"); // Redirect to the upload document page
  };

  // Function to navigate to the document details page
  const goToDocumentDetails = () => {
    navigate("/document-details"); // Redirect to the document details page
  };

  return (
    <main>
      <section className="filter-section">
        <h1>Document Listings</h1>
        <div className="filters">
          <select>
            <option value="all">All Categories</option>
            <option value="business">Business</option>
            <option value="legal">Legal</option>
            <option value="technical">Technical</option>
            <option value="research">Research</option>
          </select>
          <input type="text" placeholder="Search by title..." />
          <button>Filter</button>
          <button className="upload-btn" onClick={goToUploadDocument}>
            Upload Document
          </button>
        </div>
      </section>

      <section className="document-list-section">
        {/* Document 1 */}
        <div className="document-card" onClick={goToDocumentDetails}>
          <h2>Document Title 1</h2>
          <p className="upload-date">Uploaded on: January 12, 2024</p>
          <p className="document-description">
            A brief description of Document Title 1 that provides an overview of its contents.
          </p>
        </div>

        {/* Document 2 */}
        <div className="document-card" onClick={goToDocumentDetails}>
          <h2>Document Title 2</h2>
          <p className="upload-date">Uploaded on: February 5, 2024</p>
          <p className="document-description">
            A brief description of Document Title 2 that provides an overview of its contents.
          </p>
        </div>

        {/* Add more document cards as needed */}

        <div className="pagination">
          <a href="#" className="page-link">
            Previous
          </a>
          <a href="#" className="page-link">
            1
          </a>
          <a href="#" className="page-link">
            Next
          </a>
        </div>
      </section>
    </main>
  );
};

export default Document;
