import React, { useState, useEffect, useRef } from "react";
import Card, { DetailedCard } from "./Card";
import "./Card.css";

const PopupCard = ({ cardProps, detailedProps, hoverDelay = 200 }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState("right");
  const timerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const wrapperRef = useRef(null);
  const cardRef = useRef(null);
  const popupRef = useRef(null);

  const clearAllTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearAllTimers();
    timerRef.current = setTimeout(() => {
      setShowPopup(true);
    }, hoverDelay);
  };

  const handleMouseLeave = (e) => {
    const relatedTarget = e.relatedTarget;
    
    clearAllTimers();
    
    // Add delay before hiding to prevent flicker when moving between card and popup
    hideTimerRef.current = setTimeout(() => {
      if (
        !relatedTarget ||
        !(relatedTarget instanceof Node) ||
        !wrapperRef.current
      ) {
        setShowPopup(false);
        return;
      }

      const isMovingToWrapper = wrapperRef.current.contains(relatedTarget);
      const isMovingToPopup = popupRef.current && popupRef.current.contains(relatedTarget);

      if (!isMovingToWrapper && !isMovingToPopup) {
        setShowPopup(false);
      }
    }, 50); // Small delay to prevent flicker
  };

  useEffect(() => {
    if (showPopup && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const spaceRight = viewportWidth - rect.right;
      const spaceLeft = rect.left;
      const popupWidth = 400;
      const safeMargin = 20;
      
      // Simple logic: prioritize showing full content
      if (spaceRight >= popupWidth + safeMargin) {
        setPopupPosition("right");
      } else if (spaceLeft >= popupWidth + safeMargin) {
        setPopupPosition("left");
      } else {
        // If both sides are narrow, choose the side with more space
        setPopupPosition(spaceRight >= spaceLeft ? "right" : "left");
      }
    }
  }, [showPopup]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  return (
    <div
      className="card-wrapper"
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="presentation"
    >
      <div ref={cardRef}>
        <Card {...cardProps} />
      </div>
      
      {showPopup && (
        <div
          ref={popupRef}
          className={`popup-wrapper visible ${popupPosition}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="tooltip"
          aria-hidden="false"
        >
          <div className="pointer" />
          <DetailedCard {...detailedProps} />
        </div>
      )}
    </div>
  );
};

export default PopupCard;
