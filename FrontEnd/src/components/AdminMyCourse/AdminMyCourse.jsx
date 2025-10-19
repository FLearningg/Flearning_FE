import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../../assets/AdminMyCourse/AdminMyCourse.css";
import "../../assets/AdminMyCourse/AdminMyCourse_curriculum.css";
import {
  getCourseById,
  approveCourse,
  rejectCourse,
  deactivateCourse,
  reactivateCourse,
} from "../../services/adminService";
import { getAllLessonsOfCourse } from "../../services/watchCourseService";
import { getQuizById } from "../../services/quizService";
import { toast } from "react-toastify";

const StarIcon = ({ filled, className }) => (
  <svg
    className={`${className} ${filled ? "filled" : "amc-star-empty"}`}
    viewBox="0 0 24 24"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const StatCard = ({ icon, number, label }) => (
  <div className="amc-stat-card">
    <div className="amc-stat-content">
      <div className={`amc-stat-icon ${icon.color}`}>{icon.component}</div>
      <div>
        <div className="amc-stat-number">{number}</div>
        <div className="amc-stat-label">{label}</div>
      </div>
    </div>
  </div>
);

// --- COMPONENT CHÍNH ---
function AdminMyCourse() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Nếu có dữ liệu từ location.state, ưu tiên dùng, nếu không thì fetch từ API
  const [courseData, setCourseData] = useState(
    location.state?.courseData || null
  );
  const [loading, setLoading] = useState(!location.state?.courseData);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // State for approval actions
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);

  // State for sections and lessons
  const [sectionsData, setSectionsData] = useState([]);
  const [loadingSections, setLoadingSections] = useState(false);

  // State for lesson preview
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false); // Re-added state

  // Determine course status - check actual course status from data
  const courseStatus = courseData?.status?.toLowerCase() || "";
  const isPending = courseStatus === "pending";
  const isApproved =
    courseStatus === "approved" ||
    courseStatus === "active" ||
    courseStatus === "published" ||
    courseStatus === "inactive";

  // Debug log
  console.log("Course Status Debug:", {
    courseStatus,
    isPending,
    isApproved,
    rawStatus: courseData?.status,
  });

  useEffect(() => {
    if (!courseData) {
      setLoading(true);
      setError(null);
      getCourseById(id)
        .then((res) => {
          setCourseData(res.data);
        })
        .catch(() => setError("Course not found or failed to fetch."))
        .finally(() => setLoading(false));
    }
  }, [id, courseData]);

  // Fetch sections and lessons separately
  useEffect(() => {
    if (id) {
      setLoadingSections(true);
      getAllLessonsOfCourse(id)
        .then((res) => {
          console.log("Sections and lessons from API:", res.data);
          // API returns { sections: [...] }
          const sections = res.data?.sections || res.data || [];
          setSectionsData(sections);
        })
        .catch((err) => {
          console.error("Error fetching sections:", err);
          setSectionsData([]);
        })
        .finally(() => setLoadingSections(false));
    }
  }, [id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".amc-dropdown-container")) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  // Close modal when pressing ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setShowDeleteModal(false);
      }
    };

    if (showDeleteModal) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [showDeleteModal]);

  const handleDelete = () => {
    setShowDropdown(false);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (courseData) {
      // Check if course has enrolled students
      const studentsEnrolled =
        courseData.enrollmentCount ||
        (courseData.studentsEnrolled ? courseData.studentsEnrolled.length : 0);

      if (studentsEnrolled > 0) {
        // Import toast if not already imported
        const { toast } = await import("react-toastify");
        toast.info(
          `Course "${
            courseData.title
          }" has ${studentsEnrolled} enrolled student${
            studentsEnrolled > 1 ? "s" : ""
          }. Deletion cancelled for student protection.`
        );
        setShowDeleteModal(false);
        return;
      }

      try {
        // Import deleteCourse function
        const { deleteCourse } = await import("../../services/adminService");
        const response = await deleteCourse(id);
        console.log("Delete course response:", response);

        // Import toast for success message
        const { toast } = await import("react-toastify");
        toast.success("Course deleted successfully");

        // Navigate back to courses list
        navigate("/admin/courses/all");
      } catch (error) {
        console.error("Error deleting course:", error);
        const { toast } = await import("react-toastify");
        toast.error(error.response?.data?.message || "Failed to delete course");
      } finally {
        setShowDeleteModal(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleApproveCourse = () => {
    // Open confirmation modal
    setShowApproveModal(true);
  };

  const confirmApproveCourse = async () => {
    if (!courseData || !courseData._id) return;

    try {
      setActionLoading(true);
      await approveCourse(courseData._id);
      toast.success(
        `Course "${courseData.title}" has been approved successfully!`
      );

      setShowApproveModal(false);

      // Navigate back to pending approval tab
      navigate("/admin/courses/all", {
        state: { activeTab: "pending" },
      });
    } catch (error) {
      console.error("Error approving course:", error);
      toast.error(error.response?.data?.message || "Failed to approve course");
    } finally {
      setActionLoading(false);
    }
  };

  const cancelApproveCourse = () => {
    setShowApproveModal(false);
  };

  const handleRejectCourse = async () => {
    if (!courseData || !courseData._id || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      setActionLoading(true);
      await rejectCourse(courseData._id, rejectionReason);
      toast.success(`Course "${courseData.title}" has been rejected`);
      setShowRejectModal(false);
      setRejectionReason("");

      // Navigate back to pending approval tab
      navigate("/admin/courses/all", {
        state: { activeTab: "pending" },
      });
    } catch (error) {
      console.error("Error rejecting course:", error);
      toast.error(error.response?.data?.message || "Failed to reject course");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTrailerClick = () => {
    if (trailerUrl) {
      // Check if it's a YouTube URL or external video
      const isYouTube =
        trailerUrl.includes("youtube.com") || trailerUrl.includes("youtu.be");
      const isExternalVideo =
        trailerUrl.includes("http") &&
        !trailerUrl.includes(window.location.hostname);

      if (isYouTube || isExternalVideo) {
        // Open external videos in new tab
        window.open(trailerUrl, "_blank");
      } else {
        // For local videos, you might want to open in a modal or play inline
        console.log("Playing local video:", trailerUrl);
        // Could implement a modal video player here
        window.open(trailerUrl, "_blank");
      }
    } else {
      // If no trailer, navigate to edit page to add one
      console.log("No trailer available for this course");
      navigate(`/admin/courses/edit/${id}`, {
        state: { courseData, focusSection: "trailer" },
      });
    }
  };

  // Handle lesson click to preview
  const handleLessonClick = async (lesson) => {
    console.log("Selected lesson:", lesson);
    console.log("Lesson type:", lesson.type);
    console.log("Lesson quizIds:", lesson.quizIds);
    console.log("Lesson full data:", JSON.stringify(lesson, null, 2));

    setSelectedLesson(lesson);
    setShowLessonModal(true);

    // Quiz data is already embedded in lesson.quizIds array
    if (lesson.type === "quiz" && lesson.quizIds && lesson.quizIds.length > 0) {
      // Use the first quiz in the array
      const quizDataFromLesson = lesson.quizIds[0];
      console.log("Quiz data from lesson:", quizDataFromLesson);
      setQuizData(quizDataFromLesson);
    } else {
      setQuizData(null);
    }
  };

  const handleDeactivateCourse = () => {
    // Open confirmation modal
    setShowDeactivateModal(true);
  };

  const confirmDeactivateCourse = async () => {
    if (!courseData?._id) {
      console.error("Course ID is missing.");
      toast.error("Course ID is missing.");
      return;
    }

    setActionLoading(true);
    try {
      if (courseStatus === "inactive") {
        // Reactivate the course
        const result = await reactivateCourse(courseData._id);
        console.log("Reactivation successful:", result);
        setCourseData((prev) => ({ ...prev, status: "active" }));
        toast.success(
          `Course "${courseData.title}" has been reactivated successfully!`
        );
      } else {
        // Deactivate the course
        const result = await deactivateCourse(
          courseData._id,
          "Admin deactivated the course."
        );
        console.log("Deactivation successful:", result);
        setCourseData((prev) => ({ ...prev, status: "inactive" }));
        toast.success(
          `Course "${courseData.title}" has been deactivated successfully!`
        );
      }
      setShowDeactivateModal(false);
    } catch (err) {
      console.error("Error during course status change:", err);
      toast.error(
        err.message || "An error occurred while changing course status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const cancelDeactivateCourse = () => {
    setShowDeactivateModal(false);
  };

  if (loading) return <div style={{ padding: 32 }}>Loading...</div>;
  if (error || !courseData)
    return (
      <div style={{ padding: 32, color: "red" }}>
        {error || "Course not found"}
      </div>
    );

  // Helper: get students enrolled count
  const studentsEnrolled =
    courseData.enrollmentCount ||
    (courseData.studentsEnrolled ? courseData.studentsEnrolled.length : 0);
  // Helper: get course image/thumbnail
  const courseImage =
    courseData.thumbnail ||
    courseData.image ||
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=320&h=192&fit=crop";
  // Helper: get trailer URL from API
  const trailerUrl =
    courseData.trailerUrl ||
    courseData.trailer ||
    courseData.previewVideo ||
    courseData.videoUrl ||
    courseData.introVideo ||
    null;

  // Debug log for trailer URL
  console.log("Extracted trailer URL:", trailerUrl);
  // Helper: get course price
  const coursePrice = courseData.price
    ? `${courseData.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND`
    : "N/A";
  // Helper: get course rating
  const courseRating = courseData.rating || 0;
  // Helper: get course level
  const courseLevel = courseData.level || "Beginner";
  // Helper: get uploaded/last updated
  const uploaded = courseData.createdAt
    ? new Date(courseData.createdAt).toLocaleDateString()
    : "-";
  const lastUpdated = courseData.updatedAt
    ? new Date(courseData.updatedAt).toLocaleDateString()
    : "-";

  // Stats (replace static with real data where possible)
  const stats = [
    {
      icon: {
        component: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        ),
        color: "amc-orange",
      },
      number: courseData.sections ? courseData.sections.length : 0,
      label: "Sections",
    },
    {
      icon: {
        component: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V11h2.5c.83 0 1.5.67 1.5 1.5V18h2v-5.5c0-1.1-.9-2-2-2H13v-.5c0-1.38-1.12-2.5-2.5-2.5S8 9.62 8 11v7H4z" />
          </svg>
        ),
        color: "amc-red",
      },
      number: studentsEnrolled,
      label: "Students enrolled",
    },
    {
      icon: {
        component: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
          </svg>
        ),
        color: "amc-green",
      },
      number: courseLevel,
      label: "Course level",
    },
    {
      icon: {
        component: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
          </svg>
        ),
        color: "amc-gray",
      },
      number: courseData.duration || "N/A",
      label: "Hours",
    },
  ];

  return (
    <>
      <div className="amc-breadcrumb">
        <div className="amc-breadcrumb-content">
          <span
            onClick={() => navigate("/admin/courses/all")}
            className="amc-breadcrumb-link"
          >
            All Courses
          </span>
          <span className="amc-breadcrumb-separator">/</span>
          <span className="amc-breadcrumb-active">{courseData.title}</span>
        </div>
      </div>

      <div className="amc-content">
        {/* PHẦN TRÊN: Thông tin chính và Rating */}
        <div className="amc-content-grid">
          {/* Cột chính (trái) */}
          <div className="amc-main-info-column">
            <div className="amc-card">
              <div className="amc-card-content">
                <div className="amc-course-info">
                  <img
                    src={courseImage}
                    alt="Course thumbnail"
                    className="amc-course-image"
                  />
                  <div className="amc-course-details">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "16px",
                      }}
                    >
                      <div>
                        <p className="amc-course-meta">
                          Uploaded: {uploaded} <br /> Last Updated:{" "}
                          {lastUpdated}
                        </p>
                        <h2 className="amc-course-title">{courseData.title}</h2>
                        <p className="amc-course-description">
                          {courseData.detail?.description ||
                            courseData.description}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {isPending ? (
                          // Course is pending approval - show Approve & Reject buttons
                          <>
                            <button
                              className="amc-approve-btn"
                              onClick={handleApproveCourse}
                              disabled={actionLoading}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </svg>
                              {actionLoading
                                ? "Approving..."
                                : "Approve Course"}
                            </button>
                            <button
                              className="amc-reject-btn"
                              onClick={() => setShowRejectModal(true)}
                              disabled={actionLoading}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                              </svg>
                              Reject Course
                            </button>
                          </>
                        ) : isApproved ? (
                          // Course is approved - show Deactivate button
                          <>
                            <button
                              className="amc-deactivate-btn"
                              onClick={handleDeactivateCourse}
                              disabled={actionLoading}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                              </svg>
                              {courseStatus === "inactive"
                                ? "Reactivate Course"
                                : "Deactivate Course"}
                            </button>
                            <div className="amc-dropdown-container">
                              <button
                                className="amc-more-btn"
                                onClick={toggleDropdown}
                              >
                                ...
                              </button>
                              {showDropdown && (
                                <div className="amc-dropdown-menu">
                                  <button
                                    className="amc-dropdown-item amc-dropdown-item-danger"
                                    onClick={handleDelete}
                                  >
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                    >
                                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          // Other statuses (draft, rejected, etc.) - show delete only
                          <div className="amc-dropdown-container">
                            <button
                              className="amc-more-btn"
                              onClick={toggleDropdown}
                            >
                              ...
                            </button>
                            {showDropdown && (
                              <div className="amc-dropdown-menu">
                                <button
                                  className="amc-dropdown-item amc-dropdown-item-danger"
                                  onClick={handleDelete}
                                >
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="amc-course-creators-rating">
                      <div className="amc-creators-info">
                        <span style={{ fontSize: "14px", color: "#8c94a3" }}>
                          Created by:
                        </span>
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>
                          {courseData.createdBy?.firstName &&
                          courseData.createdBy?.lastName
                            ? `${courseData.createdBy.firstName} ${courseData.createdBy.lastName}`
                            : courseData.createdBy?.name || "Unknown"}
                        </span>
                      </div>
                      <div className="amc-rating">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            filled={i < Math.floor(courseRating)}
                            className="amc-star"
                          />
                        ))}
                        <span className="amc-rating-text">{courseRating}</span>
                        <span className="amc-rating-count">
                          ({studentsEnrolled} Ratings)
                        </span>
                      </div>
                    </div>
                    <div className="amc-course-pricing">
                      <div className="amc-price-item">
                        <h3>{coursePrice}</h3>
                        <p>Course prices</p>
                      </div>
                      <div className="amc-price-item">
                        <h3>0đ</h3>
                        <p>VND revenue</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Trailer Section */}
            <div className="amc-card amc-trailer-card">
              <div className="amc-card-header">
                <h3 className="amc-card-title">Course Trailer</h3>
              </div>
              <div className="amc-card-content">
                <div className="amc-trailer-container">
                  {trailerUrl ? (
                    <video
                      className="amc-trailer-video"
                      controls
                      poster={courseImage}
                      preload="metadata"
                      onError={(e) => {
                        console.error("Error loading trailer video:", e);
                        e.target.style.display = "none";
                      }}
                    >
                      <source src={trailerUrl} type="video/mp4" />
                      <source src={trailerUrl} type="video/webm" />
                      <source src={trailerUrl} type="video/ogg" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div
                      className="amc-trailer-placeholder"
                      onClick={handleTrailerClick}
                    >
                      <div className="amc-trailer-overlay">
                        <div className="amc-play-button">
                          {trailerUrl ? (
                            <svg
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          ) : (
                            <svg
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                          )}
                        </div>
                        <div className="amc-trailer-text">
                          <h4>
                            {trailerUrl
                              ? "Course Preview"
                              : "Add Course Trailer"}
                          </h4>
                          <p>
                            {trailerUrl
                              ? "Watch a preview of this course content"
                              : "Click to add a trailer to showcase your course"}
                          </p>
                        </div>
                      </div>
                      <img
                        src={courseImage}
                        alt="Course preview"
                        className="amc-trailer-thumbnail"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar (phải) */}
          <div>
            <div className="amc-rating-card">
              <div className="amc-rating-header">
                <h3 className="amc-card-title">Overall Course Rating</h3>
                <select className="amc-select">
                  <option>This week</option>
                  <option>This month</option>
                  <option>This year</option>
                </select>
              </div>
              <div className="amc-rating-content">
                <div className="amc-rating-summary-new">
                  <div className="amc-rating-summary-box">
                    <div className="amc-rating-number-large">
                      {courseRating}
                    </div>
                    <div className="amc-rating-stars-large">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          filled={i < Math.floor(courseRating)}
                          className="amc-star"
                        />
                      ))}
                    </div>
                    <div className="amc-rating-label">Course Rating</div>
                  </div>
                </div>
                <div className="amc-rating-breakdown">
                  {[
                    { stars: 5, percentage: 67 },
                    { stars: 4, percentage: 27 },
                    { stars: 3, percentage: 5 },
                    { stars: 2, percentage: 1 },
                    { stars: 1, percentage: 1, isLessThan: true },
                  ].map((rating) => (
                    <div className="amc-rating-row" key={rating.stars}>
                      <div className="amc-rating-stars-small">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            filled={i < rating.stars}
                            className="amc-star-small"
                          />
                        ))}
                        <span className="amc-rating-text-small">
                          {rating.stars} Star
                        </span>
                      </div>
                      <div className="amc-progress-bar">
                        <div
                          className="amc-progress-fill"
                          style={{ width: `${rating.percentage}%` }}
                        ></div>
                      </div>
                      <span className="amc-rating-percentage">
                        {rating.isLessThan
                          ? `<${rating.percentage}`
                          : rating.percentage}
                        %
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === PHẦN THỐNG KÊ (trải rộng) === */}
        <div className="amc-stats-grid" style={{ marginBottom: "32px" }}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* === PHẦN COURSE CURRICULUM (Sections & Lessons) === */}
        <div className="amc-curriculum-section">
          <div className="amc-card">
            <div className="amc-card-header">
              <h3 className="amc-card-title">Course Curriculum</h3>
              <div className="amc-curriculum-stats">
                <span className="amc-stat-badge">
                  {sectionsData?.length || 0} Sections
                </span>
                <span className="amc-stat-badge">
                  {sectionsData?.reduce(
                    (total, section) => total + (section.lessons?.length || 0),
                    0
                  ) || 0}{" "}
                  Lessons
                </span>
              </div>
            </div>
            <div className="amc-card-content">
              {loadingSections ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#6b7280",
                  }}
                >
                  <div
                    className="loading-spinner"
                    style={{
                      margin: "0 auto 16px",
                      width: "40px",
                      height: "40px",
                      border: "4px solid #f3f4f6",
                      borderTop: "4px solid #ff6636",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  <p>Loading curriculum...</p>
                </div>
              ) : sectionsData && sectionsData.length > 0 ? (
                <div className="amc-curriculum-list">
                  {sectionsData.map((section, sectionIndex) => (
                    <div
                      key={section._id || sectionIndex}
                      className="amc-section-item"
                    >
                      <div className="amc-section-header">
                        <div className="amc-section-title">
                          <span className="amc-section-number">
                            Section {sectionIndex + 1}
                          </span>
                          <h4>
                            {section.title || `Section ${sectionIndex + 1}`}
                          </h4>
                        </div>
                        <div className="amc-section-meta">
                          <span className="amc-lesson-count">
                            {section.lessons?.length || 0} lesson
                            {(section.lessons?.length || 0) !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      {section.description && (
                        <p className="amc-section-description">
                          {section.description}
                        </p>
                      )}
                      {section.lessons && section.lessons.length > 0 ? (
                        <div className="amc-lessons-list">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson._id || lessonIndex}
                              className="amc-lesson-item"
                              onClick={() => handleLessonClick(lesson)}
                            >
                              <div className="amc-lesson-icon">
                                {lesson.type === "video" ? (
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                ) : lesson.type === "quiz" ? (
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                  </svg>
                                ) : (
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                  </svg>
                                )}
                              </div>
                              <div className="amc-lesson-info">
                                <span className="amc-lesson-title">
                                  {lesson.title || `Lesson ${lessonIndex + 1}`}
                                </span>
                                {lesson.description && (
                                  <p className="amc-lesson-description">
                                    {lesson.description}
                                  </p>
                                )}
                              </div>
                              <div className="amc-lesson-meta">
                                {lesson.duration && (
                                  <span className="amc-lesson-duration">
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                    >
                                      <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                                    </svg>
                                    {lesson.duration}
                                  </span>
                                )}
                                {lesson.type && (
                                  <span
                                    className={`amc-lesson-type amc-lesson-type-${lesson.type}`}
                                  >
                                    {lesson.type}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="amc-empty-lessons">
                          <p>No lessons in this section</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="amc-empty-curriculum">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    opacity="0.3"
                  >
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                  </svg>
                  <p>No curriculum content available</p>
                  <span>
                    This course doesn't have any sections or lessons yet
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal &&
        courseData &&
        (() => {
          const studentsEnrolled =
            courseData.enrollmentCount ||
            (courseData.studentsEnrolled
              ? courseData.studentsEnrolled.length
              : 0);
          const hasStudents = studentsEnrolled > 0;

          return (
            <div className="amc-modal-overlay">
              <div className={`amc-modal ${hasStudents ? "info-modal" : ""}`}>
                <div className="amc-modal-header">
                  <h3 className="amc-modal-title">
                    {hasStudents ? "Course Information" : "Delete Course"}
                  </h3>
                  <button className="amc-modal-close" onClick={cancelDelete}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                </div>
                <div className="amc-modal-body">
                  <div className="amc-modal-icon">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                    </svg>
                  </div>
                  <h4 className="amc-modal-message">
                    {hasStudents
                      ? "Cannot Delete Course with Enrolled Students"
                      : "Are you sure you want to delete this course?"}
                  </h4>
                  <p className="amc-modal-description">
                    {hasStudents ? (
                      <>
                        <strong>"{courseData.title}"</strong> currently has{" "}
                        <strong>
                          {studentsEnrolled} enrolled student
                          {studentsEnrolled > 1 ? "s" : ""}
                        </strong>
                        . This course cannot be deleted to protect student
                        learning progress and data.
                      </>
                    ) : (
                      <>
                        <strong>"{courseData.title}"</strong> will be
                        permanently deleted. This action cannot be undone and
                        all course data will be lost.
                      </>
                    )}
                  </p>
                  <div className="amc-modal-warning-info">
                    <p className="amc-students-info">
                      <strong>Students enrolled:</strong> {studentsEnrolled}
                    </p>
                    {hasStudents && (
                      <p className="amc-warning-text">
                        ⚠️ To delete this course, please wait for students to
                        complete their learning or contact support for
                        assistance.
                      </p>
                    )}
                  </div>
                </div>
                <div className="amc-modal-footer">
                  <button
                    className="amc-modal-button amc-modal-button-secondary"
                    onClick={cancelDelete}
                  >
                    {hasStudents ? "Understood" : "Cancel"}
                  </button>
                  {!hasStudents && (
                    <button
                      className="amc-modal-button amc-modal-button-danger"
                      onClick={confirmDelete}
                    >
                      Delete Course
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

      {/* Reject Course Modal */}
      {showRejectModal && (
        <div
          className="amc-modal-overlay"
          onClick={() => setShowRejectModal(false)}
        >
          <div
            className="amc-modal amc-reject-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="amc-modal-header">
              <h3 className="amc-modal-title">Reject Course</h3>
              <button
                className="amc-modal-close"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <div className="amc-modal-body">
              <div className="amc-modal-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </div>
              <h4 className="amc-modal-message">
                Reject "{courseData?.title}"?
              </h4>
              <p className="amc-modal-description">
                Please provide a detailed reason for rejecting this course. The
                instructor will receive this feedback.
              </p>
              <textarea
                className="amc-modal-textarea"
                placeholder="Enter rejection reason (e.g., content quality issues, policy violations, incomplete information...)"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                autoFocus
              />
            </div>
            <div className="amc-modal-footer">
              <button
                className="amc-modal-button amc-modal-button-secondary"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="amc-modal-button amc-modal-button-danger"
                onClick={handleRejectCourse}
                disabled={actionLoading || !rejectionReason.trim()}
              >
                {actionLoading ? "Rejecting..." : "Reject Course"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate/Reactivate Course Modal */}
      {showDeactivateModal && (
        <div className="amc-modal-overlay" onClick={cancelDeactivateCourse}>
          <div className="amc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="amc-modal-header">
              <h3 className="amc-modal-title">
                {courseStatus === "inactive"
                  ? "Reactivate Course"
                  : "Deactivate Course"}
              </h3>
              <button
                className="amc-modal-close"
                onClick={cancelDeactivateCourse}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <div className="amc-modal-body">
              <div className="amc-modal-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  {courseStatus === "inactive" ? (
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  ) : (
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                  )}
                </svg>
              </div>
              <h4 className="amc-modal-message">
                {courseStatus === "inactive"
                  ? `Reactivate "${courseData?.title}"?`
                  : `Deactivate "${courseData?.title}"?`}
              </h4>
              <p className="amc-modal-description">
                {courseStatus === "inactive" ? (
                  <>
                    This course will be reactivated and become visible to
                    students again. Students will be able to enroll and access
                    the course content.
                  </>
                ) : (
                  <>
                    This course will be deactivated and hidden from students.
                    Current enrolled students will still have access, but new
                    enrollments will be disabled.
                  </>
                )}
              </p>
            </div>
            <div className="amc-modal-footer">
              <button
                className="amc-modal-button amc-modal-button-secondary"
                onClick={cancelDeactivateCourse}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className={`amc-modal-button ${
                  courseStatus === "inactive"
                    ? "amc-modal-button-primary"
                    : "amc-modal-button-danger"
                }`}
                onClick={confirmDeactivateCourse}
                disabled={actionLoading}
              >
                {actionLoading
                  ? courseStatus === "inactive"
                    ? "Reactivating..."
                    : "Deactivating..."
                  : courseStatus === "inactive"
                  ? "Reactivate Course"
                  : "Deactivate Course"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Course Modal */}
      {showApproveModal && (
        <div className="amc-modal-overlay" onClick={cancelApproveCourse}>
          <div className="amc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="amc-modal-header">
              <h3 className="amc-modal-title">Approve Course</h3>
              <button className="amc-modal-close" onClick={cancelApproveCourse}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <div className="amc-modal-body">
              <div className="amc-modal-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="#10b981">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <h4 className="amc-modal-message">
                Approve "{courseData?.title}"?
              </h4>
              <p className="amc-modal-description">
                This course will be approved and published. Students will be
                able to discover, enroll, and access all course content. The
                instructor will be notified of the approval.
              </p>
            </div>
            <div className="amc-modal-footer">
              <button
                className="amc-modal-button amc-modal-button-secondary"
                onClick={cancelApproveCourse}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="amc-modal-button amc-modal-button-primary"
                onClick={confirmApproveCourse}
                disabled={actionLoading}
              >
                {actionLoading ? "Approving..." : "Approve Course"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Preview Modal */}
      {showLessonModal && selectedLesson && (
        <div
          className="amc-modal-overlay"
          onClick={() => setShowLessonModal(false)}
        >
          <div
            className="amc-modal amc-lesson-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="amc-modal-header">
              <h3 className="amc-modal-title">
                {selectedLesson.title || "Lesson Preview"}
              </h3>
              <button
                className="amc-modal-close"
                onClick={() => setShowLessonModal(false)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <div className="amc-modal-body amc-lesson-modal-body">
              {selectedLesson.type === "video" ? (
                <div className="amc-video-container">
                  {selectedLesson.videoUrl || selectedLesson.url ? (
                    <video
                      controls
                      className="amc-lesson-video"
                      autoPlay
                      key={selectedLesson._id}
                    >
                      <source
                        src={selectedLesson.videoUrl || selectedLesson.url}
                        type="video/mp4"
                      />
                      <source
                        src={selectedLesson.videoUrl || selectedLesson.url}
                        type="video/webm"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="amc-no-content">
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        opacity="0.3"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <p>No video available for this lesson</p>
                    </div>
                  )}
                  {selectedLesson.description && (
                    <div className="amc-lesson-description-box">
                      <h4>Description</h4>
                      <p>{selectedLesson.description}</p>
                    </div>
                  )}
                </div>
              ) : selectedLesson.type === "quiz" ? (
                <div className="amc-quiz-container">
                  <div className="amc-quiz-header">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="#ff6636"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <h4>Quiz Preview</h4>
                  </div>
                  {(selectedLesson.description || quizData?.description) && (
                    <div className="amc-quiz-description">
                      <p>
                        {selectedLesson.description || quizData?.description}
                      </p>
                    </div>
                  )}
                  {loadingQuiz ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#6b7280",
                      }}
                    >
                      <div
                        className="loading-spinner"
                        style={{
                          margin: "0 auto 16px",
                          width: "40px",
                          height: "40px",
                          border: "4px solid #f3f4f6",
                          borderTop: "4px solid #ff6636",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      ></div>
                      <p>Loading quiz...</p>
                    </div>
                  ) : (quizData?.questions || selectedLesson.questions)
                      ?.length > 0 ? (
                    <div className="amc-quiz-questions">
                      <div className="amc-quiz-info">
                        <span className="amc-quiz-count">
                          {
                            (quizData?.questions || selectedLesson.questions)
                              .length
                          }{" "}
                          Question
                          {(quizData?.questions || selectedLesson.questions)
                            .length !== 1
                            ? "s"
                            : ""}
                        </span>
                        {(selectedLesson.duration || quizData?.duration) && (
                          <span className="amc-quiz-duration">
                            Duration:{" "}
                            {selectedLesson.duration || quizData?.duration}
                          </span>
                        )}
                      </div>
                      {(quizData?.questions || selectedLesson.questions).map(
                        (question, index) => {
                          // Handle different question structures
                          const questionText =
                            question.content ||
                            question.question ||
                            question.text;
                          const questionAnswers =
                            question.answers || question.options || [];
                          const questionScore =
                            question.score || question.points || 1;

                          return (
                            <div key={index} className="amc-quiz-question">
                              <div className="amc-question-header">
                                <span className="amc-question-number">
                                  Question {index + 1}
                                </span>
                                <span className="amc-question-points">
                                  {questionScore} pts
                                </span>
                              </div>
                              <p className="amc-question-text">
                                {questionText}
                              </p>
                              {questionAnswers.length > 0 && (
                                <div className="amc-question-options">
                                  {questionAnswers.map((answer, optIndex) => {
                                    const answerText =
                                      answer.content || answer.text || answer;
                                    const isCorrect =
                                      answer.isCorrect ||
                                      question.correctAnswer === optIndex;

                                    return (
                                      <div
                                        key={optIndex}
                                        className={`amc-option ${
                                          isCorrect ? "amc-option-correct" : ""
                                        }`}
                                      >
                                        <span className="amc-option-letter">
                                          {String.fromCharCode(65 + optIndex)}
                                        </span>
                                        <span className="amc-option-text">
                                          {answerText}
                                        </span>
                                        {isCorrect && (
                                          <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="#10b981"
                                          >
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                          </svg>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              {question.explanation && (
                                <div className="amc-question-explanation">
                                  <strong>Explanation:</strong>{" "}
                                  {question.explanation}
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <div className="amc-no-content">
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        opacity="0.3"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                      </svg>
                      <p>No quiz questions available</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="amc-no-content">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    opacity="0.3"
                  >
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                  </svg>
                  <p>Content preview not available for this lesson type</p>
                  {selectedLesson.description && (
                    <div className="amc-lesson-description-box">
                      <p>{selectedLesson.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminMyCourse;
