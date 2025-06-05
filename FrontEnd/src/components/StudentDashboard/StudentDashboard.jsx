import React from 'react';
import { FaPlay, FaBook, FaTrophy, FaUsers } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import ProfileSection from '../CourseList/ProfileSection';
import '../../assets/StudentDashboard/StudentDashboard.css';

const STATS_DATA = [
  {
    id: 1,
    icon: <FaBook />,
    count: 957,
    label: 'Enrolled Courses',
    color: '#ff6b38'
  },
  {
    id: 2,
    icon: <FaPlay />,
    count: 6,
    label: 'Active Courses',
    color: '#6366f1'
  },
  {
    id: 3,
    icon: <FaTrophy />,
    count: 951,
    label: 'Completed Courses',
    color: '#22c55e'
  },
  {
    id: 4,
    icon: <FaUsers />,
    count: 241,
    label: 'Course Instructors',
    color: '#f59e0b'
  }
];

const LEARNING_DATA = [
  {
    id: 1,
    title: 'React Level 1: # and Master/Teacher Program',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    chapter: '1. Introductions',
    progress: 0,
    status: 'not-started'
  },
  {
    id: 2,
    title: 'The Complete 2021 Web Development Bootcamp',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    chapter: '167. What You\'ll Need to Get Started - Setup',
    progress: 61,
    status: 'in-progress'
  },
  {
    id: 3,
    title: 'Copywriting - Become a Freelance Copywriter',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a',
    chapter: '1. How to get started with figma',
    progress: 0,
    status: 'not-started'
  },
  {
    id: 4,
    title: '2021 Complete Python Bootcamp From Zero to Hero',
    thumbnail: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2',
    chapter: '9. Advanced CSS - Selector Priority',
    progress: 12,
    status: 'in-progress'
  }
];

const StatCard = ({ icon, count, label, color }) => (
  <div className="dashboard-stat-card">
    <div className="stat-icon" style={{ backgroundColor: color + '10', color: color }}>
      {icon}
    </div>
    <div className="stat-info">
      <h3>{count}</h3>
      <p>{label}</p>
    </div>
  </div>
);

const LearningCard = ({ thumbnail, title, chapter, progress, status }) => (
  <div className="learning-card">
    <div className="learning-thumbnail">
      <img src={thumbnail} alt={title} loading="lazy" />
    </div>
    <div className="learning-info">
      <h4>{title}</h4>
      <p className="learning-chapter-name">{chapter}</p>
      {progress > 0 && (
        <div className="learning-progress">
          <div className="learning-progress-bar">
            <div 
              className="learning-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="learning-progress-text">{progress}% Completed</span>
        </div>
      )}
      <button 
        className="learning-watch-btn"
        aria-label={`Watch ${title}`}
      >
        Watch Lecture
      </button>
    </div>
  </div>
);

const StudentDashboard = () => {
  const location = useLocation();

  return (
    <div className="dashboard-container">
      <ProfileSection 
        avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
        name="Kevin Gilbert"
        title="Web Designer & Best-Selling Instructor"
        activePath={location.pathname}
        showMobileHeader={false}
      />

      <div className="dashboard-header">
        <h2>Dashboard</h2>
      </div>

      <div className="stats-grid">
        {STATS_DATA.map(stat => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className="learning-section">
        <div className="learning-section-header">
          <h3>Let's start learning, Kevin</h3>
          <div className="learning-nav-buttons">
            <button className="learning-nav-btn learning-nav-prev" aria-label="Previous courses">
              ←
            </button>
            <button className="learning-nav-btn learning-nav-next" aria-label="Next courses">
              →
            </button>
          </div>
        </div>

        <div className="learning-grid">
          {LEARNING_DATA.map(course => (
            <LearningCard key={course.id} {...course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 