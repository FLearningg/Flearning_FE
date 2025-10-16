import React, { useEffect } from "react";
import "../../assets/WatchCourse/ArticleContent.css";

const getFileName = (url) => {
  try {
    if (!url) return null;
    const u = new URL(url);
    const path = u.pathname;
    const last = path.substring(path.lastIndexOf("/") + 1);
    return decodeURIComponent(last || "Download file");
  } catch {
    return url;
  }
};

const ArticleContent = ({ title, description, lessonNotes, materialUrl, onNext, onAutoComplete }) => {
  const hasDownload = typeof materialUrl === "string" && materialUrl.trim() !== "";
  const fileName = hasDownload ? getFileName(materialUrl) : null;

  // Auto-complete after 5 seconds on screen
  useEffect(() => {
    if (!onAutoComplete) return;
    const timer = setTimeout(() => {
      onAutoComplete();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onAutoComplete]);

  return (
    <div className="article-container">
      <h1 className="article-hero-title">{title || "Article"}</h1>

      {description && (
        <p className="article-subtext">{description}</p>
      )}

      {hasDownload && (
        <a className="article-file-card" href={materialUrl} target="_blank" rel="noopener noreferrer">
          <div className="file-icon">📄</div>
          <div className="file-info">
          <div className="file-name" title={fileName}>{fileName}</div>
            <div className="file-type">Resource File</div>
          </div>
        </a>
      )}

      {lessonNotes && (
        <div className="article-notes-block">
          {lessonNotes}
        </div>
      )}

      {/* Footer removed as requested */}
    </div>
  );
};

export default ArticleContent;


