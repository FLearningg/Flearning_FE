import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import {
  FiBookOpen,
  FiCode,
  FiPenTool,
  FiTrendingUp,
  FiHeart,
  FiCamera,
  FiBarChart,
  FiUser,
  FiBriefcase,
  FiMoreHorizontal,
} from "react-icons/fi";
import {
  submitSurvey,
  closeSurveyModal,
  nextStep,
  previousStep,
  setCurrentStep,
  generateLearningPath,
} from "../../store/learningPathSlice";
import { getTopCategories } from "../../services/categoryService";
import "../../assets/LearningPath/SurveyModal.css";

const SurveyModal = () => {
  const dispatch = useDispatch();
  const { showSurveyModal, currentStep, surveyLoading } = useSelector(
    (state) => state.learningPath
  );
  const { categories } = useSelector((state) => state.categories.getCategories);

  // Form state
  const [formData, setFormData] = useState({
    learningGoal: "",
    learningObjectives: [],
    interestedSkills: [],
    otherSkill: "",
    currentLevel: "",
    weeklyStudyHours: "",
    targetCompletionTime: "",
  });

  // Fetch categories on mount
  useEffect(() => {
    if (showSurveyModal && categories.length === 0) {
      getTopCategories(dispatch);
    }
  }, [showSurveyModal, categories.length, dispatch]);

  // Handle close
  const handleClose = () => {
    dispatch(closeSurveyModal());
  };

  // Handle input change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle multi-select toggle
  const toggleArrayValue = (field, value) => {
    setFormData((prev) => {
      const array = prev[field];
      const exists = array.includes(value);
      return {
        ...prev,
        [field]: exists
          ? array.filter((item) => item !== value)
          : [...array, value],
      };
    });
  };

  // Handle next
  const handleNext = () => {
    // If current step is 3, require at least one interested skill
    if (
      currentStep === 3 &&
      (!formData.interestedSkills || formData.interestedSkills.length === 0)
    ) {
      toast.error("Please select at least one area you're interested in");
      return;
    }
    // Validate required fields for steps 4, 5, 6
    if (currentStep === 4 && !formData.currentLevel) {
      toast.error("Please select your current level");
      return;
    }
    if (currentStep === 5 && !formData.weeklyStudyHours) {
      toast.error("Please select weekly study hours");
      return;
    }
    if (currentStep === 6 && !formData.targetCompletionTime) {
      toast.error("Please select target completion time");
      return;
    }

    if (currentStep < 6) {
      dispatch(nextStep());
    }
  };

  // Handle previous
  const handlePrevious = () => {
    dispatch(previousStep());
  };

  // Handle submit
  const handleSubmit = async () => {
    // Ensure interested skills was selected
    if (!formData.interestedSkills || formData.interestedSkills.length === 0) {
      toast.error("Please select at least one area you're interested in");
      return;
    }
    // Validate required fields
    if (!formData.currentLevel) {
      toast.error("Please select your current level");
      return;
    }
    if (!formData.weeklyStudyHours) {
      toast.error("Please select weekly study hours");
      return;
    }
    if (!formData.targetCompletionTime) {
      toast.error("Please select target completion time");
      return;
    }

    try {
      // Submit survey
      await dispatch(submitSurvey(formData)).unwrap();
      toast.success("Survey saved!");

      // Generate learning path
      await dispatch(generateLearningPath()).unwrap();
      toast.success("Learning path created!");

      // Reset form
      setFormData({
        learningGoal: "",
        learningObjectives: [],
        interestedSkills: [],
        otherSkill: "",
        currentLevel: "",
        weeklyStudyHours: "",
        targetCompletionTime: "",
      });
    } catch (error) {
      toast.error(error || "An error occurred, please try again");
    }
  };

  if (!showSurveyModal) return null;

  return (
    <div className="f-lp-survey-modal-overlay" onClick={handleClose}>
      <div
        className="f-lp-survey-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="f-lp-survey-modal-header">
          <h2>Learning Path Survey</h2>
          <button className="f-lp-survey-close-btn" onClick={handleClose}>
            <IoClose size={24} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="f-lp-survey-progress-container">
          <div className="f-lp-survey-progress-steps">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={`f-lp-survey-progress-step ${
                  step <= currentStep ? "active" : ""
                } ${step === currentStep ? "current" : ""}`}
                onClick={() => dispatch(setCurrentStep(step))}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="f-lp-survey-progress-bar">
            <div
              className="f-lp-survey-progress-fill"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="f-lp-survey-step-content">
          {/* Step 1: Learning Goal */}
          {currentStep === 1 && (
            <div className="f-lp-survey-step">
              <h3>Step 1: What is your learning goal?</h3>
              <p className="f-lp-survey-step-description">
                Share what you'd like to achieve (optional)
              </p>
              <textarea
                className="f-lp-survey-textarea"
                placeholder="e.g. I want to become a Full-stack Developer..."
                value={formData.learningGoal}
                onChange={(e) => handleChange("learningGoal", e.target.value)}
                rows={5}
              />
            </div>
          )}

          {/* Step 2: Learning Objectives */}
          {currentStep === 2 && (
            <div className="f-lp-survey-step">
              <h3>Step 2: What are your objectives?</h3>
              <p className="f-lp-survey-step-description">
                Select goals that apply (multi-select, optional)
              </p>
              <div className="f-lp-survey-options-grid">
                {[
                  { value: "career", label: "Career development" },
                  { value: "skill", label: "Skill improvement" },
                  { value: "hobby", label: "Personal hobby" },
                  { value: "certificate", label: "Certification" },
                  { value: "startup", label: "Startup" },
                  { value: "academic", label: "Academic" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`f-lp-survey-option-card ${
                      formData.learningObjectives.includes(option.value)
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      toggleArrayValue("learningObjectives", option.value)
                    }
                  >
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Interested Skills */}
          {currentStep === 3 && (
            <div className="f-lp-survey-step">
              <h3>
                Step 3: Which skills are you interested in?{" "}
                <span className="f-lp-required">*</span>
              </h3>
              <p className="f-lp-survey-step-description">
                Select areas you want to learn (multi-select)
              </p>
              <div className="f-lp-survey-options-grid">
                {categories
                  .filter((cat) => cat.name.toLowerCase() !== "other")
                  .map((category) => (
                    <div
                      key={category._id}
                      className={`f-lp-survey-option-card ${
                        formData.interestedSkills.includes(category._id)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        toggleArrayValue("interestedSkills", category._id)
                      }
                    >
                      {/* Render an icon from react-icons based on the category name.
                        Fallback: if category.icon is a bootstrap icon class, render <i> as before. */}
                      {(() => {
                        const name = (category.name || "").toLowerCase();
                        if (
                          name.includes("dev") ||
                          name.includes("development") ||
                          name.includes("coding")
                        ) {
                          return (
                            <span className="f-lp-category-icon">
                              <FiCode size={28} />
                            </span>
                          );
                        }
                        if (
                          name.includes("design") ||
                          name.includes("ux") ||
                          name.includes("ui")
                        ) {
                          return (
                            <span className="f-lp-category-icon">
                              <FiPenTool size={28} />
                            </span>
                          );
                        }
                        if (
                          name.includes("human") ||
                          name.includes("history") ||
                          name.includes("humanities")
                        ) {
                          return (
                            <span className="f-lp-category-icon">
                              <FiBookOpen size={28} />
                            </span>
                          );
                        }
                        if (
                          name.includes("market") ||
                          name.includes("marketing")
                        ) {
                          return (
                            <span className="f-lp-category-icon">
                              <FiTrendingUp size={28} />
                            </span>
                          );
                        }
                        if (
                          name.includes("health") ||
                          name.includes("fitness")
                        ) {
                          return (
                            <span className="f-lp-category-icon">
                              <FiHeart size={28} />
                            </span>
                          );
                        }
                        if (
                          name.includes("photo") ||
                          name.includes("photography") ||
                          name.includes("video")
                        ) {
                          return (
                            <span className="f-lp-category-icon">
                              <FiCamera size={28} />
                            </span>
                          );
                        }
                        if (
                          name.includes("data") ||
                          name.includes("science") ||
                          name.includes("analytics")
                        ) {
                          return (
                            <span className="f-lp-category-icon">
                              <FiBarChart size={28} />
                            </span>
                          );
                        }
                        if (
                          name.includes("personal") ||
                          name.includes("self") ||
                          name.includes("soft")
                        ) {
                          return (
                            <span className="f-lp-category-icon">
                              <FiUser size={28} />
                            </span>
                          );
                        }
                        if (
                          name.includes("business") ||
                          name.includes("management") ||
                          name.includes("finance")
                        ) {
                          return (
                            <span className="f-lp-category-icon">
                              <FiBriefcase size={28} />
                            </span>
                          );
                        }

                        // Check for "Other" category
                        if (name === "other") {
                          return (
                            <span className="f-lp-category-icon">
                              <FiMoreHorizontal size={28} />
                            </span>
                          );
                        }

                        // Fallback: if category.icon looks like a bootstrap class, render it; otherwise show a generic book icon
                        if (
                          category.icon &&
                          typeof category.icon === "string"
                        ) {
                          return (
                            <span className="f-lp-category-icon">
                              <i className={`bi ${category.icon}`} />
                            </span>
                          );
                        }

                        return (
                          <span className="f-lp-category-icon">
                            <FiBookOpen size={28} />
                          </span>
                        );
                      })()}
                      <span>{category.name}</span>
                    </div>
                  ))}

                {/* Render "Other" category from backend at the end */}
                {categories
                  .filter((cat) => cat.name.toLowerCase() === "other")
                  .map((category) => (
                    <div
                      key={category._id}
                      className={`f-lp-survey-option-card ${
                        formData.interestedSkills.includes(category._id)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        toggleArrayValue("interestedSkills", category._id)
                      }
                    >
                      <span className="f-lp-category-icon">
                        <FiMoreHorizontal size={28} />
                      </span>
                      <span>{category.name}</span>
                    </div>
                  ))}

                {/* Other option with text input - only show if not already in categories */}
                {!categories.some(
                  (cat) => cat.name.toLowerCase() === "other"
                ) && (
                  <div
                    className={`f-lp-survey-option-card ${
                      formData.interestedSkills.includes("other")
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      toggleArrayValue("interestedSkills", "other")
                    }
                  >
                    <span className="f-lp-category-icon">
                      <FiMoreHorizontal size={28} />
                    </span>
                    <span>Other</span>
                  </div>
                )}
              </div>

              {/* Show text input when Other is selected (either from backend or custom) */}
              {(formData.interestedSkills.includes("other") ||
                formData.interestedSkills.some((skillId) =>
                  categories.find(
                    (cat) =>
                      cat._id === skillId && cat.name.toLowerCase() === "other"
                  )
                )) && (
                <div style={{ marginTop: "16px" }}>
                  <label
                    htmlFor="otherSkill"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 500,
                      color: "#1f2937",
                    }}
                  >
                    Please specify the area:
                  </label>
                  <input
                    id="otherSkill"
                    type="text"
                    className="f-lp-survey-textarea"
                    placeholder="e.g. Blockchain, IoT, Quantum Computing..."
                    value={formData.otherSkill}
                    onChange={(e) => handleChange("otherSkill", e.target.value)}
                    style={{ minHeight: "auto", padding: "12px 16px" }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 4: Current Level - REQUIRED */}
          {currentStep === 4 && (
            <div className="f-lp-survey-step">
              <h3>
                Step 4: Current level <span className="f-lp-required">*</span>
              </h3>
              <p className="f-lp-survey-step-description">
                Select the level that best matches your current knowledge
              </p>
              <div className="f-lp-survey-options-list">
                {[
                  {
                    value: "beginner",
                    label: "Beginner",
                    description: "No experience or basic knowledge",
                  },
                  {
                    value: "intermediate",
                    label: "Intermediate",
                    description:
                      "Has foundational knowledge and some experience",
                  },
                  {
                    value: "advanced",
                    label: "Advanced",
                    description: "Experienced with deeper understanding",
                  },
                  {
                    value: "expert",
                    label: "Expert",
                    description: "Proficient with many years of experience",
                  },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`f-lp-survey-option-list-item ${
                      formData.currentLevel === option.value ? "selected" : ""
                    }`}
                    onClick={() => handleChange("currentLevel", option.value)}
                  >
                    <div className="f-lp-option-radio">
                      {formData.currentLevel === option.value && (
                        <div className="f-lp-radio-dot" />
                      )}
                    </div>
                    <div className="f-lp-option-content">
                      <div className="f-lp-option-label">{option.label}</div>
                      <div className="f-lp-option-description">
                        {option.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Weekly Study Hours - REQUIRED */}
          {currentStep === 5 && (
            <div className="f-lp-survey-step">
              <h3>
                Step 5: Weekly study hours{" "}
                <span className="f-lp-required">*</span>
              </h3>
              <p className="f-lp-survey-step-description">
                How many hours per week can you dedicate to learning?
              </p>
              <div className="f-lp-survey-options-list">
                {[
                  {
                    value: "1-3",
                    label: "1-3 hours/week",
                    description: "Light study",
                  },
                  {
                    value: "4-7",
                    label: "4-7 hours/week",
                    description: "Moderate, consistent",
                  },
                  {
                    value: "8-15",
                    label: "8-15 hours/week",
                    description: "Serious study",
                  },
                  {
                    value: "15+",
                    label: "15+ hours/week",
                    description: "Intensive / near full-time",
                  },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`f-lp-survey-option-list-item ${
                      formData.weeklyStudyHours === option.value
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleChange("weeklyStudyHours", option.value)
                    }
                  >
                    <div className="f-lp-option-radio">
                      {formData.weeklyStudyHours === option.value && (
                        <div className="f-lp-radio-dot" />
                      )}
                    </div>
                    <div className="f-lp-option-content">
                      <div className="f-lp-option-label">{option.label}</div>
                      <div className="f-lp-option-description">
                        {option.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Target Completion Time - REQUIRED */}
          {currentStep === 6 && (
            <div className="f-lp-survey-step">
              <h3>
                Step 6: Target completion time{" "}
                <span className="f-lp-required">*</span>
              </h3>
              <p className="f-lp-survey-step-description">
                How long do you want to achieve your learning goal?
              </p>
              <div className="f-lp-survey-options-list">
                {[
                  {
                    value: "1-month",
                    label: "1 month",
                    description: "Fast, focused learning",
                  },
                  {
                    value: "3-months",
                    label: "3 months",
                    description: "Moderate timeframe",
                  },
                  {
                    value: "6-months",
                    label: "6 months",
                    description: "Steady, paced learning",
                  },
                  {
                    value: "1-year+",
                    label: "1 year+",
                    description: "Long-term, comprehensive",
                  },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`f-lp-survey-option-list-item ${
                      formData.targetCompletionTime === option.value
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleChange("targetCompletionTime", option.value)
                    }
                  >
                    <div className="f-lp-option-radio">
                      {formData.targetCompletionTime === option.value && (
                        <div className="f-lp-radio-dot" />
                      )}
                    </div>
                    <div className="f-lp-option-content">
                      <div className="f-lp-option-label">{option.label}</div>
                      <div className="f-lp-option-description">
                        {option.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="f-lp-survey-modal-footer">
          {currentStep > 1 && (
            <button
              className="f-lp-survey-btn f-lp-survey-btn-secondary"
              onClick={handlePrevious}
              disabled={surveyLoading}
            >
              Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          {currentStep < 6 ? (
            <button
              className="f-lp-survey-btn f-lp-survey-btn-primary"
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button
              className="f-lp-survey-btn f-lp-survey-btn-primary"
              onClick={handleSubmit}
              disabled={surveyLoading}
            >
              {surveyLoading ? "Processing..." : "Finish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyModal;
