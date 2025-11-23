import React, { useState, useEffect, useRef } from "react";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { getDashboardStats } from "../../services/dashboardService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import "../../assets/AdminDashboard/ModernAdminDashboard.css";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [exporting, setExporting] = useState(false);
  const dashboardRef = useRef(null);

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
  const TrendingUpIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  );
  const AcademicCapIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 14l9-5-9-5-9 5 9 5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
      />
    </svg>
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats(selectedYear);
        setStats(response.data);
        console.log('Admin Dashboard Stats:', response.data);
        console.log('Category Distribution:', response.data?.categoryDistribution);
        
        // Generate available years (from 2020 to current year)
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = 2020; year <= currentYear; year++) {
          years.push(year);
        }
        setAvailableYears(years);
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
  }, [selectedYear]);

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
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Admin_Dashboard_${selectedYear}_${new Date().toISOString().split('T')[0]}.pdf`);
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
      // Prepare data for Excel with styling
      const wb = XLSX.utils.book_new();
      const worksheetData = [];
      
      // Title Section
      worksheetData.push(['ADMIN DASHBOARD REPORT']);
      worksheetData.push(['Generated:', new Date().toLocaleString('vi-VN')]);
      worksheetData.push(['Year:', selectedYear]);
      worksheetData.push([]);
      
      // Overview Statistics Section
      worksheetData.push(['📊 OVERVIEW STATISTICS']);
      worksheetData.push(['Metric', 'Value', 'Unit']);
      worksheetData.push(['Total Users', stats.totalUsers || 0, 'users']);
      worksheetData.push(['Total Courses', stats.totalCourses || 0, 'courses']);
      worksheetData.push(['Total Enrollments', stats.totalEnrollments || 0, 'enrollments']);
      worksheetData.push(['Total Revenue', stats.totalRevenue || 0, 'VND']);
      worksheetData.push(['Revenue This Month', stats.revenueThisMonth || 0, 'VND']);
      worksheetData.push(['New Users This Month', stats.newUsersThisMonth || 0, 'users']);
      worksheetData.push([]);
      
      // Monthly Revenue Section
      worksheetData.push(['💰 MONTHLY REVENUE BREAKDOWN']);
      worksheetData.push(['Month', 'Revenue (VND)', 'Percentage']);
      const totalYearRevenue = (stats.monthlySales || []).reduce((sum, item) => sum + item.revenue, 0);
      (stats.monthlySales || []).forEach((item) => {
        const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][item.month - 1];
        const percentage = totalYearRevenue > 0 ? ((item.revenue / totalYearRevenue) * 100).toFixed(2) + '%' : '0%';
        worksheetData.push([monthName, item.revenue, percentage]);
      });
      worksheetData.push(['TOTAL', totalYearRevenue, '100%']);
      worksheetData.push([]);
      
      // Category Distribution Section
      worksheetData.push(['📚 CATEGORY DISTRIBUTION']);
      worksheetData.push(['Category', 'Number of Courses', 'Percentage']);
      const totalCourses = (stats.categoryDistribution || []).reduce((sum, cat) => sum + cat.count, 0);
      (stats.categoryDistribution || []).forEach((cat) => {
        const percentage = totalCourses > 0 ? ((cat.count / totalCourses) * 100).toFixed(2) + '%' : '0%';
        worksheetData.push([cat.name, cat.count, percentage]);
      });
      worksheetData.push(['TOTAL', totalCourses, '100%']);
      worksheetData.push([]);
      
      // Top Selling Courses Section
      worksheetData.push(['🏆 TOP 5 SELLING COURSES']);
      worksheetData.push(['Rank', 'Course Title', 'Enrollments', 'Price (VND)', 'Revenue (VND)']);
      (stats.topSellingCourses || []).forEach((course, index) => {
        const revenue = course.enrollmentCount * course.price;
        worksheetData.push([
          `#${index + 1}`,
          course.title,
          course.enrollmentCount,
          course.price,
          revenue
        ]);
      });
      worksheetData.push([]);
      
      // Course Status Section
      worksheetData.push(['📋 COURSE STATUS']);
      worksheetData.push(['Status', 'Count', 'Percentage']);
      const totalStatusCourses = (stats.courseStatus?.active || 0) + (stats.courseStatus?.pending || 0) + (stats.courseStatus?.draft || 0) + (stats.courseStatus?.rejected || 0);
      worksheetData.push(['Active', stats.courseStatus?.active || 0, totalStatusCourses > 0 ? ((stats.courseStatus?.active / totalStatusCourses) * 100).toFixed(2) + '%' : '0%']);
      worksheetData.push(['Pending', stats.courseStatus?.pending || 0, totalStatusCourses > 0 ? ((stats.courseStatus?.pending / totalStatusCourses) * 100).toFixed(2) + '%' : '0%']);
      worksheetData.push(['Draft', stats.courseStatus?.draft || 0, totalStatusCourses > 0 ? ((stats.courseStatus?.draft / totalStatusCourses) * 100).toFixed(2) + '%' : '0%']);
      worksheetData.push(['Rejected', stats.courseStatus?.rejected || 0, totalStatusCourses > 0 ? ((stats.courseStatus?.rejected / totalStatusCourses) * 100).toFixed(2) + '%' : '0%']);
      worksheetData.push(['TOTAL', totalStatusCourses, '100%']);
      worksheetData.push([]);
      
      // Instructor Statistics Section
      worksheetData.push(['👨‍🏫 INSTRUCTOR STATISTICS']);
      worksheetData.push(['Metric', 'Value', 'Note']);
      worksheetData.push(['Total Instructors', stats.instructorStats?.total || 0, 'All registered instructors']);
      worksheetData.push(['Active Instructors', stats.instructorStats?.active || 0, 'Instructors with published courses']);
      worksheetData.push(['Total Students', stats.instructorStats?.students || 0, 'All registered students']);
      const activeRate = stats.instructorStats?.total > 0 ? ((stats.instructorStats?.active / stats.instructorStats?.total) * 100).toFixed(2) + '%' : '0%';
      worksheetData.push(['Active Rate', activeRate, 'Percentage of active instructors']);
      
      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      
      // Set column widths
      ws['!cols'] = [
        { wch: 35 },  // Column A - wider for titles
        { wch: 22 },  // Column B
        { wch: 18 },  // Column C
        { wch: 18 },  // Column D
        { wch: 18 },  // Column E
      ];
      
      XLSX.utils.book_append_sheet(wb, ws, 'Dashboard Report');
      XLSX.writeFile(wb, `Admin_Dashboard_${selectedYear}_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert('Failed to export Excel. Please try again.');
    } finally {
      setExporting(false);
    }
  };

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
    labels: stats?.monthlySales?.map((s) => monthLabels[s.month - 1]) || [],
    datasets: [
      {
        label: "Revenue",
        data: stats?.monthlySales?.map((s) => s.revenue) || [],
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
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        titleColor: '#fff',
        bodyColor: '#fff',
        titleFont: {
          size: 13,
          weight: '600',
        },
        bodyFont: {
          size: 14,
          weight: '700',
        },
        callbacks: {
          title: (context) => {
            return context[0].label;
          },
          label: (context) => {
            const value = context.parsed.y
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return `${value} đ`;
          },
        },
      },
    },
    scales: {
      x: { 
        grid: { display: false },
        ticks: { 
          color: "#9ca3af",
          font: {
            size: 11,
            weight: '500'
          }
        } 
      },
      y: {
        grid: { 
          color: "#f3f4f6",
          borderDash: [3, 3] 
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 11,
            weight: '500'
          },
          callback: (value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
            return value;
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  // NEW: User Growth Chart
  const userGrowthData = {
    labels:
      stats?.userGrowth?.map((ug) => monthLabels[ug.month - 1]) || [],
    datasets: [
      {
        label: "New Users",
        data: stats?.userGrowth?.map((ug) => ug.count) || [],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const userGrowthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        titleColor: '#fff',
        bodyColor: '#10b981',
        titleFont: {
          size: 13,
          weight: '600',
        },
        bodyFont: {
          size: 14,
          weight: '700',
        },
      },
    },
    scales: {
      x: { 
        grid: { display: false }, 
        ticks: { 
          color: "#9ca3af",
          font: { size: 11, weight: '500' }
        } 
      },
      y: {
        grid: { 
          color: "#f3f4f6", 
          borderDash: [3, 3] 
        },
        ticks: { 
          color: "#9ca3af",
          font: { size: 11, weight: '500' }
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  // NEW: Category Distribution Chart (Bar)
  console.log('categoryDistribution from API:', stats?.categoryDistribution);
  
  const categoryData = {
    labels: stats?.categoryDistribution?.length > 0 
      ? stats.categoryDistribution.map((cat) => cat.name) 
      : ['No Data'],
    datasets: [
      {
        label: 'Number of Courses',
        data: stats?.categoryDistribution?.length > 0 
          ? stats.categoryDistribution.map((cat) => cat.count) 
          : [0],
        backgroundColor: 'rgba(124, 58, 237, 0.8)',
        borderColor: 'rgba(124, 58, 237, 1)',
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const categoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(124, 58, 237, 0.5)",
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            return ` ${context.parsed.y} courses`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#9ca3af",
          font: { size: 11, weight: '500' },
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Number of Courses',
          color: '#6b7280',
          font: { size: 12, weight: '600' },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9ca3af",
          font: { size: 11, weight: '500' },
          maxRotation: 45,
          minRotation: 45,
        },
        title: {
          display: true,
          text: 'Categories',
          color: '#6b7280',
          font: { size: 12, weight: '600' },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  // NEW: Top Selling Courses Chart (Horizontal Bar)
  const topCoursesData = {
    labels: stats?.topSellingCourses?.map((c) => c.title.slice(0, 30)) || [],
    datasets: [
      {
        label: "Enrollments",
        data: stats?.topSellingCourses?.map((c) => c.enrollmentCount) || [],
        backgroundColor: [
          'rgba(249, 115, 22, 0.9)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(249, 115, 22, 0.6)',
          'rgba(249, 115, 22, 0.5)',
        ],
        borderColor: 'rgba(249, 115, 22, 1)',
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 35,
      },
    ],
  };

  const topCoursesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(249, 115, 22, 0.5)",
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: (context) => {
            return ` ${context.parsed.x} enrollments`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#9ca3af",
          font: { size: 11, weight: '500' },
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Enrollments',
          color: '#6b7280',
          font: { size: 12, weight: '600' },
        },
      },
      y: {
        grid: { display: false },
        ticks: {
          color: "#9ca3af",
          font: { size: 11, weight: '500' },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  // NEW: Course Status Chart (Pie)
  const courseStatusData = {
    labels: ["Active", "Pending", "Draft", "Rejected"],
    datasets: [
      {
        data: [
          stats?.courseStatus?.active || 0,
          stats?.courseStatus?.pending || 0,
          stats?.courseStatus?.draft || 0,
          stats?.courseStatus?.rejected || 0,
        ],
        backgroundColor: ["#10b981", "#f59e0b", "#6b7280", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  const courseStatusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          font: { size: 12 },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "#000",
        padding: 10,
      },
    },
  };

  // Course Rating Distribution Chart (Line with gradient)
  const ratingData = {
    labels: stats?.courseRating?.distribution?.map(d => d.rating.toFixed(1)) || [],
    datasets: [
      {
        label: 'Number of Courses',
        data: stats?.courseRating?.distribution?.map(d => d.count) || [],
        borderColor: 'rgb(124, 58, 237)',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(124, 58, 237, 0.4)');
          gradient.addColorStop(1, 'rgba(124, 58, 237, 0.0)');
          return gradient;
        },
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: 'rgb(124, 58, 237)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(124, 58, 237)',
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const ratingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(124, 58, 237, 0.5)",
        borderWidth: 1,
        callbacks: {
          title: (context) => `Rating: ${context[0].label} ⭐`,
          label: (context) => {
            const total = stats?.courseRating?.stats?.total || 0;
            const percentage = total > 0 ? ((context.parsed.y / total) * 100).toFixed(1) : 0;
            return ` ${context.parsed.y} courses (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#9ca3af",
          font: { size: 11, weight: '500' },
        },
        title: {
          display: true,
          text: 'Rating ⭐',
          color: '#6b7280',
          font: { size: 12, weight: '600' },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#9ca3af",
          font: { size: 11, weight: '500' },
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Number of Courses',
          color: '#6b7280',
          font: { size: 12, weight: '600' },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
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
    <div className="ad-dashboard-container" ref={dashboardRef}>
      {/* Header */}
      <div className="ad-dashboard-header">
        <div>
          <h1 className="ad-dashboard-title">Admin Dashboard</h1>
          <p className="ad-dashboard-subtitle">Welcome back! Here's your overview</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="ad-export-button"
            onClick={exportToPDF}
            disabled={exporting}
            style={{
              padding: '10px 20px',
              backgroundColor: '#7c3aed',
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
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
          <button 
            className="ad-export-button"
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
            {exporting ? 'Exporting...' : 'Export Excel'}
          </button>
        </div>
      </div>

      {/* Stats Cards - Horizontal Scroll */}
      <div className="ad-stats-grid">
        {/* Card 1: Total Enrollments */}
        <div className="ad-stat-card">
          <div className="ad-stat-content">
            <div className="ad-stat-header">
              <div className="ad-stat-info">
                <p className="ad-stat-label">Total Enrollments</p>
                <p className="ad-stat-value">{(stats?.totalEnrollments || 0).toLocaleString()}</p>
                <div className="ad-stat-change positive">
                  +{((stats?.newUsersThisMonth || 0) / (stats?.totalEnrollments || 1) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="ad-stat-icon">
                <PlayIcon />
              </div>
            </div>
            <div className="ad-stat-mini-chart">
              <Line 
                data={{
                  labels: ['', '', '', '', '', ''],
                  datasets: [{
                    data: stats?.monthlySales?.slice(-6)?.map(s => s.revenue) || [20, 35, 25, 45, 30, 50],
                    borderColor: 'rgba(255,255,255,0.8)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false }, tooltip: { enabled: false } },
                  scales: { x: { display: false }, y: { display: false } },
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Total Courses */}
        <div className="ad-stat-card">
          <div className="ad-stat-content">
            <div className="ad-stat-header">
              <div className="ad-stat-info">
                <p className="ad-stat-label">Total Courses</p>
                <p className="ad-stat-value">{(stats?.totalCourses || 0).toLocaleString()}</p>
                <div className="ad-stat-change positive">
                  +{((stats?.courseStatus?.published || 0) / (stats?.totalCourses || 1) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="ad-stat-icon">
                <BookOpenIcon />
              </div>
            </div>
            <div className="ad-stat-mini-chart">
              <Line 
                data={{
                  labels: ['', '', '', '', '', ''],
                  datasets: [{
                    data: [15, 28, 22, 38, 32, 45],
                    borderColor: 'rgba(255,255,255,0.8)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false }, tooltip: { enabled: false } },
                  scales: { x: { display: false }, y: { display: false } },
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Total Revenue */}
        <div className="ad-stat-card">
          <div className="ad-stat-content">
            <div className="ad-stat-header">
              <div className="ad-stat-info">
                <p className="ad-stat-label">Total Revenue</p>
                <p className="ad-stat-value">
                  {(stats?.totalRevenue || 0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ
                </p>
                <div className="ad-stat-change positive">
                  +{((stats?.revenueThisMonth || 0) / (stats?.totalRevenue || 1) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="ad-stat-icon">
                <DollarSignIcon />
              </div>
            </div>
            <div className="ad-stat-mini-chart">
              <Line 
                data={{
                  labels: ['', '', '', '', '', ''],
                  datasets: [{
                    data: stats?.monthlySales?.slice(-6)?.map(s => s.revenue) || [30, 45, 35, 55, 42, 60],
                    borderColor: 'rgba(255,255,255,0.8)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false }, tooltip: { enabled: false } },
                  scales: { x: { display: false }, y: { display: false } },
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 4: Total Students */}
        <div className="ad-stat-card">
          <div className="ad-stat-content">
            <div className="ad-stat-header">
              <div className="ad-stat-info">
                <p className="ad-stat-label">Total Students</p>
                <p className="ad-stat-value">{(stats?.instructorStats?.students || 0).toLocaleString()}</p>
                <div className="ad-stat-change positive">
                  Online: {(stats?.instructorStats?.onlineStudents || 0).toLocaleString()}
                </div>
              </div>
              <div className="ad-stat-icon">
                <UsersIcon />
              </div>
            </div>
            <div className="ad-stat-mini-chart">
              <Line 
                data={{
                  labels: ['', '', '', '', '', ''],
                  datasets: [{
                    data: stats?.userGrowth?.slice(-6)?.map(u => u.count) || [40, 52, 48, 65, 58, 72],
                    borderColor: 'rgba(255,255,255,0.8)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false }, tooltip: { enabled: false } },
                  scales: { x: { display: false }, y: { display: false } },
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 5: Monthly Revenue */}
        <div className="ad-stat-card">
          <div className="ad-stat-content">
            <div className="ad-stat-header">
              <div className="ad-stat-info">
                <p className="ad-stat-label">Monthly Revenue</p>
                <p className="ad-stat-value">
                  {(stats?.revenueThisMonth || 0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ
                </p>
                <div className="ad-stat-change positive">
                  +12.5%
                </div>
              </div>
              <div className="ad-stat-icon">
                <DollarSignIcon />
              </div>
            </div>
            <div className="ad-stat-mini-chart">
              <Line 
                data={{
                  labels: ['', '', '', '', '', ''],
                  datasets: [{
                    data: [25, 38, 30, 48, 40, 55],
                    borderColor: 'rgba(255,255,255,0.8)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false }, tooltip: { enabled: false } },
                  scales: { x: { display: false }, y: { display: false } },
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 6: Total Instructors */}
        <div className="ad-stat-card">
          <div className="ad-stat-content">
            <div className="ad-stat-header">
              <div className="ad-stat-info">
                <p className="ad-stat-label">Total Instructors</p>
                <p className="ad-stat-value">{(stats?.instructorStats?.total || 0).toLocaleString()}</p>
                <div className="ad-stat-change positive">
                  Online: {(stats?.instructorStats?.online || 0).toLocaleString()}
                </div>
              </div>
              <div className="ad-stat-icon">
                <AcademicCapIcon />
              </div>
            </div>
            <div className="ad-stat-mini-chart">
              <Line 
                data={{
                  labels: ['', '', '', '', '', ''],
                  datasets: [{
                    data: [18, 24, 22, 30, 28, 35],
                    borderColor: 'rgba(255,255,255,0.8)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false }, tooltip: { enabled: false } },
                  scales: { x: { display: false }, y: { display: false } },
                }}
              />
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
                <select 
                  className="ad-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
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

        {/* NEW: User Growth Chart */}
        <div className="ad-bottom-grid">
          <div className="ad-card">
            <div className="ad-card-header">
              <div className="ad-section-header">
                <h3 className="ad-card-title">User Growth</h3>
                <select 
                  className="ad-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="ad-card-content">
              <div className="chart-placeholder" style={{ height: "250px" }}>
                <Line options={userGrowthOptions} data={userGrowthData} />
              </div>
            </div>
          </div>
        </div>

        {/* NEW: Two Column Charts Grid */}
        <div className="ad-charts-grid-two">
          {/* Category Distribution */}
          <div className="ad-card">
            <div className="ad-card-header">
              <div className="ad-section-header">
                <h3 className="ad-card-title">Category Distribution</h3>
              </div>
            </div>
            <div className="ad-card-content">
              {stats?.categoryDistribution?.length > 0 ? (
                <div className="chart-placeholder" style={{ height: "300px" }}>
                  <Bar options={categoryOptions} data={categoryData} />
                </div>
              ) : (
                <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
                  No category data available
                </div>
              )}
            </div>
          </div>

          {/* Course Rating Distribution */}
          <div className="ad-card">
            <div className="ad-card-header">
              <div className="ad-section-header">
                <h3 className="ad-card-title">Course Rating Distribution</h3>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                  Avg: {stats?.courseRating?.averageRating || '0.00'} ⭐
                </p>
              </div>
            </div>
            <div className="ad-card-content">
              {stats?.courseRating?.distribution?.length > 0 ? (
                <div className="chart-placeholder" style={{ height: "300px" }}>
                  <Line options={ratingOptions} data={ratingData} />
                </div>
              ) : (
                <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
                  No rating data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NEW: Two Column Charts Grid - Course Status & Top Courses */}
        <div className="ad-charts-grid-two">
          {/* Course Status */}
          <div className="ad-card">
            <div className="ad-card-header">
              <div className="ad-section-header">
                <h3 className="ad-card-title">Course Status</h3>
              </div>
            </div>
            <div className="ad-card-content">
              <div className="chart-placeholder" style={{ height: "300px" }}>
                <Pie options={courseStatusOptions} data={courseStatusData} />
              </div>
            </div>
          </div>

          {/* Top Selling Courses */}
          <div className="ad-card">
            <div className="ad-card-header">
              <div className="ad-section-header">
                <h3 className="ad-card-title">Top 5 Selling Courses</h3>
              </div>
            </div>
            <div className="ad-card-content">
              <div className="chart-placeholder" style={{ height: "300px" }}>
                <Bar options={topCoursesOptions} data={topCoursesData} />
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AdminDashboard;
