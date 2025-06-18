import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import "../../assets/AdminMyCourse/AdminMyCourse.css";

// Đăng ký các module cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

// --- CÁC COMPONENT BIỂU ĐỒ (giữ nguyên) ---

const RevenueChart = () => {
  const data = {
    labels: ["Aug 01", "Aug 10", "Aug 20", "Aug 31"],
    datasets: [{
      label: "Revenue",
      data: [50000, 150000, 51749, 120000],
      borderColor: "#23bd33",
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#23bd33",
      pointHoverBorderWidth: 3,
      tension: 0.4,
      fill: true,
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        if (!ctx) return null;
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, "rgba(35, 189, 51, 0.1)");
        gradient.addColorStop(1, "rgba(35, 189, 51, 0)");
        return gradient;
      },
    }],
  };
  const options = {
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
          title: () => null,
          label: (context) => `$${context.parsed.y.toLocaleString()}`,
          afterBody: (context) => context[0].label.replace("Aug ", "") + " Aug",
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#9ca3af" } },
      y: {
        grid: { color: "#e5e7eb", borderDash: [5, 5] },
        ticks: {
          color: "#9ca3af",
          callback: (value) => {
            if (value >= 1000) return `${value / 1000}k`;
            return value;
          },
        },
      },
    },
  };
  return <Line data={data} options={options} />;
};

