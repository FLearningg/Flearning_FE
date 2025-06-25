import React, { useEffect } from "react";
import "../../assets/CRUDCourseAndLesson/CourseForm.css";
import Input from "../common/Input";
import ProgressTabs from "./ProgressTabs";
import CustomButton from "../common/CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";

const categoryOptions = ["Programming", "Design", "Business"];
const subCategoryOptions = [
  "Web Development",
  "Mobile Development",
  "Data Science",
];
const languageOptions = ["English", "Spanish", "French"];
const levelOptions = ["Beginner", "Intermediate", "Advanced"];
const durationUnitOptions = ["Hours"];

const CourseForm = ({
  title = "Create New Course",
  onNext = () => {},
  initialData = {},
}) => {
  const [titleState, setTitle] = React.useState(initialData.title || "");
  const [subtitle, setSubtitle] = React.useState(
    initialData.subTitle || initialData.subtitle || ""
  );
  const [topic, setTopic] = React.useState(initialData.topic || "");
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

  const navigate = useNavigate();

  // Update state when initialData changes
  useEffect(() => {
    // Set loading to false first
    setDataLoaded(false);

    // Always set from initialData, even if empty string
    setTitle(initialData.title || "");
    setSubtitle(initialData.subTitle || initialData.subtitle || "");
    setTopic(initialData.topic || "");
    setCategory(initialData.category || "");
    setSubCategory(initialData.subCategory || "");
    setLanguage(initialData.language || "");
    setSubtitleLanguage(initialData.subtitleLanguage || "");
    setLevel(initialData.level || "");
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
      topic,
      category,
      subCategory,
      language: language?.toLowerCase() || "", // ← lowercase
      subtitleLanguage,
      level: level?.toLowerCase() || "", // ← lowercase
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
    topic?.trim() &&
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
          <ProgressTabs activeIndex={0} progressText="7/12" />
          <div className="cf-form-content">
            <div className="cf-form-header">
              <h2 className="cf-form-title">{title}</h2>
              <div className="cf-form-actions">
                <CustomButton color="primary" type="normal" size="medium">
                  Save
                </CustomButton>
                <CustomButton color="transparent" type="normal" size="medium">
                  Save & Preview
                </CustomButton>
              </div>
            </div>
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
              <div className="cf-form-group">
                <label htmlFor="topic" className="cf-form-label">
                  Course Topic
                </label>
                <Input
                  id="topic"
                  placeholder="What is primarily taught in your course?"
                  textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div className="cf-form-row">
                <div className="cf-form-group">
                  <label className="cf-form-label">Course Category</label>
                  <Input
                    variant="dropdown"
                    options={categoryOptions}
                    value={category}
                    text={category || "Select..."}
                    onChange={(val) => setCategory(val)}
                  />
                </div>
                <div className="cf-form-group">
                  <label className="cf-form-label">Course Sub-category</label>
                  <Input
                    variant="dropdown"
                    options={subCategoryOptions}
                    value={subCategory}
                    text={subCategory || "Select..."}
                    onChange={(val) => setSubCategory(val)}
                  />
                </div>
              </div>
              <div className="cf-form-row-4">
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
                <div className="cf-form-group">
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
              </div>
              <div className="cf-form-group">
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
                  Save & Next
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
