import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc, Timestamp, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirect

import './uploaddocument.css';

const UploadDocument = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
    });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate hook for redirection

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryRef = collection(db, 'categories');
                const categorySnapshot = await getDocs(categoryRef);
                const categoryList = categorySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name,
                    documentCount: doc.data().documentCount || 0, // Ensure documentCount exists
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

        try {
            const { title, description, category } = formData;

            // Get current date
            const uploadedOn = Timestamp.fromDate(new Date());

            // Add document to Firestore
            await addDoc(collection(db, 'documents'), {
                title,
                description,
                category,
                uploadedBy: 'azeem', // Hardcoded user for now
                uploadedOn,
            });

            // Fetch category document to update document count
            const categoryRef = collection(db, 'categories');
            const categorySnapshot = await getDocs(categoryRef);
            const categoryDoc = categorySnapshot.docs.find(doc => doc.data().name === category);

            if (categoryDoc) {
                const categoryDocRef = doc(db, 'categories', categoryDoc.id);
                
                // Increment documentCount by 1
                await updateDoc(categoryDocRef, {
                    documentCount: increment(1),
                });
            }

            // Clear form after submission
            setFormData({
                title: '',
                description: '',
                category: '',
            });

            // Redirect to documents page after successful upload
            navigate('/documents'); // Navigate to '/documents'

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
