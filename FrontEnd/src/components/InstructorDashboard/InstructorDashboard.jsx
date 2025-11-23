import React, { useState, useEffect, useCallback, useRef } from "react";
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
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
  const [exporting, setExporting] = useState(false);
  const dashboardRef = useRef(null);

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

  // Export Functions
  const exportToPDF = async () => {
    if (!dashboardRef.current) return;
    
    setExporting(true);
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Instructor_Dashboard_${selectedYear}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const exportToExcel = () => {
    if (!stats) return;
    
    setExporting(true);
    try {
      const wb = XLSX.utils.book_new();
      const worksheetData = [];
      
      // Title Section
      worksheetData.push(['INSTRUCTOR DASHBOARD REPORT']);
      worksheetData.push(['Generated:', new Date().toLocaleString('vi-VN')]);
      worksheetData.push(['Year:', selectedYear]);
      worksheetData.push([]);
      
      // Overview Statistics Section
      worksheetData.push(['📊 OVERVIEW STATISTICS']);
      worksheetData.push(['Metric', 'Value', 'Unit']);
      worksheetData.push(['Total Revenue', stats.overview?.totalRevenue || 0, 'VND']);
      worksheetData.push(['Period Revenue', stats.overview?.periodRevenue || 0, 'VND']);
      worksheetData.push(['Total Students', stats.overview?.totalStudents || 0, 'students']);
      worksheetData.push(['New Students This Month', stats.overview?.newStudentsThisMonth || 0, 'students']);
      worksheetData.push(['Active Courses', stats.overview?.activeCourses || 0, 'courses']);
      worksheetData.push(['Total Courses', stats.overview?.totalCourses || 0, 'courses']);
      worksheetData.push(['Average Rating', (stats.overview?.averageRating || 0).toFixed(2), '⭐']);
      worksheetData.push(['Total Reviews', stats.overview?.totalReviews || 0, 'reviews']);
      worksheetData.push([]);
      
      // Monthly Revenue Section
      if (revenueData?.monthlySales) {
        worksheetData.push(['💰 MONTHLY REVENUE BREAKDOWN']);
        worksheetData.push(['Month', 'Revenue (VND)', 'Transactions', 'Avg per Transaction']);
        const totalRevenue = revenueData.monthlySales.reduce((sum, item) => sum + item.revenue, 0);
        const totalTransactions = revenueData.monthlySales.reduce((sum, item) => sum + item.transactions, 0);
        
        revenueData.monthlySales.forEach((item) => {
          const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][item.month - 1];
          const avgPerTransaction = item.transactions > 0 ? (item.revenue / item.transactions).toFixed(0) : 0;
          worksheetData.push([monthName, item.revenue, item.transactions, avgPerTransaction]);
        });
        worksheetData.push(['TOTAL', totalRevenue, totalTransactions, totalTransactions > 0 ? (totalRevenue / totalTransactions).toFixed(0) : 0]);
        worksheetData.push([]);
      }
      
      // Enrollment Status Section
      if (stats.pieCharts?.enrollmentStatus) {
        worksheetData.push(['📚 ENROLLMENT STATUS']);
        worksheetData.push(['Status', 'Count', 'Percentage']);
        const totalEnrollments = stats.pieCharts.enrollmentStatus.reduce((sum, item) => sum + item.count, 0);
        stats.pieCharts.enrollmentStatus.forEach((item) => {
          const percentage = totalEnrollments > 0 ? ((item.count / totalEnrollments) * 100).toFixed(2) + '%' : '0%';
          worksheetData.push([item.status, item.count, percentage]);
        });
        worksheetData.push(['TOTAL', totalEnrollments, '100%']);
        worksheetData.push([]);
      }
      
      // Revenue by Category Section
      if (stats.pieCharts?.revenueByCategory) {
        worksheetData.push(['💼 REVENUE BY CATEGORY']);
        worksheetData.push(['Category', 'Revenue (VND)', 'Enrollments', 'Avg Revenue per Enrollment']);
        const totalCategoryRevenue = stats.pieCharts.revenueByCategory.reduce((sum, item) => sum + item.revenue, 0);
        const totalCategoryEnrollments = stats.pieCharts.revenueByCategory.reduce((sum, item) => sum + item.enrollments, 0);
        
        stats.pieCharts.revenueByCategory.forEach((item) => {
          const avgPerEnrollment = item.enrollments > 0 ? (item.revenue / item.enrollments).toFixed(0) : 0;
          worksheetData.push([item.categoryName, item.revenue, item.enrollments, avgPerEnrollment]);
        });
        worksheetData.push(['TOTAL', totalCategoryRevenue, totalCategoryEnrollments, totalCategoryEnrollments > 0 ? (totalCategoryRevenue / totalCategoryEnrollments).toFixed(0) : 0]);
        worksheetData.push([]);
      }
      
      // Course Completion Section
      if (stats.pieCharts?.courseCompletion) {
        worksheetData.push(['🎓 COURSE COMPLETION']);
        worksheetData.push(['Course Title', 'Completion Rate', 'Completed', 'In Progress', 'Total Enrollments']);
        stats.pieCharts.courseCompletion.forEach((item) => {
          const completed = Math.round((item.completionRate / 100) * item.totalEnrollments);
          const inProgress = item.totalEnrollments - completed;
          worksheetData.push([
            item.title,
            item.completionRate + '%',
            completed,
            inProgress,
            item.totalEnrollments
          ]);
        });
        worksheetData.push([]);
      }
      
      // Rating Distribution Section
      if (stats.pieCharts?.courseRatingDistribution) {
        worksheetData.push(['⭐ RATING DISTRIBUTION']);
        worksheetData.push(['Rating', 'Count', 'Percentage']);
        const totalRatings = stats.pieCharts.courseRatingDistribution.reduce((sum, item) => sum + item.count, 0);
        stats.pieCharts.courseRatingDistribution.forEach((item) => {
          const percentage = totalRatings > 0 ? ((item.count / totalRatings) * 100).toFixed(2) + '%' : '0%';
          worksheetData.push([`${item.stars} Stars`, item.count, percentage]);
        });
        worksheetData.push(['TOTAL', totalRatings, '100%']);
      }
      
      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      
      // Set column widths
      ws['!cols'] = [
        { wch: 35 },  // Column A
        { wch: 22 },  // Column B
        { wch: 18 },  // Column C
        { wch: 22 },  // Column D
        { wch: 20 },  // Column E
      ];
      
      XLSX.utils.book_append_sheet(wb, ws, 'Dashboard Report');
      XLSX.writeFile(wb, `Instructor_Dashboard_${selectedYear}_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert('Failed to export Excel. Please try again.');
    } finally {
      setExporting(false);
    }
  };

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
    <div className="instructor-dash-container" ref={dashboardRef}>
      {/* Header */}
      <div className="instructor-dash-header">
        <div className="instructor-dash-title-section">
          <h1>Instructor Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={exportToPDF}
            disabled={exporting}
            style={{
              padding: '10px 20px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: exporting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: exporting ? 0.6 : 1,
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {exporting ? 'Đang xuất...' : 'Xuất PDF'}
          </button>
          <button 
            onClick={exportToExcel}
            disabled={exporting}
            style={{
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: exporting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: exporting ? 0.6 : 1,
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {exporting ? 'Đang xuất...' : 'Xuất Excel'}
          </button>
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
                          <span
                            className={`instructor-dash-badge instructor-dash-${
                              t.status || ""
                            }`}
                          >
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
                <div
                  key={course.courseId}
                  className="instructor-dash-completion-item"
                >
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
