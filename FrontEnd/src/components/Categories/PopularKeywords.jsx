import { useState } from "react"

export default function PopularKeywords() {
  const keywords = [
    "HTML 5",
    "Web Development",
    "Responsive Developments",
    "Developments",
    "Programing",
    "Website",
    "Technology",
    "Wordpress",
  ]

  const [activeKeyword, setActiveKeyword] = useState("Developments")

  return (
    <>
      <style jsx>{`
        .keywords-container {
          padding: 1rem 0.75rem;
          background-color: #ffffff;
          width: 100%;
        }

        .keywords-label {
          color: #1d2026;
          font-weight: 500;
          white-space: nowrap;
          margin-right: 0.5rem;
        }

        .keyword-btn {
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-weight: 500;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          background-color: #f5f7fa;
          color: #1d2026;
          cursor: pointer;
        }

        .keyword-btn.active {
          background-color: #ff6636;
          color: #ffffff;
        }

        .keyword-btn:not(.active):hover {
          background-color: #ff6636;
          color: #ffffff;
        }
      `}</style>

      <div className="keywords-container">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <span className="keywords-label">Popular keyword:</span>
          <div className="d-flex align-items-center flex-wrap gap-2">
            {keywords.map((keyword) => (
              <button
                key={keyword}
                className={`keyword-btn ${activeKeyword === keyword ? "active" : ""}`}
                onClick={() => setActiveKeyword(keyword)}
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
