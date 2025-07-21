import { Star, Menu } from "lucide-react";
import { useState } from "react";
import "../../assets/CourseDetails/SingleCourse.css"; // Import the new CSS file
import { Link } from "react-router-dom";

function Breadcrumb({ breadcrumb }) {
  if (!Array.isArray(breadcrumb)) {
    return null;
  }
  return (
    <nav className="mb-4">
      <div className="d-flex align-items-center text-muted small breadcrumb-container">
        {breadcrumb.map((item, idx) => (
          // Sử dụng React.Fragment để bọc logic
          <span key={idx}>
            {/* Thêm dấu ">" vào trước item, trừ item đầu tiên */}
            {idx > 0 && <span className="mx-2">&gt;</span>}

            {/* Kiểm tra nếu item có path thì render Link, không thì render span */}
            {item.path ? (
              <Link to={item.path} className="text-dark text-decoration-none">
                {item.label}
              </Link>
            ) : (
              <span className="text-dark">{item.label}</span>
            )}
          </span>
        ))}
      </div>
    </nav>
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
