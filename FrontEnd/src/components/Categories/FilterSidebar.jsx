// FilterSidebar.jsx
import { useState } from "react";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import "../../assets/Categories/FilterSidebar.css";

export default function FilterSidebar({
  priceRange, setPriceRange,
  selectedCategories, setSelectedCategories,
  selectedTools, setSelectedTools,
  selectedRatings, setSelectedRatings,
  selectedLevels, setSelectedLevels,
  selectedDurations, setSelectedDurations
}) {
  const [expanded, setExpanded] = useState({ category: true, tools: true, rating: true, level: true, price: true, duration: true });
  const [categoryExpanded, setCategoryExpanded] = useState({});

  const toggleSection = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleCheckboxChange = (value, selected, setSelected) => {
    setSelected((prev) => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const renderCheckboxList = (items, section, selected, setSelected, level = 0) =>
    items.map(item => {
      const name = typeof item === "string" ? item : item.name;
      const id = `${section}-${name.replace(/\s+/g, "-").toLowerCase()}`;
      const hasChildren = typeof item === "object" && item.subItems;
      const isExpanded = categoryExpanded[id] ?? true;

      return (
        <div key={id}>
          {hasChildren ? (
            <div
              className="d-flex justify-content-between align-items-center mb-1"
              onClick={() => setCategoryExpanded((prev) => ({ ...prev, [id]: !prev[id] }))}
              style={{ cursor: "pointer" }}
            >
              <span className="text-muted fw-bold large">{name}</span>
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          ) : (
            <div className="form-check d-flex justify-content-between mb-1">
              <div>
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  id={id}
                  checked={selected.includes(name)}
                  onChange={() => handleCheckboxChange(name, selected, setSelected)}
                />
                <label className="form-check-label" htmlFor={id}>{name}</label>
              </div>
              <span className="text-muted small">1345</span>
            </div>
          )}
          {hasChildren && isExpanded && renderCheckboxList(item.subItems, section, selected, setSelected, level + 1)}
        </div>
      );
    });

  const renderRatingList = () =>
    [5, 4, 3, 2, 1].map(r => (
      <div className="form-check d-flex justify-content-between mb-1" key={r}>
        <div className="d-flex align-items-center">
          <input
            className="form-check-input me-2"
            type="checkbox"
            id={`rating-${r}`}
            checked={selectedRatings.includes(r)}
            onChange={() => handleCheckboxChange(r, selectedRatings, setSelectedRatings)}
          />
          <label className="form-check-label d-flex align-items-center gap-2" htmlFor={`rating-${r}`}>
            <Star size={14} fill="#fd8e1f" color="#fd8e1f" />
            <span className="small fw-semibold">{r} {r !== 5 && <>& up</>}</span>
          </label>
        </div>
        <span className="text-muted small">1345</span>
      </div>
    ));

  const Section = ({ title, sectionKey, children }) => (
    <div className="card mb-3">
      <div
        className="card-header bg-white d-flex justify-content-between align-items-center py-3 px-4 border-bottom"
        onClick={() => toggleSection(sectionKey)}
        style={{ cursor: "pointer" }}
      >
        <h6 className="mb-0 fw-bold text-uppercase text-dark">{title}</h6>
        {expanded[sectionKey] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      {expanded[sectionKey] && <div className="card-body px-4 py-3 pt-2">{children}</div>}
    </div>
  );

  const categories = [
    { name: "Development", subItems: ["Web Development", "Data Science", "Mobile Development", "Software Testing", "Software Engineering", "Software Development Tools", "No-code Development"] },
    { name: "Business", subItems: [] },
    { name: "Finance & Accounting", subItems: [] }
  ];

  return (
    <div className="w-100 filter-sidebar">
      <Section title="Category" sectionKey="category">
        {renderCheckboxList(categories, "category", selectedCategories, setSelectedCategories)}
      </Section>

      <Section title="Tools" sectionKey="tools">
        {renderCheckboxList(["HTML 5", "CSS 3", "React", "Webflow", "Node.js", "Laravel", "Saas", "Wordpress"], "tools", selectedTools, setSelectedTools)}
      </Section>

      <Section title="Rating" sectionKey="rating">
        {renderRatingList()}
      </Section>

      <Section title="Course Level" sectionKey="level">
        {renderCheckboxList(["All Level", "Beginner", "Intermediate", "Expert"], "level", selectedLevels, setSelectedLevels)}
      </Section>

      <Section title="Duration" sectionKey="duration">
        {renderCheckboxList(["6-12 Months", "3-6 Months", "1-3 Months", "1-4 Weeks", "1-7 Days"], "duration", selectedDurations, setSelectedDurations)}
      </Section>
    </div>
  );
}


{/* <Section title="Price" sectionKey="price">
        <>
          <input
            type="range"
            className="form-range mb-2"
            min="0"
            max="100"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
          />
          <div className="d-flex gap-2 align-items-center mb-2">
            <span>$</span>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
              className="form-control form-control-sm"
              placeholder="min"
            />
            <span>-</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="form-control form-control-sm"
              placeholder="max"
            />
          </div>
          <div className="form-check mb-1">
            <input className="form-check-input me-2" type="checkbox" id="paid" />
            <label className="form-check-label" htmlFor="paid">Paid</label>
          </div>
          <div className="form-check">
            <input className="form-check-input me-2" type="checkbox" id="free" />
            <label className="form-check-label" htmlFor="free">Free</label>
          </div>
        </>
      </Section> */}