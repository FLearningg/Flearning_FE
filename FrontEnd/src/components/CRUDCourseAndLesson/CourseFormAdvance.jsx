import { useState, useEffect } from "react";
import {
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
  Trash2,
} from "lucide-react";
import "../../assets/CRUDCourseAndLesson/CourseFormAdvance.css";
import ProgressTabs from "./ProgressTabs";
import Input from "../common/Input";
import CustomButton from "../common/CustomButton/CustomButton";
import apiClient from "../../services/authService";
import { toast } from "react-toastify";

export default function CourseForm({
  onNext = () => {},
  onPrev = () => {},
  initialData = {},
  completedTabs = [],
  onTabClick = () => {},
}) {
  const [courseInputs, setCourseInputs] = useState(
    initialData.detail?.willLearn?.length > 0
      ? initialData.detail.willLearn
      : [""]
  );
  const [audienceInputs, setAudienceInputs] = useState(
    initialData.detail?.targetAudience?.length > 0
      ? initialData.detail.targetAudience
      : [""]
  );
  const [requirementInputs, setRequirementInputs] = useState(
    initialData.detail?.requirement?.length > 0
      ? initialData.detail.requirement
      : [""]
  );
  const [description, setDescription] = useState(
    initialData.detail?.description || ""
  );

  // Media states
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [trailerFile, setTrailerFile] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initialData.uploadedFiles?.image?.url || initialData.thumbnail || null
  );
  const [trailerUrl, setTrailerUrl] = useState(
    initialData.uploadedFiles?.video?.url || initialData.trailer || null
  );
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [trailerPreview, setTrailerPreview] = useState(null);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingTrailer, setUploadingTrailer] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const MAX_INPUTS = 8;

  // Update state when initialData changes
  useEffect(() => {
    // Always update arrays, even if empty
    if (initialData.detail?.willLearn?.length >= 0) {
      setCourseInputs(
        initialData.detail.willLearn?.length > 0
          ? initialData.detail.willLearn
          : [""]
      );
    }
    if (initialData.detail?.targetAudience?.length >= 0) {
      setAudienceInputs(
        initialData.detail.targetAudience?.length > 0
          ? initialData.detail.targetAudience
          : [""]
      );
    }
    if (initialData.detail?.requirement?.length >= 0) {
      setRequirementInputs(
        initialData.detail.requirement?.length > 0
          ? initialData.detail.requirement
          : [""]
      );
    }
    // Always set description, even if empty
    setDescription(initialData.detail?.description || "");

    // Set media URLs from initialData
    const newThumbnailUrl =
      initialData.uploadedFiles?.image?.url || initialData.thumbnail || null;
    const newTrailerUrl =
      initialData.uploadedFiles?.video?.url || initialData.trailer || null;

    setThumbnailUrl(newThumbnailUrl);
    setTrailerUrl(newTrailerUrl);

    // Cập nhật preview từ url nếu có (khi quay lại tab)
    if (newThumbnailUrl) setThumbnailPreview(newThumbnailUrl);
    if (newTrailerUrl) setTrailerPreview(newTrailerUrl);
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

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setError("");

      // Auto upload immediately
      setUploadingThumbnail(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await apiClient.post("/admin/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (!res.data || !res.data.url) {
          throw new Error(res.data?.message || "Failed to upload thumbnail");
        }
        setThumbnailUrl(res.data.url);
        setThumbnailFile(null);
        toast.success("Thumbnail uploaded successfully!");
      } catch (err) {
        setError(err.message || "Failed to upload thumbnail");
        toast.error(err.message || "Failed to upload thumbnail");
      } finally {
        setUploadingThumbnail(false);
      }
    }
  };

  const handleTrailerChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setTrailerFile(file);
      setTrailerPreview(URL.createObjectURL(file));
      setError("");

      // Auto upload immediately
      setUploadingTrailer(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await apiClient.post("/admin/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (!res.data || !res.data.url) {
          throw new Error(res.data?.message || "Failed to upload trailer");
        }
        setTrailerUrl(res.data.url);
        setTrailerFile(null);
        toast.success("Trailer uploaded successfully!");
      } catch (err) {
        setError(err.message || "Failed to upload trailer");
        toast.error(err.message || "Failed to upload trailer");
      } finally {
        setUploadingTrailer(false);
      }
    }
  };

  const removeThumbnail = () => {
    setThumbnailUrl(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const removeTrailer = () => {
    setTrailerUrl(null);
    setTrailerFile(null);
    setTrailerPreview(null);
  };

  const handleSaveNext = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Upload any pending files first
      if (thumbnailFile) {
        await handleThumbnailChange({ target: { files: [thumbnailFile] } });
      }
      if (trailerFile) {
        await handleTrailerChange({ target: { files: [trailerFile] } });
      }

      let uploadedFiles = {};
      if (thumbnailUrl) uploadedFiles.image = { url: thumbnailUrl };
      if (trailerUrl) uploadedFiles.video = { url: trailerUrl };

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
      toast.error(err.message || "Failed to save advance info");
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

  const renderMediaUpload = (
    type,
    title,
    description,
    icon,
    accept,
    file,
    preview,
    url,
    onChange,
    onRemove,
    uploading
  ) => {
    // Use URL as preview if available, otherwise use preview state
    const displayUrl = url || preview;
    const isUploaded = !!url;

    return (
      <div className="media-card">
        <h3>{title}</h3>
        <p>{description}</p>

        {/* Show existing media or preview */}
        {displayUrl && (
          <div className="media-preview-container">
            <div className="media-preview">
              {type === "image" ? (
                <img
                  src={displayUrl}
                  alt="Preview"
                  className="media-preview-image"
                />
              ) : (
                <video
                  src={displayUrl}
                  controls
                  className="media-preview-video"
                />
              )}
              <button className="media-remove-btn" onClick={onRemove}>
                <Trash2 size={16} />
              </button>
            </div>
            <p className="media-status">
              {isUploaded ? "✓ Uploaded successfully" : "📁 Uploading..."}
            </p>
          </div>
        )}

        {/* Upload area - show if no URL or when uploading */}
        {(!displayUrl || uploading) && (
          <div className="upload-card">
            {icon}
            <input
              type="file"
              accept={accept}
              id={`${type}-upload`}
              style={{ display: "none" }}
              onChange={onChange}
              disabled={uploading}
            />
            <CustomButton
              color="primary"
              type="normal"
              size="small"
              onClick={() => document.getElementById(`${type}-upload`).click()}
              disabled={uploading}
            >
              {uploading
                ? "Uploading..."
                : `Upload ${type === "image" ? "Image" : "Video"}`}
            </CustomButton>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="cf-app-container">
      <div className="cf-content-area">
        <div className="cf-main-content">
          <ProgressTabs
            activeIndex={1}
            completedTabs={completedTabs}
            onTabClick={onTabClick}
          />
          <div className="cf-form-content">
            <div className="cf-form-header">
              <h2 className="cf-form-title">Advance Information</h2>
              <div className="cf-form-actions">
                <CustomButton
                  color="primary"
                  type="normal"
                  size="medium"
                  onClick={handleSaveNext}
                  disabled={loading || uploadingThumbnail || uploadingTrailer}
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
              {renderMediaUpload(
                "image",
                "Course Thumbnail",
                "Upload your course thumbnail here. Important guidelines: 1200x800 pixels. Supported: .jpg, .jpeg, .png",
                <ImageIcon className="upload-icon" />,
                "image/*",
                thumbnailFile,
                thumbnailPreview,
                thumbnailUrl,
                handleThumbnailChange,
                removeThumbnail,
                uploadingThumbnail
              )}

              {renderMediaUpload(
                "video",
                "Course Trailer",
                "Promo videos increase enrollment 5–10X. Make it awesome!",
                <Play className="upload-icon" />,
                "video/*",
                trailerFile,
                trailerPreview,
                trailerUrl,
                handleTrailerChange,
                removeTrailer,
                uploadingTrailer
              )}
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
                      image: thumbnailUrl ? { url: thumbnailUrl } : null,
                      video: trailerUrl ? { url: trailerUrl } : null,
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
                disabled={loading || uploadingThumbnail || uploadingTrailer}
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
