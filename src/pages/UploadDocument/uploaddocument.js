import React, { useState } from 'react';
import './uploaddocument.css';

const UploadDocument = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        file: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            file,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission (e.g., send data to the server)
        console.log('Document submitted', formData);
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
                        <label htmlFor="file">Choose File</label>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            onChange={handleFileChange}
                            required
                        />
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
