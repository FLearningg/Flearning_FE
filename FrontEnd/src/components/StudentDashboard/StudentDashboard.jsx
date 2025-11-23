import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaBook, FaTrophy, FaUsers, FaClock, FaFire } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import ProfileSection from "../CourseList/ProfileSection";
import {
  getEnrolledCourses,
  getAllCoursesProgress,
} from "../../services/profileService";
import {
  createCourseFeedback,
  getCourseFeedback,
  updateCourseFeedback,
  getCourseAverageRating,
} from "../../services/feedbackService";
import { getStudentAnalytics } from "../../services/analyticsService";
import "../../assets/StudentDashboard/StudentDashboard.css";
import "../../assets/StudentDashboard/ModernStudentDashboard.css";
import { useSelector, useDispatch } from "react-redux";
import ReviewModal from "../WatchCourse/ReviewModal";
import SurveyModal from "../LearningPath/SurveyModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  checkSurveyCompletion,
  openSurveyModal,
} from "../../store/learningPathSlice";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

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
  onReview,
  reviewMode,
  onContinue,
  onCardClick,
}) => (
  <div
    className="learning-card"
    onClick={onCardClick}
    style={{ cursor: onCardClick ? "pointer" : undefined }}
  >
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
      <button
        className="learning-watch-btn"
        aria-label={`Watch ${title}`}
        onClick={(e) => {
          e.stopPropagation();
          if (status === "completed" && onReview) {
            onReview();
          } else if (status === "in-progress" && onContinue) {
            onContinue();
          }
        }}
      >
        {status === "completed"
          ? reviewMode
            ? "Update Review"
            : "Review Course"
          : "Continue Learning"}
      </button>
    </div>
  </div>
);

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { surveyCompleted } = useSelector((state) => state.learningPath);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [coursesProgress, setCoursesProgress] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const coursesPerPage = 4;
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [feedbackByCourseId, setFeedbackByCourseId] = useState({});
  const dashboardRef = useRef(null);

  useEffect(() => {
    fetchDashboardData();
    // Check survey completion status
    dispatch(checkSurveyCompletion());
    
    // Initialize available years (last 5 years)
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 5; i++) {
      years.push(currentYear - i);
    }
    setAvailableYears(years);
  }, [dispatch]);

  useEffect(() => {
    if (selectedYear) {
      fetchDashboardData();
    }
  }, [selectedYear]);

  useEffect(() => {
    // Khi đã có danh sách courses, fetch feedback cho từng course
    if (enrolledCourses.length > 0 && currentUser) {
      const fetchAllFeedback = async () => {
        const feedbackMap = {};
        await Promise.all(
          enrolledCourses.map(async (enrollment) => {
            try {
              const res = await getCourseFeedback(enrollment.course.id);
              const myFeedback = res.feedback.find((fb) => {
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
  }, [enrolledCourses, currentUser]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      console.log('Fetching analytics with:', { year: selectedYear });

      // Fetch enrolled courses, progress, and analytics data
      const [enrolledResponse, progressResponse, analyticsResponse] = await Promise.all([
        getEnrolledCourses(),
        getAllCoursesProgress(),
        getStudentAnalytics(selectedYear),
      ]);

      console.log('Analytics API response:', analyticsResponse);

      setEnrolledCourses(enrolledResponse.data.data);
      setCoursesProgress(progressResponse.data.data);
      setAnalytics(analyticsResponse.data);
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
      icon: <FaClock />,
      count: analytics?.learningTime?.total || 0,
      label: "Learning Hours",
      color: "#f59e0b",
    },
    {
      id: 5,
      icon: <FaFire />,
      count: analytics?.streak?.current || 0,
      label: "Day Streak",
      color: "#ef4444",
    },
  ];

  // Debug: Log analytics data
  console.log('Analytics data:', analytics);
  console.log('Weekly activity:', analytics?.weeklyActivity);
  if (analytics?.weeklyActivity) {
    console.log('First activity item:', analytics.weeklyActivity[0]);
    console.log('Activity array length:', analytics.weeklyActivity.length);
    console.log('All activity data:', JSON.stringify(analytics.weeklyActivity, null, 2));
  }

  // Weekly activity chart data
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weeklyChartData = {
    labels: analytics?.weeklyActivity?.map(d => monthNames[d.month - 1]) || [],
    datasets: [{
      label: 'Courses Completed',
      data: analytics?.weeklyActivity?.map(d => d.courses) || [],
      backgroundColor: 'rgba(102, 126, 234, 0.5)',
      borderColor: 'rgb(102, 126, 234)',
      borderWidth: 2,
      borderRadius: 6,
    }]
  };

  const weeklyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true,
        position: 'top',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          title: (context) => `Day ${context[0].label}`,
          label: (context) => `Courses: ${context.parsed.y}`
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Day of Month',
          font: { size: 14, weight: 'bold' }
        },
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 15
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Courses Completed',
          font: { size: 14, weight: 'bold' }
        },
        ticks: { 
          stepSize: 1,
          precision: 0
        },
      },
    },
  };

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

  // Lấy tên hiển thị ưu tiên firstName + lastName, nếu không có thì dùng userName
  const displayName = currentUser
    ? currentUser.firstName || currentUser.lastName
      ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim()
      : currentUser.userName || "User"
    : "User";

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
          <h2>Learning Progress Dashboard</h2>
          <div className="dashboard-header-actions">
            <button
              className="learning-path-btn"
              onClick={() => navigate("/profile/learning-path")}
            >
              Create Your Learning Path
            </button>
          </div>
        </div>

        <div className="stats-grid">
          {statsData.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>

        {/* Weekly Activity Chart */}
        {analytics?.weeklyActivity && (
          <div className="sd-chart-section">
            <div className="chart-header">
              <h3>📅 Monthly Learning Activity</h3>
              <div className="filter-group">
                <select 
                  className="sd-year-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sd-chart-container">
              {analytics.weeklyActivity.length > 0 ? (
                <Bar data={weeklyChartData} options={weeklyChartOptions} />
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                  No learning activity data for this period
                </div>
              )}
            </div>
          </div>
        )}

        <div className="learning-section">
          <div className="learning-section-header">
            <h3>{`Let's start learning, ${displayName}`}</h3>
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
            {currentCourses.map((enrollment) => {
              const myFeedback = feedbackByCourseId[enrollment.course.id];
              return (
                <LearningCard
                  key={enrollment.course.id}
                  thumbnail={enrollment.course.thumbnail}
                  title={enrollment.course.title}
                  chapter={`${enrollment.course.category || "General"} Course`}
                  progress={enrollment.progress}
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
                  onContinue={
                    enrollment.status === "in-progress"
                      ? () => navigate(`/watch-course/${enrollment.course.id}`)
                      : undefined
                  }
                  onCardClick={() =>
                    navigate(`/watch-course/${enrollment.course.id}`)
                  }
                />
              );
            })}
            {currentCourses.length === 0 && (
              <div className="no-courses-message">
                No courses found. Start learning by enrolling in a course!
              </div>
            )}
          </div>
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
            const updatedFeedback = res.feedback.find((fb) => {
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
            // Gọi API cập nhật rating trung bình
            await getCourseAverageRating(selectedCourseId);
          } catch (err) {
            toast.error(
              err.response?.data?.message || "Failed to submit review!"
            );
          }
          setIsReviewOpen(false);
        }}
        defaultRating={feedbackByCourseId[selectedCourseId]?.rateStar || 0}
        defaultFeedback={feedbackByCourseId[selectedCourseId]?.content || ""}
        reviewMode={!!feedbackByCourseId[selectedCourseId]}
      />

      {/* Survey Modal */}
      <SurveyModal />

      <ToastContainer autoClose={3000} />
    </ProfileSection>
  );
};

export default StudentDashboard;
