import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../common/Card/Card";
import SearchBox from "../common/search/SearchBox/SearchBox";
import { IoClose, IoWarning } from "react-icons/io5";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import {
  getAdminCourses,
  deleteCourse,
  getAllCategories,
} from "../../services/adminService";
import { toast } from "react-toastify";
import "../../assets/AdminMyCourse/AdminAllCourse.css";

const AdminAllCourse = ({ title = "My Courses" }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("latest");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

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
        const aCount = Array.isArray(a.originalData?.studentsEnrolled)
          ? a.originalData.studentsEnrolled.length
          : a.originalData?.enrolledStudents ||
            a.originalData?.studentsCount ||
            0;
        const bCount = Array.isArray(b.originalData?.studentsEnrolled)
          ? b.originalData.studentsEnrolled.length
          : b.originalData?.enrolledStudents ||
            b.originalData?.studentsCount ||
            0;
        return bCount - aCount;
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
      icon: <FaEye />,
    },
    {
      label: "Edit Course",
      type: "secondary",
      icon: <FaEdit />,
    },
    {
      label: "Delete Course",
      type: "danger",
      icon: <FaTrash />,
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
        setCourseToDelete(course);
        setShowDeleteModal(true);
        break;
      default:
        break;
    }
  };

  // Modal handlers
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  const confirmDelete = async () => {
    if (courseToDelete) {
      // Check if course has enrolled students
      const studentsCount = parseInt(courseToDelete.students) || 0;
      const originalData = courseToDelete.originalData;
      const enrolledStudents =
        originalData?.studentsCount ||
        originalData?.enrolledStudents ||
        originalData?.studentsEnrolled?.length ||
        studentsCount;

      if (enrolledStudents > 0) {
        // If has students, just close modal and show info message
        toast.info(
          `Course "${
            courseToDelete.title
          }" has ${enrolledStudents} enrolled student${
            enrolledStudents > 1 ? "s" : ""
          }. Deletion cancelled for student protection.`
        );
        setShowDeleteModal(false);
        setCourseToDelete(null);
        return;
      }

      // Only delete if no students enrolled
      try {
        const response = await deleteCourse(courseToDelete.id);
        console.log("Delete course response:", response);
        toast.success("Course deleted successfully");
        // Refresh the courses list
        fetchCourses();
      } catch (error) {
        console.error("Error deleting course:", error);
        toast.error(error.response?.data?.message || "Failed to delete course");
      } finally {
        setShowDeleteModal(false);
        setCourseToDelete(null);
      }
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
            <MdKeyboardArrowLeft size={20} />
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
            <MdKeyboardArrowRight size={20} />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal &&
        courseToDelete &&
        (() => {
          const studentsCount = parseInt(courseToDelete.students) || 0;
          const originalData = courseToDelete.originalData;
          const enrolledStudents =
            originalData?.studentsCount ||
            originalData?.enrolledStudents ||
            originalData?.studentsEnrolled?.length ||
            studentsCount;
          const hasStudents = enrolledStudents > 0;

          return (
            <div className="amc-modal-overlay">
              <div className={`amc-modal ${hasStudents ? "info-modal" : ""}`}>
                <div className="amc-modal-header">
                  <h3 className="amc-modal-title">
                    {hasStudents ? "Course Information" : "Delete Course"}
                  </h3>
                  <button className="amc-modal-close" onClick={cancelDelete}>
                    <IoClose size={20} />
                  </button>
                </div>
                <div className="amc-modal-body">
                  <div className="amc-modal-icon">
                    <IoWarning size={48} />
                  </div>
                  <h4 className="amc-modal-message">
                    {hasStudents
                      ? "Cannot Delete Course with Enrolled Students"
                      : "Are you sure you want to delete this course?"}
                  </h4>
                  <p className="amc-modal-description">
                    {hasStudents ? (
                      <>
                        <strong>"{courseToDelete.title}"</strong> currently has{" "}
                        <strong>
                          {enrolledStudents} enrolled student
                          {enrolledStudents > 1 ? "s" : ""}
                        </strong>
                        . This course cannot be deleted to protect student
                        learning progress and data.
                      </>
                    ) : (
                      <>
                        <strong>"{courseToDelete.title}"</strong> will be
                        permanently deleted. This action cannot be undone and
                        all course data will be lost.
                      </>
                    )}
                  </p>
                  <div className="amc-modal-warning-info">
                    <p className="amc-students-info">
                      <strong>Students enrolled:</strong> {enrolledStudents}
                    </p>
                    {hasStudents && (
                      <p className="amc-warning-text">
                        ⚠️ To delete this course, please wait for students to
                        complete their learning or contact support for
                        assistance.
                      </p>
                    )}
                  </div>
                </div>
                <div className="amc-modal-footer">
                  <button
                    className="amc-modal-button amc-modal-button-secondary"
                    onClick={cancelDelete}
                  >
                    {hasStudents ? "Understood" : "Cancel"}
                  </button>
                  {!hasStudents && (
                    <button
                      className="amc-modal-button amc-modal-button-danger"
                      onClick={confirmDelete}
                    >
                      Delete Course
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default AdminAllCourse;
