import { useState } from "react";
import { ChevronDown, ChevronRight, Play, FileText, Clock } from "lucide-react";

// SectionHeader Component
function SectionHeader({ section, expanded, onClick }) {
    return (
        <button
            onClick={onClick}
            className="btn btn-link w-100 d-flex justify-content-between align-items-center py-3 px-2 text-decoration-none border-0"
            style={{
                backgroundColor: "transparent",
                transition: "background-color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
            aria-expanded={expanded}
            aria-controls={`section-${section.id}`}
        >
            <div className="d-flex align-items-center">
                {expanded ? (
                    <ChevronDown size={16} color="#fd8e1f" className="me-3" />
                ) : (
                    <ChevronRight size={16} color="#6e7485" className="me-3" />
                )}
                <span
                    className={`h5 fw-medium mb-0`}
                    style={{
                        color: expanded ? "#fd8e1f" : "#1d2026",
                    }}
                >
                    {section.title}
                </span>
            </div>
            <div className="d-flex align-items-center gap-4">
                <SectionStat
                    icon={<Play size={10} color="white" fill="white" />}
                    bg="#564ffd"
                    label={`${section.lectureCount} lectures`}
                />
                <SectionStat
                    icon={<Clock size={10} color="white" />}
                    bg="#fd8e1f"
                    label={section.duration}
                />
            </div>
        </button>
    );
}

// SectionStat Component
function SectionStat({ icon, bg, label }) {
    return (
        <div className="d-flex align-items-center">
            <div
                className="d-flex align-items-center justify-content-center me-2 rounded-circle"
                style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: bg,
                }}
            >
                {icon}
            </div>
            <span className="small fw-medium text-muted">{label}</span>
        </div>
    );
}

// LectureRow Component
function LectureRow({ lecture }) {
    const Icon = lecture.type === "video" ? Play : FileText;
    return (
        <button
            className="d-flex justify-content-between align-items-center py-2 px-2 rounded w-100 text-start"
            style={{
                transition: "background-color 0.2s",
                backgroundColor: "transparent",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
            aria-label={`View ${lecture.title}`}
        >
            <div className="d-flex align-items-center">
                <Icon size={16} color="#6e7485" className="me-3" />
                <span className="fw-medium" style={{ color: "#4e5566" }}>
                    {lecture.title}
                </span>
            </div>
            <span className="small text-muted">{lecture.duration || lecture.size || "N/A"}</span>
        </button>
    );
}

// Section Component
function Section({ section, expanded, onToggle }) {
    return (
        <div className="border-bottom border-light">
            <SectionHeader section={section} expanded={expanded} onClick={onToggle} />
            {expanded && section.lectures && (
                <div id={`section-${section.id}`}>
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
        <div className="d-flex align-items-center gap-4">
            <SectionStat
                icon={<FileText size={10} color="white" />}
                bg="#fd8e1f"
                label={`${totalSections} Sections`}
            />
            <SectionStat
                icon={<Play size={10} color="white" fill="white" />}
                bg="#564ffd"
                label={`${totalLectures} lectures`}
            />
            <SectionStat
                icon={<Clock size={10} color="white" />}
                bg="#fd8e1f"
                label={totalDuration}
            />
        </div>
    );
}

// Main Curriculum Component
export default function Curriculum({ totalSections, totalLectures, totalDuration, sections }) {
    const [expandedSections, setExpandedSections] = useState(["getting-started"]);

    const toggleSection = sectionId =>
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );

    return (
        <div className="container py-4">
            <div className="bg-white">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h4 fw-bold mb-4 text-dark">Curriculum</h2>
                    <CurriculumStats
                        totalSections={totalSections}
                        totalLectures={totalLectures}
                        totalDuration={totalDuration}
                    />
                </div>
                {/* Sections */}
                <div className="border-bottom-0">
                    {sections.map(section => (
                        <div
                            key={section.id}
                            style={{ border: "1px solid #bab6b6", borderBottom: "none" }}
                        >
                            <Section
                                section={section}
                                expanded={expandedSections.includes(section.id)}
                                onToggle={() => toggleSection(section.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
