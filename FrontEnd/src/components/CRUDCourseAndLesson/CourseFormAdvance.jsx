import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
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
  courseId = null,
  isEditMode = false,
  onMediaSaved = () => {},
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
  const MAX_INPUTS = 8;

  // Helper function to move files from temporary to course folder
  const moveFilesToCourseFolder = async (courseId, mediaUrls) => {
    if (!courseId || !mediaUrls) return mediaUrls;

    try {
      const movePromises = [];
      const updatedUrls = { ...mediaUrls };

      // Move thumbnail if it's in temporary folder
      if (mediaUrls.thumbnail && mediaUrls.thumbnail.includes("temporary/")) {
        const moveRequest = apiClient.post("/admin/move-file", {
          fromUrl: mediaUrls.thumbnail,
          courseId: courseId,
          fileType: "thumbnail",
        });
        movePromises.push(
          moveRequest
            .then((res) => {
              if (res.data?.url) {
                updatedUrls.thumbnail = res.data.url;
              }
            })
            .catch((err) => {
              console.error("Failed to move thumbnail:", err);
            })
        );
      }

      // Move trailer if it's in temporary folder
      if (mediaUrls.trailer && mediaUrls.trailer.includes("temporary/")) {
        const moveRequest = apiClient.post("/admin/move-file", {
          fromUrl: mediaUrls.trailer,
          courseId: courseId,
          fileType: "trailer",
        });
        movePromises.push(
          moveRequest
            .then((res) => {
              if (res.data?.url) {
                updatedUrls.trailer = res.data.url;
              }
            })
            .catch((err) => {
              console.error("Failed to move trailer:", err);
            })
        );
      }

      // Wait for all moves to complete
      if (movePromises.length > 0) {
        await Promise.all(movePromises);
        console.log("Files moved to course folder:", updatedUrls);
        return updatedUrls;
      }

      return mediaUrls;
    } catch (error) {
      console.error("Error moving files to course folder:", error);
      return mediaUrls;
    }
  };

  // Helper function to save media to database immediately
  const saveMediaToDatabase = async (thumbnailUrl, trailerUrl) => {
    try {
      // Only save if we're in edit mode and have a courseId
      if (!isEditMode || !courseId) {
        return true; // Return true for new course creation (not an error)
      }

      const mediaData = {
        ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
        ...(trailerUrl && { trailer: trailerUrl }),

        // Preserve existing curriculum/sections to avoid data loss
        ...(initialData.curriculum && { curriculum: initialData.curriculum }),
        ...(initialData.sections && { sections: initialData.sections }),
        // Preserve other existing course data
        ...(initialData.detail && { detail: initialData.detail }),
        ...(initialData.title && { title: initialData.title }),
        ...(initialData.description && {
          description: initialData.description,
        }),
        ...(initialData.price && { price: initialData.price }),
        ...(initialData.category && { category: initialData.category }),
        ...(initialData.level && { level: initialData.level }),
        ...(initialData.language && { language: initialData.language }),
        ...(initialData.requirements && {
          requirements: initialData.requirements,
        }),
        ...(initialData.duration && { duration: initialData.duration }),
      };

      // Save to database
      await apiClient.put(`/admin/courses/${courseId}`, mediaData);

      // Only trigger reload of course data to ensure UI consistency
      onMediaSaved();

      return true;
    } catch (error) {
      console.error("Failed to save media to database:", error);
      toast.error(
        "Failed to save to database: " +
          (error.response?.data?.message || error.message)
      );
      return false;
    }
  };

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

    // Set media URLs from initialData - priority: uploadedFiles > direct fields
    const newThumbnailUrl =
      initialData.uploadedFiles?.image?.url || initialData.thumbnail || null;
    const newTrailerUrl =
      initialData.uploadedFiles?.video?.url || initialData.trailer || null;

    // Always update URLs and previews to ensure UI consistency
    setThumbnailUrl(newThumbnailUrl);
    setTrailerUrl(newTrailerUrl);
    setThumbnailPreview(newThumbnailUrl || null);
    setTrailerPreview(newTrailerUrl || null);
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
      // Set file and preview immediately for better UX
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));

      // Auto upload immediately
      setUploadingThumbnail(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        // Add courseId to help server determine the correct folder
        if (courseId) {
          formData.append("courseId", courseId);
        }

        // Specify this is a course thumbnail
        formData.append("fileType", "thumbnail");

        const res = await apiClient.post("/admin/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (!res.data || !res.data.url) {
          throw new Error(res.data?.message || "Failed to upload thumbnail");
        }

        // Set new URL and clear file after successful upload
        const newThumbnailUrl = res.data.url;

        // Update state immediately
        setThumbnailUrl(newThumbnailUrl);
        setThumbnailFile(null);

        // Save to database immediately with the NEW URL (not state)
        const saveResult = await saveMediaToDatabase(
          newThumbnailUrl,
          trailerUrl
        );

        if (saveResult) {
          toast.success("Thumbnail uploaded and saved successfully!");
        } else {
          toast.warn("Thumbnail uploaded but failed to save to database");
        }
      } catch (err) {
        console.error("Thumbnail upload error:", err);
        toast.error(err.message || "Failed to upload thumbnail");
        // Clear preview on error
        setThumbnailPreview(null);
        setThumbnailFile(null);
      } finally {
        setUploadingThumbnail(false);
      }
    }
  };

  const handleTrailerChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Set file and preview immediately for better UX
      setTrailerFile(file);
      setTrailerPreview(URL.createObjectURL(file));

      // Auto upload immediately
      setUploadingTrailer(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        // Add courseId to help server determine the correct folder
        if (courseId) {
          formData.append("courseId", courseId);
        }

        // Specify this is a course trailer
        formData.append("fileType", "trailer");

        const res = await apiClient.post("/admin/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (!res.data || !res.data.url) {
          throw new Error(res.data?.message || "Failed to upload trailer");
        }

        // Set new URL and clear file after successful upload
        const newTrailerUrl = res.data.url;

        // Update state immediately
        setTrailerUrl(newTrailerUrl);
        setTrailerFile(null);

        // Save to database immediately with the NEW URL (not state)
        const saveResult = await saveMediaToDatabase(
          thumbnailUrl,
          newTrailerUrl
        );

        if (saveResult) {
          toast.success("Trailer uploaded and saved successfully!");
        } else {
          toast.warn("Trailer uploaded but failed to save to database");
        }
      } catch (err) {
        console.error("Trailer upload error:", err);
        toast.error(err.message || "Failed to upload trailer");
        // Clear preview on error
        setTrailerPreview(null);
        setTrailerFile(null);
      } finally {
        setUploadingTrailer(false);
      }
    }
  };

  const removeThumbnail = () => {
    setThumbnailUrl(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    // Reset file input
    const input = document.getElementById("image-upload");
    if (input) input.value = "";
  };

  const removeTrailer = () => {
    setTrailerUrl(null);
    setTrailerFile(null);
    setTrailerPreview(null);
    // Reset file input
    const input = document.getElementById("video-upload");
    if (input) input.value = "";
  };

  const handleSaveNext = async () => {
    setLoading(true);
    try {
      // Upload any pending files first
      if (thumbnailFile) {
        await handleThumbnailChange({ target: { files: [thumbnailFile] } });
      }
      if (trailerFile) {
        await handleTrailerChange({ target: { files: [trailerFile] } });
      }

      let uploadedFiles = {};
      if (thumbnailUrl) {
        uploadedFiles.image = { url: thumbnailUrl };
      }
      if (trailerUrl) {
        uploadedFiles.video = { url: trailerUrl };
      }

      const data = {
        detail: {
          description,
          willLearn: courseInputs.filter((item) => item.trim() !== ""),
          targetAudience: audienceInputs.filter((item) => item.trim() !== ""),
          requirement: requirementInputs.filter((item) => item.trim() !== ""),
        },
        uploadedFiles,
      };

      // If in edit mode and files are in temporary folder, try to move them
      if (isEditMode && courseId && (thumbnailUrl || trailerUrl)) {
        const movedUrls = await moveFilesToCourseFolder(courseId, {
          thumbnail: thumbnailUrl,
          trailer: trailerUrl,
        });

        // Update URLs if they were moved
        if (movedUrls.thumbnail !== thumbnailUrl) {
          setThumbnailUrl(movedUrls.thumbnail);
          data.uploadedFiles.image = { url: movedUrls.thumbnail };
        }
        if (movedUrls.trailer !== trailerUrl) {
          setTrailerUrl(movedUrls.trailer);
          data.uploadedFiles.video = { url: movedUrls.trailer };
        }
      }

      onNext(data);
    } catch (err) {
      console.error("Save next error:", err);
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
    // Priority: url > preview (url is uploaded, preview is local)
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
              {isUploaded
                ? "✓ Uploaded successfully"
                : uploading
                ? "📁 Uploading..."
                : "📁 Ready to upload"}
            </p>
          </div>
        )}

        {/* Upload area - always show to allow re-uploading */}
        <div className="upload-card">
          {!displayUrl && icon}
          <input
            type="file"
            accept={accept}
            id={`${type}-upload`}
            style={{ display: "none" }}
            onChange={onChange}
            disabled={uploading}
          />
          <CustomButton
            color={displayUrl ? "grey" : "primary"}
            type="normal"
            size="small"
            onClick={() => {
              const input = document.getElementById(`${type}-upload`);
              input.value = ""; // Reset input to allow selecting the same file
              input.click();
            }}
            disabled={uploading}
          >
            {uploading
              ? "Uploading..."
              : displayUrl
              ? `Change ${type === "image" ? "Image" : "Video"}`
              : `Upload ${type === "image" ? "Image" : "Video"}`}
          </CustomButton>
        </div>
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
                null,
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
                null,
                "video/*",
                trailerFile,
                trailerPreview,
                trailerUrl,
                handleTrailerChange,
                removeTrailer,
                uploadingTrailer
              )}
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
                    // Preserve curriculum if exists
                    ...(initialData.curriculum && {
                      curriculum: initialData.curriculum,
                    }),
                    ...(initialData.sections && {
                      sections: initialData.sections,
                    }),
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

