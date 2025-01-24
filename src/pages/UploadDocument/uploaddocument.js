import React, { useState, useEffect, useContext } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc, Timestamp, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import './uploaddocument.css';

const UploadDocument = () => {
    const { currentUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
    });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryRef = collection(db, 'categories');
                const categorySnapshot = await getDocs(categoryRef);
                const categoryList = categorySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name,
                    documentCount: doc.data().documentCount || 0,
                }));
                setCategories(categoryList);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert('You must be logged in to upload a document.');
            return;
        }

        try {
            const { title, description, category } = formData;

            const uploadedOn = Timestamp.fromDate(new Date());

            await addDoc(collection(db, 'documents'), {
                title,
                description,
                category,
                uploadedBy: currentUser.name,
                uploadedOn,
            });

            const categoryRef = collection(db, 'categories');
            const categorySnapshot = await getDocs(categoryRef);
            const categoryDoc = categorySnapshot.docs.find(doc => doc.data().name === category);

            if (categoryDoc) {
                const categoryDocRef = doc(db, 'categories', categoryDoc.id);

                await updateDoc(categoryDocRef, {
                    documentCount: increment(1),
                });
            }

            setFormData({
                title: '',
                description: '',
                category: '',
            });

            navigate('/documents');

            alert('Document uploaded successfully!');
        } catch (error) {
            console.error('Error uploading document:', error);
            alert('Failed to upload document.');
        }
    };

    return (
        <main>
            <section className="upload-section">
                <h1>Upload New Document</h1>
                <form className="upload-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Document Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter document title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Document Description</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="5"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter a brief description"
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Select Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <button type="submit">Upload Document</button>
                    </div>
                </form>
            </section>
        </main>
    );
};

export default UploadDocument;
