import React, { useState, useEffect } from 'react';
import './dashboard.css';
import { db } from '../../config/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, increment } from 'firebase/firestore';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('allUsers');
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editedCategoryName, setEditedCategoryName] = useState('');

    // Fetch users from Firestore
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const userList = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setUsers(userList);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    // Fetch categories from Firestore
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'categories'));
                const categoryList = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setCategories(categoryList);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch documents from Firestore
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'documents'));
                const documentList = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setDocuments(documentList);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };
        fetchDocuments();
    }, []);

    // Handle deleting a document
    // Handle deleting a document
    const handleDeleteDocument = async (documentId, categoryName) => {
        try {
            const confirmDelete = window.confirm(
                'Are you sure you want to delete this document? This will also decrement the document count for the associated category.'
            );
            if (confirmDelete) {
                // Ensure categoryName is valid
                if (!categoryName) {
                    console.error('Error: Category name is undefined or invalid.');
                    return;
                }
    
                // Find the category associated with the document
                const category = categories.find((cat) => cat.name === categoryName);
                if (category) {
                    // Check if the document count is already 0
                    if (category.documentCount > 0) {
                        // Decrement the document count for the category
                        const categoryRef = doc(db, 'categories', category.id);
                        await updateDoc(categoryRef, {
                            documentCount: increment(-1), // Decrement the count
                        });
                    } else {
                        console.log('Document count is already 0, no need to decrement.');
                    }
                } else {
                    console.warn(`Category with name "${categoryName}" not found.`);
                }
    
                // Delete the document from Firestore
                const docRef = doc(db, 'documents', documentId);
                await deleteDoc(docRef);
    
                // Update the documents state to remove the deleted document
                const updatedDocuments = documents.filter(
                    (document) => document.id !== documentId
                );
                setDocuments(updatedDocuments);
            }
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };
    

    // Handle adding a new category
    const handleAddCategory = async (event) => {
        event.preventDefault();
        if (newCategoryName.trim() === '') {
            alert('Category name is required.');
            return;
        }

        try {
            // Add the new category with name and document count set to 0
            await addDoc(collection(db, 'categories'), {
                name: newCategoryName,
                documentCount: 0, // Default value
            });

            // Reset the new category input field
            setNewCategoryName('');
            // Fetch categories again to update the list
            const querySnapshot = await getDocs(collection(db, 'categories'));
            const categoryList = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setCategories(categoryList);
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    // Handle toggling the admin status of a user
    const handleToggleAdmin = async (userId, currentStatus) => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                isAdmin: currentStatus === 1 ? 0 : 1, // Toggle between 0 and 1
            });

            // Update the users state to reflect the change
            const updatedUsers = users.map((user) =>
                user.id === userId ? { ...user, isAdmin: currentStatus === 1 ? 0 : 1 } : user
            );
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Error toggling admin:', error);
        }
    };

    // Handle deleting a user
    const handleDeleteUser = async (userId) => {
        try {
            const confirmDelete = window.confirm('Are you sure you want to delete this user?');
            if (confirmDelete) {
                const userRef = doc(db, 'users', userId);
                await deleteDoc(userRef);

                // Update the users state to remove the deleted user
                const updatedUsers = users.filter((user) => user.id !== userId);
                setUsers(updatedUsers);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    // Handle saving the edited category
    const handleSaveCategory = async (categoryId) => {
        if (editedCategoryName.trim() === '') {
            alert('Category name cannot be empty.');
            return;
        }

        try {
            // Update the category in Firestore
            const categoryRef = doc(db, 'categories', categoryId);
            await updateDoc(categoryRef, { name: editedCategoryName });

            // Update the categories state to reflect the change
            const updatedCategories = categories.map((category) =>
                category.id === categoryId
                    ? { ...category, name: editedCategoryName }
                    : category
            );
            setCategories(updatedCategories);

            // Reset editing state
            setEditingCategoryId(null);
            setEditedCategoryName('');
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    // Handle editing the category name
    const handleEditCategory = (categoryId, currentName) => {
        setEditingCategoryId(categoryId);
        setEditedCategoryName(currentName);
    };

    // Handle deleting a category
    // Handle deleting a category
    const handleDeleteCategory = async (categoryId) => {
        try {
            const category = categories.find((cat) => cat.id === categoryId);

            // Check if the category has documentCount 0
            if (category && category.documentCount === 0) {
                const confirmDelete = window.confirm('Are you sure you want to delete this category? This category has no documents.');

                if (confirmDelete) {
                    const categoryRef = doc(db, 'categories', categoryId);
                    await deleteDoc(categoryRef);

                    // Update the categories state to remove the deleted category
                    const updatedCategories = categories.filter((category) => category.id !== categoryId);
                    setCategories(updatedCategories);
                }
            } else if (category && category.documentCount > 0) {
                // If there are documents in the category, alert the user that deletion is not allowed
                alert('Cannot delete category with documents.');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };


    return (
        <div className="dashboard-container">
            <div className="tabs">
                <button
                    className={activeTab === 'allUsers' ? 'active' : ''}
                    onClick={() => setActiveTab('allUsers')}
                >
                    All Users
                </button>
                <button
                    className={activeTab === 'allDocuments' ? 'active' : ''}
                    onClick={() => setActiveTab('allDocuments')}
                >
                    All Documents
                </button>
                <button
                    className={activeTab === 'allCategories' ? 'active' : ''}
                    onClick={() => setActiveTab('allCategories')}
                >
                    All Categories
                </button>
            </div>

            {/* All Users Tab */}
            {activeTab === 'allUsers' && (
                <div className="users-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Admin Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.isAdmin === 1 ? 'Admin' : 'User'}</td>
                                    <td>
                                        <button onClick={() => handleToggleAdmin(user.id, user.isAdmin)}>Toggle Admin</button>
                                        <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* All Categories Tab */}
            {activeTab === 'allCategories' && (
                <div className="categories-section">
                    <div className="add-category-form">
                        <input
                            type="text"
                            placeholder="Enter category name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                        <button onClick={handleAddCategory}>Add Category</button>
                    </div>

                    <div className="categories-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Number of Documents</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="empty-row">
                                            No categories found.
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr key={category.id}>
                                            <td>
                                                {editingCategoryId === category.id ? (
                                                    <input
                                                        type="text"
                                                        value={editedCategoryName}
                                                        onChange={(e) =>
                                                            setEditedCategoryName(e.target.value)
                                                        }
                                                    />
                                                ) : (
                                                    <p>{category.name}</p>
                                                )}
                                            </td>
                                            <td>{category.documentCount || 0}</td>
                                            <td>
                                                {editingCategoryId === category.id ? (
                                                    <button onClick={() => handleSaveCategory(category.id)}>
                                                        Save
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleEditCategory(category.id, category.name)}>
                                                        Edit
                                                    </button>
                                                )}
                                                <button onClick={() => handleDeleteCategory(category.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* All Documents Tab */}
            {activeTab === 'allDocuments' && (
                <div className="documents-section">
                    <div className="documents-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Uploaded By</th>
                                    <th>Uploaded On</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="empty-row">
                                            No documents found.
                                        </td>
                                    </tr>
                                ) : (
                                    documents.map((document) => (
                                        <tr key={document.id}>
                                            <td>{document.title}</td>
                                            <td>{document.uploadedBy}</td>
                                            <td>{new Date(document.uploadedOn.seconds * 1000).toLocaleString()}</td>
                                            <td>{document.category}</td>
                                            <td>
                                                <button onClick={() => handleDeleteDocument(document.id, document.category)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
