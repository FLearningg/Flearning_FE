import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import CourseFilterHeader from "./CourseFilterHeader";
import Card from "../common/Card/Card";
import FilterSidebar from "./FilterSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../../assets/Categories/CourseScreen.css";
import { useNavigate } from "react-router-dom";
import { getAllCoursesWithoutDispatch } from "../../services/courseService";

const ITEMS_PER_PAGE = 12;

export default function CourseScreen() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("trending");
  const [showSidebar, setShowSidebar] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const navigate = useNavigate();

  const suggestions = [
    "user interface",
    "user experience",
    "web design",
    "interface",
    "app",
  ];

  const activeFilterCount = useMemo(
    () =>
      selectedCategories.length +
      selectedTools.length +
      selectedRatings.length +
      selectedLevels.length +
      selectedDurations.length +
      (priceRange[0] > 0 || priceRange[1] < 100 ? 1 : 0),
    [
      selectedCategories,
      selectedTools,
      selectedRatings,
      selectedLevels,
      selectedDurations,
      priceRange,
    ]
  );

  useEffect(() => {
    const controller = new AbortController(); // Cancel fetch on unmount

    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getAllCoursesWithoutDispatch({
          signal: controller.signal,
        });
        const data = Array.isArray(res) ? res : [res];

        setCourses(
          data.map((course) => ({
            id: course._id,
            title: course.title,
            image: course.thumbnail,
            price: course.price ?? 0,
            rating: course.rating ?? 0,
            students: (course.studentsEnrolled?.length ?? 0).toLocaleString(),
            category: course.categoryIds?.[0]?.name || "Unknown",
            categoryColor: "rgb(255, 238, 232)",
            level: course.level ?? "All levels",
            duration: course.duration ?? 0,
          }))
        );
      } catch (err) {
        if (axios.isCancel(err)) return; // Prevent error if aborted
        console.error("Failed to fetch courses:", err);
        setError("Failed to fetch courses.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchCourses();

    return () => controller.abort(); // Clean up fetch if component unmounts
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(course.category);

      const matchesTool =
        selectedTools.length === 0 ||
        selectedTools.some((tool) =>
          course.title.toLowerCase().includes(tool.toLowerCase())
        );

      const matchesRating =
        selectedRatings.length === 0 ||
        selectedRatings.some((r) => course.rating >= r);

      const matchesLevel =
        selectedLevels.length === 0 || selectedLevels.includes(course.level);

      const matchesDuration =
        selectedDurations.length === 0 ||
        selectedDurations.includes(course.duration);

      // Uncomment below to enable price filtering
      // const matchesPrice =
      //   course.price >= priceRange[0] && course.price <= priceRange[1];

      return (
        matchesSearch &&
        matchesCategory &&
        matchesTool &&
        matchesRating &&
        matchesLevel &&
        matchesDuration
        // && matchesPrice
      );
    });
  }, [
    courses,
    searchQuery,
    selectedCategories,
    selectedTools,
    selectedRatings,
    selectedLevels,
    selectedDurations,
    // priceRange,
  ]);

  const sortedCourses = useMemo(() => {
    let sorted = [...filteredCourses];
    switch (sort) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "newest":
        return sorted.sort((a, b) => b.id.localeCompare(a.id));
      default:
        return sorted;
    }
  }, [filteredCourses, sort]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = sortedCourses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(sortedCourses.length / ITEMS_PER_PAGE);

  return (
    <div className="p-4 course-screen">
      <CourseFilterHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sort={sort}
        setSort={setSort}
        activeFilterCount={activeFilterCount}
        suggestions={suggestions}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        resultCount={filteredCourses.length}
      />

      <div className="row g-4">
        {showSidebar && (
          <div className="col-12 col-md-6 col-lg-4 col-xl-3 filter-sidebarr">
            <FilterSidebar
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedTools={selectedTools}
              setSelectedTools={setSelectedTools}
              selectedRatings={selectedRatings}
              setSelectedRatings={setSelectedRatings}
              selectedLevels={selectedLevels}
              setSelectedLevels={setSelectedLevels}
              selectedDurations={selectedDurations}
              setSelectedDurations={setSelectedDurations}
            />
          </div>
        )}

        <div
          className={
            showSidebar ? "col-12 col-md-6 col-lg-8 col-xl-9" : "col-12"
          }
        >
          <div className="row g-4 justify-content-center">
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : error ? (
              <div className="text-danger text-center">{error}</div>
            ) : paginatedCourses.length === 0 ? (
              <div className="text-center">No courses found.</div>
            ) : (
              paginatedCourses.map((course) => (
                <div
                  key={course.id}
                  className={`${
                    showSidebar
                      ? "col-12 col-sm-6 col-md-12 col-lg-6 col-xl-4 center-course"
                      : "col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 center-course"
                  }`}
                  onClick={() => navigate(`/course/${course.id}`)}
                >
                  <Card
                    image={course.image}
                    category={course.category}
                    categoryBgColor={course.categoryColor}
                    price={`$${course.price}`}
                    title={course.title}
                    rating={course.rating}
                    students={course.students}
                    variant="normal"
                  />
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination custom-pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft size={18} />
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <li
                      key={page}
                      className={`page-item ${
                        page === currentPage ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page.toString().padStart(2, "0")}
                      </button>
                    </li>
                  )
                )}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  >
                    <ChevronRight size={18} />
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
