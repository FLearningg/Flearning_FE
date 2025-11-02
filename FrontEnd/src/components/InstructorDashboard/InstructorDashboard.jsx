import React, { useState, useEffect, useCallback } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { getInstructorDashboardStats } from "../../services/dashboardService";
import { formatVND, formatVNDCompact } from "../../utils/formatCurrency";
import {
  FaDollarSign,
  FaUsers,
  FaBookOpen,
  FaStar,
  FaCheckCircle,
  FaChartBar,
  FaClock,
  FaSpinner,
} from "react-icons/fa";
import "../../assets/InstructorDashboard/InstructorDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const InstructorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Revenue Chart specific state
  const [revenueData, setRevenueData] = useState(null);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedPeriod, setSelectedPeriod] = useState("year");

  // Initial load - fetch all dashboard data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const response = await getInstructorDashboardStats({
        period: "year",
        year: new Date().getFullYear(),
      });
      setStats(response.data);
      setRevenueData(response.data.analytics);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tải dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Fetch only revenue chart data when filter changes
  const fetchRevenueData = useCallback(async () => {
    if (!stats) return; // Don't fetch if initial data not loaded

    try {
      setRevenueLoading(true);
      const params = {
        period: selectedPeriod,
        year: selectedYear,
      };
      const response = await getInstructorDashboardStats(params);
      setRevenueData(response.data.analytics);
    } catch (err) {
      // Silently handle error
    } finally {
      setRevenueLoading(false);
    }
  }, [selectedYear, selectedPeriod, stats]);

  useEffect(() => {
    fetchRevenueData();
  }, [fetchRevenueData]);

  // Generate year options (current year and 5 years back)
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i <= 5; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  // Revenue Chart Data
  const fillMonthlySales = (monthlySales = []) => {
    const allMonths = Array.from({ length: 12 }, (_, i) => ({
      year: selectedYear,
      month: i + 1,
      revenue: 0,
      transactions: 0,
    }));
    monthlySales.forEach((item) => {
      const index = item.month - 1;
      if (index >= 0 && index < 12) allMonths[index] = item;
    });
    return allMonths;
  };

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
  const filledSales = fillMonthlySales(revenueData?.monthlySales);

  const revenueChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Doanh thu",
        data: filledSales.map((s) => s.revenue),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => formatVND(context.parsed.y),
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatVNDCompact(value),
        },
      },
    },
  };

  // Pie Chart: Enrollment Status
  const enrollmentStatusData = {
    labels:
      stats?.pieCharts?.enrollmentStatus?.map((item) => item.status) || [],
    datasets: [
      {
        data:
          stats?.pieCharts?.enrollmentStatus?.map((item) => item.count) || [],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
      },
    ],
  };

  // Pie Chart: Revenue by Category
  const revenueByCategoryData = {
    labels:
      stats?.pieCharts?.revenueByCategory?.map((item) => item.categoryName) ||
      [],
    datasets: [
      {
        data:
          stats?.pieCharts?.revenueByCategory?.map((item) => item.revenue) ||
          [],
        backgroundColor: [
          "#8B5CF6",
          "#EC4899",
          "#10B981",
          "#F59E0B",
          "#3B82F6",
          "#6366F1",
        ],
      },
    ],
  };

  // Pie Chart: Revenue by Course
  const revenueByCourseData = {
    labels:
      stats?.pieCharts?.revenueByCoursePieData?.map((item) => item.name) || [],
    datasets: [
      {
        data:
          stats?.pieCharts?.revenueByCoursePieData?.map((item) => item.value) ||
          [],
        backgroundColor: [
          "#8B5CF6",
          "#EC4899",
          "#10B981",
          "#F59E0B",
          "#3B82F6",
          "#6366F1",
          "#EF4444",
          "#14B8A6",
        ],
      },
    ],
  };

  // Pie Chart: Rating Distribution
  const ratingDistributionData = {
    labels:
      stats?.pieCharts?.courseRatingDistribution?.map(
        (item) => `${item.stars}★`
      ) || [],
    datasets: [
      {
        data:
          stats?.pieCharts?.courseRatingDistribution?.map(
            (item) => item.count
          ) || [],
        backgroundColor: [
          "#10B981",
          "#3B82F6",
          "#F59E0B",
          "#F97316",
          "#EF4444",
        ],
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: { size: 11 } },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const dataset = context.dataset.data;
            const total = dataset.reduce((acc, data) => acc + data, 0);
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="instructor-dash-loading">
        <div className="instructor-dash-spinner"></div>
        <p>Đang tải dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="instructor-dash-error">
        <p>{error}</p>
        <button onClick={fetchInitialData}>Thử lại</button>
      </div>
    );
  }

  return (
    <div className="instructor-dash-container">
      {/* Header */}
      <div className="instructor-dash-header">
        <div className="instructor-dash-title-section">
          <h1>Instructor Dashboard</h1>
        </div>
      </div>

      {/* 4 Key Metrics Cards */}
      <div className="instructor-dash-metrics-grid">
        <div className="instructor-dash-metric-card instructor-dash-revenue">
          <div className="instructor-dash-metric-icon">
            <FaDollarSign />
          </div>
          <div className="instructor-dash-metric-content">
            <p className="instructor-dash-metric-label">Tổng doanh thu</p>
            <h2 className="instructor-dash-metric-value">
              {formatVNDCompact(stats.overview?.totalRevenue || 0)}
            </h2>
            <p className="instructor-dash-metric-trend instructor-dash-positive">
              +{formatVNDCompact(stats.overview?.periodRevenue || 0)} kỳ này
            </p>
          </div>
        </div>

        <div className="instructor-dash-metric-card instructor-dash-students">
          <div className="instructor-dash-metric-icon">
            <FaUsers />
          </div>
          <div className="instructor-dash-metric-content">
            <p className="instructor-dash-metric-label">Tổng học viên</p>
            <h2 className="instructor-dash-metric-value">
              {stats.overview?.totalStudents?.toLocaleString() || 0}
            </h2>
            <p className="instructor-dash-metric-trend instructor-dash-positive">
              +{stats.overview?.newStudentsThisMonth || 0} tháng này
            </p>
          </div>
        </div>

        <div className="instructor-dash-metric-card instructor-dash-courses">
          <div className="instructor-dash-metric-icon">
            <FaBookOpen />
          </div>
          <div className="instructor-dash-metric-content">
            <p className="instructor-dash-metric-label">Khóa học</p>
            <h2 className="instructor-dash-metric-value">
              {stats.overview?.totalCourses?.toLocaleString() || 0}
            </h2>
            <p className="instructor-dash-metric-trend instructor-dash-neutral">
              {stats.analytics?.topCoursesByRevenue?.length || 0} đang hoạt động
            </p>
          </div>
        </div>

        <div className="instructor-dash-metric-card instructor-dash-rating">
          <div className="instructor-dash-metric-icon">
            <FaStar />
          </div>
          <div className="instructor-dash-metric-content">
            <p className="instructor-dash-metric-label">Đánh giá TB</p>
            <h2 className="instructor-dash-metric-value">
              {stats.courseRating?.averageRating?.toFixed(1) || "N/A"}
            </h2>
            <p className="instructor-dash-metric-trend instructor-dash-neutral">
              {stats.courseRating?.breakdown?.reduce(
                (sum, r) => sum + r.count,
                0
              ) || 0}{" "}
              đánh giá
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Row: Revenue (2/3) + Rating (1/3) */}
      <div className="instructor-dash-main-charts-row">
        <div className="instructor-dash-chart-card instructor-dash-large">
          <div className="instructor-dash-chart-header">
            <h3>Doanh thu theo tháng</h3>
            <div className="instructor-dash-chart-filters">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="instructor-dash-filter-select-compact"
                disabled={revenueLoading}
              >
                <option value="week">Tuần</option>
                <option value="month">Tháng</option>
                <option value="quarter">Quý</option>
                <option value="year">Năm</option>
                <option value="all">Tất cả</option>
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="instructor-dash-filter-select-compact"
                disabled={selectedPeriod === "all" || revenueLoading}
              >
                {getYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {revenueLoading && (
                <span className="instructor-dash-loading-indicator">
                  <FaSpinner className="instructor-dash-spinning" />
                </span>
              )}
            </div>
          </div>
          <div
            className="instructor-dash-chart-container"
            style={{
              opacity: revenueLoading ? 0.5 : 1,
              transition: "opacity 0.3s",
            }}
          >
            <Line data={revenueChartData} options={revenueChartOptions} />
          </div>
        </div>

        <div className="instructor-dash-chart-card instructor-dash-small">
          <div className="instructor-dash-chart-header">
            <h3>Đánh giá khóa học</h3>
          </div>
          <div className="instructor-dash-rating-summary">
            <div className="instructor-dash-rating-score">
              <h1>{stats.courseRating?.averageRating?.toFixed(1) || "0.0"}</h1>
              <div className="instructor-dash-stars">
                {Array(Math.round(stats.courseRating?.averageRating || 0))
                  .fill(0)
                  .map((_, i) => (
                    <FaStar key={i} size={16} color="#fbbf24" />
                  ))}
              </div>
              <p>
                {stats.courseRating?.breakdown?.reduce(
                  (sum, r) => sum + r.count,
                  0
                ) || 0}{" "}
                đánh giá
              </p>
            </div>
            <div className="instructor-dash-rating-bars">
              {stats.courseRating?.breakdown?.map((r) => (
                <div key={r.stars} className="instructor-dash-rating-bar-row">
                  <span>{r.stars}★</span>
                  <div className="instructor-dash-bar">
                    <div
                      className="instructor-dash-bar-fill"
                      style={{ width: `${r.percentage}%` }}
                    ></div>
                  </div>
                  <span>{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pie Charts Row - 4 Charts */}
      <div className="instructor-dash-pie-charts-row">
        <div className="instructor-dash-pie-chart-card">
          <h3>Trạng thái học viên</h3>
          <div className="instructor-dash-pie-container">
            <Doughnut data={enrollmentStatusData} options={pieChartOptions} />
          </div>
        </div>

        <div className="instructor-dash-pie-chart-card">
          <h3>Doanh thu theo danh mục</h3>
          <div className="instructor-dash-pie-container">
            <Doughnut data={revenueByCategoryData} options={pieChartOptions} />
          </div>
        </div>

        <div className="instructor-dash-pie-chart-card">
          <h3>Doanh thu theo khóa học</h3>
          <div className="instructor-dash-pie-container">
            <Doughnut data={revenueByCourseData} options={pieChartOptions} />
          </div>
        </div>

        <div className="instructor-dash-pie-chart-card">
          <h3>Phân bố đánh giá</h3>
          <div className="instructor-dash-pie-container">
            <Doughnut data={ratingDistributionData} options={pieChartOptions} />
          </div>
        </div>
      </div>

      {/* Top Courses Grid */}
      <div className="instructor-dash-section-card">
        <h3>Top khóa học theo doanh thu</h3>
        <div className="instructor-dash-top-courses-grid">
          {revenueData?.topCoursesByRevenue &&
          revenueData.topCoursesByRevenue.length > 0 ? (
            revenueData.topCoursesByRevenue.slice(0, 6).map((course) => {
              // Extract revenue - handle MongoDB Decimal128 format
              const revenue =
                typeof course.revenue === "object"
                  ? course.revenue?.$numberDecimal || course.revenue?.total || 0
                  : course.revenue || 0;

              const courseTitle =
                course.title ||
                course.courseName ||
                course.name ||
                "Không có tên";

              return (
                <div key={course._id} className="instructor-dash-course-card">
                  <img
                    src={course.thumbnail || "/placeholder.jpg"}
                    alt={courseTitle}
                    onError={(e) => (e.target.src = "/placeholder.jpg")}
                  />
                  <div className="instructor-dash-course-info">
                    <h4 title={courseTitle}>{courseTitle}</h4>
                    <p className="instructor-dash-course-revenue">
                      <FaDollarSign size={14} style={{ marginRight: "4px" }} />
                      {formatVND(Number(revenue))}
                    </p>
                    <p className="instructor-dash-course-meta">
                      <FaUsers size={14} /> {course.enrollments || 0} ·{" "}
                      <FaStar size={14} color="#fbbf24" />{" "}
                      {course.rating?.toFixed(1) || "N/A"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p
              style={{
                padding: "2rem",
                color: "#6b7280",
                textAlign: "center",
                width: "100%",
              }}
            >
              Không có dữ liệu khóa học
            </p>
          )}
        </div>
      </div>

      {/* Bottom Row: Transactions + Completion */}
      <div className="instructor-dash-bottom-row">
        <div className="instructor-dash-section-card">
          <h3>Giao dịch gần đây</h3>
          <div className="instructor-dash-table-wrapper">
            <table className="instructor-dash-transactions-table">
              <thead>
                <tr>
                  <th>Học viên</th>
                  <th>Khóa học</th>
                  <th>Số tiền</th>
                  <th>Ngày</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {stats.latestTransactions &&
                stats.latestTransactions.length > 0 ? (
                  stats.latestTransactions.map((t) => {
                    // Extract amount - handle MongoDB Decimal128
                    const amount =
                      typeof t.amount === "object"
                        ? t.amount?.$numberDecimal || t.amount?.total || 0
                        : t.amount || 0;

                    return (
                      <tr key={t._id}>
                        <td>
                          {t.userId?.firstName || ""}{" "}
                          {t.userId?.lastName || "N/A"}
                        </td>
                        <td>{t.courseId?.title || "Không có tên"}</td>
                        <td>{formatVND(Number(amount))}</td>
                        <td>
                          {t.paymentDate
                            ? new Date(t.paymentDate).toLocaleDateString(
                                "vi-VN"
                              )
                            : "N/A"}
                        </td>
                        <td>
                          <span className={`instructor-dash-badge instructor-dash-${t.status || ""}`}>
                            {t.status || "N/A"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        padding: "2rem",
                        color: "#6b7280",
                      }}
                    >
                      Không có giao dịch
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="instructor-dash-section-card">
          <h3>Tỷ lệ hoàn thành</h3>
          <div className="instructor-dash-completion-list">
            {revenueData?.courseCompletion &&
            revenueData.courseCompletion.length > 0 ? (
              revenueData.courseCompletion.map((course) => (
                <div key={course.courseId} className="instructor-dash-completion-item">
                  <div className="instructor-dash-completion-header">
                    <span>{course.title || "Không có tên"}</span>
                    <span className="instructor-dash-completion-rate">
                      {course.completionRate || 0}%
                    </span>
                  </div>
                  <div className="instructor-dash-progress-bar">
                    <div
                      className="instructor-dash-progress-fill"
                      style={{ width: `${course.completionRate || 0}%` }}
                    ></div>
                  </div>
                  <div className="instructor-dash-completion-stats">
                    <span>
                      <FaCheckCircle size={14} /> {course.completed || 0}
                    </span>
                    <span>
                      <FaClock size={14} /> {course.inProgress || 0}
                    </span>
                    <span>
                      <FaChartBar size={14} /> {course.totalEnrollments || 0}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p
                style={{
                  padding: "2rem",
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                Không có dữ liệu hoàn thành
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
