import { useState, useEffect } from "react";
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
import apiClient from "../../services/authService";

export default function CourseForm({
  onNext = () => {},
  onPrev = () => {},
  initialData = {},
}) {
  const [courseInputs, setCourseInputs] = useState(
    initialData.detail?.willLearn?.length > 0
      ? [
          ...initialData.detail.willLearn,
          ...Array(Math.max(0, 4 - initialData.detail.willLearn.length)).fill(
            ""
          ),
        ]
      : Array(4).fill("")
  );
  const [audienceInputs, setAudienceInputs] = useState(
    initialData.detail?.targetAudience?.length > 0
      ? [
          ...initialData.detail.targetAudience,
          ...Array(
            Math.max(0, 4 - initialData.detail.targetAudience.length)
          ).fill(""),
        ]
      : Array(4).fill("")
  );
  const [requirementInputs, setRequirementInputs] = useState(
    initialData.detail?.requirement?.length > 0
      ? [
          ...initialData.detail.requirement,
          ...Array(Math.max(0, 4 - initialData.detail.requirement.length)).fill(
            ""
          ),
        ]
      : Array(4).fill("")
  );
  const [description, setDescription] = useState(
    initialData.detail?.description || ""
  );
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [trailerFile, setTrailerFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    initialData.thumbnail || null
  );
  const [trailerPreview, setTrailerPreview] = useState(
    initialData.trailer || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const MAX_INPUTS = 8;

  // Update state when initialData changes
  useEffect(() => {
    // Always update arrays, even if empty
    if (initialData.detail?.willLearn?.length >= 0) {
      setCourseInputs([
        ...initialData.detail.willLearn,
        ...Array(Math.max(0, 4 - initialData.detail.willLearn.length)).fill(""),
      ]);
    }
    if (initialData.detail?.targetAudience?.length >= 0) {
      setAudienceInputs([
        ...initialData.detail.targetAudience,
        ...Array(
          Math.max(0, 4 - initialData.detail.targetAudience.length)
        ).fill(""),
      ]);
    }
    if (initialData.detail?.requirement?.length >= 0) {
      setRequirementInputs([
        ...initialData.detail.requirement,
        ...Array(Math.max(0, 4 - initialData.detail.requirement.length)).fill(
          ""
        ),
      ]);
    }
    // Always set description, even if empty
    setDescription(initialData.detail?.description || "");
    setThumbnailPreview(initialData.thumbnail || null);
    setTrailerPreview(initialData.trailer || null);
  }, [initialData]);

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

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);
    setThumbnailPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleTrailerChange = (e) => {
    const file = e.target.files[0];
    setTrailerFile(file);
    setTrailerPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSaveNext = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      let thumbnail, trailer;
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append("file", thumbnailFile);
        const res = await apiClient.post("/admin/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (!res.data || !res.data.url) {
          throw new Error(res.data?.message || "Failed to upload file");
        }
        thumbnail = res.data.url;
      }
      if (trailerFile) {
        const formData = new FormData();
        formData.append("file", trailerFile);
        const res = await apiClient.post("/admin/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (!res.data || !res.data.url) {
          throw new Error(res.data?.message || "Failed to upload file");
        }
        trailer = res.data.url;
      }
      let uploadedFiles = {};
      if (thumbnail) uploadedFiles.image = { url: thumbnail };
      if (trailer) uploadedFiles.video = { url: trailer };
      const data = {
        detail: {
          description,
          willLearn: courseInputs.filter((item) => item.trim() !== ""),
          targetAudience: audienceInputs.filter((item) => item.trim() !== ""),
          requirement: requirementInputs.filter((item) => item.trim() !== ""),
        },
        uploadedFiles,
      };
      onNext(data);
    } catch (err) {
      setError(err.message || "Failed to save advance info");
    } finally {
      setLoading(false);
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
          <div className="acc-add-sections-container">
            <Plus className="icon-sm" />
            <span>Add new</span>
          </div>
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
                <CustomButton
                  color="primary"
                  type="normal"
                  size="medium"
                  onClick={handleSaveNext}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save & Next"}
                </CustomButton>
                <CustomButton color="transparent" type="normal" size="medium">
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
                  <input
                    type="file"
                    accept="image/*"
                    id="thumbnail-upload"
                    style={{ display: "none" }}
                    onChange={handleThumbnailChange}
                  />
                  <CustomButton
                    color="primary"
                    type="normal"
                    size="small"
                    onClick={() =>
                      document.getElementById("thumbnail-upload").click()
                    }
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload Image"}
                  </CustomButton>
                  {thumbnailPreview && (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      style={{ maxWidth: 200, marginTop: 8 }}
                    />
                  )}
                </div>
              </div>

              {/* Trailer */}
              <div className="media-card">
                <h3>Course Trailer</h3>
                <p>Promo videos increase enrollment 5–10X. Make it awesome!</p>
                <div className="upload-card">
                  <Play className="upload-icon" />
                  <input
                    type="file"
                    accept="video/*"
                    id="trailer-upload"
                    style={{ display: "none" }}
                    onChange={handleTrailerChange}
                  />
                  <CustomButton
                    color="primary"
                    type="normal"
                    size="small"
                    onClick={() =>
                      document.getElementById("trailer-upload").click()
                    }
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload Video"}
                  </CustomButton>
                  {trailerPreview && (
                    <video
                      src={trailerPreview}
                      controls
                      style={{ maxWidth: 300, marginTop: 8 }}
                    />
                  )}
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

            {error && (
              <div style={{ color: "red", marginBottom: 8 }}>{error}</div>
            )}
            {success && (
              <div style={{ color: "green", marginBottom: 8 }}>{success}</div>
            )}

            <div className="acc-navigation-buttons">
              <CustomButton
                color="transparent"
                type="normal"
                size="large"
                onClick={() => {
                  // Save current data before going back
                  const data = {
                    detail: {
                      description,
                      willLearn: courseInputs.filter(
                        (item) => item.trim() !== ""
                      ),
                      targetAudience: audienceInputs.filter(
                        (item) => item.trim() !== ""
                      ),
                      requirement: requirementInputs.filter(
                        (item) => item.trim() !== ""
                      ),
                    },
                    uploadedFiles: {
                      image: thumbnailPreview
                        ? { url: thumbnailPreview }
                        : null,
                      video: trailerPreview ? { url: trailerPreview } : null,
                    },
                  };
                  onPrev(data);
                }}
              >
                Previous
              </CustomButton>
              <CustomButton
                color="primary"
                type="normal"
                size="large"
                onClick={handleSaveNext}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save & Next"}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
