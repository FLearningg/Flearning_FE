import React from 'react';
import PropTypes from 'prop-types';

const CourseCard = ({ 
  thumbnail, 
  title, 
  progress, 
  instructor,
  category,
  status 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'course-status-completed';
      case 'in-progress':
        return 'course-status-progress';
      default:
        return 'course-status-default';
    }
  };

  const getProgressColor = () => {
    if (progress >= 75) return '#4CAF50';
    if (progress >= 50) return '#FFC107';
    return '#ff6b38';
  };

  return (
    <div 
      className="course-card"
      role="article"
    >
      <div className="course-thumbnail">
        <img 
          src={thumbnail} 
          alt={`${title} course thumbnail`}
          loading="lazy"
        />
        <div className={`course-status-badge ${getStatusColor()}`}>
          {status.replace('-', ' ')}
        </div>
      </div>
      <div className="course-info">
        <div className="course-meta">
          <span className="course-category">{category}</span>
          <span className="course-instructor">{instructor}</span>
        </div>
        <h3 title={title}>{title}</h3>
        <div className="course-footer">
          <button 
            className="course-watch-btn"
            aria-label={`Watch lecture for ${title}`}
          >
            Watch Lecture
          </button>
          {progress > 0 && (
            <div className="course-progress-status">
              <div className="course-progress-wrapper">
                <div 
                  className="course-progress"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div 
                    className="course-progress-bar" 
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: getProgressColor()
                    }}
                  />
                </div>
              </div>
              <span className="course-completion-text">
                {progress}% Completed
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CourseCard.propTypes = {
  thumbnail: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  instructor: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['completed', 'in-progress']).isRequired
};

export default CourseCard; 