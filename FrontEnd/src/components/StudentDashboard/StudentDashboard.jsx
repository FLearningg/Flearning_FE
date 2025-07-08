import React, { useState, useEffect } from "react";
import { FaPlay, FaBook, FaTrophy, FaUsers } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import ProfileSection from "../CourseList/ProfileSection";
import {
  getEnrolledCourses,
  getAllCoursesProgress,
} from "../../services/profileService";
import "../../assets/StudentDashboard/StudentDashboard.css";

const StatCard = ({ icon, count, label, color }) => (
  <div className="dashboard-stat-card">
    <div
      className="stat-icon"
      style={{ backgroundColor: color + "10", color: color }}
    >
      {icon}
    </div>
    <div className="stat-info">
      <h3>{count}</h3>
      <p>{label}</p>
    </div>
  </div>
);

const LearningCard = ({
  thumbnail,
  title,
  chapter,
  progress,
  status,
  completedLessons,
  totalLessons,
}) => (
  <div className="learning-card">
    <div className="learning-thumbnail">
      <img src={thumbnail} alt={title} loading="lazy" />
      <div className={`status-badge ${status}`}>
        {status === "completed" ? "Completed" : "In Progress"}
      </div>
    </div>
    <div className="learning-info">
      <h4>{title}</h4>
      <p className="learning-chapter-name">{chapter}</p>
      <div className="learning-progress">
        <div className="learning-progress-bar">
          <div
            className="learning-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="learning-progress-text">
          {progress}% Completed ({completedLessons}/{totalLessons} lessons)
        </span>
      </div>
      <button className="learning-watch-btn" aria-label={`Watch ${title}`}>
        {status === "completed" ? "Review Course" : "Continue Learning"}
      </button>
    </div>
  </div>
);

const StudentDashboard = () => {
  const location = useLocation();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [coursesProgress, setCoursesProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const coursesPerPage = 4;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch both enrolled courses and their progress data
      const [enrolledResponse, progressResponse] = await Promise.all([
        getEnrolledCourses(),
        getAllCoursesProgress(),
      ]);

      setEnrolledCourses(enrolledResponse.data.data);
      setCoursesProgress(progressResponse.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Merge course data with progress data
  const coursesWithProgress = enrolledCourses.map((enrollment) => {
    const progressData = coursesProgress.find(
      (progress) => progress.courseId === enrollment.course.id
    );

    return {
      ...enrollment,
      progress: progressData ? progressData.progressPercentage : 0,
      completedLessons: progressData ? progressData.completedLessons : 0,
      totalLessons: progressData ? progressData.totalLessons : 0,
      status:
        progressData && progressData.progressPercentage === 100
          ? "completed"
          : "in-progress",
    };
  });

  const statsData = [
    {
      id: 1,
      icon: <FaBook />,
      count: coursesWithProgress.length,
      label: "Enrolled Courses",
      color: "#ff6b38",
    },
    {
      id: 2,
      icon: <FaPlay />,
      count: coursesWithProgress.filter(
        (course) => course.status === "in-progress"
      ).length,
      label: "Active Courses",
      color: "#6366f1",
    },
    {
      id: 3,
      icon: <FaTrophy />,
      count: coursesWithProgress.filter(
        (course) => course.status === "completed"
      ).length,
      label: "Completed Courses",
      color: "#22c55e",
    },
    {
      id: 4,
      icon: <FaUsers />,
      count: [
        ...new Set(
          coursesWithProgress.map((course) => course.course.instructor)
        ),
      ].length,
      label: "Course Instructors",
      color: "#f59e0b",
    },
  ];

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) =>
      Math.min(
        prev + 1,
        Math.ceil(coursesWithProgress.length / coursesPerPage) - 1
      )
    );
  };

  const currentCourses = coursesWithProgress.slice(
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
          {statsData.map((stat) => (
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
                disabled={
                  currentPage >=
                  Math.ceil(coursesWithProgress.length / coursesPerPage) - 1
                }
              >
                →
              </button>
            </div>
          </div>

          <div className="learning-grid">
            {currentCourses.map((enrollment) => (
              <LearningCard
                key={enrollment.enrollmentId}
                thumbnail={enrollment.course.thumbnail}
                title={enrollment.course.title}
                chapter={`${enrollment.course.category || "General"} Course`}
                progress={enrollment.progress}
                status={enrollment.status}
                completedLessons={enrollment.completedLessons}
                totalLessons={enrollment.totalLessons}
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
