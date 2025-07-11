import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Play,
  FileText,
  Clock,
  BookOpen,
} from "lucide-react";
import "../../assets/CourseDetails/SingleCourse.css"; // Import the new CSS file

// Utility function to convert seconds to MM:SS format
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

// Utility function to convert total seconds to hours and minutes format
function formatTotalDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

// SectionHeader Component
function SectionHeader({ section, expanded, onClick }) {
  // Dynamically set class names based on the 'expanded' state
  const titleClass = expanded
    ? "section-header__title section-header__title--expanded"
    : "section-header__title";

  return (
    <button
      onClick={onClick}
      className="btn btn-link w-100 d-flex justify-content-between align-items-center p-3 text-decoration-none border-0 section-header"
      aria-expanded={expanded}
      aria-controls={`section-${section.id}`}
    >
      <div className="d-flex align-items-center section-header__left">
        {expanded ? (
          <ChevronDown size={20} className="section-header__icon--expanded" />
        ) : (
          <ChevronRight size={20} className="section-header__icon" />
        )}
        <span className={titleClass}>{section.title}</span>
      </div>
      <div className="d-flex align-items-center section-header__right">
        <div className="d-flex align-items-center stat-item">
          <Play className="stat-icon stat-icon--lectures" />
          <span>{section.lectureCount} lectures</span>
        </div>
        <div className="d-flex align-items-center stat-item">
          <Clock className="stat-icon stat-icon--duration" />
          <span>{section.duration}</span>
        </div>
      </div>
    </button>
  );
}

// LectureRow Component
function LectureRow({ lecture }) {
  const Icon = lecture.type === "video" ? Play : FileText;
  return (
    <button
      className="d-flex justify-content-between align-items-center p-3 w-100 text-start border-0 lecture-row"
      aria-label={`View ${lecture.title}`}
    >
      <div className="d-flex align-items-center lecture-row__left">
        <Icon className="lecture-row__icon" />
        <span className="lecture-row__title">{lecture.title}</span>
      </div>
      <span className="lecture-row__duration">
        {lecture.duration || lecture.size || "N/A"}
      </span>
    </button>
  );
}

// Section Component
function Section({ section, expanded, onToggle }) {
  return (
    <div className="section-wrapper">
      <SectionHeader section={section} expanded={expanded} onClick={onToggle} />
      {expanded && section.lectures && (
        <div id={`section-${section.id}`} className="section-content">
          {section.lectures.map((lecture, idx) => (
            <LectureRow key={idx} lecture={lecture} />
          ))}
        </div>
      )}
    </div>
  );
}

// CurriculumStats Component
function CurriculumStats({ totalSections, totalLectures, totalDuration }) {
  return (
    <div className="d-flex align-items-center curriculum-stats">
      <div className="d-flex align-items-center stat-item">
        <BookOpen className="stat-icon stat-icon--sections" />
        <span>{totalSections} Sections</span>
      </div>
      <div className="d-flex align-items-center stat-item">
        <Play className="stat-icon stat-icon--lectures" />
        <span>{totalLectures} lectures</span>
      </div>
      <div className="d-flex align-items-center stat-item">
        <Clock className="stat-icon stat-icon--duration" />
        <span>{totalDuration}</span>
      </div>
    </div>
  );
}

// Main Curriculum Component
export default function Curriculum({ sections }) {
  const [expandedSections, setExpandedSections] = useState([
    sections[0]?._id || "",
  ]);

  const toggleSection = (sectionId) =>
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );

  // Calculate derived values
  const totalSections = sections.length;
  const totalLectures = sections.reduce(
    (total, section) => total + section.lessons.length,
    0
  );
  const totalDurationSeconds = sections.reduce(
    (total, section) =>
      total +
      section.lessons.reduce(
        (sectionTotal, lesson) => sectionTotal + lesson.duration,
        0
      ),
    0
  );
  const totalDuration = formatTotalDuration(totalDurationSeconds);

  // Transform data for the component
  const transformedSections = sections
    .sort((a, b) => a.order - b.order)
    .map((section) => ({
      id: section._id,
      title: section.name,
      lectureCount: section.lessons.length,
      duration: formatTotalDuration(
        section.lessons.reduce((total, lesson) => total + lesson.duration, 0)
      ),
      lectures: section.lessons
        .sort((a, b) => a.order - b.order)
        .map((lesson) => ({
          title: lesson.title,
          type: lesson.duration === 0 ? "document" : "video",
          duration:
            lesson.duration === 0 ? undefined : formatDuration(lesson.duration),
          size: lesson.duration === 0 ? "5.3 MB" : undefined, // Hard coded size for documents
        })),
    }));

  return (
    <div className="curriculum-container container">
      <div className="curriculum-content-wrapper">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 curriculum-header">
          <h2 className="curriculum-title h4 fw-bold">Curriculum</h2>
          <CurriculumStats
            totalSections={totalSections}
            totalLectures={totalLectures}
            totalDuration={totalDuration}
          />
        </div>

        {/* Sections */}
        <div>
          {transformedSections.map((section) => (
            <Section
              key={section.id}
              section={section}
              expanded={expandedSections.includes(section.id)}
              onToggle={() => toggleSection(section.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
