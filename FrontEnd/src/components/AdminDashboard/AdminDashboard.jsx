import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { getDashboardStats } from "../../services/dashboardService";
import "../../assets/AdminDashboard/AdminDashboard.css";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Icon Components ---
  const PlayIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 4h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
  const BookOpenIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
  const UsersIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
      />
    </svg>
  );
  const DollarSignIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
      />
    </svg>
  );
  const StarIcon = ({ filled }) => (
    <svg
      className={`ad-star ${filled ? "filled" : "empty"}`}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching data."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // --- Chart Data & Options ---
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const revenueData = {
    labels: stats?.monthlySales.map((s) => monthLabels[s.month - 1]) || [],
    datasets: [
      {
        label: "Revenue",
        data: stats?.monthlySales.map((s) => s.revenue) || [],
        borderColor: "#7c3aed",
        borderWidth: 2,
        pointBackgroundColor: "#7c3aed",
        pointBorderColor: "#fff",
        tension: 0.4,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(124, 58, 237, 0.3)");
          gradient.addColorStop(1, "rgba(124, 58, 237, 0)");
          return gradient;
        },
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#000",
        padding: 10,
        cornerRadius: 4,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return `${value} VND`;
          },
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#9ca3af" } },
      y: {
        grid: { color: "#e5e7eb", borderDash: [5, 5] },
        ticks: {
          color: "#9ca3af",
          callback: (value) => {
            if (value >= 1000000) return `${value / 1000000}m`;
            if (value >= 1000) return `${value / 1000}k`;
            return value;
          },
        },
      },
    },
  };

  // Static data for mini-chart, can be upgraded later
  const ratingChartData = {
    labels: ["1", "2", "3", "4", "5", "6", "7"],
    datasets: [
      {
        data: [20, 40, 30, 50, 45, 60, 55],
        borderColor: "#f97316",
        tension: 0.4,
      },
    ],
  };
  const ratingChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
    elements: { point: { radius: 0 } },
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="ad-dashboard">
      <div className="ad-container">
        {/* Stats Cards Row 1 */}
        <div className="ad-stats-grid">
          <div className="ad-card">
            <div className="ad-card-content">
              <div className="stat-card-content">
                <div className="stat-icon orange">
                  <PlayIcon />
                </div>
                <div>
                  <p className="stat-number">
                    {stats.totalEnrollments.toLocaleString()}
                  </p>
                  <p className="stat-label">Enrolled Courses</p>
                </div>
              </div>
            </div>
          </div>
          <div className="ad-card">
            <div className="ad-card-content">
              <div className="stat-card-content">
                <div className="stat-icon purple">
                  <BookOpenIcon />
                </div>
                <div>
                  <p className="stat-number">
                    {stats.totalCourses.toLocaleString()}
                  </p>
                  <p className="stat-label">Total Courses</p>
                </div>
              </div>
            </div>
          </div>
          <div className="ad-card">
            <div className="ad-card-content">
              <div className="stat-card-content">
                <div className="stat-icon purple">
                  <UsersIcon />
                </div>
                <div>
                  <p className="stat-number">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                  <p className="stat-label">Total Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Row 2 */}
        <div className="ad-stats-grid">
          <div className="ad-card">
            <div className="ad-card-content">
              <div className="stat-card-content">
                <div className="stat-icon red">
                  <UsersIcon />
                </div>
                <div>
                  <p className="stat-number">
                    {stats.newUsersThisMonth.toLocaleString()}
                  </p>
                  <p className="stat-label">New Users This Month</p>
                </div>
              </div>
            </div>
          </div>
          <div className="ad-card">
            <div className="ad-card-content">
              <div className="stat-card-content">
                <div className="stat-icon purple">
                  <DollarSignIcon />
                </div>
                <div>
                  <p className="stat-number">
                    {stats.totalRevenue
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                    VND
                  </p>
                  <p className="stat-label">Total Earning</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="ad-bottom-grid">
          <div className="ad-card">
            <div className="ad-card-header">
              <div className="ad-section-header">
                <h3 className="ad-card-title">Revenue</h3>
                <select className="ad-select">
                  <option>This Year</option>
                </select>
              </div>
            </div>
            <div className="ad-card-content">
              <div className="chart-placeholder" style={{ height: "250px" }}>
                <Line options={revenueOptions} data={revenueData} />
              </div>
            </div>
          </div>
        </div>

        {/* Rating Chart */}
        <div className="ad-charts-grid">
          <div className="ad-card">
            <div className="ad-card-header">
              <div className="ad-section-header">
                <h3 className="ad-card-title">Overall Course Rating</h3>
                <select className="ad-select">
                  <option>All Time</option>
                </select>
              </div>
            </div>
            <div className="ad-card-content">
              <div className="rating-grid-new">
                <div className="rating-summary-new">
                  <div className="rating-info">
                    <p className="rating-number">
                      {stats.courseRating?.averageRating.toFixed(1) || "N/A"}
                    </p>
                    <p className="rating-label">Overall Rating</p>
                  </div>
                  <div className="rating-mini-chart">
                    <Line data={ratingChartData} options={ratingChartOptions} />
                  </div>
                </div>
                <div className="rating-breakdown">
                  {stats.courseRating?.breakdown.map((rating) => (
                    <div key={rating.stars} className="rating-row">
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} filled={i < rating.stars} />
                        ))}
                      </div>
                      <div className="rating-bar">
                        <div
                          className="rating-bar-fill"
                          style={{
                            width: `${rating.percentage}%`,
                            backgroundColor: "#f97316",
                          }}
                        />
                      </div>
                      <span className="rating-percentage">
                        {rating.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
