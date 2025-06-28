import React from "react";
import "../../assets/CRUDCourseAndLesson/ProgressTabs.css";

const tabData = [
  { label: "Basic Information" },
  { label: "Advance Information" },
  { label: "Curriculum" },
  { label: "Publish Course" },
];

const ProgressTabs = ({
  activeIndex = 0,
  onTabClick,
  progressText,
  completedTabs = [], // Array of completed tab indices
}) => (
  <div className="cf-progress-tabs">
    {tabData.map((tab, idx) => {
      const isActive = activeIndex === idx;
      const isCompleted = completedTabs.includes(idx);
      const isClickable = isCompleted || idx <= activeIndex;

      return (
        <div
          key={tab.label}
          className={`cf-tab${isActive ? " cf-active" : ""}${
            isCompleted ? " cf-completed" : ""
          }${isClickable ? " cf-clickable" : ""}`}
          onClick={() => isClickable && onTabClick && onTabClick(idx)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {isCompleted ? (
              // Checkmark icon for completed tabs
              <path
                d="M20 6L9 17l-5-5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              // Original icon for incomplete tabs
              <>
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </>
            )}
          </svg>
          <span>{tab.label}</span>
          {progressText && idx === 0 && (
            <span className="cf-progress-indicator">{progressText}</span>
          )}
        </div>
      );
    })}
  </div>
);

export default ProgressTabs;
