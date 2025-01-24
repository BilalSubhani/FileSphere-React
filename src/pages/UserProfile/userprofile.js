import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './userprofile.css';

const UserProfile = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const fetchDocuments = async () => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'documents'),
      where('uploadedBy', '==', currentUser.name)
    );

    try {
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      fetchDocuments();
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const defaultProfilePic = "https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg";

  const handleViewDocument = (documentId) => {
    navigate(`/document-details/${documentId}`); 
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
                src={currentUser.profilePic || defaultProfilePic}
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
