import { useState, useEffect } from "react";
import CourseFilterHeader from "./CourseFilterHeader";
import CourseCard from "./CourseCard";
import FilterSidebar from "./FilterSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../../assets/Categories/CourseScreen.css";

const courses = [
  { id: 1, title: "Learn Python Programming Masterclass", category: "DEVELOPMENT", price: 35, rating: 4.7, students: "211,434", image: "/images/nonepic.jpg", categoryColor: "bg-[#ff6636]" },
  { id: 2, title: "Complete Blender Creator: Learn 3D Modelling for Beginners", category: "DESIGN", price: 42, rating: 4.2, students: "167,847", image: "/images/nonepic.jpg", categoryColor: "bg-[#564ffd]" },
  { id: 3, title: "Adobe Premiere Pro CC - Advanced Training Course", category: "DEVELOPMENT", price: 32, rating: 4.6, students: "236,546", image: "/images/nonepic.jpg", categoryColor: "bg-[#ff6636]" },
  { id: 4, title: "Ultimate AWS Certified Solutions Architect Associate 2021", category: "DEVELOPMENT", price: 13, rating: 4.1, students: "511,123", image: "/images/nonepic.jpg", categoryColor: "bg-[#ff6636]" },
  { id: 5, title: "Ultimate Google Ads Training 2020: Profit with Pay Per Click", category: "MARKETING", price: 18, rating: 4.1, students: "154,817", image: "/images/nonepic.jpg", categoryColor: "bg-[#fd8e1f]" },
  { id: 6, title: "Learn Ethical Hacking From Scratch 2021", category: "IT & SOFTWARE", price: 16, rating: 4.1, students: "451,444", image: "/images/nonepic.jpg", categoryColor: "bg-[#342f98]" },
  { id: 7, title: "Angular - The Complete Guide (2021 Edition)", category: "DEVELOPMENT", price: 16, rating: 4.5, students: "167,847", image: "/images/nonepic.jpg", categoryColor: "bg-[#ff6636]" },
  { id: 8, title: "How to get Diamond in solo | League of Legends | Season 11", category: "LIFESTYLE", price: 23, rating: 4.7, students: "436,671", image: "/images/nonepic.jpg", categoryColor: "bg-[#fd8e1f]" },
  { id: 9, title: "Machine Learning A-Z™: Hands-On Python & R In Data Science", category: "DEVELOPMENT", price: 19, rating: 4.6, students: "191,831", image: "/images/nonepic.jpg", categoryColor: "bg-[#ff6636]" },
  { id: 10, title: "SQL for NEWBS: Weekender Crash Course", category: "IT & SOFTWARE", price: 24, rating: 5.0, students: "451,444", image: "/images/nonepic.jpg", categoryColor: "bg-[#342f98]" },
  { id: 11, title: "SEO 2021: Complete SEO Training + SEO for WordPress Websites", category: "DEVELOPMENT", price: 24, rating: 4.0, students: "167,847", image: "/images/nonepic.jpg", categoryColor: "bg-[#ff6636]" },
  { id: 12, title: "[NEW] Ultimate AWS Certified Cloud Practitioner - 2021", category: "MARKETING", price: 32, rating: 5.0, students: "1,356,236", image: "/images/nonepic.jpg", categoryColor: "bg-[#fd8e1f]" },
  { id: 13, title: "Data Structures & Algorithms Essentials (2021)", category: "DESIGN", price: 24, rating: 3.7, students: "451,444", image: "/images/nonepic.jpg", categoryColor: "bg-[#564ffd]" },
  { id: 14, title: "Complete Adobe Lightroom Megacourse: Beginner to Expert", category: "IT & SOFTWARE", price: 89, rating: 4.9, students: "511,123", image: "/images/nonepic.jpg", categoryColor: "bg-[#342f98]" },
  { id: 15, title: "Digital Marketing Masterclass - 23 Courses in 1", category: "DEVELOPMENT", price: 32, rating: 3.0, students: "211,434", image: "/images/nonepic.jpg", categoryColor: "bg-[#ff6636]" },
  { id: 16, title: "The Ultimate Drawing Course - Beginner to Advanced", category: "MARKETING", price: 49, rating: 4.8, students: "167,847", image: "/images/nonepic.jpg", categoryColor: "bg-[#fd8e1f]" },
];

const ITEMS_PER_PAGE = 12;

export default function CourseScreen() {
  const [searchQuery, setSearchQuery] = useState("UI/UX Design");
  const [sort, setSort] = useState("trending");
  const [showSidebar, setShowSidebar] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);

  const suggestions = ["user interface", "user experience", "web design", "interface", "app"];

  const activeFilterCount =
    selectedCategories.length +
    selectedTools.length +
    selectedRatings.length +
    selectedLevels.length +
    selectedDurations.length +
    (priceRange[0] > 0 || priceRange[1] < 100 ? 1 : 0);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || course.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(course.category);
    const matchesTool = selectedTools.length === 0 || selectedTools.some(tool => course.title.toLowerCase().includes(tool.toLowerCase()));
    const matchesRating = selectedRatings.length === 0 || selectedRatings.some(r => course.rating >= r);
    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(course.level);
    const matchesDuration = selectedDurations.length === 0 || selectedDurations.includes(course.duration);
    const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesTool && matchesRating && matchesLevel && matchesDuration && matchesPrice;
  });

  const getSortedCourses = () => {
    let sorted = [...filteredCourses];
    switch (sort) {
      case "price-low": return sorted.sort((a, b) => a.price - b.price);
      case "price-high": return sorted.sort((a, b) => b.price - a.price);
      case "rating": return sorted.sort((a, b) => b.rating - a.rating);
      case "newest": return sorted.sort((a, b) => b.id - a.id);
      default: return sorted;
    }
  };

  const sortedCourses = getSortedCourses();
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = sortedCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(sortedCourses.length / ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

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
          <div className="col-12 col-lg-3">
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

        <div className={showSidebar ? "col-12 col-lg-9" : "col-12"}>
          <div className="row g-4">
            {paginatedCourses.map(course => (
              <div key={course.id} className={showSidebar ? "col-12 col-sm-6 col-lg-4" : "col-12 col-sm-6 col-lg-3"}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination custom-pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                    <ChevronLeft size={18} />
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <li key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(page)}>
                      {page.toString().padStart(2, "0")}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
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
