// src/UserProfile.js
import React from 'react';
import './userprofile.css'; // Import the CSS file for styling

const UserProfile = () => {
  return (
    <main>
      <section className="profile-section">
        <div className="profile-card">
          <h2>User Profile</h2>

          <div className="profile-container">
            {/* Left side: Profile Image */}
            <div className="profile-image">
              <img
                src="/Images/filesphere-favicon-color.png"
                alt="Profile Picture"
              />
            </div>

            {/* Right side: User Info and Preferences */}
            <div className="user-info">
              <p><strong>Name:</strong> John Doe</p>
              <p><strong>Email:</strong> john.doe@example.com</p>
              <p><strong>Preferences:</strong> Receive document notifications via email</p>
              <button className="edit-btn">Edit Preferences</button>
            </div>
          </div>
        </div>

        <div className="uploaded-documents">
          <h3>Uploaded Documents</h3>
          <ul className="document-list">
            <li>
              <div className="document-item">
                <h4>Document 1</h4>
                <p>Uploaded on: January 10, 2024</p>
                <a href="#" className="download-link">Download</a>
              </div>
            </li>
            <li>
              <div className="document-item">
                <h4>Document 2</h4>
                <p>Uploaded on: January 12, 2024</p>
                <a href="#" className="download-link">Download</a>
              </div>
            </li>
            {/* Add more documents as needed */}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default UserProfile;
