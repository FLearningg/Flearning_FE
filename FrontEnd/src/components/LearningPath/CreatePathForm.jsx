import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IoClose, IoAdd, IoTrash } from "react-icons/io5";
import { FiArrowRight } from "react-icons/fi";
import { generateLearningPath } from "../../store/learningPathSlice";
import { getTopCategories } from "../../services/categoryService";
import "../../assets/LearningPath/CreatePathForm.css";

const CreatePathForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { categories = [] } = useSelector(
    (state) => state.categories?.getCategories || {}
  );
  const { pathLoading } = useSelector((state) => state.learningPath);

  const [formData, setFormData] = useState({
    pathTitle: "",
    learningGoal: "",
    targetSkills: [],
    currentLevel: "beginner",
    weeklyHours: "4-7",
    duration: "3-months",
    preferredTopics: [],
    // Structured phases: each phase has title, description, order and steps
    phases: [
      {
        title: "",
        description: "",
        order: 1,
        steps: [
          {
            title: "",
            description: "",
            courseId: "",
            order: 1,
          },
        ],
      },
    ],
  });

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      getTopCategories(dispatch);
    }
  }, [isOpen, categories.length, dispatch]);

  const handleClose = () => {
    onClose();
    // Reset form
    setFormData({
      pathTitle: "",
      learningGoal: "",
      targetSkills: [],
      currentLevel: "beginner",
      weeklyHours: "4-7",
      duration: "3-months",
      preferredTopics: [],
    });
  };

  const toggleSkill = (skillId) => {
    setFormData((prev) => ({
      ...prev,
      targetSkills: prev.targetSkills.includes(skillId)
        ? prev.targetSkills.filter((id) => id !== skillId)
        : [...prev.targetSkills, skillId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.pathTitle.trim()) {
      toast.error("Please enter a path title");
      return;
    }
    if (!formData.learningGoal.trim()) {
      toast.error("Please enter a learning goal");
      return;
    }
    if (formData.targetSkills.length === 0) {
      toast.error("Please select at least one skill");
      return;
    }

    // Validate structured phases & steps
    if (!Array.isArray(formData.phases) || formData.phases.length === 0) {
      toast.error("Please add at least one phase to the path");
      return;
    }
    for (let i = 0; i < formData.phases.length; i++) {
      const p = formData.phases[i];
      if (!p.title || !p.title.trim()) {
        toast.error(`Please enter a title for phase #${i + 1}`);
        return;
      }
      if (!Array.isArray(p.steps) || p.steps.length === 0) {
        toast.error(`Phase "${p.title || i + 1}" needs at least one step`);
        return;
      }
      for (let j = 0; j < p.steps.length; j++) {
        const s = p.steps[j];
        if (!s.title || !s.title.trim()) {
          toast.error(
            `Please enter a title for step #${j + 1} in phase "${p.title}"`
          );
          return;
        }
      }
    }

    try {
      // Build payload including structured phases
      const payload = {
        pathTitle: formData.pathTitle,
        learningGoal: formData.learningGoal,
        targetSkills: formData.targetSkills,
        currentLevel: formData.currentLevel,
        weeklyStudyHours: formData.weeklyHours,
        targetCompletionTime: formData.duration,
        preferredTopics: formData.preferredTopics,
        // ensure orders are numbers and consistent
        phases: formData.phases.map((p, idx) => ({
          title: p.title,
          description: p.description,
          order: p.order || idx + 1,
          steps: (p.steps || []).map((s, sidx) => ({
            title: s.title,
            description: s.description,
            courseId: s.courseId || null,
            order: s.order || sidx + 1,
          })),
        })),
      };

      // Dispatch action with payload (slice/service updated to forward payload)
      await dispatch(generateLearningPath(payload)).unwrap();

      toast.success("Learning path created successfully!");
      handleClose();
    } catch (error) {
      toast.error(error || "Unable to create path, please try again");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="f-lp-create-form-overlay" onClick={handleClose}>
      <div
        className="f-lp-create-form-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="f-lp-create-form-header">
          <h2>Create New Learning Path</h2>
          <button className="f-lp-create-close-btn" onClick={handleClose}>
            <IoClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="f-lp-create-form-content">
          {/* Path Title */}
          <div className="f-lp-form-group">
            <label className="f-lp-form-label">
              Path title <span className="f-lp-required">*</span>
            </label>
            <input
              type="text"
              className="f-lp-form-input"
              placeholder="e.g. Become a Full-stack Developer"
              value={formData.pathTitle}
              onChange={(e) =>
                setFormData({ ...formData, pathTitle: e.target.value })
              }
            />
          </div>

          {/* Learning Goal */}
          <div className="f-lp-form-group">
            <label className="f-lp-form-label">
              Learning goal <span className="f-lp-required">*</span>
            </label>
            <textarea
              className="f-lp-form-textarea"
              rows={3}
              placeholder="Describe the learning outcome you want to achieve..."
              value={formData.learningGoal}
              onChange={(e) =>
                setFormData({ ...formData, learningGoal: e.target.value })
              }
            />
          </div>

          {/* Target Skills */}
          <div className="f-lp-form-group">
            <label className="f-lp-form-label">
              Target skills <span className="f-lp-required">*</span>
            </label>
            <div className="f-lp-skills-grid">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className={`f-lp-skill-chip ${
                    formData.targetSkills.includes(cat._id) ? "selected" : ""
                  }`}
                  onClick={() => toggleSkill(cat._id)}
                >
                  <span className="f-lp-skill-icon">{cat.icon}</span>
                  <span>{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Level */}
          <div className="f-lp-form-group">
            <label className="f-lp-form-label">Trình độ hiện tại</label>
            <select
              className="f-lp-form-select"
              value={formData.currentLevel}
              onChange={(e) =>
                setFormData({ ...formData, currentLevel: e.target.value })
              }
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          {/* Weekly Hours & Duration */}
          {/* Structured Phases */}
          <div className="f-lp-form-group">
            <label className="f-lp-form-label">Phases & Steps</label>
            <div className="f-lp-phases-list">
              {formData.phases.map((phase, pIdx) => (
                <div key={`phase-${pIdx}`} className="f-lp-phase-card">
                  <div className="f-lp-phase-header">
                    <input
                      type="text"
                      className="f-lp-form-input"
                      placeholder={`Phase title #${pIdx + 1}`}
                      value={phase.title}
                      onChange={(e) =>
                        setFormData((prev) => {
                          const phases = [...prev.phases];
                          phases[pIdx] = {
                            ...phases[pIdx],
                            title: e.target.value,
                          };
                          return { ...prev, phases };
                        })
                      }
                    />
                    <button
                      type="button"
                      className="f-lp-icon-btn"
                      title="Delete phase"
                      onClick={() =>
                        setFormData((prev) => {
                          const phases = prev.phases.filter(
                            (_, i) => i !== pIdx
                          );
                          return { ...prev, phases };
                        })
                      }
                    >
                      <IoTrash />
                    </button>
                  </div>

                  <textarea
                    className="f-lp-form-textarea"
                    rows={2}
                    placeholder="Short description for the phase (goals, outcomes)"
                    value={phase.description}
                    onChange={(e) =>
                      setFormData((prev) => {
                        const phases = [...prev.phases];
                        phases[pIdx] = {
                          ...phases[pIdx],
                          description: e.target.value,
                        };
                        return { ...prev, phases };
                      })
                    }
                  />

                  <div className="f-lp-steps-list">
                    {phase.steps.map((step, sIdx) => (
                      <div
                        key={`step-${pIdx}-${sIdx}`}
                        className="f-lp-step-row"
                      >
                        <input
                          type="text"
                          className="f-lp-form-input f-lp-step-input"
                          placeholder={`Step title #${sIdx + 1}`}
                          value={step.title}
                          onChange={(e) =>
                            setFormData((prev) => {
                              const phases = [...prev.phases];
                              const steps = [...phases[pIdx].steps];
                              steps[sIdx] = {
                                ...steps[sIdx],
                                title: e.target.value,
                              };
                              phases[pIdx] = { ...phases[pIdx], steps };
                              return { ...prev, phases };
                            })
                          }
                        />

                        <input
                          type="text"
                          className="f-lp-form-input f-lp-step-input"
                          placeholder="(optional) courseId or link"
                          value={step.courseId}
                          onChange={(e) =>
                            setFormData((prev) => {
                              const phases = [...prev.phases];
                              const steps = [...phases[pIdx].steps];
                              steps[sIdx] = {
                                ...steps[sIdx],
                                courseId: e.target.value,
                              };
                              phases[pIdx] = { ...phases[pIdx], steps };
                              return { ...prev, phases };
                            })
                          }
                        />

                        <button
                          type="button"
                          className="f-lp-icon-btn"
                          title="Delete step"
                          onClick={() =>
                            setFormData((prev) => {
                              const phases = [...prev.phases];
                              const steps = phases[pIdx].steps.filter(
                                (_, i) => i !== sIdx
                              );
                              phases[pIdx] = { ...phases[pIdx], steps };
                              return { ...prev, phases };
                            })
                          }
                        >
                          <IoTrash />
                        </button>
                      </div>
                    ))}

                    <div className="f-lp-step-actions">
                      <button
                        type="button"
                        className="f-lp-form-btn f-lp-form-btn-secondary"
                        onClick={() =>
                          setFormData((prev) => {
                            const phases = [...prev.phases];
                            const steps = phases[pIdx].steps || [];
                            steps.push({
                              title: "",
                              description: "",
                              courseId: "",
                              order: steps.length + 1,
                            });
                            phases[pIdx] = { ...phases[pIdx], steps };
                            return { ...prev, phases };
                          })
                        }
                      >
                        <IoAdd /> Add step
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="f-lp-phase-actions">
                <button
                  type="button"
                  className="f-lp-form-btn f-lp-form-btn-primary"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      phases: [
                        ...prev.phases,
                        {
                          title: "",
                          description: "",
                          order: prev.phases.length + 1,
                          steps: [
                            {
                              title: "",
                              description: "",
                              courseId: "",
                              order: 1,
                            },
                          ],
                        },
                      ],
                    }))
                  }
                >
                  <IoAdd /> Add phase
                </button>
              </div>
            </div>
          </div>
          <div className="f-lp-form-row">
            <div className="f-lp-form-group">
              <label className="f-lp-form-label">Weekly study hours</label>
              <select
                className="f-lp-form-select"
                value={formData.weeklyHours}
                onChange={(e) =>
                  setFormData({ ...formData, weeklyHours: e.target.value })
                }
              >
                <option value="1-3">1-3 hours/week</option>
                <option value="4-7">4-7 hours/week</option>
                <option value="8-15">8-15 hours/week</option>
                <option value="15+">15+ hours/week</option>
              </select>
            </div>

            <div className="f-lp-form-group">
              <label className="f-lp-form-label">Target completion time</label>
              <select
                className="f-lp-form-select"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              >
                <option value="1-month">1 month</option>
                <option value="3-months">3 months</option>
                <option value="6-months">6 months</option>
                <option value="1-year+">1 year+</option>
              </select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="f-lp-form-footer">
            <button
              type="button"
              className="f-lp-form-btn f-lp-form-btn-secondary"
              onClick={handleClose}
              disabled={pathLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="f-lp-form-btn f-lp-form-btn-primary"
              disabled={pathLoading}
            >
              {pathLoading ? "Creating..." : "Create path"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePathForm;
