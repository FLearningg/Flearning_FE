import React from "react";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import CourseCard from "./CourseCard";
import ProfileSection from "./ProfileSection";
import "../../assets/CourseList/CourseList.css";

const DUMMY_COURSES = [
  {
    id: 1,
    thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80",
    title: "Learn More About Web Design",
    progress: 25,
    createdAt: "2024-01-15",
    instructor: "Kevin Gilbert",
    category: "Web Design",
    status: "in-progress",
  },
  {
    id: 2,
    thumbnail: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=800&q=80",
    title: "UI/UX Design with Figma",
    progress: 75,
    createdAt: "2024-01-15",
    instructor: "Kevin Gilbert",
    category: "UI/UX Design",
    status: "completed",
  },
  {
    id: 3,
    thumbnail: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?auto=format&fit=crop&w=800&q=80",
    title: "CSS Static and Relative Positioning",
    progress: 100,
    createdAt: "2024-01-15",
    instructor: "Kevin Gilbert",
    category: "Web Design",
    status: "completed",
  },
  {
    id: 4,
    thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=800&q=80",
    title: "JavaScript Fundamentals",
    progress: 60,
    createdAt: "2024-01-15",
    instructor: "Kevin Gilbert",
    category: "Web Development",
    status: "in-progress",
  },
  {
    id: 5,
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    title: "React.js Essential Training",
    progress: 40,
    createdAt: "2024-01-15",
    instructor: "Kevin Gilbert",
    category: "Web Development",
    status: "in-progress",
  },
  {
    id: 6,
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=800&q=80",
    title: "Node.js for Beginners",
    progress: 90,
    createdAt: "2024-01-15",
    instructor: "Kevin Gilbert",
    category: "Web Development",
    status: "completed",
  },
  {
    id: 7,
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    title: "Python Programming Basics",
    progress: 15,
    createdAt: "2024-01-15",
    instructor: "Kevin Gilbert",
    category: "Programming",
    status: "in-progress",
  },
  {
    id: 8,
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
    title: "Design Principles for Developers",
    progress: 50,
    createdAt: "2024-01-15",
    instructor: "Kevin Gilbert",
    category: "Design",
    status: "in-progress",
  },
];

const CourseList = () => {
  const location = useLocation();

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
              My Courses <span className="course-count">({DUMMY_COURSES.length})</span>
            </h2>
            <div className="filter-group">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  aria-label="Search courses"
                />
              </div>
              <div className="select-filters">
                <select
                  defaultValue="latest"
                  className="filter-select"
                  aria-label="Sort courses"
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                  <option value="progress">Most Progress</option>
                </select>
                <select
                  defaultValue="all"
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
            {DUMMY_COURSES.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>

          <div className="course-pagination-wrapper">
            <div className="course-pagination">
              <button className="course-page-item" aria-label="Previous page">
                ←
              </button>
              <button className="course-page-item course-page-item-active">1</button>
              <button className="course-page-item">2</button>
              <button className="course-page-item">3</button>
              <button className="course-page-item" aria-label="Next page">
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProfileSection>
  );
};

export default CourseList;
