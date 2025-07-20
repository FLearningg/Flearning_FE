import { useState, useEffect } from "react";
import { Star, RotateCcw, ChevronDown } from "lucide-react";
import { getCourseFeedback } from "../../services/feedbackService";
import "../../assets/CourseDetails/SingleCourse.css";

const RATING_OPTIONS = [
  { label: "5 Star Rating", value: 5 },
  { label: "4 Star Rating", value: 4 },
  { label: "3 Star Rating", value: 3 },
  { label: "2 Star Rating", value: 2 },
  { label: "1 Star Rating", value: 1 },
  { label: "All Ratings", value: "all" },
];

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);

  if (mins < 60) return `${mins} mins ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days < 7) return `${days} days ago`;
  return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
}

function StarRating({ rating }) {
  return (
    <div
      className="d-flex gap-1 mb-3"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={star <= rating ? "text-warning" : "text-muted"}
          fill={star <= rating ? "#fd8e1f" : "#e9eaf0"}
        />
      ))}
    </div>
  );
}

function FeedbackItem({ item, isLast }) {
  const { userId, createdAt, rateStar, content } = item;

  // Handle different user data structures from backend
  const userName =
    userId?.firstName && userId?.lastName
      ? `${userId.firstName} ${userId.lastName}`
      : userId?.name || "Anonymous User";

  const userAvatar =
    userId?.userImage || userId?.avatar || "/images/defaultImageUser.png";

  return (
    <div
      className={`d-flex gap-3 pb-4 mb-4${
        !isLast ? " border-bottom feedback-item-border" : ""
      }`}
    >
      <div className="flex-shrink-0">
        <img
          src={userAvatar}
          alt={`${userName}'s avatar`}
          className="rounded-circle feedback-avatar"
          width="48"
          height="48"
        />
      </div>
      <div className="flex-grow-1">
        <div className="d-flex align-items-center gap-2 mb-2 feedback-user-info">
          <h5 className="fw-medium mb-0 feedback-name feedback-user">
            {userName}
          </h5>
          <span className="feedback-time-separator">•</span>
          <small className="feedback-time">{formatTimeAgo(createdAt)}</small>
        </div>
        <StarRating rating={rateStar} />
        <p className="mb-0 lh-base feedback-text">{content}</p>
      </div>
    </div>
  );
}

function FeedbackList({ feedbacks }) {
  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted">No feedback available for this course yet.</p>
      </div>
    );
  }

  return (
    <div>
      {feedbacks.map((item, idx) => (
        <FeedbackItem
          key={item._id}
          item={item}
          isLast={idx === feedbacks.length - 1}
        />
      ))}
    </div>
  );
}

function Dropdown({ options, selected, show, onToggle, onSelect }) {
  const selectedLabel =
    options.find((r) => r.value === selected)?.label || "All Ratings";
  return (
    <div className="dropdown position-relative">
      <button
        className="btn btn-outline-secondary d-flex align-items-center gap-2 dropdown-toggle-btn"
        type="button"
        aria-expanded={show}
        aria-controls="rating-dropdown"
        onClick={onToggle}
      >
        {selectedLabel}
        <ChevronDown size={16} />
      </button>
      {show && (
        <ul
          className="dropdown-menu show position-absolute dropdown-menu-custom"
          id="rating-dropdown"
        >
          {options.map((option) => (
            <li key={option.value} className="dropdown-item-wrapper">
              <button
                className="dropdown-item dropdown-item-inner"
                type="button"
                onClick={() => onSelect(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function StudentFeedback({ courseId }) {
  const [selectedRating, setSelectedRating] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalFeedback: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await getCourseFeedback(courseId, 1, 10);
        setFeedbacks(response.feedback || []);
        setPagination({
          currentPage: response.pagination?.currentPage || 1,
          totalPages: response.pagination?.totalPages || 0,
          totalFeedback: response.pagination?.totalFeedback || 0,
          hasNext: response.pagination?.hasNext || false,
          hasPrev: response.pagination?.hasPrev || false,
        });
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setError(err.response?.data?.message || "Failed to load feedback");
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [courseId]);

  const loadMoreFeedbacks = async () => {
    if (!pagination.hasNext || loadingMore) return;

    try {
      setLoadingMore(true);
      const nextPage = pagination.currentPage + 1;
      const response = await getCourseFeedback(courseId, nextPage, 10);

      setFeedbacks((prev) => [...prev, ...(response.feedback || [])]);
      setPagination({
        currentPage: response.pagination?.currentPage || nextPage,
        totalPages: response.pagination?.totalPages || 0,
        totalFeedback: response.pagination?.totalFeedback || 0,
        hasNext: response.pagination?.hasNext || false,
        hasPrev: response.pagination?.hasPrev || false,
      });
    } catch (err) {
      console.error("Error loading more feedbacks:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredFeedbacks =
    selectedRating === "all"
      ? feedbacks
      : feedbacks.filter((f) => f.rateStar === selectedRating);

  const handleDropdown = () => setShowDropdown((prev) => !prev);
  const handleSelect = (value) => {
    setSelectedRating(value);
    setShowDropdown(false);
  };

  if (loading) {
    return (
      <div className="container-fluid course-feedback">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-12 col-xl-12">
            <div className="p-4 bg-white">
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid course-feedback">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-12 col-xl-12">
            <div className="p-4 bg-white">
              <div className="text-center text-danger">
                <p>Error loading feedback: {error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid course-feedback">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-12 col-xl-12">
          <div
            className="p-4 bg-white"
            role="region"
            aria-labelledby="feedback-heading"
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2
                id="feedback-heading"
                className="h4 fw-semibold mb-0 feedback-name"
              >
                Students Feedback
              </h2>
              <Dropdown
                options={RATING_OPTIONS}
                selected={selectedRating}
                show={showDropdown}
                onToggle={handleDropdown}
                onSelect={handleSelect}
              />
            </div>
            <FeedbackList feedbacks={filteredFeedbacks} />
            {pagination.hasNext && (
              <div className="text-center mt-4">
                <button
                  className="btn d-flex align-items-center gap-2 mx-auto px-4 py-2 load-more-btn"
                  aria-label="Load more student reviews"
                  onClick={loadMoreFeedbacks}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More
                      <RotateCcw size={16} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
