import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import CourseFilterHeader from "./CourseFilterHeader";
import Card from "../common/Card/Card";
import FilterSidebar from "./FilterSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../../assets/Categories/CourseScreen.css";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllCoursesWithoutDispatch } from "../../services/courseService";
import { getAllCategories } from "../../services/categoryService";

const ITEMS_PER_PAGE = 12;
const MAX_PRICE = 1000000;

// --- 1. ĐỊNH NGHĨA DANH SÁCH TOOLS Ở ĐÂY ---
const toolsList = [
  "HTML 5",
  "CSS 3",
  "React",
  "Webflow",
  "Node.js",
  "Laravel",
  "Saas",
  "Wordpress",
];

export default function CourseScreen() {
  // --- STATE ---
  const [rawCourses, setRawCourses] = useState([]); // Dữ liệu thô từ API
  const [apiCategories, setApiCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("trending");
  const [showSidebar, setShowSidebar] = useState(true);
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [currentPage, setCurrentPage] = useState(1);

  // States cho các bộ lọc
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedPriceTypes, setSelectedPriceTypes] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchParam = params.get("search") || "";

  // --- EFFECTS ---
  // (Các useEffect không thay đổi... )
  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Gọi cả 2 API cùng lúc
        const [courseRes, categoryRes] = await Promise.all([
          getAllCoursesWithoutDispatch({ signal: controller.signal }),
          getAllCategories({ signal: controller.signal }),
        ]);

        // Xử lý courses
        const courseData = Array.isArray(courseRes) ? courseRes : [];
        setRawCourses(courseData);

        // Xử lý categories
        const categoryData = Array.isArray(categoryRes) ? categoryRes : [];
        setApiCategories(categoryData); // <-- Lưu categories vào state
      } catch (err) {
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
          return; // Bỏ qua lỗi hủy này một cách an toàn
        }
        // --- KẾT THÚC SỬA ---

        // Chỉ log các lỗi thực sự
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch data.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCategories,
    selectedTools,
    selectedRatings,
    selectedLevels,
    selectedDurations,
    selectedPriceTypes,
    priceRange,
  ]);

  // --- MEMOS (LOGIC TÍNH TOÁN) ---
  // (formatVND, activeFilterCount không đổi...)
  const formatVND = (price) => {
    const number = Number(price) || 0;
    return number.toLocaleString("vi-VN");
  };

  const activeFilterCount = useMemo(
    () =>
      selectedCategories.length +
      selectedTools.length +
      selectedRatings.length +
      selectedLevels.length +
      selectedDurations.length +
      selectedPriceTypes.length +
      (priceRange[0] > 0 || priceRange[1] < MAX_PRICE ? 1 : 0),
    [
      selectedCategories,
      selectedTools,
      selectedRatings,
      selectedLevels,
      selectedDurations,
      selectedPriceTypes,
      priceRange,
    ]
  );

  // --- LOGIC LỌC VÀ ĐẾM SỐ LƯỢNG ĐA CHIỀU (FACETED) ---
  const {
    filteredCourses,
    categoryCounts,
    toolCounts, // <-- 2. LẤY toolCounts
    ratingCounts,
    levelCounts,
    durationCounts,
    priceCounts,
  } = useMemo(() => {
    // Khởi tạo các bộ đếm
    const counts = {
      category: {},
      tool: {}, // <-- 3. KHỞI TẠO BỘ ĐẾM TOOL
      rating: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      level: { "All Level": 0, Beginner: 0, Intermediate: 0, Expert: 0 },
      duration: {
        "1-7 Days": 0,
        "1-4 Weeks": 0,
        "1-3 Months": 0,
        "3-6 Months": 0,
        "6-12 Months": 0,
      },
      price: { Free: 0, Paid: 0 },
    };
    // Khởi tạo bộ đếm tool dựa trên toolsList
    toolsList.forEach((tool) => {
      counts.tool[tool] = 0;
    });

    // --- Các hàm "kiểm tra" (tester) cho từng bộ lọc ---
    const matchesSearch = (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.categoryIds.some((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory = (course) =>
      selectedCategories.length === 0 ||
      selectedCategories.some((catFilter) =>
        course.categoryIds.some((cat) => cat.name === catFilter)
      );

    // --- 4. SỬA HÀM matchesTool ĐỂ LỌC CHÍNH XÁC ---
    const matchesTool = (course) => {
      if (selectedTools.length === 0) return true;

      const titleLower = (course.title || "").toLowerCase();
      const subTitleLower = (course.subTitle || "").toLowerCase();
      const descriptionLower = (course.detail?.description || "").toLowerCase();

      return selectedTools.some((tool) => {
        const toolLower = tool.toLowerCase();
        return (
          titleLower.includes(toolLower) ||
          subTitleLower.includes(toolLower) ||
          descriptionLower.includes(toolLower)
        );
      });
    };

    const matchesRating = (course) =>
      selectedRatings.length === 0 ||
      selectedRatings.some((r) => (course.rating || 0) >= r);

    const matchesLevel = (course) =>
      selectedLevels.length === 0 ||
      selectedLevels.includes("All Level") ||
      selectedLevels.some(
        (levelFilter) =>
          course.level && levelFilter.toLowerCase() === course.level
      );

    const matchesDuration = (course) =>
      selectedDurations.length === 0 ||
      selectedDurations.some((durationFilter) => {
        const days = Number(course.duration) || 0;
        if (durationFilter === "1-7 Days") return days >= 1 && days <= 7;
        if (durationFilter === "1-4 Weeks") return days > 7 && days <= 28;
        if (durationFilter === "1-3 Months") return days > 28 && days <= 90;
        if (durationFilter === "3-6 Months") return days > 90 && days <= 180;
        if (durationFilter === "6-12 Months") return days > 180 && days <= 365;
        return false;
      });

    const matchesPrice = (course) => {
      const price = course.price ?? 0;

      // 1. Kiểm tra loại giá (Free/Paid)
      const matchesType =
        selectedPriceTypes.length === 0 ||
        (selectedPriceTypes.includes("Free") && price === 0) ||
        (selectedPriceTypes.includes("Paid") && price > 0);

      // 2. Kiểm tra khoảng giá
      const matchesRange = price >= priceRange[0] && price <= priceRange[1];

      return matchesType && matchesRange;
    };
    // --- Kết thúc các hàm "kiểm tra" ---

    const finalFilteredCourses = [];

    // --- VÒNG LẶP CHÍNH ---
    for (const course of rawCourses) {
      // Kiểm tra xem khóa học có khớp với TỪNG BỘ LỌC không
      const doesMatchSearch = matchesSearch(course);
      const doesMatchCategory = matchesCategory(course);
      const doesMatchTool = matchesTool(course);
      const doesMatchRating = matchesRating(course);
      const doesMatchLevel = matchesLevel(course);
      const doesMatchDuration = matchesDuration(course);
      const doesMatchPrice = matchesPrice(course);

      // --- Tính toán số lượng ---

      // Đếm CATEGORY (nếu khớp với MỌI THỨ *TRỪ* CATEGORY)
      if (
        doesMatchSearch &&
        doesMatchTool &&
        doesMatchRating &&
        doesMatchLevel &&
        doesMatchDuration
      ) {
        course.categoryIds.forEach((cat) => {
          counts.category[cat.name] = (counts.category[cat.name] || 0) + 1;
        });
      }

      // --- 5. THÊM LOGIC ĐẾM TOOL ---
      // Đếm TOOL (nếu khớp với MỌI THỨ *TRỪ* TOOL)
      if (
        doesMatchSearch &&
        doesMatchCategory &&
        doesMatchRating &&
        doesMatchLevel &&
        doesMatchDuration
      ) {
        const titleLower = (course.title || "").toLowerCase();
        const subTitleLower = (course.subTitle || "").toLowerCase();
        const descriptionLower = (
          course.detail?.description || ""
        ).toLowerCase();

        for (const tool of toolsList) {
          const toolLower = tool.toLowerCase();
          if (
            titleLower.includes(toolLower) ||
            subTitleLower.includes(toolLower) ||
            descriptionLower.includes(toolLower)
          ) {
            counts.tool[tool]++;
          }
        }
      }

      // Đếm RATING (nếu khớp với MỌI THỨ *TRỪ* RATING)
      if (
        doesMatchSearch &&
        doesMatchTool &&
        doesMatchCategory &&
        doesMatchLevel &&
        doesMatchDuration
      ) {
        const r = course.rating || 0;
        if (r >= 1) counts.rating[1]++;
        if (r >= 2) counts.rating[2]++;
        if (r >= 3) counts.rating[3]++;
        if (r >= 4) counts.rating[4]++;
        if (r >= 5) counts.rating[5]++;
      }

      // Đếm LEVEL (nếu khớp với MỌI THỨ *TRỪ* LEVEL)
      if (
        doesMatchSearch &&
        doesMatchTool &&
        doesMatchCategory &&
        doesMatchRating &&
        doesMatchDuration
      ) {
        counts.level["All Level"]++;
        const level = course.level;
        if (level === "beginner") counts.level["Beginner"]++;
        else if (level === "intermediate") counts.level["Intermediate"]++;
        else if (level === "advanced") counts.level["Expert"]++;
      }

      // Đếm DURATION (nếu khớp với MỌI THỨ *TRỪ* DURATION)
      if (
        doesMatchSearch &&
        doesMatchTool &&
        doesMatchCategory &&
        doesMatchRating &&
        doesMatchLevel
      ) {
        const days = Number(course.duration) || 0;
        if (days >= 1 && days <= 7) counts.duration["1-7 Days"]++;
        else if (days > 7 && days <= 28) counts.duration["1-4 Weeks"]++;
        else if (days > 28 && days <= 90) counts.duration["1-3 Months"]++;
        else if (days > 90 && days <= 180) counts.duration["3-6 Months"]++;
        else if (days > 180 && days <= 365) counts.duration["6-12 Months"]++;
      }

      // Đếm PRICE (nếu khớp với MỌI THỨ *TRỪ* PRICE)
      if (
        doesMatchSearch &&
        doesMatchTool &&
        doesMatchCategory &&
        doesMatchRating &&
        doesMatchLevel &&
        doesMatchDuration
      ) {
        const price = course.price ?? 0;
        if (price === 0) {
          counts.price["Free"]++;
        } else {
          counts.price["Paid"]++;
        }
      }

      // --- Kiểm tra danh sách hiển thị cuối cùng ---
      if (
        doesMatchSearch &&
        doesMatchCategory &&
        doesMatchTool &&
        doesMatchRating &&
        doesMatchLevel &&
        doesMatchDuration &&
        doesMatchPrice
      ) {
        finalFilteredCourses.push(course);
      }
    } // --- Kết thúc vòng lặp chính ---

    return {
      filteredCourses: finalFilteredCourses,
      categoryCounts: counts.category,
      toolCounts: counts.tool, // <-- 6. TRẢ RA toolCounts
      ratingCounts: counts.rating,
      levelCounts: counts.level,
      durationCounts: counts.duration,
      priceCounts: counts.price,
    };
  }, [
    rawCourses,
    searchQuery,
    selectedCategories,
    selectedTools,
    selectedRatings,
    selectedLevels,
    selectedDurations,
    selectedPriceTypes,
    priceRange,
  ]);

  // Sắp xếp khóa học
  const sortedCourses = useMemo(() => {
    let sorted = [...filteredCourses];
    switch (sort) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "newest":
        return sorted.sort((a, b) => b._id.localeCompare(a._id));
      default:
        return sorted;
    }
  }, [filteredCourses, sort]);

  // Phân trang
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = sortedCourses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(sortedCourses.length / ITEMS_PER_PAGE);

  const suggestions = [
    "user interface",
    "user experience",
    "web design",
    "interface",
    "app",
  ];

  // --- RENDER ---
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
              // --- Truyền props mới xuống
              categories={apiCategories}
              toolsList={toolsList}
              categoryCounts={categoryCounts}
              toolCounts={toolCounts}
              ratingCounts={ratingCounts}
              levelCounts={levelCounts}
              durationCounts={durationCounts}
              // --- Props cho Price
              MAX_PRICE={MAX_PRICE}
              selectedPriceTypes={selectedPriceTypes}
              setSelectedPriceTypes={setSelectedPriceTypes}
              priceCounts={priceCounts}
            />
          </div>
        )}

        {/* ... (Phần còn lại của JSX không đổi) ... */}
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
                  key={course._id}
                  className={`${
                    showSidebar
                      ? "col-12 col-sm-6 col-md-12 col-lg-6 col-xl-4 center-course"
                      : "col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 center-course"
                  }`}
                  onClick={() => navigate(`/course/${course._id}`)}
                >
                  <Card
                    image={course.thumbnail}
                    category={course.categoryIds?.[0]?.name || "Unknown"}
                    categoryBgColor={"rgb(255, 238, 232)"}
                    price={`${formatVND(course.price)} VND`}
                    title={course.title}
                    rating={course.rating || 0}
                    students={0}
                    variant="normal"
                  />
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
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
