import { useState } from "react";
import { Star, RotateCw, ChevronDown } from "lucide-react";

const ratingOptions = [
    { label: "5 Star Rating", value: 5 },
    { label: "4 Star Rating", value: 4 },
    { label: "3 Star Rating", value: 3 },
    { label: "2 Star Rating", value: 2 },
    { label: "1 Star Rating", value: 1 },
    { label: "All Ratings", value: "all" },
];

const StarRating = ({ rating }) => (
    <div className="d-flex gap-1 mb-3" role="img" aria-label={`${rating} out of 5 stars`}>
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

const FeedbackItem = ({ item, isLast }) => (
    <div
        className={`d-flex gap-3 pb-4 mb-4${!isLast ? " border-bottom" : ""}`}
        style={{ borderColor: "#e9eaf0" }}
    >
        <div className="flex-shrink-0">
            <img
                src={item.avatar || "/placeholder.svg?height=48&width=48"}
                alt={`${item.name}'s avatar`}
                className="rounded-circle"
                width="48"
                height="48"
                style={{ backgroundColor: "#e9eaf0" }}
            />
        </div>
        <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-2">
                <h5 className="fw-medium mb-0" style={{ color: "#1d2026" }}>
                    {item.name}
                </h5>
                <span style={{ color: "#6e7485" }}>•</span>
                <small style={{ color: "#6e7485" }}>{item.timestamp}</small>
            </div>
            <StarRating rating={item.rating} />
            <p className="mb-0 lh-base" style={{ color: "#4e5566" }}>
                {item.feedback}
            </p>
        </div>
    </div>
);

const FeedbackList = ({ feedbacks }) => (
    <div>
        {feedbacks.map((item, idx) => (
            <FeedbackItem
                key={item.id}
                item={item}
                isLast={idx === feedbacks.length - 1}
            />
        ))}
    </div>
);

const Dropdown = ({ options, selected, show, onToggle, onSelect }) => (
    <div className="dropdown" style={{ position: "relative" }}>
        <button
            className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2"
            type="button"
            aria-expanded={show}
            aria-controls="rating-dropdown"
            style={{
                borderColor: "#e9eaf0",
                color: "#6e7485",
                minWidth: "180px",
            }}
            onClick={onToggle}
        >
            {options.find((r) => r.value === selected)?.label || "All Ratings"}
            <ChevronDown size={16} />
        </button>
        {show && (
            <ul className="dropdown-menu show" id="rating-dropdown" style={{ display: "block", position: "absolute" }}>
                {options.map((option) => (
                    <li key={option.value}>
                        <button
                            className="dropdown-item"
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

export default function StudentFeedback({ feedback }) {
    const [selectedRating, setSelectedRating] = useState("all");
    const [showDropdown, setShowDropdown] = useState(false);

    const filteredFeedbacks =
        selectedRating === "all"
            ? feedback
            : feedback.filter((f) => f.rating === selectedRating);

    const handleDropdown = () => setShowDropdown((prev) => !prev);
    const handleSelect = (value) => {
        setSelectedRating(value);
        setShowDropdown(false);
    };

    return (
        <div className="container py-4">
            <div className="p-4" role="region" aria-labelledby="feedback-heading">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 id="feedback-heading" className="h4 fw-bold mb-4 text-dark" style={{ color: "#1d2026" }}>
                        Student Feedback
                    </h2>
                    <Dropdown
                        options={ratingOptions}
                        selected={selectedRating}
                        show={showDropdown}
                        onToggle={handleDropdown}
                        onSelect={handleSelect}
                    />
                </div>

                {/* Feedback List */}
                <FeedbackList feedbacks={filteredFeedbacks} />

                {/* Load More Button */}
                <div className="text-center mt-4">
                    <button
                        className="btn d-flex align-items-center gap-2 mx-auto px-4 py-2"
                        style={{
                            borderColor: "#fd8e1f",
                            color: "#fd8e1f",
                            backgroundColor: "transparent",
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#ffeee8";
                            e.target.style.color = "#fd8e1f";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.color = "#fd8e1f";
                        }}
                        aria-label="Load more student reviews"
                    >
                        Load More
                        <RotateCw size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}