import React from 'react';
import { IoArrowBack } from 'react-icons/io5';
import '../../assets/WatchCourse/CourseHeader.css';

const CourseHeader = ({ courseData, onReviewClick }) => {
  return (
    <div className="f-course-header">
      <div className="f-course-header-left">
        <button className="f-back-button" onClick={() => window.history.back()}>
          <IoArrowBack className="f-back-icon" />
        </button>
        <div className="f-course-info">
          <h1 className="f-course-title">{courseData?.title || 'Course Title'}</h1>
          <div className="f-course-stats">
            <div className="f-stat-item">
              <span className="f-stat-icon">📚</span>
              <span>{courseData?.sectionsCount || 6} Sections</span>
            </div>
            <div className="f-stat-item">
              <span className="f-stat-icon">▶️</span>
              <span>{courseData?.lecturesCount || 202} Lectures</span>
            </div>
            <div className="f-stat-item">
              <span className="f-stat-icon">⏱️</span>
              <span>{courseData?.duration || '19h 37m'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="f-course-header-right">
        <button className="f-review-button" onClick={onReviewClick}>
          Write a Review
        </button>
        <button className="f-next-lecture-button">
          Next Lecture
        </button>
      </div>
    </div>
  );
};

export default CourseHeader; 