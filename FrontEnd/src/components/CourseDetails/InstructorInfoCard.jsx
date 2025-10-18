import React from "react";
import { Link } from "react-router-dom";
import { User, Award, BookOpen, Star } from "lucide-react";
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
  const headline = instructorProfile?.headline || "Course Instructor";
  const bio = instructorProfile?.bio || "No bio available";
  const totalStudents = instructorProfile?.totalStudents || 0;
  const totalCourses = instructorProfile?.totalCourses || 0;
  const averageRating = instructorProfile?.averageRating || 0;
  const totalReviews = instructorProfile?.totalReviews || 0;

  return (
    <div className="instructor-info-card">
      <div className="instructor-info-header">
        <User size={20} />
        <h3>About the Instructor</h3>
      </div>

      <div className="instructor-info-content">
        <div className="instructor-profile">
          <img
            src={userImage || "/images/defaultImageUser.png"}
            alt={fullName}
            className="instructor-avatar"
            onError={(e) => {
              e.target.src = "/images/defaultImageUser.png";
            }}
          />
          <div className="instructor-details">
            <h4 className="instructor-name">{fullName}</h4>
            <p className="instructor-headline">{headline}</p>
          </div>
        </div>

        <div className="instructor-stats">
          <div className="stat-item">
            <BookOpen size={18} />
            <span>{totalCourses} {totalCourses === 1 ? 'Course' : 'Courses'}</span>
          </div>
          <div className="stat-item">
            <User size={18} />
            <span>{totalStudents.toLocaleString()} Students</span>
          </div>
          <div className="stat-item">
            <Star size={18} fill="#ffc107" color="#ffc107" />
            <span>{averageRating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'})</span>
          </div>
        </div>

        <p className="instructor-bio">
          {bio.length > 150 ? `${bio.substring(0, 150)}...` : bio}
        </p>

        <Link 
          to={`/public/instructor/${_id}`}
          className="view-profile-btn"
        >
          <Award size={18} />
          View Instructor Profile
        </Link>
      </div>
    </div>
  );
};

export default InstructorInfoCard;
