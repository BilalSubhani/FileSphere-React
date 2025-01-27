import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";
import "./document.css";

const Document = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [documentsPerPage] = useState(5);

  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "documents"));
        const documentList = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setDocuments(documentList);
        setFilteredDocuments(documentList);

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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    filterDocuments(category, searchQuery);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1);
    filterDocuments(selectedCategory, query);
  };

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
