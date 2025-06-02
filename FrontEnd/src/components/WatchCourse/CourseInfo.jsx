import React, { useState } from 'react';
import { FaBook, FaClock, FaUsers } from 'react-icons/fa';
import '../../assets/WatchCourse/CourseInfo.css';
import '../../assets/WatchCourse/CourseTabs.css';

const CourseInfo = ({ lesson, students, lastUpdated, commentsCount }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'notes', label: 'Lecture Notes' },
    { id: 'attachments', label: 'Attach File' },
    { id: 'comments', label: 'Comments' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="ci-description-content">
            <h3>{lesson?.title}</h3>
            <p>{lesson?.description}</p>
          </div>
        );
      case 'notes':
        return (
          <div className="ci-notes-content">
            <div className="ci-notes-header">
              <h3>Lecture Notes</h3>
              <div className="ci-notes-actions">
                <button className="ci-edit-button">
                  <span className="ci-button-icon">✏️</span>
                  Edit Notes
                </button>
                <button className="ci-download-button">
                  <span className="ci-button-icon">⬇️</span>
                  Download
                </button>
              </div>
            </div>
            <div className="ci-notes-sections">
              <div className="ci-notes-section">
                <h4>Key Concepts</h4>
                <ul className="ci-notes-list">
                  <li>Understanding the fundamentals of web design principles</li>
                  <li>Color theory and its application in UI/UX design</li>
                  <li>Typography selection and hierarchy in design systems</li>
                  <li>Layout composition and grid systems</li>
                </ul>
              </div>
              <div className="ci-notes-section">
                <h4>Important Points</h4>
                <ul className="ci-notes-list">
                  <li>Always consider user accessibility in design decisions</li>
                  <li>Test designs across different screen sizes and devices</li>
                  <li>Maintain consistency in design patterns</li>
                  <li>Document design decisions and rationale</li>
                </ul>
              </div>
              <div className="ci-notes-section">
                <h4>Examples & References</h4>
                <div className="ci-code-block">
                  <pre>
                    <code>
{`// Example of good color contrast
const colors = {
  primary: '#0066CC',
  secondary: '#FF4D4F',
  background: '#F5F5F5',
  text: '#1A1A1A'
}`}
                    </code>
                  </pre>
                </div>
                <div className="ci-reference-links">
                  <a href="#" className="ci-reference-link">📚 Design System Guidelines</a>
                  <a href="#" className="ci-reference-link">🎨 Color Palette Reference</a>
                  <a href="#" className="ci-reference-link">📐 Grid System Documentation</a>
                </div>
              </div>
              <div className="ci-notes-section">
                <h4>Practice Exercises</h4>
                <div className="ci-exercise-list">
                  <div className="ci-exercise-item">
                    <span className="ci-exercise-number">1</span>
                    <p>Create a responsive layout using the grid system discussed</p>
                  </div>
                  <div className="ci-exercise-item">
                    <span className="ci-exercise-number">2</span>
                    <p>Implement a color scheme following accessibility guidelines</p>
                  </div>
                  <div className="ci-exercise-item">
                    <span className="ci-exercise-number">3</span>
                    <p>Design a typography hierarchy for a landing page</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'attachments':
        return (
          <div className="ci-attachments-content">
            {lesson?.attachments?.map((file, index) => (
              <div key={index} className="ci-attachment-item">
                <span className="ci-file-icon">📎</span>
                <span className="ci-file-name">{file.name}</span>
                <button className="ci-download-button">Download</button>
              </div>
            ))}
          </div>
        );
      case 'comments':
        return (
          <div className="ci-comments-content">
            <div className="ci-comments-header">
              <h3>Discussion ({commentsCount})</h3>
              <button className="ci-add-comment-button">Add Comment</button>
            </div>
            {/* Comments list would go here */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ci-course-info">
      <div className="ci-info-header">
        <div className="ci-lesson-stats">
          <div className="ci-stat-item">
            <FaBook className="ci-stat-icon" />
            <span>{students} students</span>
          </div>
          <div className="ci-stat-item">
            <FaClock className="ci-stat-icon" />
            <span>Last updated: {lastUpdated}</span>
          </div>
          <div className="ci-stat-item">
            <FaUsers className="ci-stat-icon" />
            <span>{commentsCount} comments</span>
          </div>
        </div>
      </div>

      <div className="course-tabs-container">
        <div className="course-tabs">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`course-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>

      <div className="ci-tab-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default CourseInfo; 