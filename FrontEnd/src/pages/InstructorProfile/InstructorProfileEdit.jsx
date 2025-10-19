import React, { useState, useEffect } from "react";
import { FaCamera, FaGlobe, FaLinkedin, FaTwitter, FaYoutube, FaFacebook } from "react-icons/fa";
import { toast } from "react-toastify";
import { getMyProfile, updateMyProfile } from "../../services/instructorService";
import "../../assets/InstructorProfile/InstructorProfileEdit.css";

const DEFAULT_PROFILE_IMAGE = "/images/defaultImageUser.png";

const InstructorProfileEdit = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    headline: "",
    website: "",
    socialLinks: {
      linkedin: "",
      twitter: "",
      youtube: "",
      facebook: "",
    },
    expertise: [],
    experience: "",
    userImage: DEFAULT_PROFILE_IMAGE,
  });

  const [newExpertise, setNewExpertise] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getMyProfile();
      const data = response.data.data;

      setProfileData({
        firstName: data.userId?.firstName || "",
        lastName: data.userId?.lastName || "",
        email: data.userId?.email || "",
        phone: data.phone || "",
        bio: data.bio || "",
        headline: data.headline || "",
        website: data.website || "",
        socialLinks: data.socialLinks || {
          linkedin: "",
          twitter: "",
          youtube: "",
          facebook: "",
        },
        expertise: data.expertise || [],
        experience: data.experience || "",
        userImage: data.userId?.userImage || DEFAULT_PROFILE_IMAGE,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setProfileData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleAddExpertise = () => {
    if (newExpertise.trim() && !profileData.expertise.includes(newExpertise.trim())) {
      setProfileData((prev) => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()],
      }));
      setNewExpertise("");
    }
  };

  const handleRemoveExpertise = (index) => {
    setProfileData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) {
      toast.warning("Please select an image first");
      return;
    }

    try {
      setIsUploadingAvatar(true);

      const formData = new FormData();
      formData.append("avatar", selectedFile);

      await updateMyProfile(formData);
      toast.success("Avatar updated successfully!");

      // Clear states before reload
      setSelectedFile(null);
      setImagePreview(null);

      // Reload page to update avatar everywhere (same as ProfileSetting does)
      window.location.reload();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error(error.response?.data?.message || "Failed to upload avatar");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCancelAvatar = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);

      const formData = new FormData();
      formData.append("bio", profileData.bio);
      formData.append("headline", profileData.headline);
      formData.append("website", profileData.website);
      formData.append("socialLinks", JSON.stringify(profileData.socialLinks));

      await updateMyProfile(formData);
      toast.success("Profile updated successfully!");
      
      // Refresh profile data
      await fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="ipe-loading">
        <div className="ipe-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="ipe-container">
      <div className="ipe-header">
        <h1>Edit Profile</h1>
        <p>Manage your public instructor profile</p>
      </div>

      <form onSubmit={handleSubmit} className="ipe-form">
        {/* Profile Picture Section */}
        <div className="ipe-section">
          <h2 className="ipe-section-title">Profile Picture</h2>
          <div className="ipe-image-upload">
            <div className="ipe-image-preview">
              <img
                src={imagePreview || profileData.userImage}
                alt="Profile"
                onError={(e) => {
                  e.target.src = DEFAULT_PROFILE_IMAGE;
                }}
              />
              <label htmlFor="avatar-upload" className="ipe-image-overlay">
                <FaCamera size={24} />
                <span>Choose Photo</span>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
            <div className="ipe-image-info">
              <p className="ipe-image-text">
                Upload a professional photo. JPG, PNG or GIF. Max size 5MB.
              </p>
              {selectedFile && (
                <div className="ipe-image-actions">
                  <button
                    type="button"
                    onClick={handleUploadAvatar}
                    className="ipe-btn-upload"
                    disabled={isUploadingAvatar}
                  >
                    {isUploadingAvatar ? "Uploading..." : "Upload Avatar"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelAvatar}
                    className="ipe-btn-cancel"
                    disabled={isUploadingAvatar}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information - Read Only */}
        <div className="ipe-section">
          <h2 className="ipe-section-title">Basic Information</h2>
          <div className="ipe-form-grid">
            <div className="ipe-form-group">
              <label>First Name</label>
              <input
                type="text"
                value={profileData.firstName}
                disabled
                className="ipe-input-disabled"
              />
            </div>
            <div className="ipe-form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={profileData.lastName}
                disabled
                className="ipe-input-disabled"
              />
            </div>
            <div className="ipe-form-group">
              <label>Email</label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="ipe-input-disabled"
              />
            </div>
            <div className="ipe-form-group">
              <label>Phone</label>
              <input
                type="text"
                value={profileData.phone}
                disabled
                className="ipe-input-disabled"
              />
            </div>
          </div>
        </div>

        {/* Professional Information - Read Only */}
        <div className="ipe-section">
          <h2 className="ipe-section-title">Professional Information</h2>
          <div className="ipe-form-group">
            <label>Expertise</label>
            <div className="ipe-expertise-tags">
              {profileData.expertise.map((exp, index) => (
                <span key={index} className="ipe-expertise-tag">
                  {exp}
                </span>
              ))}
            </div>
          </div>
          <div className="ipe-form-group">
            <label>Experience</label>
            <textarea
              value={profileData.experience}
              disabled
              className="ipe-input-disabled"
              rows="3"
            />
          </div>
        </div>

        {/* Public Profile - Editable */}
        <div className="ipe-section">
          <h2 className="ipe-section-title">Public Profile</h2>
          
          <div className="ipe-form-group">
            <label>Headline</label>
            <input
              type="text"
              name="headline"
              value={profileData.headline}
              onChange={handleInputChange}
              placeholder="e.g., Senior Developer & Tech Instructor"
              maxLength={100}
            />
            <small>{profileData.headline.length}/100 characters</small>
          </div>

          <div className="ipe-form-group">
            <label>Biography</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              placeholder="Tell students about yourself..."
              rows="6"
              maxLength={500}
            />
            <small>{profileData.bio.length}/500 characters</small>
          </div>

          <div className="ipe-form-group">
            <label>
              <FaGlobe /> Website
            </label>
            <input
              type="url"
              name="website"
              value={profileData.website}
              onChange={handleInputChange}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        {/* Social Links - Editable */}
        <div className="ipe-section">
          <h2 className="ipe-section-title">Social Links</h2>
          
          <div className="ipe-form-group">
            <label>
              <FaLinkedin /> LinkedIn
            </label>
            <input
              type="url"
              value={profileData.socialLinks.linkedin}
              onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div className="ipe-form-group">
            <label>
              <FaTwitter /> Twitter
            </label>
            <input
              type="url"
              value={profileData.socialLinks.twitter}
              onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
              placeholder="https://twitter.com/yourhandle"
            />
          </div>

          <div className="ipe-form-group">
            <label>
              <FaYoutube /> YouTube
            </label>
            <input
              type="url"
              value={profileData.socialLinks.youtube}
              onChange={(e) => handleSocialLinkChange("youtube", e.target.value)}
              placeholder="https://youtube.com/@yourchannel"
            />
          </div>

          <div className="ipe-form-group">
            <label>
              <FaFacebook /> Facebook
            </label>
            <input
              type="url"
              value={profileData.socialLinks.facebook}
              onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
              placeholder="https://facebook.com/yourpage"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="ipe-actions">
          <button
            type="submit"
            className="ipe-btn-primary"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InstructorProfileEdit;
