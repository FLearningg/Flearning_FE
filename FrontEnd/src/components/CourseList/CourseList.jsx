import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import CourseCard from "./CourseCard";
import ProfileSection from "./ProfileSection";
import { getEnrolledCourses } from "../../services/profileService";
import "../../assets/CourseList/CourseList.css";

const CourseList = () => {
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const { data } = await getEnrolledCourses();
      setCourses(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch = course.course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && course.progress === 100) ||
        (statusFilter === "in-progress" && course.progress < 100);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.enrollmentDate) - new Date(a.enrollmentDate);
      } else if (sortBy === "oldest") {
        return new Date(a.enrollmentDate) - new Date(b.enrollmentDate);
      } else if (sortBy === "progress") {
        return b.progress - a.progress;
      }
      return 0;
    });

  if (loading) {
    return (
      <ProfileSection
        avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
        name="Loading..."
        title="Loading..."
        activePath={location.pathname}
      >
        <div className="course-list-wrapper">
          <div>Loading courses...</div>
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
        <div className="course-list-wrapper">
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
      <div className="course-list-wrapper">
        <div className="course-list-container">
          <div className="courses-header">
            <h2>
              My Courses <span className="course-count">({filteredCourses.length})</span>
            </h2>
            <div className="filter-group">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  aria-label="Search courses"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="select-filters">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                  aria-label="Sort courses"
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                  <option value="progress">Most Progress</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                  aria-label="Filter by status"
                >
                  <option value="all">All Courses</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="course-grid">
            {filteredCourses.map((enrollment) => (
              <CourseCard
                key={enrollment.enrollmentId}
                id={enrollment.course.id}
                thumbnail={enrollment.course.thumbnail}
                title={enrollment.course.title}
                progress={enrollment.progress || 0}
                createdAt={enrollment.enrollmentDate}
                instructor={enrollment.course.instructor}
                category={enrollment.course.category}
                status={enrollment.progress === 100 ? "completed" : "in-progress"}
              />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="no-courses-message">
              No courses found matching your criteria
            </div>
          )}
        </div>
      </div>
    </ProfileSection>
  );
};

export default CourseList;
