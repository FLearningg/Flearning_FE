import { Star } from "lucide-react";

const STAR_COLOR = "#fd8e1f";
const STAR_EMPTY_FILL = "none";
const STAR_SIZE = 20;
const STAR_COUNT = 5;

function renderStars(rating) {
    return Array.from({ length: STAR_COUNT }, (_, i) => (
        <Star
            key={i}
            className={`me-1 ${i < rating ? "text-warning" : "text-warning-emphasis"}`}
            fill={i < rating ? STAR_COLOR : STAR_EMPTY_FILL}
            stroke={STAR_COLOR}
            strokeWidth="2"
            size={STAR_SIZE}
        />
    ));
}

function RatingBreakdown({ distribution }) {
    return (
        <div className="d-flex flex-column gap-3 h-100 justify-content-center">
            {distribution.map(({ stars, label, percentage }) => (
                <div key={stars} className="row align-items-center g-3">
                    <div className="col-auto" style={{ minWidth: 140 }}>
                        <div className="d-flex">{renderStars(stars)}</div>
                    </div>
                    <div className="col-auto" style={{ minWidth: 140 }}>
                        <span className="fw-medium" style={{ color: "#6e7485" }}>{label}</span>
                    </div>
                    <div className="col">
                        <div className="progress" style={{ height: 12, backgroundColor: "#e9eaf0" }}>
                            <div
                                className="progress-bar"
                                role="progressbar"
                                style={{
                                    width: `${percentage}%`,
                                    backgroundColor: STAR_COLOR,
                                    transition: "width 0.3s ease",
                                }}
                                aria-valuenow={percentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                        </div>
                    </div>
                    <div className="col-auto" style={{ minWidth: 50 }}>
                        <span className="fw-bold h5 text-end d-block" style={{ color: "#1d2026" }}>
                            {percentage < 1 ? "<1%" : `${percentage}%`}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function OverallRating({ overall, totalRatings }) {
    return (
        <div
            className="border rounded p-4 text-center h-100 d-flex flex-column justify-content-center"
            style={{ backgroundColor: "#fff", borderColor: "#e9eaf0" }}
        >
            <div className="display-1 fw-bold mb-3" style={{ color: "#1d2026", fontSize: "4rem" }}>
                {overall}
            </div>
            <div className="d-flex justify-content-center mb-3">{renderStars(overall)}</div>
            <div className="h5 fw-medium" style={{ color: "#1d2026" }}>
                Course Rating ({totalRatings.toLocaleString()} Ratings)
            </div>
        </div>
    );
}

export default function CourseRating({ rating }) {
    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12">
                    <h2 className="h4 fw-bold mb-4 text-dark" style={{ color: "#1d2026" }}>
                        Course Rating
                    </h2>
                    <div className="row g-4">
                        <div className="col-12 col-lg-4">
                            <OverallRating overall={rating.overall} totalRatings={rating.totalRatings} />
                        </div>
                        <div className="col-12 col-lg-8">
                            <RatingBreakdown distribution={rating.distribution} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}