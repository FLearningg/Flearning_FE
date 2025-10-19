import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import "../../assets/CourseDetails/InstructorInfoCard.css";

const InstructorInfoCard = ({ instructor }) => {
  if (!instructor) {
    return null;
  }

  const {
    _id,
    firstName,
    lastName,
    userImage,
    instructorProfile,
  } = instructor;

  const fullName = `${firstName || ""} ${lastName || ""}`.trim() || "Instructor";
  
  // Get instructor rating from instructor profile
  const rating = instructorProfile?.averageRating || 0;
  const totalRatings = instructorProfile?.totalReviews || 0;

  // Render 5 stars based on rating
  const renderStars = () => {
    const stars = [];
    const ratingValue = rating || 0;
    
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= Math.floor(ratingValue);
      
      stars.push(
        <Star
          key={i}
          size={20}
          fill={isFilled ? "#FF8A00" : "none"}
          color="#FF8A00"
          strokeWidth={2}
        />
      );
    }
    return stars;
  };

  return (
    <div className="instructor-compact-info">
      <div className="instructor-left">
        <Link to={`/public/instructor/${_id}`} className="instructor-avatar-link">
          <img
            src={userImage || "/images/defaultImageUser.png"}
            alt={fullName}
            className="instructor-avatar-small"
            onError={(e) => {
              e.target.src = "/images/defaultImageUser.png";
            }}
          />
        </Link>
        <div className="instructor-info">
          <span className="created-by-label">Created by:</span>
          <Link to={`/public/instructor/${_id}`} className="instructor-name-link">
            <span className="instructor-name-compact">{fullName}</span>
          </Link>
        </div>
      </div>
      
      {(rating !== undefined || totalRatings !== undefined) && (
        <div className="instructor-rating">
          <div className="stars-container">
            {renderStars()}
          </div>
          <span className="rating-number1">{rating?.toFixed(1) || "0.0"}</span>
          <span className="rating-count">({(totalRatings || 0).toLocaleString()} Rating)</span>
        </div>
      )}
    </div>
  );
};

export default InstructorInfoCard;
