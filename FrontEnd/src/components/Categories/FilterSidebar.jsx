import { useState } from "react";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import "../../assets/Categories/FilterSidebar.css";

export default function FilterSidebar({
  priceRange,
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  selectedTools,
  setSelectedTools,
  selectedRatings,
  setSelectedRatings,
  selectedLevels,
  setSelectedLevels,
  selectedDurations,
  setSelectedDurations,

  // Props danh sách
  categories,
  toolsList,

  // Props số lượng
  categoryCounts,
  toolCounts,
  ratingCounts,
  levelCounts,
  durationCounts,

  // --- NHẬN PROPS MỚI CHO PRICE ---
  MAX_PRICE,
  selectedPriceTypes,
  setSelectedPriceTypes,
  priceCounts,
}) {
  const [expanded, setExpanded] = useState({
    category: true,
    tools: true,
    rating: true,
    level: true,
    price: true,
    duration: true,
  });
  const [categoryExpanded, setCategoryExpanded] = useState({});

  const toggleSection = (key) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleCheckboxChange = (value, selected, setSelected) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const renderCheckboxList = (
    items,
    section,
    selected,
    setSelected,
    countObject, // object chứa số lượng
    level = 0
  ) =>
    items.map((item) => {
      const name = typeof item === "string" ? item : item.name;
      const id = `${section}-${name.replace(/\s+/g, "-").toLowerCase()}`;
      const hasChildren = typeof item === "object" && item.subItems;
      const isExpanded = categoryExpanded[id] ?? true;

      // Lấy số lượng từ object, mặc định là 0
      const countToShow =
        countObject && countObject[name] ? countObject[name] : 0;

      if (!hasChildren && countToShow === 0) {
        //Xóa mục không có số lượng
        return null;
      }

      return (
        <div key={id} className="filter-sidebar">
          {hasChildren ? (
            <div
              className="d-flex justify-content-between align-items-center mb-1"
              onClick={() =>
                setCategoryExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
              }
              style={{ cursor: "pointer" }}
            >
              <span className="text-muted fw-bold large">{name}</span>
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          ) : (
            <div className="d-flex justify-content-between align-items-center mb-1">
              <div className="d-flex align-items-center flex-grow-1 overflow-hidden">
                <input
                  className="form-check-input me-2 flex-shrink-0"
                  type="checkbox"
                  id={id}
                  checked={selected.includes(name)}
                  onChange={() =>
                    handleCheckboxChange(name, selected, setSelected)
                  }
                />
                <label
                  className="form-check-label text-truncate"
                  htmlFor={id}
                  title={name}
                >
                  {name}
                </label>
              </div>
              <span className="text-muted small ms-2 flex-shrink-0">
                {countToShow}
              </span>
            </div>
          )}
          {hasChildren &&
            isExpanded &&
            renderCheckboxList(
              item.subItems,
              section,
              selected,
              setSelected,
              countObject, // Truyền countObject xuống đệ quy
              level + 1
            )}
        </div>
      );
    });

  const renderRatingList = () =>
    [5, 4, 3, 2, 1].map((r) => {
      // Lấy số lượng từ prop, nếu không có thì là 0
      const count = ratingCounts && ratingCounts[r] ? ratingCounts[r] : 0;

      return (
        <div className="form-check d-flex justify-content-between mb-1" key={r}>
          <div className="d-flex align-items-center">
            <input
              className="form-check-input me-2"
              type="checkbox"
              id={`rating-${r}`}
              checked={selectedRatings.includes(r)}
              onChange={() =>
                handleCheckboxChange(r, selectedRatings, setSelectedRatings)
              }
            />
            <label
              className="form-check-label d-flex align-items-center gap-2"
              htmlFor={`rating-${r}`}
            >
              <Star size={14} fill="#fd8e1f" color="#fd8e1f" />
              <span className="small fw-semibold">
                {r} {r !== 5 && <>& up</>}
              </span>
            </label>
          </div>
          <span className="text-muted small">{count}</span>
        </div>
      );
    });

  const Section = ({ title, sectionKey, children }) => (
    <div className="card mb-3">
      <div
        className="card-header bg-white d-flex justify-content-between align-items-center py-3 px-4 border-bottom"
        onClick={() => toggleSection(sectionKey)}
        style={{ cursor: "pointer" }}
      >
        <h6 className="mb-0 fw-bold text-uppercase text-dark">{title}</h6>
        {expanded[sectionKey] ? (
          <ChevronUp size={16} />
        ) : (
          <ChevronDown size={16} />
        )}
      </div>
      {expanded[sectionKey] && (
        <div className="card-body px-4 py-3 pt-2">{children}</div>
      )}
    </div>
  );

  return (
    <div className="w-100 filter-sidebar">
      <Section title="Category" sectionKey="category">
        {renderCheckboxList(
          categories || [],
          "category",
          selectedCategories,
          setSelectedCategories,
          categoryCounts // Truyền object count cho category
        )}
      </Section>

      {/* --- 2. SỬA PHẦN TOOLS --- */}
      <Section title="Tools" sectionKey="tools">
        {renderCheckboxList(
          toolsList || [], // Dùng toolsList từ props
          "tools",
          selectedTools,
          setSelectedTools,
          toolCounts // Truyền object count cho tools
        )}
      </Section>

      <Section title="Rating" sectionKey="rating">
        {renderRatingList()}
      </Section>

      <Section title="Course Level" sectionKey="level">
        {renderCheckboxList(
          ["All Level", "Beginner", "Intermediate", "Expert"],
          "level",
          selectedLevels,
          setSelectedLevels,
          levelCounts // Truyền object count cho level
        )}
      </Section>

      <Section title="Duration" sectionKey="duration">
        {renderCheckboxList(
          ["1-7 Days", "1-4 Weeks", "1-3 Months", "3-6 Months", "6-12 Months"],
          "duration",
          selectedDurations,
          setSelectedDurations,
          durationCounts // Truyền object count cho duration
        )}
      </Section>
    </div>
  );
}
