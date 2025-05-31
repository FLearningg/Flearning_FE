import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import '../../assets/WatchCourse/ReviewModal.css';

const ReviewModal = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [feedback, setFeedback] = useState('');

    const getRatingText = (rating) => {
        switch(rating) {
            case 1: return 'Poor';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Very Good';
            case 5: return 'Excellent';
            default: return 'How would you rate this?';
        }
    };

    const handleSubmit = () => {
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }
        onSubmit({ rating, feedback });
        setFeedback('');
        setRating(0);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="f-review-modal-overlay">
            <div className="f-review-modal">
                <div className="f-review-modal-header">
                    <h3>Share Your Experience</h3>
                    <button className="f-close-button" onClick={onClose}>
                        <IoClose size={24} />
                    </button>
                </div>
                
                <div className="f-rating-section">
                    <div className="f-rating-display">
                        <span className="f-rating-number">{rating || '0'}</span>
                        <span className="f-rating-text">{getRatingText(rating)}</span>
                    </div>
                    <div className="f-stars">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <label key={index}>
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={ratingValue}
                                        onClick={() => setRating(ratingValue)}
                                    />
                                    <FaStar
                                        className="f-star"
                                        size={32}
                                        color={ratingValue <= (hover || rating) ? "#f6ad55" : "#e2e8f0"}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(null)}
                                    />
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className="f-feedback-section">
                    <label>Your Feedback (optional)</label>
                    <textarea
                        placeholder="What did you like or dislike? What could be improved?"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                </div>

                <div className="f-modal-actions">
                    <button className="f-cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                    <button 
                        className="f-submit-button" 
                        onClick={handleSubmit}
                        disabled={rating === 0}
                    >
                        Submit Review
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;