import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { BsBook } from "react-icons/bs";
import { BiPlay } from "react-icons/bi";
import { BsClock } from "react-icons/bs";
import "../../assets/WatchCourse/CourseHeader.css";

const CourseHeader = ({
  courseData,
  onReviewClick,
  reviewMode,
  onNextLecture,
  showReviewButton = true,
}) => {
  return (
    <div className="f-course-header">
      <div className="f-course-header-left">
        <button className="f-back-button" onClick={() => window.history.back()}>
          <IoArrowBack className="f-back-icon" />
        </button>
        <div className="f-course-info">
          <h1 className="f-course-title">{courseData?.title || ""}</h1>
          <div className="f-course-stats">
            <div className="f-stat-item">
              <BsBook className="f-stat-icon" style={{ color: "#dc3545" }} />
              <span>{courseData?.sections?.length ?? 0} Sections</span>
            </div>
            <div className="f-stat-item">
              <BiPlay className="f-stat-icon" style={{ color: "#0d6efd" }} />
              <span>
                {courseData?.sections?.reduce(
                  (acc, s) => acc + (s.lessons?.length || 0),
                  0
                )}{" "}
                Lectures
              </span>
            </div>
            <div className="f-stat-item">
              <BsClock className="f-stat-icon" style={{ color: "#fd7e14" }} />
              <span>{courseData?.duration || ""}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="f-course-header-right">
        {showReviewButton ? (
          <button className="f-review-button" onClick={onReviewClick}>
            {reviewMode ? "Update Review" : "Write a Review"}
          </button>
        ) : (
          <div
            className="f-review-info"
            style={{
              fontSize: "14px",
              color: "#666",
              fontStyle: "italic",
              marginRight: "10px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span>📝</span>
            <span>Complete all lessons to write a review</span>
          </div>
        )}
        <button className="f-next-lecture-button" onClick={onNextLecture}>
          Next Lecture
        </button>
      </div>
    </div>
  );
};

export default CourseHeader;
