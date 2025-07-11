import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
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

const VISIBLE_COUNT = 6;

function ToolCard({ name, courses, isActive, onClick }) {
  return (
    <div
      className={`tool-card${isActive ? " highlighted" : ""}`}
      onClick={onClick}
    >
      <h3 className="tool-name">{name}</h3>
      <p className="tool-courses">{courses}</p>
    </div>
  );
}

export default function PopularTools() {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrev = useCallback(
    () => setStartIndex((prev) => Math.max(prev - 1, 0)),
    []
  );

  const handleNext = useCallback(
    () =>
      setStartIndex((prev) => Math.min(prev + 1, tools.length - VISIBLE_COUNT)),
    []
  );

  const visibleTools = tools.slice(startIndex, startIndex + VISIBLE_COUNT);

  return (
    <div className="container-fluid">
      <div className="popular-tools-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-title mb-0">Popular Tools</h2>
          {!isMobileView && (
            <div className="d-flex gap-2">
              <button
                className="nav-btn"
                onClick={handlePrev}
                disabled={startIndex === 0}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className="nav-btn"
                onClick={handleNext}
                disabled={startIndex + VISIBLE_COUNT >= tools.length}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>

        {isMobileView ? (
          <Swiper
            spaceBetween={12}
            slidesPerView={1.5}
            grabCursor
            breakpoints={{
              500: { slidesPerView: 2.5 },
              768: { slidesPerView: 3.5 },
            }}
          >
            {tools.map((tool, index) => (
              <SwiperSlide key={tool.name}>
                <ToolCard
                  {...tool}
                  isActive={selectedIndex === index}
                  onClick={() => setSelectedIndex(index)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="row g-3">
            {visibleTools.map((tool, i) => {
              const idx = startIndex + i;
              return (
                <div key={tool.name} className="col-6 col-md-4 col-lg-2">
                  <ToolCard
                    {...tool}
                    isActive={selectedIndex === idx}
                    onClick={() => setSelectedIndex(idx)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
