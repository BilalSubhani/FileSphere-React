import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Importing AuthContext
import { useNavigate } from 'react-router-dom'; // For navigation
import { db } from '../../config/firebase'; // Import Firestore
import { collection, query, where, getDocs } from 'firebase/firestore'; // Firebase query methods
import './userprofile.css'; // Import the CSS file for styling

const UserProfile = () => {
  const { currentUser, logout } = useContext(AuthContext); // Accessing currentUser data and logout function from context
  const navigate = useNavigate(); // To navigate to the login page after logout
  const [documents, setDocuments] = useState([]); // State to store uploaded documents

  const handleLogout = () => {
    logout(); // Reset the currentUser state in the context
    navigate('/login'); // Navigate to login page after logout
  };

  // Navigate to Admin Dashboard if user is Admin
  const handleGoToDashboard = () => {
    navigate('/dashboard'); // Navigate to the Admin Dashboard
  };

  // Fetch documents from Firestore based on the logged-in user's name (uploadedBy field)
  const fetchDocuments = async () => {
    if (!currentUser) return;

    // Assuming Firestore collection is named 'documents' and each document has an 'uploadedBy' field
    const q = query(
      collection(db, 'documents'), // Firestore collection name
      where('uploadedBy', '==', currentUser.name) // Query where 'uploadedBy' matches the logged-in user's name
    );

    try {
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() // Extract document data
      }));
      setDocuments(docs); // Set the fetched documents to state
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/login'); // If not logged in, navigate to login
    } else {
      fetchDocuments(); // Fetch documents when user is logged in
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const defaultProfilePic = "https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg";

  // Navigate to document details page using document ID
  const handleViewDocument = (documentId) => {
    navigate(`/document-details/${documentId}`); // Navigate using document ID
  };

  return (
    <main>
      <section className="profile-section">
        <div className="profile-card">
          <h2>User Profile</h2>

          <div className="profile-container">
            {/* Left side: Profile Image */}
            <div className="profile-image">
              <img
                src={currentUser.profilePic || defaultProfilePic}  // Using default image if no profilePic
                alt="Profile Picture"
              />
            </div>

            {/* Right side: User Info */}
            <div className="user-info">
              <p><strong>Name:</strong> {currentUser.name || 'John Doe'}</p>
              <p><strong>Email:</strong> {currentUser.email || 'john.doe@example.com'}</p>
            </div>
          </div>

          {/* Show Dashboard button only if the user is an Admin */}
          <div className='btns'>
            {currentUser.isAdmin ? (
              <button className="dshb-btn" onClick={handleGoToDashboard}>
                Go to Dashboard
              </button>
            ) : null}

            <button className="lgt-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* Uploaded documents section */}
        <div className="uploaded-documents">
          <h3>Uploaded Documents</h3>
          {documents.length > 0 ? (
            <table className="document-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <tr key={document.id}>
                    <td>{document.title}</td>
                    <td>{document.description}</td>
                    <td>{document.category}</td>
                    <td>
                      <button 
                        className="view-btn" 
                        onClick={() => handleViewDocument(document.id)}> {/* Passing document ID */}
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No documents uploaded yet.</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default UserProfile;
