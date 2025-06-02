import React from "react";
import "../../assets/CRUDCourseAndLesson/ProgressTabs.css";

const tabData = [
  { label: "Basic Information" },
  { label: "Advance Information" },
  { label: "Curriculum" },
  { label: "Publish Course" },
];

const ProgressTabs = ({ activeIndex = 0, onTabClick, progressText }) => (
  <div className="cf-progress-tabs">
    {tabData.map((tab, idx) => (
      <div
        key={tab.label}
        className={`cf-tab${activeIndex === idx ? " cf-active" : ""}`}
        onClick={() => onTabClick && onTabClick(idx)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
        <span>{tab.label}</span>
        {progressText && idx === 0 && (
          <span className="cf-progress-indicator">{progressText}</span>
        )}
      </div>
    ))}
  </div>
);

export default ProgressTabs;
