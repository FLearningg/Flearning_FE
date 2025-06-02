import React, { useState } from 'react';
import '../../assets/WatchCourse/CourseContents.css';

const CourseContents = ({ contents, currentLesson, progress, onSelectLesson }) => {
  const [expandedSections, setExpandedSections] = useState(new Set([0])); // First section expanded by default

  const toggleSection = (index) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="course-contents">
      <div className="course-contents-header">
        <h2>Course Contents</h2>
        <div className="progress-info">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{progress}% Completed</span>
        </div>
      </div>

      <div className="sections-list">
        {contents?.map((section, index) => (
          <div key={index} className="section">
            <div 
              className="section-header"
              onClick={() => toggleSection(index)}
            >
              <div className="section-title">
                <span className="section-arrow">
                  {expandedSections.has(index) ? '▾' : '▸'}
                </span>
                <span className="section-name">{section.title}</span>
              </div>
              <div className="section-meta">
                <span className="lecture-count">
                  <span className="meta-icon">📚</span>
                  {section.lectures?.length} lectures
                </span>
                <span className="duration">
                  <span className="meta-icon">⏱️</span>
                  {section.duration}
                </span>
                {index === 0 && (
                  <span className="completion">
                    <span className="meta-icon">✓</span>
                    25% finish (1/4)
                  </span>
                )}
              </div>
            </div>

            <div className={`lectures-list ${expandedSections.has(index) ? 'expanded' : ''}`}>
              {section.lectures?.map((lecture, lectureIndex) => (
                <div
                  key={lectureIndex}
                  className={`lecture ${currentLesson?.id === lecture.id ? 'active' : ''} ${lecture.completed ? 'completed' : ''}`}
                  onClick={() => onSelectLesson(lecture)}
                >
                  <div className="lecture-info">
                    <div className="lecture-status-title">
                      <input 
                        type="checkbox" 
                        checked={lecture.completed}
                        onChange={(e) => e.stopPropagation()}
                        className="lecture-checkbox"
                      />
                      <span className="lecture-title">{lecture.title}</span>
                    </div>
                    <div className="lecture-duration">
                      {currentLesson?.id === lecture.id ? (
                        <span className="now-playing">▐▐</span>
                      ) : (
                        <span className="play-icon">▶</span>
                      )}
                      <span>{lecture.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContents; 