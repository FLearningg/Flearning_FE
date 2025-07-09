import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Card from "../common/Card/Card";
import SearchBox from "../common/search/SearchBox/SearchBox";
import {
  getAdminCourses,
  deleteCourse,
  getAllCategories,
} from "../../services/adminService";
import { toast } from "react-toastify";
import "../../assets/AdminMyCourse/AdminAllCourse.css";

const AdminAllCourse = ({ title = "My Courses" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState("latest");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(8); // 8 courses per page

  // Fetch courses and categories on component mount
  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminCourses();

      // Handle different response structures
      let courses;
      if (response.data && response.data.data) {
        courses = response.data.data;
      } else if (response.data) {
        courses = response.data;
      } else {
        courses = response;
      }

      // Transform API data to match the expected format
      const transformedCourses = courses.map((course) => ({
        id: course._id || course.id,
        image:
          course.thumbnail ||
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
        category:
          course.category || course.categoryIds?.[0]?.name || "DEVELOPMENTS",
        categoryBgColor: "#e8f4fd",
        categoryTextColor: "#1e40af",
        price: course.price ? `$${course.price}` : "$0.00",
        originalPrice: course.originalPrice ? `$${course.originalPrice}` : null,
        title: course.title || "Untitled Course",
        rating: course.rating || 0,
        students:
          course.studentsCount ||
          course.enrolledStudents ||
          course.studentsEnrolled?.length ||
          "0",
        actions: ["View Details", "Edit Course", "Delete Course"],
        // Store original course data for editing
        originalData: course,
      }));

      console.log("Transformed courses:", transformedCourses);
      setCoursesData(transformedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError(error.response?.data?.message || "Failed to fetch courses");
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await getAllCategories();

      console.log("Categories API response:", response);

      // Handle different response structures
      let categoriesData;
      if (response.data && response.data.data) {
        categoriesData = response.data.data;
      } else if (response.data) {
        categoriesData = response.data;
      } else {
        categoriesData = response;
      }

      console.log("Extracted categories data:", categoriesData);

      // Extract category names
      const categoryNames = categoriesData.map(
        (cat) => cat.name || cat.title || cat
      );

      console.log("Category names:", categoryNames);
      setCategories(categoryNames);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback to default categories if API fails
      const fallbackCategories = [
        "Development",
        "Design",
        "Business",
        "Marketing",
        "IT & Software",
      ];
      console.log("Using fallback categories:", fallbackCategories);
      setCategories(fallbackCategories);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Filter courses based on search and filters
  const filteredCourses = coursesData.filter((course) => {
    const matchesCategory =
      categoryFilter === "all" ||
      course.category.toLowerCase() === categoryFilter.toLowerCase() ||
      course.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "4+" && course.rating >= 4) ||
      (ratingFilter === "3+" && course.rating >= 3);

    return matchesCategory && matchesRating;
  });

  // Sort courses based on selected criteria
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return (
          new Date(b.originalData?.createdAt || 0) -
          new Date(a.originalData?.createdAt || 0)
        );
      case "oldest":
        return (
          new Date(a.originalData?.createdAt || 0) -
          new Date(b.originalData?.createdAt || 0)
        );
      case "popular":
        return (
          parseInt(b.students.replace(/,/g, "")) -
          parseInt(a.students.replace(/,/g, ""))
        );
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Pagination calculations
  const totalCourses = sortedCourses.length;
  const totalPages = Math.ceil(totalCourses / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = sortedCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, ratingFilter, sortBy]);

  // Pagination handlers
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  // Handle course click - navigate to AdminMyCourse with course details
  const handleCourseClick = (course) => {
    navigate(`/admin/courses/${course.id}`, {
      state: { courseData: course.originalData },
    });
  };

  // Menu actions for each course
  const getMenuActions = (course) => [
    {
      label: "View Details",
      type: "primary",
      icon: "👁️",
    },
    {
      label: "Edit Course",
      type: "secondary",
      icon: "✏️",
    },
    {
      label: "Delete Course",
      type: "danger",
      icon: "🗑️",
    },
  ];

  // Handle menu action
  const handleMenuAction = (course, action) => {
    switch (action.label) {
      case "View Details":
        handleCourseClick(course);
        break;
      case "Edit Course":
        // Navigate to CourseWizard with course data for editing
        navigate(`/admin/courses/edit/${course.id}`, {
          state: {
            courseData: course.originalData,
            isEditMode: true,
          },
        });
        break;
      case "Delete Course":
        if (window.confirm("Are you sure you want to delete this course?")) {
          handleDeleteCourse(course.id);
        }
        break;
      default:
        break;
    }
  };

  // Handle course deletion
  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await deleteCourse(courseId);
      console.log("Delete course response:", response);
      toast.success("Course deleted successfully");
      // Refresh the courses list
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error(error.response?.data?.message || "Failed to delete course");
    }
  };

  // Enhanced Card component with admin actions
  const AdminCourseCard = ({ course }) => {
    return (
      <div
        className="admin-course-card-wrapper"
        onClick={() => handleCourseClick(course)}
      >
        <Card
          image={course.image}
          category={course.category}
          categoryBgColor={course.categoryBgColor}
          categoryTextColor={course.categoryTextColor}
          price={course.price}
          originalPrice={course.originalPrice}
          title={course.title}
          rating={course.rating}
          students={course.students}
          variant="admin"
          menuActions={getMenuActions(course)}
          onMenuAction={(action) => handleMenuAction(course, action)}
        />
      </div>
    );
  };

  // Sample search data for SearchBox
  const searchData = coursesData.map((course) => ({
    id: course.id,
    label: course.title,
    category: course.category,
  }));

  // Handle search selection
  const handleSearchSelect = (selectedItem) => {
    const course = coursesData.find((c) => c.id === selectedItem.id);
    if (course) {
      handleCourseClick(course);
    }
  };

  // Handle category click
  const handleCategoryClick = () => {
    console.log("Category clicked");
  };

  if (loading) {
    return (
      <div className="admin-all-courses">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-all-courses">
        <div className="error-container">
          <p>Error: {error}</p>
          <button onClick={fetchCourses} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-all-courses">
      {/* Filters */}
      <div className="aac-filters">
        <SearchBox
          data={searchData}
          placeholder="Search in your courses..."
          onSelect={handleSearchSelect}
          onCategoryClick={handleCategoryClick}
          categoryLabel="Browse"
          containerClassName="aac-search-box"
        />

        <select
          className="aac-filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
        </select>

        <select
          className="aac-filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          disabled={loadingCategories}
        >
          <option value="all">
            {loadingCategories ? "Loading Categories..." : "All Category"}
          </option>
          {categories.map((category) => (
            <option key={category} value={category.toLowerCase()}>
              {category}
            </option>
          ))}
        </select>

        <select
          className="aac-filter-select"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
        >
          <option value="all">All Ratings</option>
          <option value="4+">4+ Stars</option>
          <option value="3+">3+ Stars</option>
        </select>

        {/* Show filter info */}
        <div className="aac-filter-info">
          <span className="aac-filter-count">
            Showing {indexOfFirstCourse + 1}-
            {Math.min(indexOfLastCourse, totalCourses)} of {totalCourses}{" "}
            courses
            {totalCourses !== coursesData.length &&
              ` (filtered from ${coursesData.length})`}
          </span>
          {(categoryFilter !== "all" || ratingFilter !== "all") && (
            <button
              className="aac-clear-filters-btn"
              onClick={() => {
                setCategoryFilter("all");
                setRatingFilter("all");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="aac-courses-grid">
        {currentCourses.length > 0 ? (
          currentCourses.map((course) => (
            <AdminCourseCard key={course.id} course={course} />
          ))
        ) : (
          <div className="no-courses-message">
            <p>No courses found matching your criteria</p>
            <button onClick={fetchCourses} className="refresh-button">
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="aac-pagination">
          <button
            className={`aac-page-btn aac-page-prev ${
              currentPage === 1 ? "disabled" : ""
            }`}
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="aac-page-numbers">
            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                className={`aac-page-btn ${
                  currentPage === pageNumber ? "aac-page-active" : ""
                }`}
                onClick={() => goToPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          <button
            className={`aac-page-btn aac-page-next ${
              currentPage === totalPages ? "disabled" : ""
            }`}
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminAllCourse;