const CourseOverviewChart = () => {
  const data = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [{
      label: "Comments",
      data: [120, 190, 150, 220, 180, 250, 210],
      borderColor: "#ff6636",
      tension: 0.4,
      pointRadius: 0,
    }, {
      label: "View",
      data: [80, 110, 90, 150, 130, 170, 140],
      borderColor: "#564ffd",
      tension: 0.4,
      pointRadius: 0,
    }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}k`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#9ca3af" } },
      y: {
        grid: { color: "#e5e7eb" },
        ticks: {
          color: "#9ca3af",
          callback: (value) => `${value}k`
        }
      },
    },
  };
  return <Line data={data} options={options} />;
};

const RatingLineChart = () => {
  const data = {
    labels: ['', '', '', '', '', '', ''],
    datasets: [{
      data: [20, 40, 30, 50, 45, 60, 55],
      borderColor: "#f97316",
      borderWidth: 2.5,
      tension: 0.4,
    }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
    elements: { point: { radius: 0 } },
  };
  return <Line data={data} options={options} />;
};

const StarIcon = ({ filled, className }) => (
  <svg className={`${className} ${filled ? 'filled' : 'amc-star-empty'}`} viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const StatCard = ({icon, number, label}) => (
    <div className="amc-stat-card">
        <div className="amc-stat-content">
            <div className={`amc-stat-icon ${icon.color}`}>
                {icon.component}
            </div>
            <div>
                <div className="amc-stat-number">{number}</div>
                <div className="amc-stat-label">{label}</div>
            </div>
        </div>
    </div>
);


// --- COMPONENT CHÍNH ---
function AdminMyCourse() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    // Lấy dữ liệu course từ state hoặc default data
    const courseData = location.state?.courseData || {
        id: id || '1',
        title: '2021 Complete Python Bootcamp From Zero to Hero in Python',
        description: '3 in 1 Course: Learn to design websites with Figma, build with Webflow, and make a living freelancing.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=320&h=192&fit=crop',
        category: 'DEVELOPMENTS',
        price: '$24.00',
        rating: 4.9,
        students: '982,941',
        lastUpdated: 'Sep 11, 2021',
        uploaded: 'Jan 21, 2020'
    };

    const stats = [
        { icon: { component: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>, color: 'amc-orange'}, number: '1,957', label: 'Lecture (279.3 GB)' },
        { icon: { component: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" /></svg>, color: 'amc-purple'}, number: '51,429', label: 'Total Comments' },
        { icon: { component: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V11h2.5c.83 0 1.5.67 1.5 1.5V18h2v-5.5c0-1.1-.9-2-2-2H13v-.5c0-1.38-1.12-2.5-2.5-2.5S8 9.62 8 11v7H4z" /></svg>, color: 'amc-red'}, number: courseData.students || '9,419,418', label: 'Students enrolled' },
        { icon: { component: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" /></svg>, color: 'amc-green'}, number: 'Beginner', label: 'Course level' },
        { icon: { component: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" /></svg>, color: 'amc-gray'}, number: 'Mandarin', label: 'Course Language' },
        { icon: { component: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" /></svg>, color: 'amc-yellow'}, number: '142', label: 'Attach File (14.4 GB)' },
        { icon: { component: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" /></svg>, color: 'amc-gray'}, number: '19:37:51', label: 'Hours' },
        { icon: { component: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" /></svg>, color: 'amc-gray'}, number: '76,395,167', label: 'Students viewed' },
    ];

  return (
    <>
      <div className="amc-breadcrumb">
        <div className="amc-breadcrumb-content">
          <span 
            onClick={() => navigate('/admin/courses/all')}
            style={{ cursor: 'pointer', color: '#ff6636' }}
          >
            My Courses
          </span> / <span>Course</span> / <span>{courseData.category}</span> /
          <span className="amc-breadcrumb-active">
            {courseData.title}
          </span>
        </div>
      </div>

      <div className="amc-content">
        {/* PHẦN TRÊN: Thông tin chính và Rating */}
        <div className="amc-content-grid">
          {/* Cột chính (trái) */}
          <div className="amc-main-info-column">
            <div className="amc-card">
              <div className="amc-card-content">
                <div className="amc-course-info">
                  <img src={courseData.image} alt="Course thumbnail" className="amc-course-image" />
                  <div className="amc-course-details">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                      <div>
                        <p className="amc-course-meta">Uploaded: {courseData.uploaded} • Last Updated: {courseData.lastUpdated}</p>
                        <h2 className="amc-course-title">{courseData.title}</h2>
                        <p className="amc-course-description">{courseData.description}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="amc-withdraw-btn">Withdraw Money</button>
                        <button className="amc-more-btn">...</button>
                      </div>
                    </div>
                    <div className="amc-course-creators-rating">
                      <div className="amc-creators-info">
                        <span style={{ fontSize: "14px", color: "#8c94a3" }}>Created by:</span>
                        <div className="amc-creator-avatars">
                          <div className="amc-creator-avatar">KG</div>
                          <div className="amc-creator-avatar">KW</div>
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>Kevin Gilbert & Kristin Watson</span>
                      </div>
                      <div className="amc-rating">
                        {[...Array(5)].map((_, i) => (<StarIcon key={i} filled={i < Math.floor(courseData.rating)} className="amc-star" />))}
                        <span className="amc-rating-text">{courseData.rating}</span>
                        <span className="amc-rating-count">({courseData.students} Ratings)</span>
                      </div>
                    </div>
                    <div className="amc-course-pricing">
                      <div className="amc-price-item"><h3>{courseData.price}</h3><p>Course prices</p></div>
                      <div className="amc-price-item"><h3>$131,800,455.82</h3><p>USD dollar revenue</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar (phải) */}
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
                <div className="amc-rating-summary-new">
                  <div className="amc-rating-summary-box">
                    <div className="amc-rating-number-large">{courseData.rating}</div>
                    <div className="amc-rating-stars-large">
                      {[...Array(5)].map((_, i) => (<StarIcon key={i} filled={i < Math.floor(courseData.rating)} className="amc-star" />))}
                    </div>
                    <div className="amc-rating-label">Course Rating</div>
                  </div>
                  <div className="amc-rating-mini-chart">
                    <RatingLineChart />
                  </div>
                </div>
                <div className="amc-rating-breakdown">
                  {[
                    { stars: 5, percentage: 67 },
                    { stars: 4, percentage: 27 },
                    { stars: 3, percentage: 5 },
                    { stars: 2, percentage: 1 },
                    { stars: 1, percentage: 1, isLessThan: true },
                  ].map((rating) => (
                    <div className="amc-rating-row" key={rating.stars}>
                      <div className="amc-rating-stars-small">
                        {[...Array(5)].map((_, i) => (<StarIcon key={i} filled={i < rating.stars} className="amc-star-small" />))}
                        <span className="amc-rating-text-small">{rating.stars} Star</span>
                      </div>
                      <div className="amc-progress-bar">
                        <div className="amc-progress-fill" style={{ width: `${rating.percentage}%` }}></div>
                      </div>
                      <span className="amc-rating-percentage">{rating.isLessThan ? `<${rating.percentage}` : rating.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === PHẦN THỐNG KÊ (trải rộng) === */}
        <div className="amc-stats-grid" style={{ marginBottom: '32px' }}>
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>

        {/* === PHẦN BIỂU ĐỒ (trải rộng) === */}
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
              <div className="amc-chart-placeholder" style={{ height: '250px', position: 'relative' }}>
                <RevenueChart />
              </div>
            </div>
          </div>
          <div className="amc-card">
            <div className="amc-card-header">
              <h3 className="amc-card-title">Course Overview</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "12px", height: "12px", backgroundColor: "#ff6636", borderRadius: "50%" }}></div>
                  <span style={{ fontSize: "14px", color: "#8c94a3" }}>Comments</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "12px", height: "12px", backgroundColor: "#564ffd", borderRadius: "50%" }}></div>
                  <span style={{ fontSize: "14px", color: "#8c94a3" }}>View</span>
                </div>
                <select className="amc-select">
                  <option>This month</option>
                  <option>This week</option>
                  <option>This year</option>
                </select>
              </div>
            </div>
            <div className="amc-card-content">
              <div className="amc-chart-placeholder" style={{ height: '250px', position: 'relative' }}>
                <CourseOverviewChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminMyCourse;