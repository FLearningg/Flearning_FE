import React from "react";
import "../../assets/CRUDCourseAndLesson/CourseForm.css";
import Input from "../common/Input";
import ProgressTabs from "./ProgressTabs";
import CustomButton from "../common/CustomButton/CustomButton";

const categoryOptions = ["Programming", "Design", "Business"];
const subCategoryOptions = [
  "Web Development",
  "Mobile Development",
  "Data Science",
];
const languageOptions = ["English", "Spanish", "French"];
const levelOptions = ["Beginner", "Intermediate", "Advanced"];
const durationUnitOptions = ["Day", "Week", "Month"];

const CourseForm = ({ title = "Create New Course" }) => {
  const [titleState, setTitle] = React.useState("");
  const [subtitle, setSubtitle] = React.useState("");
  const [topic, setTopic] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [subCategory, setSubCategory] = React.useState("");
  const [language, setLanguage] = React.useState("");
  const [subtitleLanguage, setSubtitleLanguage] = React.useState("");
  const [level, setLevel] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [durationUnit, setDurationUnit] = React.useState("Day");

  return (
    <div className="cf-app-container">
      <div className="cf-content-area">
        <div className="cf-main-content">
          <ProgressTabs activeIndex={0} progressText="7/12" />
          <div className="cf-form-content">
            <div className="cf-form-header">
              <h2 className="cf-form-title">{title}</h2>
              <div className="cf-form-actions">
                <CustomButton color="grey" type="normal" size="medium">
                  Save
                </CustomButton>
                <CustomButton color="warning" type="normal" size="medium">
                  Save & Preview
                </CustomButton>
              </div>
            </div>
            <form className="cf-course-form">
              <div className="cf-form-group">
                <label htmlFor="title" className="cf-form-label">
                  Title
                </label>
                <div className="cf-input-container">
                  <Input
                    id="title"
                    placeholder="You course title"
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
                    placeholder="You course subtitle"
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
                    text={category || "Select..."}
                    onChange={() => {}}
                  />
                </div>
                <div className="cf-form-group">
                  <label className="cf-form-label">Course Sub-category</label>
                  <Input
                    variant="dropdown"
                    options={subCategoryOptions}
                    value={subCategory}
                    text={subCategory || "Select..."}
                    onChange={() => {}}
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
              <div className="cf-form-row-4">
                <div className="cf-form-group">
                  <label className="cf-form-label">Course Language</label>
                  <Input
                    variant="dropdown"
                    options={languageOptions}
                    value={language}
                    text={language || "Select..."}
                    onChange={() => {}}
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
                    onChange={() => {}}
                  />
                </div>
                <div className="cf-form-group">
                  <label className="cf-form-label">Course Level</label>
                  <Input
                    variant="dropdown"
                    options={levelOptions}
                    value={level}
                    text={level || "Select..."}
                    onChange={() => {}}
                  />
                </div>
                <div className="cf-form-group">
                  <label className="cf-form-label">Durations</label>
                  <div className="cf-duration-container">
                    <Input
                      placeholder="Course durations"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                    <Input
                      variant="dropdown"
                      options={durationUnitOptions}
                      value={durationUnit}
                      text={durationUnit}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </div>
              <div className="cf-form-actions-bottom">
                <CustomButton
                  color="grey"
                  type="normal"
                  size="large"
                  onClick={() => {}}
                >
                  Cancel
                </CustomButton>
                <CustomButton color="primary" type="normal" size="large">
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
