import { useState } from "react"
import "../../assets/Categories/PopularTools.css";

const tools = [
  { name: "HTML 5", courses: "2,739 Courses" },
  { name: "CSS 3", courses: "13,932 Courses" },
  { name: "Javascript", courses: "52,822 Courses" },
  { name: "Saas", courses: "20,128 Courses" },
  { name: "Laravel", courses: "6,198 Courses" },
  { name: "Django", courses: "22,649 Courses" },
  { name: "Java", courses: "22,649 Courses" },
  { name: "Ruby", courses: "22,649 Courses" },
];

export default function PopularTools() {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const visibleCount = 6; // number of cards shown at once (responsive-friendly)

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(prev + 1, tools.length - visibleCount));
  };

  const visibleTools = tools.slice(startIndex, startIndex + visibleCount);

  const ToolCard = ({ name, courses, index }) => {
    const isActive = selectedIndex === index;
    return (
      <div
        className={`tool-card ${isActive ? "highlighted" : ""}`}
        onClick={() => setSelectedIndex(index)}
      >
        <h3 className="tool-name">{name}</h3>
        <p className="tool-courses">{courses}</p>
      </div>
    );
  };

  return (
    <>
      <div className="container-fluid">
        <div className="popular-tools-section">
          {/* Header */}
          <div className="section-header d-flex justify-content-between align-items-center">
            <h2 className="section-title">Popular tools</h2>
            <div className="nav-arrows">
              <button
                className="nav-btn"
                type="button"
                onClick={handlePrev}
                disabled={startIndex === 0}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                className="nav-btn"
                type="button"
                onClick={handleNext}
                disabled={startIndex + visibleCount >= tools.length}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="row g-3">
            {visibleTools.map((tool, i) => (
              <div key={startIndex + i} className="col-6 col-md-4 col-lg-2">
                <ToolCard {...tool} index={startIndex + i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
