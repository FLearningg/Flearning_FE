import { Star } from "lucide-react";
import "../../assets/CourseDetails/SingleCourse.css";

// Utility function to calculate rating stats
function calculateRatingStats(rawRatings = []) {
  if (!Array.isArray(rawRatings) || rawRatings.length === 0) {
    return {
      overallRating: 0,
      ratingBreakdown: [],
      totalReviews: 0,
    };
  }

  const totalStars = rawRatings.reduce((sum, r) => sum + r.rateStar, 0);
  const overallRating = Math.round((totalStars / rawRatings.length) * 10) / 10;

  const starCounts = [1, 2, 3, 4, 5].reduce((acc, star) => {
    acc[star] = 0;
    return acc;
  }, {});
  rawRatings.forEach(({ rateStar }) => {
    if (rateStar >= 1 && rateStar <= 5) starCounts[rateStar]++;
  });

  const totalReviews = rawRatings.length;
  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: starCounts[stars],
    percentage: Math.round((starCounts[stars] / totalReviews) * 100),
    label: `${stars} Star Rating`,
  }));

  return { overallRating, ratingBreakdown, totalReviews };
}

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
  rawRatings,
  totalStars = 5,
}) {
  const { overallRating, ratingBreakdown, totalReviews } =
    calculateRatingStats(rawRatings);

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
