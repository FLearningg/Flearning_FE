import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import CourseContents from './CourseContents';
import CourseInfo from './CourseInfo';
import CourseHeader from './CourseHeader';
import ReviewModal from './ReviewModal';
import '../../assets/WatchCourse/WatchCourse.css';

const WatchCourse = ({ courseData }) => {
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState(15); // Example progress
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleReviewSubmit = (reviewData) => {
    // Handle review submission here
    console.log('Review submitted:', reviewData);
    // You can make an API call here to save the review
  };

  return (
    <div className="f-watch-course-wrapper">
      <div className="f-watch-course-container">
        <CourseHeader 
          courseData={courseData} 
          onReviewClick={() => setIsReviewModalOpen(true)}
        />
      </div>
      <div className="f-watch-course-main">
        <div className="f-watch-course-left">
          <div className="f-video-section">
            <VideoPlayer 
              videoUrl={currentLesson?.videoUrl} 
              onProgress={(progress) => {
                // Handle video progress
              }}
            />
          </div>
          <div className="f-course-info-section">
            <CourseInfo 
              lesson={currentLesson}
              students={courseData?.studentsCount}
              lastUpdated={courseData?.lastUpdated}
              commentsCount={courseData?.commentsCount}
            />
          </div>
        </div>
        <div className="f-content-section">
          <CourseContents
            contents={courseData?.contents}
            currentLesson={currentLesson}
            progress={progress}
            onSelectLesson={(lesson) => setCurrentLesson(lesson)}
          />
        </div>
      </div>

      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

export default WatchCourse; 