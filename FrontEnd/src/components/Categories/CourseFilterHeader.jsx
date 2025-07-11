import { Filter, Search } from "lucide-react";
import "../../assets/Categories/CourseFilterHeader.css";

export default function CourseFilterHeader({
  searchQuery,
  setSearchQuery,
  sort,
  setSort,
  activeFilterCount = 0,
  suggestions = [],
  showSidebar,
  setShowSidebar,
  resultCount,
}) {
  const handleSidebarToggle = () => setShowSidebar(!showSidebar);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSortChange = (e) => setSort(e.target.value);
  const handleSuggestionClick = (sugg) => setSearchQuery(sugg);

  return (
    <div className="mb-4 course-filter-header">
      <div className="wrap-cont d-flex align-items-center justify-content-between flex-wrap gap-3 mb-2">
        <div className="position-relative">
          <button
            type="button"
            onClick={handleSidebarToggle}
            className="filter-btn"
          >
            <Filter size={18} />
            Filter
          </button>
          {activeFilterCount > 0 && (
            <span className="badge filter-count">{activeFilterCount}</span>
          )}
        </div>

        <div className="position-relative flex-grow-1 course-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="form-control ps-5"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search courses..."
          />
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="sort-text text-secondary small fw-semibold">
            Sort by:
          </span>
          <select
            className="form-select"
            style={{ width: 160 }}
            value={sort}
            onChange={handleSortChange}
          >
            <option value="trending">Trending</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="d-flex justify-content-between flex-wrap align-items-center gap-2">
        <div className="suggestion d-flex align-items-center gap-2 small flex-wrap">
          <span className="text-secondary">Suggestion:</span>
          {suggestions.map((sugg, idx) => (
            <button
              key={sugg}
              type="button"
              className="suggestion-item"
              onClick={() => handleSuggestionClick(sugg)}
            >
              {sugg}
            </button>
          ))}
        </div>

        <div className="numresul small text-muted ms-auto">
          <strong>{resultCount?.toLocaleString?.() ?? 0}</strong> results found
          for “{searchQuery?.toLowerCase?.() ?? ""}”
        </div>
      </div>
    </div>
  );
}
