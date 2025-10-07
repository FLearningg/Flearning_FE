import React, { useEffect } from "react";
import "../../assets/CRUDCourseAndLesson/CourseForm.css";
import Input from "../common/Input";
import ProgressTabs from "./ProgressTabs";
import CustomButton from "../common/CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../../services/adminService";
import { toast } from "react-toastify";

const languageOptions = ["English", "Vietnamese"];
const levelOptions = ["Beginner", "Intermediate", "Advanced"];
const durationUnitOptions = ["Hours"];

const CourseForm = ({
  title = "Create New Course",
  onNext = () => {},
  initialData = {},
  completedTabs = [],
  onTabClick = () => {},
}) => {
  const [titleState, setTitle] = React.useState(initialData.title || "");
  const [subtitle, setSubtitle] = React.useState(
    initialData.subTitle || initialData.subtitle || ""
  );

  const [category, setCategory] = React.useState(initialData.category || "");
  const [subCategory, setSubCategory] = React.useState(
    initialData.subCategory || ""
  );
  const [language, setLanguage] = React.useState(initialData.language || "");
  const [subtitleLanguage, setSubtitleLanguage] = React.useState(
    initialData.subtitleLanguage || ""
  );
  const [level, setLevel] = React.useState(initialData.level || "");
  const [duration, setDuration] = React.useState(initialData.duration || "");
  const [durationUnit, setDurationUnit] = React.useState(
    initialData.durationUnit || "Hours"
  );
  const [price, setPrice] = React.useState(initialData.price || "");
  const [dataLoaded, setDataLoaded] = React.useState(false);

  // State for categories from database
  const [allCategories, setAllCategories] = React.useState([]);
  const [categoryMap, setCategoryMap] = React.useState({}); // Map category names to IDs
  const [loadingCategories, setLoadingCategories] = React.useState(false);
  const [categoryError, setCategoryError] = React.useState("");

  const navigate = useNavigate();

  // Language conversion mapping
  const languageMapping = {
    English: "english",
    Vietnamese: "vietnam",
  };

  // Convert display language to backend format
  const convertLanguageToBackend = (displayLanguage) => {
    return languageMapping[displayLanguage] || displayLanguage;
  };

  // Convert backend language to display format
  const convertLanguageToDisplay = (backendLanguage) => {
    const reverseMapping = Object.fromEntries(
      Object.entries(languageMapping).map(([key, value]) => [value, key])
    );
    return reverseMapping[backendLanguage] || backendLanguage;
  };

  // Fetch categories from database
  const fetchCategories = async () => {
    setLoadingCategories(true);
    setCategoryError("");
    try {
      const response = await getAllCategories();

      if (response.data && response.data.success) {
        const categories = response.data.data.map((cat) => cat.name);
        setAllCategories(categories);

        // Create mapping from category name to ID
        const categoryIdMap = {};
        response.data.data.forEach((cat) => {
          categoryIdMap[cat.name] = cat._id;
        });
        setCategoryMap(categoryIdMap);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoryError("Failed to load categories from database");
      toast.error("Failed to load categories from database");
      // Fallback to hardcoded options if API fails
      setAllCategories(["Programming", "Design", "Business"]);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle category ID to name mapping when categories are loaded
  useEffect(() => {
    if (
      allCategories.length > 0 &&
      categoryMap &&
      Object.keys(categoryMap).length > 0
    ) {
      // If we have category/subcategory IDs but no names, try to map them
      if (initialData.categoryId && !initialData.category) {
        // Find category name by ID
        const categoryName = Object.keys(categoryMap).find(
          (key) => categoryMap[key] === initialData.categoryId
        );
        if (categoryName) {
          setCategory(categoryName);
        }
      }

      if (initialData.subCategoryId && !initialData.subCategory) {
        // Find subcategory name by ID
        const subCategoryName = Object.keys(categoryMap).find(
          (key) => categoryMap[key] === initialData.subCategoryId
        );
        if (subCategoryName) {
          setSubCategory(subCategoryName);
        }
      }
    }
  }, [
    allCategories,
    categoryMap,
    initialData.categoryId,
    initialData.subCategoryId,
    initialData.category,
    initialData.subCategory,
  ]);

  // Filter categories for dropdowns - exclude selected values
  const categoryOptions = allCategories.filter((cat) => cat !== subCategory);
  const subCategoryOptions = allCategories.filter((cat) => cat !== category);

  // Handle category change
  const handleCategoryChange = (val) => {
    setCategory(val);
    // Clear subcategory if it's the same as the new category
    if (val === subCategory) {
      setSubCategory("");
    }
  };

  // Handle subcategory change
  const handleSubCategoryChange = (val) => {
    setSubCategory(val);
    // Clear category if it's the same as the new subcategory
    if (val === category) {
      setCategory("");
    }
  };

  // Update state when initialData changes
  useEffect(() => {
    // Set loading to false first
    setDataLoaded(false);

    // Always set from initialData, even if empty string
    setTitle(initialData.title || "");
    setSubtitle(initialData.subTitle || initialData.subtitle || "");

    // Handle category restoration - prioritize category names over IDs
    setCategory(initialData.category || "");
    setSubCategory(initialData.subCategory || "");

    // Handle language and level restoration - prioritize display format
    // If we have display format data, use it directly
    if (
      initialData.language &&
      !initialData.language.includes("english") &&
      !initialData.language.includes("vietnam")
    ) {
      setLanguage(initialData.language);
    } else {
      // Convert backend language format to display format
      setLanguage(convertLanguageToDisplay(initialData.language || ""));
    }

    if (
      initialData.subtitleLanguage &&
      !initialData.subtitleLanguage.includes("english") &&
      !initialData.subtitleLanguage.includes("vietnam")
    ) {
      setSubtitleLanguage(initialData.subtitleLanguage);
    } else {
      setSubtitleLanguage(
        convertLanguageToDisplay(initialData.subtitleLanguage || "")
      );
    }

    // Handle level restoration - prioritize display format
    if (
      initialData.level &&
      !initialData.level.includes("beginner") &&
      !initialData.level.includes("intermediate") &&
      !initialData.level.includes("advanced")
    ) {
      setLevel(initialData.level);
    } else {
      // Convert backend level format to display format
      const levelValue = initialData.level || "";
      if (levelValue) {
        const levelMap = {
          beginner: "Beginner",
          intermediate: "Intermediate",
          advanced: "Advanced",
        };
        const displayLevel = levelMap[levelValue.toLowerCase()] || levelValue;
        setLevel(displayLevel);
      } else {
        setLevel("");
      }
    }

    // Parse duration to extract number part (e.g., "123 Hours" -> "123")
    const durationValue = initialData.duration
      ? initialData.duration.toString().split(" ")[0]
      : "";
    setDuration(durationValue);
    setDurationUnit("Hours");
    setPrice(initialData.price || "");

    // Use setTimeout to ensure all state updates are complete
    setTimeout(() => {
      setDataLoaded(true);
    }, 50);
  }, [initialData]);

  const handleSaveNext = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const data = {
      title: titleState,
      subTitle: subtitle, // ← Fixed key name
      detail: {
        description: "No description provided", // ← Send non-empty description as required by backend
      },

      category: category, // ← Save category name for restoration
      subCategory: subCategory, // ← Save subcategory name for restoration
      categoryId: categoryMap[category] || "", // ← Send categoryId instead of category
      subCategoryId: categoryMap[subCategory] || "", // ← Send subCategoryId instead of subCategory
      // Save display format for restoration
      language: language, // ← Save display format (English, Vietnamese)
      subtitleLanguage: subtitleLanguage, // ← Save display format (English, Vietnamese)
      level: level, // ← Save display format (Beginner, Intermediate, Advanced)
      // Save backend format for API
      languageBackend: convertLanguageToBackend(language) || "", // ← Convert to backend format
      subtitleLanguageBackend: convertLanguageToBackend(subtitleLanguage) || "", // ← Convert to backend format
      levelBackend: level?.toLowerCase() || "", // ← lowercase for backend
      duration: duration ? `${duration} ${durationUnit}` : "", // ← format as "123 Hours"
      price: parseFloat(price) || 0, // ← ensure number
    };

    onNext(data);
  };

  const handleCancel = () => {
    navigate("/admin/courses/all");
  };

  const allFieldsFilled =
    titleState?.trim() &&
    subtitle?.trim() &&
    category &&
    category !== "Select..." &&
    subCategory &&
    subCategory !== "Select..." &&
    language &&
    language !== "Select..." &&
    level &&
    level !== "Select..." &&
    duration &&
    price;

  return (
    <div className="cf-app-container">
      <div className="cf-content-area">
        <div className="cf-main-content">
          <ProgressTabs
            activeIndex={0}
            completedTabs={completedTabs}
            onTabClick={onTabClick}
          />
          <div className="cf-form-content">
            <div className="cf-form-header">
              <h2 className="cf-form-title">{title}</h2>
            </div>

            {/* Show category error if any */}
            {categoryError && (
              <div
                style={{
                  color: "red",
                  marginBottom: "16px",
                  padding: "8px 12px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "6px",
                }}
              >
                {categoryError}
              </div>
            )}

            <form className="cf-course-form" onSubmit={handleSaveNext}>
              <div className="cf-form-group">
                <label htmlFor="title" className="cf-form-label">
                  Title
                </label>
                <div className="cf-input-container">
                  <Input
                    id="title"
                    placeholder="Your course title"
                    maxLength={80}
                    value={titleState}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>
              <div className="cf-form-group">
                <label htmlFor="subtitle" className="cf-form-label">
                  Subtitle
                </label>
                <div className="cf-input-container">
                  <Input
                    id="subtitle"
                    placeholder="Your course subtitle"
                    maxLength={120}
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="cf-form-row">
                <div className="cf-form-group">
                  <label className="cf-form-label">Course Category</label>
                  <Input
                    variant="dropdown"
                    options={categoryOptions}
                    value={category}
                    text={
                      loadingCategories ? "Loading..." : category || "Select..."
                    }
                    onChange={handleCategoryChange}
                    disabled={loadingCategories}
                  />
                </div>
                <div className="cf-form-group">
                  <label className="cf-form-label">Course Sub-category</label>
                  <Input
                    variant="dropdown"
                    options={subCategoryOptions}
                    value={subCategory}
                    text={
                      loadingCategories
                        ? "Loading..."
                        : subCategory || "Select..."
                    }
                    onChange={handleSubCategoryChange}
                    disabled={loadingCategories}
                  />
                </div>
              </div>
              <div className="cf-form-row">
                <div className="cf-form-group">
                  <label className="cf-form-label">Course Language</label>
                  <Input
                    variant="dropdown"
                    options={languageOptions}
                    value={language}
                    text={language || "Select..."}
                    onChange={(val) => setLanguage(val)}
                  />
                </div>
                <div className="cf-form-group">
                  <label className="cf-form-label">
                    Subtitle Language (Optional)
                  </label>
                  <Input
                    variant="dropdown"
                    options={languageOptions}
                    value={subtitleLanguage}
                    text={subtitleLanguage || "Select..."}
                    onChange={(val) => setSubtitleLanguage(val)}
                  />
                </div>
              </div>
              <div className="cf-form-row-3">
                <div className="cf-form-group">
                  <label className="cf-form-label">Course Level</label>
                  <Input
                    variant="dropdown"
                    options={levelOptions}
                    value={level}
                    text={level || "Select..."}
                    onChange={(val) => setLevel(val)}
                  />
                </div>
                <div className="cf-form-group cf-small-input">
                  <label className="cf-form-label">Durations</label>
                  <div className="cf-duration-container">
                    <Input
                      placeholder="Course durations"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                    <span style={{ marginLeft: 8, lineHeight: "32px" }}>
                      Hours
                    </span>
                  </div>
                </div>
                <div className="cf-form-group cf-price-input">
                  <label htmlFor="price" className="cf-form-label">
                    Course Price
                  </label>
                  <div className="cf-input-container">
                    <Input
                      id="price"
                      placeholder="Enter course price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="acc-navigation-buttons">
                <CustomButton
                  color="transparent"
                  type="normal"
                  size="large"
                  onClick={handleCancel}
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  color="primary"
                  type="normal"
                  size="large"
                  onClick={handleSaveNext}
                  disabled={!allFieldsFilled}
                >
                  Next
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
