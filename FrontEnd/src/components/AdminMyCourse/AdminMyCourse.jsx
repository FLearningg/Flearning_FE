import "../../assets/AdminMyCourse/AdminMyCourse.css";

function AdminMyCourse() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="amc-breadcrumb">
        <div className="amc-breadcrumb-content">
          <span>Course</span>
          <span>/</span>
          <span>My Course</span>
          <span>/</span>
          <span>Development</span>
          <span>/</span>
          <span>Web Development</span>
          <span>/</span>
          <span className="amc-breadcrumb-active">
            2021 Complete Python Bootcamp From Zero to Hero in Python
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="amc-content">
        <div className="amc-content-grid">
          {/* Main Content */}
          <div>
            {/* Course Info Card */}
            <div className="amc-card">
              <div className="amc-card-content">
                <div className="amc-course-info">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=320&h=192&fit=crop"
                    alt="Course thumbnail"
                    className="amc-course-image"
                  />
                  <div className="amc-course-details">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "16px",
                      }}
                    >
                      <div>
                        <p className="amc-course-meta">
                          Uploaded: Jan 21, 2020 • Last Updated: Sep 11, 2021
                        </p>
                        <h2 className="amc-course-title">
                          2021 Complete Python Bootcamp From Zero to Hero in
                          Python
                        </h2>
                        <p className="amc-course-description">
                          3 in 1 Course: Learn to design websites with Figma,
                          build with Webflow, and make a living freelancing.
                        </p>
                      </div>
                      <button className="amc-withdraw-btn">
                        Withdraw Money
                      </button>
                    </div>

                    <div className="amc-course-creators">
                      <div className="amc-creators-info">
                        <span style={{ fontSize: "14px", color: "#8c94a3" }}>
                          Created by:
                        </span>
                        <div className="amc-creator-avatars">
                          <div className="amc-creator-avatar">KG</div>
                          <div className="amc-creator-avatar">KW</div>
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>
                          Kevin Gilbert & Kristin Watson
                        </span>
                      </div>
                      <div className="amc-rating">
                        <svg className="amc-star" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <svg className="amc-star" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <svg className="amc-star" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <svg className="amc-star" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <svg className="amc-star" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="amc-rating-text">4.8</span>
                        <span className="amc-rating-count">
                          (451,444 Ratings)
                        </span>
                      </div>
                    </div>

                    <div className="amc-course-pricing">
                      <div className="amc-price-item">
                        <h3>$13.99</h3>
                        <p>Course prices</p>
                      </div>
                      <div className="amc-price-item">
                        <h3>$131,800,455.82</h3>
                        <p>USD dollar revenue</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="amc-stats-grid">
              <div className="amc-stat-card">
                <div className="amc-stat-content">
                  <div className="amc-stat-icon amc-orange">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="amc-stat-number">1,957</div>
                    <div className="amc-stat-label">Lecture (279.3 GB)</div>
                  </div>
                </div>
              </div>

              <div className="amc-stat-card">
                <div className="amc-stat-content">
                  <div className="amc-stat-icon amc-purple">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="amc-stat-number">51,429</div>
                    <div className="amc-stat-label">Total Comments</div>
                  </div>
                </div>
              </div>

              <div className="amc-stat-card">
                <div className="amc-stat-content">
                  <div className="amc-stat-icon amc-red">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V11h2.5c.83 0 1.5.67 1.5 1.5V18h2v-5.5c0-1.1-.9-2-2-2H13v-.5c0-1.38-1.12-2.5-2.5-2.5S8 9.62 8 11v7H4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="amc-stat-number">9,419,418</div>
                    <div className="amc-stat-label">Students enrolled</div>
                  </div>
                </div>
              </div>

              <div className="amc-stat-card">
                <div className="amc-stat-content">
                  <div className="amc-stat-icon amc-green">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
                    </svg>
                  </div>
                  <div>
                    <div className="amc-stat-number">Beginner</div>
                    <div className="amc-stat-label">Course level</div>
                  </div>
                </div>
              </div>

              <div className="amc-stat-card">
                <div className="amc-stat-content">
                  <div className="amc-stat-icon amc-gray">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
                    </svg>
                  </div>
                  <div>
                    <div className="amc-stat-number">Mandarin</div>
                    <div className="amc-stat-label">Course Language</div>
                  </div>
                </div>
              </div>

              <div className="amc-stat-card">
                <div className="amc-stat-content">
                  <div className="amc-stat-icon amc-yellow">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="amc-stat-number">142</div>
                    <div className="amc-stat-label">Attach File (14.4 GB)</div>
                  </div>
                </div>
              </div>

              <div className="amc-stat-card">
                <div className="amc-stat-content">
                  <div className="amc-stat-icon amc-gray">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="amc-stat-number">19:37:51</div>
                    <div className="amc-stat-label">Hours</div>
                  </div>
                </div>
              </div>

              <div className="amc-stat-card">
                <div className="amc-stat-content">
                  <div className="amc-stat-icon amc-gray">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="amc-stat-number">76,395,167</div>
                    <div className="amc-stat-label">Students viewed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="amc-charts-grid">
              <div className="amc-card">
                <div className="amc-card-header">
                  <h3 className="amc-card-title">Revenue</h3>
                  <select className="amc-select">
                    <option>This month</option>
                    <option>This week</option>
                    <option>This year</option>
                  </select>
                </div>
                <div className="amc-card-content">
                  <div className="amc-chart-placeholder">
                    Revenue Chart Placeholder
                  </div>
                </div>
              </div>

              <div className="amc-card">
                <div className="amc-card-header">
                  <h3 className="amc-card-title">Course Overview</h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          backgroundColor: "#ff6636",
                          borderRadius: "50%",
                        }}
                      ></div>
                      <span style={{ fontSize: "14px", color: "#8c94a3" }}>
                        Comments
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          backgroundColor: "#564ffd",
                          borderRadius: "50%",
                        }}
                      ></div>
                      <span style={{ fontSize: "14px", color: "#8c94a3" }}>
                        View
                      </span>
                    </div>
                    <select className="amc-select">
                      <option>This month</option>
                      <option>This week</option>
                      <option>This year</option>
                    </select>
                  </div>
                </div>
                <div className="amc-card-content">
                  <div className="amc-chart-placeholder">
                    Course Overview Chart Placeholder
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Sidebar */}
          <div>
            <div className="amc-rating-card">
              <div className="amc-rating-header">
                <h3 className="amc-card-title">Overall Course Rating</h3>
                <select className="amc-select">
                  <option>This week</option>
                  <option>This month</option>
                  <option>This year</option>
                </select>
              </div>
              <div className="amc-rating-content">
                <div className="amc-rating-circle">
                  <div className="amc-rating-display">
                    <div style={{ textAlign: "center" }}>
                      <div className="amc-rating-number">4.8</div>
                      <div className="amc-rating-stars">
                        <svg
                          className="amc-star-small amc-star-filled"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <svg
                          className="amc-star-small amc-star-filled"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <svg
                          className="amc-star-small amc-star-filled"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <svg
                          className="amc-star-small amc-star-filled"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <svg
                          className="amc-star-small amc-star-filled"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="amc-rating-text-small">4.8</span>
                      </div>
                      <div className="amc-rating-label">Course Rating</div>
                    </div>
                  </div>
                </div>

                <div className="amc-rating-breakdown">
                  <div className="amc-rating-row">
                    <div className="amc-rating-stars-small">
                      <svg
                        className="amc-star-small amc-star-filled"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-filled"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-filled"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-filled"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-filled"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="amc-rating-text-small">5 Star</span>
                    </div>
                    <div className="amc-progress-bar">
                      <div
                        className="amc-progress-fill"
                        style={{ width: "67%" }}
                      ></div>
                    </div>
                    <span className="amc-rating-percentage">67%</span>
                  </div>

                  <div className="amc-rating-row">
                    <div className="amc-rating-stars-small">
                      <svg
                        className="amc-star-small amc-star-filled"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-filled"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-filled"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-filled"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-empty"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="amc-rating-text-small">4 Star</span>
                    </div>
                    <div className="amc-progress-bar">
                      <div
                        className="amc-progress-fill"
                        style={{ width: "27%" }}
                      ></div>
                    </div>
                    <span className="amc-rating-percentage">27%</span>
                  </div>

                  <div className="amc-rating-row">
                    <div className="amc-rating-stars-small">
                      <svg
                        className="amc-star-small amc-star-filled"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-filled"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-filled"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-empty"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-empty"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="amc-rating-text-small">3 Star</span>
                    </div>
                    <div className="amc-progress-bar">
                      <div
                        className="amc-progress-fill"
                        style={{ width: "5%" }}
                      ></div>
                    </div>
                    <span className="amc-rating-percentage">5%</span>
                  </div>

                  <div className="amc-rating-row">
                    <div className="amc-rating-stars-small">
                      <svg
                        className="amc-star-small amc-star-filled"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-filled"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-empty"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-empty"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-empty"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="amc-rating-text-small">2 Star</span>
                    </div>
                    <div className="amc-progress-bar">
                      <div
                        className="amc-progress-fill"
                        style={{ width: "1%" }}
                      ></div>
                    </div>
                    <span className="amc-rating-percentage">1%</span>
                  </div>

                  <div className="amc-rating-row">
                    <div className="amc-rating-stars-small">
                      <svg
                        className="amc-star-small amc-star-filled"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-empty"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-empty"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-empty"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <svg
                        className="amc-star-small amc-star-empty"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="amc-rating-text-small">1 Star</span>
                    </div>
                    <div className="amc-progress-bar">
                      <div
                        className="amc-progress-fill"
                        style={{ width: "1%" }}
                      ></div>
                    </div>
                    <span className="amc-rating-percentage">1%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminMyCourse;
