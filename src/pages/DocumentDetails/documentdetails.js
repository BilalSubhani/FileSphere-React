import React, { useState } from 'react';
import './documentdetails.css';

const DocumentDetail = () => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([
        { user: 'User1', text: 'This document is really helpful for my project. Thanks for sharing!' },
        { user: 'User2', text: 'Great insights. I found the recommendations to be very practical.' }
    ]);

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            setComments([...comments, { user: 'Anonymous', text: comment }]);
            setComment('');
        }
    };

    return (
        <main>
            <section className="document-details-section">
                <h1>Document Title</h1>
                <p className="upload-date">Uploaded on: January 15, 2024</p>
                <p className="document-description">
                    This is a detailed description of the document. It provides an overview of the content, purpose, and any important information related to the document.
                    The document includes in-depth analysis, data, and recommendations. It is meant to provide clear insight and valuable information to the reader.
                </p>

                <a href="#" className="download-btn">Download Document</a>
            </section>

            <section className="comments-section">
                <h2>Comments</h2>
                {comments.map((comment, index) => (
                    <div className="comment" key={index}>
                        <p><strong>{comment.user}:</strong> {comment.text}</p>
                    </div>
                ))}

                <div className="add-comment">
                    <h3>Add a Comment</h3>
                    <form className="comment-form" onSubmit={handleCommentSubmit}>
                        <textarea
                            id="comment"
                            name="comment"
                            rows="4"
                            value={comment}
                            onChange={handleCommentChange}
                            placeholder="Write your comment..."
                            required
                        ></textarea>
                        <button type="submit">Submit Comment</button>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default DocumentDetail;
