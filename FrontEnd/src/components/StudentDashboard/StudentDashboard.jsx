import React, { useState, useEffect } from 'react';
import { FaPlay, FaBook, FaTrophy, FaUsers } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import ProfileSection from '../CourseList/ProfileSection';
import { getEnrolledCourses } from '../../services/profileService';
import '../../assets/StudentDashboard/StudentDashboard.css';

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
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const coursesPerPage = 4;

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const { data } = await getEnrolledCourses();
      setEnrolledCourses(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      id: 1,
      icon: <FaBook />,
      count: enrolledCourses.length,
      label: 'Enrolled Courses',
      color: '#ff6b38'
    },
    {
      id: 2,
      icon: <FaPlay />,
      count: enrolledCourses.filter(course => course.progress > 0 && course.progress < 100).length,
      label: 'Active Courses',
      color: '#6366f1'
    },
    {
      id: 3,
      icon: <FaTrophy />,
      count: enrolledCourses.filter(course => course.progress === 100).length,
      label: 'Completed Courses',
      color: '#22c55e'
    },
    {
      id: 4,
      icon: <FaUsers />,
      count: [...new Set(enrolledCourses.map(course => course.course.instructor))].length,
      label: 'Course Instructors',
      color: '#f59e0b'
    }
  ];

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => 
      Math.min(prev + 1, Math.ceil(enrolledCourses.length / coursesPerPage) - 1)
    );
  };

  const currentCourses = enrolledCourses.slice(
    currentPage * coursesPerPage,
    (currentPage + 1) * coursesPerPage
  );

  if (loading) {
    return (
      <ProfileSection
        avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
        name="Loading..."
        title="Loading..."
        activePath={location.pathname}
      >
        <div className="dashboard-content">
          <div>Loading dashboard...</div>
        </div>
      </ProfileSection>
    );
  }

  if (error) {
    return (
      <ProfileSection
        avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
        name="Error"
        title="Error"
        activePath={location.pathname}
      >
        <div className="dashboard-content">
          <div>Error: {error}</div>
        </div>
      </ProfileSection>
    );
  }

  return (
    <ProfileSection 
      avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
      name="Kevin Gilbert"
      title="Web Designer & Best-Selling Instructor"
      activePath={location.pathname}
    >
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
        </div>

        <div className="stats-grid">
          {statsData.map(stat => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>

        <div className="learning-section">
          <div className="learning-section-header">
            <h3>Let's start learning, Kevin</h3>
            <div className="learning-nav-buttons">
              <button 
                className="learning-nav-btn learning-nav-prev" 
                aria-label="Previous courses"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
              >
                ←
              </button>
              <button 
                className="learning-nav-btn learning-nav-next" 
                aria-label="Next courses"
                onClick={handleNextPage}
                disabled={currentPage >= Math.ceil(enrolledCourses.length / coursesPerPage) - 1}
              >
                →
              </button>
            </div>
          </div>

          <div className="learning-grid">
            {currentCourses.map(enrollment => (
              <LearningCard
                key={enrollment.enrollmentId}
                thumbnail={enrollment.course.thumbnail}
                title={enrollment.course.title}
                chapter={`${enrollment.course.category || 'General'} Course`}
                progress={enrollment.progress || 0}
                status={enrollment.progress === 100 ? "completed" : "in-progress"}
              />
            ))}
            {currentCourses.length === 0 && (
              <div className="no-courses-message">
                No courses found. Start learning by enrolling in a course!
              </div>
            )}
          </div>
        </div>
      </div>
    </ProfileSection>
  );
};

export default StudentDashboard; 