import "../../assets/CRUDCourseAndLesson/CourseForm.css";
import "../../assets/CRUDCourseAndLesson/CoursePublish.css";
import ProgressTabs from "./ProgressTabs";
import CustomButton from "../common/CustomButton/CustomButton";

const CoursePublish = () => {
  return (
    <div className="cf-app-container">
      <div className="cf-content-area">
        <div className="cf-main-content">
          <ProgressTabs activeIndex={3} />
          <div className="cf-form-content">
            {/* Header */}
            <div className="cf-form-header">
              <h2 className="cf-form-title">Publish Course</h2>
              <div className="cf-form-actions">
                <CustomButton color="primary" size="medium" type="normal">
                  Save
                </CustomButton>
                <CustomButton color="transparent" size="medium" type="normal">
                  Save & Preview
                </CustomButton>
              </div>
            </div>

            {/* Message Section */}
            <div className="cp-message-grid">
              <div className="cf-form-group">
                <label className="cf-form-label">Welcome Message</label>
                <textarea
                  placeholder="Enter course starting message here..."
                  className="form-control"
                  rows="5"
                  style={{ minHeight: 120, marginBottom: 16 }}
                ></textarea>
              </div>
              <div className="cf-form-group">
                <label className="cf-form-label">Congratulations Message</label>
                <textarea
                  placeholder="Enter your course completed message here..."
                  className="form-control"
                  rows="5"
                  style={{ minHeight: 120, marginBottom: 16 }}
                ></textarea>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="cf-form-actions-bottom">
              <CustomButton color="transparent" size="large" type="normal">
                Previous
              </CustomButton>
              <CustomButton
                color="primary"
                size="large"
                type="normal"
                style={{ padding: "12px 32px" }}
              >
                Submit For Review
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePublish;
