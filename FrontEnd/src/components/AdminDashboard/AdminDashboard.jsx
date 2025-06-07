import React from "react";
import { Line, Bar } from "react-chartjs-2";
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
import "../../assets/AdminDashboard/AdminDashboard.css";

// Đăng ký các module cần thiết của Chart.js
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
  const PlayIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 4h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
  const BookOpenIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
  const UsersIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  );
  const AwardIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
  const GraduationCapIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  );
  const MonitorIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
  const DollarSignIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  );
  const ShoppingCartIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
    </svg>
  );
  const DownloadIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
  const StarIcon = ({ filled }) => (
    <svg
      className={`ad-star ${filled ? "filled" : "empty"}`}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );

  // --- Cấu hình Dữ liệu và Tùy chọn cho Biểu đồ ---

  // 1. Biểu đồ Doanh thu (Revenue)
  const revenueData = {
    labels: ["Aug 01", "Aug 05", "Aug 10", "Aug 15", "Aug 20", "Aug 25", "Aug 31"],
    datasets: [
      {
        label: "Revenue",
        data: [100000, 150000, 120000, 51749, 180000, 160000, 250000],
        borderColor: "#7c3aed", // Màu tím đậm
        borderWidth: 2,
        pointBackgroundColor: "#7c3aed",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
        pointHoverBorderWidth: 2,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#7c3aed",
        tension: 0.4, // Làm cho đường cong mượt mà
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
        backgroundColor: '#000',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 4,
        displayColors: false,
        callbacks: {
            label: (context) => `$${context.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9ca3af" },
      },
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

  // 2. Biểu đồ Lượt xem Hồ sơ (Profile View)
  const profileViewData = {
    labels: Array(15).fill(""),
    datasets: [
      {
        label: "Views",
        data: [40, 60, 80, 45, 70, 90, 55, 75, 65, 85, 50, 70, 60, 80, 45],
        backgroundColor: "#22c55e", // Màu xanh lá
        borderColor: "#22c55e",
        borderRadius: 4,
        barThickness: 'flex',
        maxBarThickness: 12,
      },
    ],
  };

  const profileViewOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  // 3. Biểu đồ Đánh giá Tổng quan (Mini-chart)
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
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  // 4. Biểu đồ Tổng quan Khóa học (Course Overview)
  const courseOverviewData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Enrolled",
        data: [110000, 150000, 90000, 180000, 120000, 160000, 200000],
        borderColor: "#3b82f6", // Blue
        tension: 0.4,
      },
      {
        label: "Completed",
        data: [50000, 80000, 60000, 110000, 70000, 90000, 120000],
        borderColor: "#f97316", // Orange
        tension: 0.4,
      },
    ],
  };

  const courseOverviewOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          padding: 20,
          color: "#4b5563",
        },
      },
       tooltip: {
        enabled: true,
        padding: 10,
        cornerRadius: 4,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9ca3af" },
      },
      y: {
        grid: { color: "#e5e7eb" },
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

  return (
    <div className="ad-dashboard">
      <div className="ad-container">
        {/* Hàng thẻ thống kê 1 */}
        <div className="ad-stats-grid">
          <div className="ad-card">
            <div className="ad-card-content">
              <div className="stat-card-content">
                <div className="stat-icon orange"><PlayIcon /></div>
                <div>
                  <p className="stat-number">957</p>
                  <p className="stat-label">Enrolled Courses</p>
                </div>
              </div>
            </div>
          </div>
          <div className="ad-card">
            <div className="ad-card-content">
              <div className="stat-card-content">
                <div className="stat-icon purple"><BookOpenIcon /></div>
                <div>
                  <p className="stat-number">19</p>
                  <p className="stat-label">Active Courses</p>
                </div>
              </div>
            </div>
          </div>
          <div className="ad-card">
            <div className="ad-card-content">
              <div className="stat-card-content">
                <div className="stat-icon yellow"><UsersIcon /></div>
                <div>
                  <p className="stat-number">241</p>
                  <p className="stat-label">Course Instructors</p>
                </div>
              </div>
            </div>
          </div>
          <div className="ad-card">
            <div className="ad-card-content">
              <div className="stat-card-content">
                <div className="stat-icon green"><AwardIcon /></div>
                <div>
                  <p className="stat-number">951</p>
                  <p className="stat-label">Completed Courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hàng thẻ thống kê 2 */}
        <div className="ad-stats-grid">
           <div className="ad-card">
            <div className="ad-card-content">
              <div className="stat-card-content">
                <div className="stat-icon red"><GraduationCapIcon /></div>
                <div>
                  <p className="stat-number">1,674,767</p>
                  <p className="stat-label">Students</p>
                </div>
              </div>
            </div>
          </div>
           <div className="ad-card">
            <div className="ad-card-content">
              <div className="stat-card-content">
                <div className="stat-icon green"><MonitorIcon /></div>
                <div>
                  <p className="stat-number">3</p>
                  <p className="stat-label">Online Courses</p>
                </div>
              </div>
            </div>
          </div>
           <div className="ad-card">
            <div className="ad-card-content">
              <div className="stat-card-content">
                <div className="stat-icon purple"><DollarSignIcon /></div>
                <div>
                  <p className="stat-number">$7,461,767</p>
                  <p className="stat-label">USD Total Earning</p>
                </div>
              </div>
            </div>
          </div>
           <div className="ad-card">
            <div className="ad-card-content">
              <div className="stat-card-content">
                <div className="stat-icon purple"><ShoppingCartIcon /></div>
                <div>
                  <p className="stat-number">56,489</p>
                  <p className="stat-label">Course Sold</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phần Hồ sơ */}
        <div className="ad-card ad-profile-card">
          <div className="ad-profile-content">
            <div className="ad-profile-left">
              <div className="ad-profile-avatar">VS</div>
              <div className="ad-profile-info">
                <h3>Vako Shvili</h3>
                <p className="ad-profile-email">vako.shvili@gmail.com</p>
              </div>
            </div>
            <div className="ad-profile-right">
              <p className="completion-text">25% Completed</p>
              <button className="edit-btn">Edit Biography</button>
              <button className="download-btn"><DownloadIcon /></button>
            </div>
          </div>
        </div>

        {/* Phần dưới */}
        <div className="ad-bottom-grid">
          {/* Hoạt động Gần đây */}
          <div className="ad-card">
            <div className="ad-card-header">
              <div className="ad-section-header">
                <h3 className="ad-card-title">Recent Activity</h3>
                <select className="ad-select">
                  <option>Today</option>
                  <option>This week</option>
                  <option>This month</option>
                </select>
              </div>
            </div>
            <div className="ad-card-content">
                <div className="activity-list">
                    <div className="activity-item">
                        <div className="activity-avatar kevin">K</div>
                        <div className="activity-content">
                            <p className="activity-text"><span className="username">Kevin</span> comments on your lecture "What is ux" in "2021 ui/ux design with figma"</p>
                            <p className="activity-time">Just now</p>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-avatar john">J</div>
                        <div className="activity-content">
                            <p className="activity-text"><span className="username">John</span> gave a 5 star rating on your course "2021 ui/ux design with figma"</p>
                            <p className="activity-time">5 mins ago</p>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-avatar sraboni">S</div>
                        <div className="activity-content">
                            <p className="activity-text"><span className="username">Sraboni</span> purchase your course "2021 ui/ux design with figma"</p>
                            <p className="activity-time">8 mins ago</p>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-avatar arif">A</div>
                        <div className="activity-content">
                            <p className="activity-text"><span className="username">Arif</span> purchase your course "2021 ui/ux design with figma"</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Biểu đồ Doanh thu */}
          <div className="ad-card">
            <div className="ad-card-header">
              <div className="ad-section-header">
                <h3 className="ad-card-title">Revenue</h3>
                <select className="ad-select">
                  <option>This month</option>
                  <option>This week</option>
                  <option>This year</option>
                </select>
              </div>
            </div>
            <div className="ad-card-content">
              <div className="revenue-highlight">
                <p className="revenue-number">$51,749</p>
                <p className="revenue-date">7th Aug</p>
              </div>
              <div className="chart-placeholder" style={{ height: "150px" }}>
                <Line options={revenueOptions} data={revenueData} />
              </div>
            </div>
          </div>

          {/* Biểu đồ Lượt xem Hồ sơ */}
          <div className="ad-card">
            <div className="ad-card-header">
              <div className="ad-section-header">
                <h3 className="ad-card-title">Profile View</h3>
                <select className="ad-select">
                  <option>Today</option>
                  <option>This week</option>
                  <option>This month</option>
                </select>
              </div>
            </div>
            <div className="ad-card-content" style={{ flexDirection: 'column' }}>
              <div className="bar-chart" style={{ height: "100px", width: '100%' }}>
                 <Bar options={profileViewOptions} data={profileViewData} />
              </div>
              <div className="earnings-summary">
                <p className="earnings-amount">$7,443</p>
                <p className="earnings-label">USD Dollar you earned.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Biểu đồ hàng dưới */}
        <div className="ad-charts-grid">
          {/* Đánh giá Tổng quan */}
          <div className="ad-card">
            <div className="ad-card-header">
               <div className="ad-section-header">
                    <h3 className="ad-card-title">Overall Course Rating</h3>
                    <select className="ad-select">
                        <option>This week</option>
                        <option>This month</option>
                        <option>This year</option>
                    </select>
                </div>
            </div>
            <div className="ad-card-content">
                <div className="rating-grid-new">
                    <div className="rating-summary-new">
                        <div className="rating-info">
                             <p className="rating-number">4.6</p>
                             <p className="rating-label">Overall Rating</p>
                        </div>
                        <div className="rating-mini-chart">
                            <Line data={ratingChartData} options={ratingChartOptions} />
                        </div>
                    </div>
                     <div className="rating-breakdown">
                         {[
                             { stars: 5, percentage: 56 },
                             { stars: 4, percentage: 37 },
                             { stars: 3, percentage: 8 },
                             { stars: 2, percentage: 1 },
                             { stars: 1, percentage: 1 },
                         ].map((rating) => (
                             <div key={rating.stars} className="rating-row">
                                 <div className="rating-stars">
                                     {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < rating.stars} />)}
                                 </div>
                                 <div className="rating-bar">
                                     <div className="rating-bar-fill" style={{ width: `${rating.percentage}%`, backgroundColor: '#f97316' }} />
                                 </div>
                                 <span className="rating-percentage">{rating.percentage}%</span>
                             </div>
                         ))}
                     </div>
                </div>
            </div>
          </div>
          
          {/* Tổng quan Khóa học */}
          <div className="ad-card">
            <div className="ad-card-header">
              <div className="ad-section-header">
                <h3 className="ad-card-title">Course Overview</h3>
                <select className="ad-select">
                  <option>This week</option>
                  <option>This month</option>
                  <option>This year</option>
                </select>
              </div>
            </div>
            <div className="ad-card-content">
              <div className="chart-placeholder" style={{ height: "240px" }}>
                 <Line options={courseOverviewOptions} data={courseOverviewData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
