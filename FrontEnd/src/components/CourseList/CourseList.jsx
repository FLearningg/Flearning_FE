import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import CourseCard from "./CourseCard";
import ProfileSection from "./ProfileSection";
import {
  getEnrolledCourses,
  getAllCoursesProgress,
  createCourseFeedback,
  getCourseFeedback,
  updateCourseFeedback,
} from "../../services/profileService";
import { useSelector } from "react-redux";
import "../../assets/CourseList/CourseList.css";
import ReviewModal from "../WatchCourse/ReviewModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CourseList = () => {
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [coursesProgress, setCoursesProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const coursesPerPage = 8;
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const { currentUser } = useSelector((state) => state.auth);
  const [feedbackByCourseId, setFeedbackByCourseId] = useState({});

  useEffect(() => {
    fetchCoursesData();
  }, []);

  useEffect(() => {
    // Khi đã có danh sách courses, fetch feedback cho từng course
    if (courses.length > 0 && currentUser) {
      const fetchAllFeedback = async () => {
        const feedbackMap = {};
        await Promise.all(
          courses.map(async (enrollment) => {
            try {
              const res = await getCourseFeedback(enrollment.course.id);
              const myFeedback = res.data.feedback.find((fb) => {
                if (!fb.userId) return false;
                if (typeof fb.userId === "string") {
                  return (
                    fb.userId === currentUser._id ||
                    fb.userId === currentUser.id
                  );
                }
                return (
                  fb.userId._id === currentUser._id ||
                  fb.userId._id === currentUser.id
                );
              });
              feedbackMap[enrollment.course.id] = myFeedback || null;
            } catch {
              feedbackMap[enrollment.course.id] = null;
            }
          })
        );
        setFeedbackByCourseId(feedbackMap);
      };
      fetchAllFeedback();
    }
  }, [courses, currentUser]);

  const fetchCoursesData = async () => {
    try {
      setLoading(true);

      // Fetch both enrolled courses and their progress data
      const [enrolledResponse, progressResponse] = await Promise.all([
        getEnrolledCourses(),
        getAllCoursesProgress(),
      ]);

      setCourses(enrolledResponse.data.data);
      setCoursesProgress(progressResponse.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch courses data");
    } finally {
      setLoading(false);
    }
  };

  // Merge course data with progress data
  const coursesWithProgress = courses.map((enrollment) => {
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

  const filteredCourses = coursesWithProgress
    .filter((course) => {
      const matchesSearch = course.course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && course.status === "completed") ||
        (statusFilter === "in-progress" && course.status === "in-progress");
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

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const currentCourses = filteredCourses.slice(
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
              My Courses{" "}
              <span className="course-count">({filteredCourses.length})</span>
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
            {currentCourses.map((enrollment) => {
              const myFeedback = feedbackByCourseId[enrollment.course.id];
              return (
                <CourseCard
                  key={enrollment.course.id}
                  id={enrollment.course.id}
                  thumbnail={enrollment.course.thumbnail}
                  title={enrollment.course.title}
                  progress={enrollment.progress}
                  instructor={enrollment.course.instructor}
                  category={enrollment.course.category}
                  status={enrollment.status}
                  completedLessons={enrollment.completedLessons}
                  totalLessons={enrollment.totalLessons}
                  onReview={
                    enrollment.status === "completed"
                      ? () => {
                          setSelectedCourseId(enrollment.course.id);
                          setIsReviewOpen(true);
                        }
                      : undefined
                  }
                  reviewMode={!!myFeedback}
                >
                  {/* Có thể truyền thêm prop nếu muốn */}
                </CourseCard>
              );
            })}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="course-pagination">
              <button
                className="course-pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                ← Prev
              </button>
              <span className="course-pagination-info">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                className="course-pagination-btn"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
                }
                disabled={currentPage >= totalPages - 1}
              >
                Next →
              </button>
            </div>
          )}

          {filteredCourses.length === 0 && (
            <div className="no-courses-message">
              No courses found matching your criteria
            </div>
          )}
        </div>
      </div>
      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSubmit={async ({ rating, feedback }) => {
          const myFeedback = feedbackByCourseId[selectedCourseId];
          try {
            if (myFeedback) {
              await updateCourseFeedback(selectedCourseId, {
                content: feedback,
                rateStar: rating,
              });
              toast.success("Review updated successfully!");
            } else {
              await createCourseFeedback(selectedCourseId, {
                content: feedback,
                rateStar: rating,
              });
              toast.success("Review submitted successfully!");
            }
            // Refetch feedback cho course này
            const res = await getCourseFeedback(selectedCourseId);
            const updatedFeedback = res.data.feedback.find((fb) => {
              if (!fb.userId) return false;
              if (typeof fb.userId === "string") {
                return (
                  fb.userId === currentUser._id || fb.userId === currentUser.id
                );
              }
              return (
                fb.userId._id === currentUser._id ||
                fb.userId._id === currentUser.id
              );
            });
            setFeedbackByCourseId((prev) => ({
              ...prev,
              [selectedCourseId]: updatedFeedback || null,
            }));
          } catch (err) {
            toast.error(
              err.response?.data?.message || "Failed to submit review!"
            );
          }
          setIsReviewOpen(false);
        }}
        // Truyền giá trị mặc định nếu đã review
        defaultRating={feedbackByCourseId[selectedCourseId]?.rateStar || 0}
        defaultFeedback={feedbackByCourseId[selectedCourseId]?.content || ""}
        reviewMode={!!feedbackByCourseId[selectedCourseId]}
      />
      <ToastContainer autoClose={3000} />
    </ProfileSection>
  );
};

export default CourseList;
