import { Star, Menu } from "lucide-react";
import { useState } from "react";
import "../../assets/CourseDetails/SingleCourse.css"; // Import the new CSS file

function Breadcrumb({ breadcrumb }) {
  return (
    <nav className="mb-4">
      <div className="d-flex align-items-center text-muted small breadcrumb-container">
        {breadcrumb.map((item, idx) => (
          <span key={item}>
            {idx > 0 && <span className="mx-2">{">"}</span>}
            {item}
          </span>
        ))}
      </div>
    </nav>
  );
}

function Instructors({ instructors }) {
  return (
    <div className="d-flex align-items-center">
      <div className="d-flex me-3 instructors-container">
        {instructors.map((inst, idx) => (
          <div
            key={inst.name}
            className="rounded-circle border border-white bg-light overflow-hidden instructor-avatar"
            style={{
              marginRight: idx === 0 ? "-8px" : undefined,
              zIndex: instructors.length - idx,
            }}
          >
            <img
              src={inst.img || "/placeholder.svg"}
              alt={`${inst.name}'s avatar`}
              className="instructor-avatar-image"
            />
          </div>
        ))}
      </div>
      <div className="">
        <p className="small text-muted mb-1 created-by">Created by:</p>
        <p className="fs-5 fw-medium text-dark mb-0 creator">
          {instructors.map((inst) => inst.name).join(" • ")}
        </p>
      </div>
    </div>
  );
}

function RatingStars({ rating, totalRatings }) {
  return (
    <div className="d-flex align-items-center gap-3">
      <div className="d-flex align-items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={24}
            fill={i < Math.round(rating) ? "#fd8e1f" : "none"}
            color="#fd8e1f"
          />
        ))}
      </div>
      <div className="text-dark">
        <span className="fs-4 fw-bold">{rating}</span>
        {typeof totalRatings === "number" && (
          <span className="text-muted ms-2">
            ({totalRatings.toLocaleString()} Ratings)
          </span>
        )}
      </div>
    </div>
  );
}

function HeroImage({ heroImage, trailer }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="position-relative">
        <video
          src={trailer}
          controls
          autoPlay
          className="w-100 rounded hero-video"
        />
      </div>
    );
  }

  return (
    <div className="position-relative">
      <img
        src={heroImage}
        alt="Course preview"
        className="w-100 rounded hero-image"
      />
      <button
        className="btn btn-light rounded-circle d-flex align-items-center justify-content-center position-absolute top-50 start-50 translate-middle play-button"
        aria-label="Play course preview"
        onClick={() => setPlaying(true)}
      >
        <div className="play-button-triangle" />
      </button>
    </div>
  );
}

function CourseTabs({ activeTab, setActiveTab }) {
  const tabs = ["overview", "curriculum", "review"];

  return (
    <nav>
      <ul className="nav nav-tabs border-0 d-flex course-tabs">
        {tabs.map((tab) => (
          <li
            className="nav-item flex-grow-1 text-center course-tab-item"
            key={tab}
            style={{
              borderBottom: `2px solid ${
                activeTab === tab ? "#fd8e1f" : "#000"
              }`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderBottom = "2px solid #fd8e1f";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderBottom = `2px solid ${
                activeTab === tab ? "#fd8e1f" : "#000"
              }`;
            }}
          >
            <button
              className={`nav-link w-100 border-0 fw-medium course-tab-button ${
                activeTab === tab ? "active text-dark" : "text-muted"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function CourseHeader({
  breadcrumb,
  title,
  subtitle,
  instructors,
  rating,
  totalRatings,
  heroImage,
  trailer,
  activeTab,
  setActiveTab,
  isScreenSmall,
  onBurgerClick,
}) {
  return (
    <div className="course-header">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 breadcrumb-big-container">
          <Breadcrumb breadcrumb={breadcrumb} />
          {isScreenSmall && (
            <button
              onClick={onBurgerClick}
              className="btn btn-light"
              aria-label="Open course details"
            >
              <Menu size={24} />
            </button>
          )}
        </div>

        <div className="row">
          <div className="col-12">
            <h1 className="display-2 fw-bold text-dark mb-4 course-title">
              {title}
            </h1>
            <p className="fs-4 text-secondary mb-5 course-subtitle">
              {subtitle}
            </p>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-4 pt-4">
              <Instructors instructors={instructors} />
              <RatingStars rating={rating} totalRatings={totalRatings} />
            </div>
            <div className="row mt-5">
              <div className="col-12">
                <HeroImage heroImage={heroImage} trailer={trailer?.url} />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12">
                <CourseTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
