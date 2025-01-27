import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./documentdetails.css";

const DocumentDetail = () => {
  const { documentId } = useParams();
  const [document, setDocument] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const docRef = doc(db, "documents", documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDocument(docSnap.data());
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchDocument();
  }, [documentId]);

  if (!document) {
    return <p>Loading document details...</p>;
  }

  const handleDownload = () => {
    const documentTitle = document.title;
    const uploadDate = new Date(document.uploadedOn.seconds * 1000).toLocaleString();
    const documentDescription = document.description;
    
    const content = `
      <html>
        <body>
          <h1>${documentTitle}</h1>
          <p><strong>Uploaded on:</strong> ${uploadDate}</p>
          <p>${documentDescription}</p>
        </body>
      </html>
    `;

    if (typeof window !== 'undefined' && window.document) {
      const blob = new Blob([content], { type: 'application/msword' });

      if (window.document.createElement) {
        const link = window.document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${documentTitle}.doc`;
        link.click();
      } else {
        console.error('Unable to create download link.');
      }
    } else {
      console.error('Window or document object is not available.');
    }
  };

  return (
    <main>
      <section className="document-details-section">
        <h1>{document.title}</h1>
        <p className="upload-date">
          Uploaded on: {new Date(document.uploadedOn.seconds * 1000).toLocaleString()}
        </p>
        <p className="document-description">{document.description}</p>

        {/* Button to download the document as a .doc file */}
        <button className="download-btn" onClick={handleDownload}>
          Download Document
        </button>
      </section>
    </main>
  );
};

export default DocumentDetail;