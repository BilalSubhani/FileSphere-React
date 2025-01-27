import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
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

    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (!currentUser)
            navigate("/login");
        else
            if(currentUser.isAdmin === 0)
                navigate("/");
    }, [currentUser, navigate]);

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

    const handleDeleteDocument = async (documentId, categoryName) => {
        try {
            const confirmDelete = window.confirm(
                'Are you sure you want to delete this document? This will also decrement the document count for the associated category.'
            );
            if (confirmDelete) {
                if (!categoryName) {
                    console.error('Error: Category name is undefined or invalid.');
                    return;
                }

                const category = categories.find((cat) => cat.name === categoryName);
                if (category) {
                    if (category.documentCount > 0) {
                        const categoryRef = doc(db, 'categories', category.id);
                        await updateDoc(categoryRef, {
                            documentCount: increment(-1),
                        });
                    } else {
                        console.log('Document count is already 0, no need to decrement.');
                    }
                } else {
                    console.warn(`Category with name "${categoryName}" not found.`);
                }

                const docRef = doc(db, 'documents', documentId);
                await deleteDoc(docRef);

                const updatedDocuments = documents.filter(
                    (document) => document.id !== documentId
                );
                setDocuments(updatedDocuments);
            }
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    const handleAddCategory = async (event) => {
        event.preventDefault();
        if (newCategoryName.trim() === '') {
            alert('Category name is required.');
            return;
        }

        try {
            await addDoc(collection(db, 'categories'), {
                name: newCategoryName,
                documentCount: 0,
            });

            setNewCategoryName('');
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

    const handleToggleAdmin = async (userId, currentStatus) => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                isAdmin: currentStatus === 1 ? 0 : 1,
            });

            const updatedUsers = users.map((user) =>
                user.id === userId ? { ...user, isAdmin: currentStatus === 1 ? 0 : 1 } : user
            );
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Error toggling admin:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const confirmDelete = window.confirm('Are you sure you want to delete this user?');
            if (confirmDelete) {
                const userRef = doc(db, 'users', userId);
                await deleteDoc(userRef);

                const updatedUsers = users.filter((user) => user.id !== userId);
                setUsers(updatedUsers);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleSaveCategory = async (categoryId) => {
        if (editedCategoryName.trim() === '') {
            alert('Category name cannot be empty.');
            return;
        }

        try {
            const categoryRef = doc(db, 'categories', categoryId);
            await updateDoc(categoryRef, { name: editedCategoryName });

            const updatedCategories = categories.map((category) =>
                category.id === categoryId
                    ? { ...category, name: editedCategoryName }
                    : category
            );
            setCategories(updatedCategories);

            setEditingCategoryId(null);
            setEditedCategoryName('');
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleEditCategory = (categoryId, currentName) => {
        setEditingCategoryId(categoryId);
        setEditedCategoryName(currentName);
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            const category = categories.find((cat) => cat.id === categoryId);

            if (category) {
                const confirmDelete = window.confirm(
                    `Are you sure you want to delete the category "${category.name}"? This will also delete all associated documents.`
                );

                if (confirmDelete) {
                    const associatedDocuments = documents.filter(
                        (doc) => doc.category === category.name
                    );

                    for (const document of associatedDocuments) {
                        const documentRef = doc(db, 'documents', document.id);
                        await deleteDoc(documentRef);
                    }

                    const categoryRef = doc(db, 'categories', categoryId);
                    await deleteDoc(categoryRef);

                    const updatedCategories = categories.filter(
                        (category) => category.id !== categoryId
                    );
                    setCategories(updatedCategories);

                    const updatedDocuments = documents.filter(
                        (document) => document.category !== category.name
                    );
                    setDocuments(updatedDocuments);
                }
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
                                        <button className="btn" onClick={() => handleToggleAdmin(user.id, user.isAdmin)}>Toggle Admin</button>
                                        <button className="btn" onClick={() => handleDeleteUser(user.id)}>Delete</button>
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
                                                    <button className="btn" onClick={() => handleSaveCategory(category.id)}>
                                                        Save
                                                    </button>
                                                ) : (
                                                    <button className="btn" onClick={() => handleEditCategory(category.id, category.name)}>
                                                        Edit
                                                    </button>
                                                )}
                                                <button className="btn" onClick={() => handleDeleteCategory(category.id)}>
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
                                                <button className="btn" onClick={() => handleDeleteDocument(document.id, document.category)}>
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