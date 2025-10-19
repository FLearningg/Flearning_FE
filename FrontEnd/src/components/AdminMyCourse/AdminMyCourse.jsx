import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import "../../assets/AdminMyCourse/AdminMyCourse.css";
import { getCourseById } from "../../services/adminService";
import { getUserProfile } from "../../services/authService";

// Đăng ký các module cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

// --- CÁC COMPONENT BIỂU ĐỒ (giữ nguyên) ---

const RevenueChart = () => {
  const data = {
    labels: ["Aug 01", "Aug 10", "Aug 20", "Aug 31"],
    datasets: [
      {
        label: "Revenue",
        data: [50000, 150000, 51749, 120000],
        borderColor: "#23bd33",
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#23bd33",
        pointHoverBorderWidth: 3,
        tension: 0.4,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          if (!ctx) return null;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(35, 189, 51, 0.1)");
          gradient.addColorStop(1, "rgba(35, 189, 51, 0)");
          return gradient;
        },
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#000",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        cornerRadius: 4,
        displayColors: false,
        callbacks: {
          title: () => null,
          label: (context) => `$${context.parsed.y.toLocaleString()}`,
          afterBody: (context) => context[0].label.replace("Aug ", "") + " Aug",
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#9ca3af" } },
      y: {
        grid: { color: "#e5e7eb", borderDash: [5, 5] },
        ticks: {
          color: "#9ca3af",
          callback: (value) => {
            if (value >= 1000) return `${value / 1000}k`;
            return value;
          },
        },
      },
    },
  };
  return <Line data={data} options={options} />;
};

const CourseOverviewChart = () => {
  const data = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Comments",
        data: [120, 190, 150, 220, 180, 250, 210],
        borderColor: "#ff6636",
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "View",
        data: [80, 110, 90, 150, 130, 170, 140],
        borderColor: "#564ffd",
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}k`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#9ca3af" } },
      y: {
        grid: { color: "#e5e7eb" },
        ticks: {
          color: "#9ca3af",
          callback: (value) => `${value}k`,
        },
      },
    },
  };
  return <Line data={data} options={options} />;
};

const RatingLineChart = () => {
  const data = {
    labels: ["", "", "", "", "", "", ""],
    datasets: [
      {
        data: [20, 40, 30, 50, 45, 60, 55],
        borderColor: "#f97316",
        borderWidth: 2.5,
        tension: 0.4,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
    elements: { point: { radius: 0 } },
  };
  return <Line data={data} options={options} />;
};

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
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data: user } = await getUserProfile();
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!courseData) {
      setLoading(true);
      setError(null);
      getCourseById(id)
        .then((res) => {
          console.log("Course data from API:", res.data);
          setCourseData(res.data);
        })
        .catch(() => setError("Course not found or failed to fetch."))
        .finally(() => setLoading(false));
    }
  }, [id, courseData]);

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

  const handleEdit = () => {
    setShowDropdown(false);
    // Navigate to edit course page
    navigate(`/admin/courses/edit/${id}`, { state: { courseData } });
  };

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
  const coursePrice = courseData.price ? `$${courseData.price}` : "N/A";
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

  const isAdmin = currentUser?.role === "admin";

  return (
    <>
      <div className="amc-breadcrumb">
        <div className="amc-breadcrumb-content">
          <span
            onClick={() => navigate("/admin/courses/all")}
            className="amc-breadcrumb-link"
          >
            My Courses
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
                        {!isAdmin && (
                          <button className="amc-withdraw-btn">
                            Withdraw Money
                          </button>
                        )}
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
                                className="amc-dropdown-item"
                                onClick={handleEdit}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                </svg>
                                Edit
                              </button>
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
                      </div>
                    </div>
                    <div className="amc-course-creators-rating">
                      <div className="amc-creators-info">
                        <span style={{ fontSize: "14px", color: "#8c94a3" }}>
                          Created by:
                        </span>
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>
                          {courseData.instructorName || "Admin"}
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
                        <h3>$0.00</h3>
                        <p>USD dollar revenue</p>
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
                  <div className="amc-rating-mini-chart">
                    <RatingLineChart />
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

        {/* === PHẦN BIỂU ĐỒ (trải rộng) === */}
        <div className="amc-charts-grid">
          <div className="amc-card">
            <div className="amc-card-header">
              <h3 className="amc-card-title">Revenue</h3>
              <select className="amc-select">
                <option>This month</option>
                <option>This week</option>
                <option>This year</option>
              </select>
            </div>
            <div className="amc-card-content">
              <div
                className="amc-chart-placeholder"
                style={{ height: "250px", position: "relative" }}
              >
                <RevenueChart />
              </div>
            </div>
          </div>
          <div className="amc-card">
            <div className="amc-card-header">
              <h3 className="amc-card-title">Course Overview</h3>
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: "#ff6636",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <span style={{ fontSize: "14px", color: "#8c94a3" }}>
                    Comments
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: "#564ffd",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <span style={{ fontSize: "14px", color: "#8c94a3" }}>
                    View
                  </span>
                </div>
                <select className="amc-select">
                  <option>This month</option>
                  <option>This week</option>
                  <option>This year</option>
                </select>
              </div>
            </div>
            <div className="amc-card-content">
              <div
                className="amc-chart-placeholder"
                style={{ height: "250px", position: "relative" }}
              >
                <CourseOverviewChart />
              </div>
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
    </>
  );
}

export default AdminMyCourse;
