# FileSphere

FileSphere is a web application designed to manage and share documents seamlessly. Built with ReactJS for the frontend, Firebase for the backend and hosting, and Firestore as the database, it provides distinct functionalities for normal users and admin users.

## Features

### Normal Users:
- **Account Management**: Create a new account and manage your profile.
- **Document Viewing**: Access all documents uploaded by users.
- **Document Downloading**: Download documents in `.doc` format.
- **Document Uploading**: Upload your own documents.
- **Search and Filter**: Easily find documents using the search and filter features.
- **Profile Page**: View account details and manage all uploaded documents.

### Admin Users:
- **Admin Dashboard**: Access an exclusive dashboard for advanced management features.
- **User Management**: View all users, toggle admin status, and delete users.
- **Document Management**: View all documents, including details about who uploaded them and when, and delete documents.
- **Category Management**: Perform CRUD operations on document categories.

## Website Link
- [FileSphere](https://login-13d81.web.app/home)

## Issues

1. **Authentication**: Firebase authentication was not used for this project.
2. **Media File Uploads**: Due to the requirement of a paid Firestore version for media uploads, users can only add a document's `Title`, `Description`, and select a `Category` for uploading.

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.
- Firebase account with appropriate configurations.

### Cloning the Repository
```bash
git clone https://github.com/BilalSubhani/FileSphere-React
cd FileSphere-React
```

### Setting Up the Environment
1. Create a `.env` file in the root directory.
2. Add the following Firebase configuration details to your `.env` file:
    ```env
    REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
    ```

### Installing Dependencies
```bash
npm install
```

### Running the Application
```bash
npm start
```
The application will be available at `http://localhost:3000`.

## Deployment
FileSphere is hosted on Firebase Hosting. For deployment instructions:
1. Install Firebase CLI:
    ```bash
    npm install -g firebase-tools
    ```
2. Login to Firebase:
    ```bash
    firebase login
    ```
3. Deploy the application:
    ```bash
    firebase deploy
    ```

## Contact
For questions, suggestions, or support, please reach out:
- **Email**: bilalsubhani.025@gmail.com
- **GitHub**: [Bilal Subhani](https://github.com/BilalSubhani)

---

Feel free to contribute or report issues to improve FileSphere!
