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
    const handleDeleteDocument = async (documentId, category) => {
        try {
            const confirmDelete = window.confirm(
                'Are you sure you want to delete this document? This will also decrement the document count for the category.'
            );
            if (confirmDelete) {
                // Decrement the document count for the category
                const categoryRef = doc(db, 'categories', category.id);
                await updateDoc(categoryRef, {
                    documentCount: increment(-1), // Decrement the count
                });

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

    // Handle deleting a category
    // Handle deleting a category only if its documentCount is 0
const handleDeleteCategory = async (categoryId, documentCount) => {
    try {
        if (documentCount > 0) {
            // Alert the user if the category has documents attached
            alert('This category cannot be deleted because it has documents attached.');
            return;
        }

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this category? This action cannot be undone.'
        );
        if (confirmDelete) {
            // Now, delete the category
            const categoryRef = doc(db, 'categories', categoryId);
            await deleteDoc(categoryRef);

            // Update the categories state to remove the deleted category
            const updatedCategories = categories.filter(
                (category) => category.id !== categoryId
            );
            setCategories(updatedCategories);
        }
    } catch (error) {
        console.error('Error deleting category:', error);
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

    // Handle toggling the edit state for category
    const handleEditCategory = (categoryId, currentName) => {
        setEditingCategoryId(categoryId);
        setEditedCategoryName(currentName);
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
                                        <button>Toggle Admin</button>
                                        <button>Delete</button>
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
