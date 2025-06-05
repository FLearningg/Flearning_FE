import React from "react";
import PropTypes from "prop-types";
import "./Card.css";

// SVG Components
export const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label="Star rating">
    <path
      d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z"
      fill="#FFB400"
    />
  </svg>
);

export const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label="Students">
    <g>
      <circle cx="10" cy="7" r="4" stroke="#7B7B7B" strokeWidth="1.5" />
      <path
        d="M2 18c0-3.87 3.13-7 7-7h2c3.87 0 7 3.13 7 7"
        stroke="#7B7B7B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

export const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="Duration">
    <path
      d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33334 8 1.33334C4.3181 1.33334 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667Z"
      stroke="#6E7A8A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 4V8L10.6667 9.33333"
      stroke="#6E7A8A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LevelIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="Level">
    <path
      d="M2 14L2 8.5"
      stroke="#6E7A8A"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 14L8 2"
      stroke="#6E7A8A"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14 14L14 5.5"
      stroke="#6E7A8A"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const Card = ({ image, category, price, title, rating, students }) => (
  <div className="card-container" role="article" tabIndex="0">
    <div 
      className="card-image" 
      style={{ backgroundImage: `url(${image})` }}
      role="img"
      aria-label={`Course image for ${title}`}
    />
    <div className="card-body custom-card-body">
      <div className="custom-row">
        <div className="card-category" aria-label={`Category: ${category}`}>
          {category}
        </div>
        <div className="card-price" aria-label={`Price: ${price}`}>
          <span className="orange-gradient">{price}</span>
        </div>
      </div>
      <div className="card-title" title={title}>{title}</div>
      <div className="card-footer">
        <div className="rating" aria-label={`Rating: ${rating} stars`}>
          <StarIcon />
          {rating}
        </div>
        <div className="students" aria-label={`${students} students enrolled`}>
          <UserIcon />
          {students}
        </div>
      </div>
    </div>
  </div>
);

Card.propTypes = {
  image: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  students: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

Card.defaultProps = {
  image: "/api/placeholder/312/234",
  category: "Course",
  price: "Free",
  title: "Course Title",
  rating: "0.0",
  students: "0",
};

export const DetailedCard = ({
  title,
  author,
  authorAvatar,
  rating,
  ratingCount,
  students,
  level,
  duration,
  price,
  oldPrice,
  discount,
  learnList,
}) => (
  <div className="detailed-card-container" role="article" tabIndex="0">
    <div className="detailed-card-body">
      <h3 className="detailed-title">{title}</h3>

      <div className="author-row">
        <div className="author-info">
          <div
            className="author-avatar"
            style={{ backgroundImage: `url(${authorAvatar})` }}
            role="img"
            aria-label={`${author}'s profile picture`}
          />
          <div className="author-name">
            Course by
            <strong>{author}</strong>
          </div>
        </div>
        <div className="rating-info" aria-label={`Rating: ${rating} stars from ${ratingCount} reviews`}>
          <StarIcon />
          {rating}
          <span style={{ color: "#6E7A8A" }}>({ratingCount})</span>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-item" aria-label={`${students} students enrolled`}>
          <UserIcon />
          {students} students
        </div>

        <div className="stat-item" aria-label={`Difficulty level: ${level}`}>
          <LevelIcon />
          {level}
        </div>

        <div className="stat-item" aria-label={`Course duration: ${duration}`}>
          <ClockIcon />
          {duration}
        </div>
      </div>

      <div className="price-row">
        <div className="current-price" aria-label={`Current price: ${price}`}>
          <span className="orange-gradient">{price}</span>
        </div>
        {oldPrice && (
          <div className="old-price" aria-label={`Original price: ${oldPrice}`}>
            {oldPrice}
          </div>
        )}
        {discount && (
          <div className="discount" aria-label={`Discount: ${discount}`}>
            {discount}
          </div>
        )}
      </div>

      <div>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 600,
            marginBottom: "16px",
            color: "#1d2026",
          }}
        >
          What you'll learn
        </div>
        <ul className="learn-list">
          {learnList && learnList.map((item, index) => (
            <li key={`learn-item-${index}`} className="learn-item">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <button 
        className="card-button"
        aria-label={`Add ${title} to cart`}
        type="button"
      >
        Add To Cart
      </button>
      <button 
        className="card-detail-button"
        aria-label={`View details for ${title}`}
        type="button"
      >
        Course Detail
      </button>
    </div>
  </div>
);

DetailedCard.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  authorAvatar: PropTypes.string,
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  ratingCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  students: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  level: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  oldPrice: PropTypes.string,
  discount: PropTypes.string,
  learnList: PropTypes.arrayOf(PropTypes.string),
};

DetailedCard.defaultProps = {
  authorAvatar: "/api/placeholder/36/36",
  oldPrice: null,
  discount: null,
  learnList: [],
};

export default Card;
