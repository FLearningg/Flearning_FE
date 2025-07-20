import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getCourseFeedback } from "../../services/feedbackService";
import "../../assets/CourseDetails/SingleCourse.css";

function StarIcons({ count, filled }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Star
          key={i}
          className={`star-icon ${i < filled ? "star-filled" : "star-outline"}`}
          style={{ width: 24, height: 24 }}
        />
      ))}
    </>
  );
}

function OverallStars({ rating, totalStars }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div
      className="stars-container justify-content-center"
      style={{ marginTop: -12 }}
    >
      <StarIcons count={fullStars} filled={fullStars} />
      {hasHalfStar && (
        <Star
          className="star-icon star-half"
          style={{ width: 24, height: 24 }}
        />
      )}
      <StarIcons count={emptyStars} filled={0} />
    </div>
  );
}

export default function CourseRating({
  title = "Course Rating",
  courseId,
  totalStars = 5,
}) {
  const [ratingData, setRatingData] = useState({
    overallRating: 0,
    ratingBreakdown: [],
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatingData = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await getCourseFeedback(courseId, 1, 100); // Get all feedback for rating calculation
        const { feedback, averageRating } = response;

        // Use backend average rating if available, otherwise calculate from feedback
        const overallRating = averageRating || 0;

        // Calculate rating breakdown from feedback data
        const starCounts = [1, 2, 3, 4, 5].reduce((acc, star) => {
          acc[star] = 0;
          return acc;
        }, {});

        feedback.forEach(({ rateStar }) => {
          if (rateStar >= 1 && rateStar <= 5) starCounts[rateStar]++;
        });

        const totalReviews = feedback.length;
        const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => ({
          stars,
          count: starCounts[stars],
          percentage:
            totalReviews > 0
              ? Math.round((starCounts[stars] / totalReviews) * 100)
              : 0,
          label: `${stars} Star Rating`,
        }));

        setRatingData({
          overallRating,
          ratingBreakdown,
          totalReviews,
        });
      } catch (err) {
        console.error("Error fetching rating data:", err);
        setError(err.response?.data?.message || "Failed to load rating data");
      } finally {
        setLoading(false);
      }
    };

    fetchRatingData();
  }, [courseId]);

  if (loading) {
    return (
      <div
        className="course-rating container-fluid py-4"
        style={{ background: "#fff" }}
      >
        <div className="row justify-content-center">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="course-rating container-fluid py-4"
        style={{ background: "#fff" }}
      >
        <div className="row justify-content-center">
          <div className="text-center text-danger">
            <p>Error loading rating data: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const { overallRating, ratingBreakdown, totalReviews } = ratingData;

  return (
    <>
      <div
        className="course-rating container-fluid py-4"
        style={{ background: "#fff" }}
      >
        <div className="row justify-content-center">
          <div>
            <h1 className="h4 fw-bold mb-4">{title}</h1>
            <div className="row g-4">
              {/* Overall Rating */}
              <div className="col-12 col-lg-4 d-flex">
                <div
                  className="card rating-card"
                  style={{ width: "160%", height: 190 }}
                >
                  <div className="card-body text-center d-flex flex-column justify-content-center">
                    <div className="rating-number">{overallRating}</div>
                    <OverallStars
                      rating={overallRating}
                      totalStars={totalStars}
                    />
                    <div className="rating-label fs-5">Course Rating</div>
                    <div className="total-reviews">
                      ({totalReviews} reviews)
                    </div>
                  </div>
                </div>
              </div>
              {/* Rating Breakdown */}
              <div className="col-12 col-lg-6 d-flex">
                <div className="w-100 d-flex flex-column justify-content-center">
                  {ratingBreakdown.map((rating) => (
                    <div key={rating.stars} className="rating-row">
                      <div className="row align-items-center g-3">
                        <div className="col-auto">
                          <div className="stars-container">
                            <StarIcons
                              count={totalStars}
                              filled={rating.stars}
                            />
                          </div>
                        </div>
                        <div
                          className="col progress-col"
                          style={{ width: "470px" }}
                        >
                          <div className="progress progress-custom">
                            <div
                              className="progress-bar progress-bar-custom"
                              role="progressbar"
                              style={{
                                width: `${Math.min(
                                  Math.max(rating.percentage || 0, 0),
                                  100
                                )}%`,
                              }}
                              aria-valuenow={rating.percentage}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            />
                          </div>
                        </div>
                        <div className="col-auto text-start-col">
                          <span className="rating-breakdown-label">
                            {rating.label}
                          </span>
                        </div>

                        <div className="col-1 text-end-col">
                          <span className="rating-percentage text-end">
                            {rating.percentage < 1
                              ? "<1%"
                              : `${rating.percentage}%`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
