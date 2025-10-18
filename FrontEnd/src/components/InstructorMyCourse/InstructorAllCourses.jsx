import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../common/Card/Card";
import { IoClose, IoWarning } from "react-icons/io5";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import {
  getInstructorCourses,
  deleteCourse,
  getAllCategories,
} from "../../services/instructorService";
import { toast } from "react-toastify";
import "../../assets/AdminMyCourse/AdminAllCourse.css";

const InstructorAllCourses = () => {
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
  const [coursesPerPage] = useState(8);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getInstructorCourses();

      let courses;
      if (response.data && response.data.data) {
        courses = response.data.data;
      } else if (response.data) {
        courses = response.data;
      } else {
        courses = response;
      }

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
        originalData: course,
      }));

      console.log("Instructor courses:", transformedCourses);
      setCoursesData(transformedCourses);
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
      setError(error.response?.data?.message || "Failed to fetch courses");
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await getAllCategories();

      let categoriesData;
      if (response.data && response.data.data) {
        categoriesData = response.data.data;
      } else if (response.data) {
        categoriesData = response.data;
      } else {
        categoriesData = response;
      }

      const categoryNames = categoriesData.map(
        (cat) => cat.name || cat.title || cat
      );

      setCategories(categoryNames);
    } catch (error) {
      console.error("Error fetching categories:", error);
      const fallbackCategories = [
        "Development",
        "Design",
        "Business",
        "Marketing",
        "IT & Software",
      ];
      setCategories(fallbackCategories);
    } finally {
      setLoadingCategories(false);
    }
  };

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

  const totalCourses = sortedCourses.length;
  const totalPages = Math.ceil(totalCourses / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = sortedCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Define menu actions for course cards
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

  // Handle menu action (compatible with Card component)
  const handleMenuAction = (course, action) => {
    switch (action.label) {
      case "View Details":
        navigate(`/instructor/courses/${course.id}`, {
          state: { courseData: course.originalData },
        });
        break;
      case "Edit Course":
        navigate(`/instructor/courses/edit/${course.id}`, {
          state: { courseData: course.originalData },
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

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    const studentsEnrolled =
      courseToDelete.originalData?.enrollmentCount ||
      (courseToDelete.originalData?.studentsEnrolled
        ? courseToDelete.originalData.studentsEnrolled.length
        : 0);

    if (studentsEnrolled > 0) {
      toast.info(
        `Course "${
          courseToDelete.title
        }" has ${studentsEnrolled} enrolled student${
          studentsEnrolled > 1 ? "s" : ""
        }. Cannot delete.`
      );
      setShowDeleteModal(false);
      setCourseToDelete(null);
      return;
    }

    try {
      await deleteCourse(courseToDelete.id);
      toast.success("Course deleted successfully");
      await fetchCourses();
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error(error.response?.data?.message || "Failed to delete course");
      setShowDeleteModal(false);
      setCourseToDelete(null);
    }
  };

  return (
    <div className="admin-all-courses">
      <div className="aac-filters">
        <div className="aac-filter-group">
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
            <option value="all">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
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
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading courses...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
        </div>
      ) : currentCourses.length === 0 ? (
        <div className="no-courses-message">
          <p>No courses found. Create your first course!</p>
          <button
            className="admin-all-course-create-btn"
            onClick={() => navigate("/instructor/courses/new")}
          >
            + Create New Course
          </button>
        </div>
      ) : (
        <>
          <div className="aac-courses-grid">
            {currentCourses.map((course) => (
              <div
                key={course.id}
                className="admin-course-card-wrapper"
                onClick={() =>
                  navigate(`/instructor/courses/${course.id}`, {
                    state: { courseData: course.originalData },
                  })
                }
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
            ))}
          </div>

          {totalPages > 1 && (
            <div className="aac-pagination">
              <button
                className="aac-page-btn"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <MdKeyboardArrowLeft size={20} />
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`aac-page-btn ${
                    currentPage === index + 1 ? "aac-page-active" : ""
                  }`}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="aac-page-btn"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <MdKeyboardArrowRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && courseToDelete && (
        <div className="amc-modal-overlay">
          <div className="amc-modal">
            <div className="amc-modal-header">
              <h3 className="amc-modal-title">Delete Course</h3>
              <button
                className="amc-modal-close"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCourseToDelete(null);
                }}
              >
                <IoClose size={24} />
              </button>
            </div>
            <div className="amc-modal-body">
              <div className="amc-modal-icon">
                <IoWarning size={48} color="#ff6636" />
              </div>
              <h4 className="amc-modal-message">
                Are you sure you want to delete this course?
              </h4>
              <p className="amc-modal-description">
                <strong>"{courseToDelete.title}"</strong> will be permanently
                deleted. This action cannot be undone.
              </p>
            </div>
            <div className="amc-modal-footer">
              <button
                className="amc-modal-button amc-modal-button-secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCourseToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="amc-modal-button amc-modal-button-danger"
                onClick={handleDeleteCourse}
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorAllCourses;
