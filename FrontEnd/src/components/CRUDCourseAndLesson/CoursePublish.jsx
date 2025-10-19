import "../../assets/CRUDCourseAndLesson/CourseForm.css";
import "../../assets/CRUDCourseAndLesson/CoursePublish.css";
import ProgressTabs from "./ProgressTabs";
import CustomButton from "../common/CustomButton/CustomButton";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const CoursePublish = ({
  onSubmit = () => {},
  onPrev = () => {},
  initialData = {},
  completedTabs = [],
  onTabClick = () => {},
}) => {
  const [welcomeMsg, setWelcomeMsg] = useState(
    initialData.message?.welcome || ""
  );
  const [congratsMsg, setCongratsMsg] = useState(
    initialData.message?.congrats || ""
  );
  const [loading, setLoading] = useState(false);

  // Update state when initialData changes
  useEffect(() => {
    // Always set messages, even if empty
    setWelcomeMsg(initialData.message?.welcome || "");
    setCongratsMsg(initialData.message?.congrats || "");
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ welcome: welcomeMsg, congrats: congratsMsg });
    } catch (err) {
      toast.error(err.message || "Failed to publish course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cf-app-container">
      <div className="cf-content-area">
        <div className="cf-main-content">
          <ProgressTabs
            activeIndex={3}
            completedTabs={completedTabs}
            onTabClick={onTabClick}
          />
          <div className="cf-form-content">
            {/* Header */}
            <div className="cf-form-header">
              <h2 className="cf-form-title">Publish Course</h2>
            </div>

            {/* Message Section */}
            <form onSubmit={handleSubmit}>
              <div className="cp-message-grid">
                <div className="cf-form-group">
                  <label className="cf-form-label">Welcome Message</label>
                  <textarea
                    placeholder="Enter course starting message here..."
                    className="form-control"
                    rows="5"
                    style={{ minHeight: 120, marginBottom: 16 }}
                    value={welcomeMsg}
                    onChange={(e) => setWelcomeMsg(e.target.value)}
                  ></textarea>
                </div>
                <div className="cf-form-group">
                  <label className="cf-form-label">
                    Congratulations Message
                  </label>
                  <textarea
                    placeholder="Enter your course completed message here..."
                    className="form-control"
                    rows="5"
                    style={{ minHeight: 120, marginBottom: 16 }}
                    value={congratsMsg}
                    onChange={(e) => setCongratsMsg(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="cf-form-actions-bottom">
                <CustomButton
                  color="transparent"
                  size="large"
                  type="normal"
                  onClick={() => {
                    // Save current data before going back
                    const data = {
                      message: {
                        welcome: welcomeMsg,
                        congrats: congratsMsg,
                      },
                    };
                    onPrev(data);
                  }}
                >
                  Previous
                </CustomButton>
                <CustomButton
                  color="primary"
                  size="large"
                  type="normal"
                  style={{ padding: "12px 32px" }}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit For Review"}
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePublish;
