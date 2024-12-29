import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase"; // Import Firebase configuration
import { collection, getDocs } from "firebase/firestore";
import "./document.css"; // Import the CSS for this component

const Document = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [documentsPerPage] = useState(10); // Fixed number of documents per page

  const navigate = useNavigate();

  // Fetch documents from Firestore
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "documents"));
        const documentList = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setDocuments(documentList);
        setFilteredDocuments(documentList); // Initialize filtered documents

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(documentList.map((doc) => doc.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    fetchDocuments();
  }, []);

  // Handle category selection for filtering
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to page 1 after filtering
    filterDocuments(category, searchQuery);
  };

  // Handle search query input
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1); // Reset to page 1 after searching
    filterDocuments(selectedCategory, query);
  };

  // Filter documents based on category and search query
  const filterDocuments = (category, query) => {
    let filtered = documents;

    if (category !== "all") {
      filtered = filtered.filter(
        (doc) => doc.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (query) {
      filtered = filtered.filter((doc) =>
        doc.title.toLowerCase().includes(query)
      );
    }

    setFilteredDocuments(filtered);
  };

  // Pagination logic
  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = filteredDocuments.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );
  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Navigate to document details page
  const goToDocumentDetails = (documentId) => {
    navigate(`/document-details/${documentId}`);
  };

  return (
    <main className="DocumentBody">
      <section className="filter-section">
        <h1>Document Listings</h1>
        <div className="filters">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="upload-btn" onClick={() => navigate("/upload")}>
            Upload Document
          </button>
        </div>
      </section>

      <section className="document-list-section">
        {currentDocuments.length > 0 ? (
          currentDocuments.map((doc) => (
            <div
              className="document-card"
              key={doc.id}
              onClick={() => goToDocumentDetails(doc.id)}
            >
              <h2>{doc.title}</h2>
              <p className="upload-date">
                Uploaded on:{" "}
                {new Date(doc.uploadedOn.seconds * 1000).toLocaleString()}
              </p>
              <p className="document-description">{doc.description}</p>
            </div>
          ))
        ) : (
          <p>No documents found.</p>
        )}

        <div className="pagination">
          <button
            className="page-link"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="page-link"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
};

export default Document;
