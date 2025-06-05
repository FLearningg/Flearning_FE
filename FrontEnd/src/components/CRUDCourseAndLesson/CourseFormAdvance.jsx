import { useState } from "react";
import {
  Check,
  Upload,
  Play,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  List,
  ListOrdered,
  Plus,
  ImageIcon,
} from "lucide-react";
import "../../assets/CRUDCourseAndLesson/CourseFormAdvance.css";
import ProgressTabs from "./ProgressTabs";
import Input from "../common/Input";
import CustomButton from "../common/CustomButton/CustomButton";

export default function CourseForm() {
  const [courseInputs, setCourseInputs] = useState(Array(4).fill(""));
  const [audienceInputs, setAudienceInputs] = useState(Array(4).fill(""));
  const [requirementInputs, setRequirementInputs] = useState(Array(4).fill(""));
  const [description, setDescription] = useState("");
  const MAX_INPUTS = 8;

  const updateInput = (index, value, type) => {
    const newInputs =
      type === "course"
        ? [...courseInputs]
        : type === "audience"
        ? [...audienceInputs]
        : [...requirementInputs];
    newInputs[index] = value;
    if (type === "course") setCourseInputs(newInputs);
    else if (type === "audience") setAudienceInputs(newInputs);
    else setRequirementInputs(newInputs);
  };

  const addInput = (type) => {
    if (type === "course" && courseInputs.length < MAX_INPUTS) {
      setCourseInputs([...courseInputs, ""]);
    } else if (type === "audience" && audienceInputs.length < MAX_INPUTS) {
      setAudienceInputs([...audienceInputs, ""]);
    } else if (
      type === "requirement" &&
      requirementInputs.length < MAX_INPUTS
    ) {
      setRequirementInputs([...requirementInputs, ""]);
    }
  };

  const renderInputList = (label, items, type) => (
    <div className="section">
      <div className="section-header">
        <h3>
          {label} ({items.length}/{MAX_INPUTS})
        </h3>
        <CustomButton
          color="grey"
          type="normal"
          size="small"
          onClick={() => addInput(type)}
          disabled={items.length >= MAX_INPUTS}
        >
          <Plus className="icon-sm" /> Add new
        </CustomButton>
      </div>
      <div className="input-list">
        {items.map((value, index) => (
          <div key={index} className="input-row">
            <span className="input-index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="input-wrapper">
              <Input
                value={value}
                placeholder={`Enter ${type}...`}
                maxLength={120}
                onChange={(e) => updateInput(index, e.target.value, type)}
              />
              <span className="char-count">{value.length}/120</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="cf-app-container">
      <div className="cf-content-area">
        <div className="cf-main-content">
          <ProgressTabs activeIndex={1} progressText="7/12" />
          <div className="cf-form-content">
            <div className="cf-form-header">
              <h2 className="cf-form-title">Advance Information</h2>
              <div className="cf-form-actions">
                <CustomButton color="grey" type="normal" size="medium">
                  Save
                </CustomButton>
                <CustomButton color="warning" type="normal" size="medium">
                  Save & Preview
                </CustomButton>
              </div>
            </div>

            {/* Media Uploads */}
            <div className="media-section">
              {/* Thumbnail */}
              <div className="media-card">
                <h3>Course Thumbnail</h3>
                <p>
                  Upload your course Thumbnail here.{" "}
                  <strong>Important guidelines:</strong> 1200x800 pixels.
                  Supported:
                  <strong>.jpg, .jpeg, .png</strong>
                </p>
                <div className="upload-card">
                  <ImageIcon className="upload-icon" />
                  <CustomButton color="primary" type="normal" size="small">
                    <Upload className="icon-sm" /> Upload Image
                  </CustomButton>
                </div>
              </div>

              {/* Trailer */}
              <div className="media-card">
                <h3>Course Trailer</h3>
                <p>Promo videos increase enrollment 5–10X. Make it awesome!</p>
                <div className="upload-card">
                  <Play className="upload-icon" />
                  <CustomButton color="primary" type="normal" size="small">
                    <Upload className="icon-sm" /> Upload Video
                  </CustomButton>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="section">
              <h3>Course Descriptions</h3>
              <div className="textarea-container">
                <Input
                  textarea
                  placeholder="Enter your course descriptions"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="formatting-toolbar">
                  {[
                    Bold,
                    Italic,
                    Underline,
                    Strikethrough,
                    Link,
                    List,
                    ListOrdered,
                  ].map((Icon, idx) => (
                    <CustomButton
                      key={idx}
                      type="square"
                      isTransparent
                      size="small"
                      style={{ padding: 4 }}
                    >
                      <Icon className="icon-sm" />
                    </CustomButton>
                  ))}
                </div>
              </div>
            </div>

            {renderInputList(
              "What you will teach in this course",
              courseInputs,
              "course"
            )}
            {renderInputList("Target Audience", audienceInputs, "audience")}
            {renderInputList(
              "Course requirements",
              requirementInputs,
              "requirement"
            )}

            <div className="cf-form-actions-bottom">
              <CustomButton color="grey" type="normal" size="large">
                Previous
              </CustomButton>
              <CustomButton color="primary" type="normal" size="large">
                Save & Next
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
