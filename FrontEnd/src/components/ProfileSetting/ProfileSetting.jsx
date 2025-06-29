import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaCamera } from 'react-icons/fa';
import ProfileSection, { updateProfileSectionCache } from "../CourseList/ProfileSection";
import CustomButton from "../common/CustomButton/CustomButton";
import Input from "../common/Input";
import { getProfile, updateProfile } from "../../services/profileService";
import { changePassword } from "../../services/authService";
import "../../assets/ProfileSetting/ProfileSetting.css";

const DEFAULT_PROFILE_IMAGE = "/images/defaultImageUser.png";

// Password Input wrapper component
const PasswordInput = ({ value, onChange, placeholder, label, disabled }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="ps-form-group" style={{ position: 'relative' }}>
      <Input
        variant="label"
        text={label}
        placeholder={placeholder}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: 'absolute',
          right: '10px',
          top: '32px',
          background: 'none',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          padding: '8px',
          color: disabled ? '#ccc' : '#666',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        disabled={disabled}
      >
        {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
      </button>
    </div>
  );
};

const Component = () => {
  const location = useLocation();

  // State for profile data
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    title: "",
    userImage: "",
  });

  // State for file upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageKey, setImageKey] = useState(0);

  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Error states
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Success states
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoadingProfile(true);
      setProfileError("");

      console.log("Fetching profile data...");
      const response = await getProfile();
      console.log("Profile response:", response);

      const data = response.data.data;
      console.log("Profile data:", data);

      setProfileData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        username: data.userName || "",
        email: data.email || "",
        title: data.biography || "",
        userImage: data.userImage || DEFAULT_PROFILE_IMAGE,
      });

    } catch (error) {
      console.error("Error fetching profile:", error);
      let errorMessage = "Failed to load profile data";
      if (error.response?.status === 401) {
        errorMessage = "Authentication required. Please login again.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setProfileError(errorMessage);
      setProfileData(prev => ({
        ...prev,
        userImage: DEFAULT_PROFILE_IMAGE
      }));
    } finally {
      setIsLoadingProfile(false);
      setImageLoading(false);
    }
  };

  const handleProfileInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear errors when user starts typing
    if (profileError) setProfileError("");
    if (profileSuccess) setProfileSuccess("");
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear errors when user starts typing
    if (passwordError) setPasswordError("");
    if (passwordSuccess) setPasswordSuccess("");
  };

  const handleProfileSave = async () => {
    try {
      setIsLoading(true);
      setProfileError("");
      setProfileSuccess("");

      const backendData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        userName: profileData.username,
        email: profileData.email,
        biography: profileData.title,
      };

      console.log("Sending profile data:", backendData);
      const response = await updateProfile(backendData);
      console.log("Update response:", response);

      // Update success message
      setProfileSuccess("Profile updated successfully!");

      // Update profile section cache
      updateProfileSectionCache({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        biography: profileData.title,
        userImage: profileData.userImage
      });

      // Force update components and refresh data
      setImageKey(prev => prev + 1);
      await fetchProfileData();

      // Reload the page after successful update
      window.location.reload();

    } catch (error) {
      console.error("Error updating profile:", error);
      setProfileError(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    try {
      // Validate input
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setPasswordError("Please fill in all password fields");
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setPasswordError("New password must be at least 6 characters long");
        return;
      }

      // Validate passwords match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError("New passwords do not match");
        return;
      }

      setIsLoadingPassword(true);
      setPasswordError("");
      setPasswordSuccess("");

      // Call the changePassword API
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      // Check if the response was successful
      if (response.data.message) {
        setPasswordSuccess(response.data.message);
        
        // Clear password fields after successful change
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      
      // Handle specific error messages from the backend
      const errorMessage = error.response?.data?.message || "Failed to change password";
      setPasswordError(errorMessage);
    } finally {
      setIsLoadingPassword(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setProfileError("Please select an image file");
        return;
      }

      // Validate file size (1MB = 1048576 bytes)
      if (file.size > 1048576) {
        setProfileError("Image size should be under 1MB");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear any previous errors
      setProfileError("");
    }
  };

  // Handle file upload
  const handleImageUpload = async () => {
    if (!selectedFile) {
      setProfileError("Please select an image file first");
      return;
    }

    try {
      setIsLoading(true);
      setProfileError("");
      setProfileSuccess("");
      setImageLoading(true);

      const formData = new FormData();
      formData.append("userImage", selectedFile);
      formData.append("firstName", profileData.firstName);
      formData.append("lastName", profileData.lastName);
      formData.append("userName", profileData.username);
      formData.append("email", profileData.email);
      formData.append("biography", profileData.title);

      console.log("Uploading image...");
      const response = await updateProfile(formData);
      console.log("Upload response:", response);

      if (response.data?.data?.userImage) {
        const imageUrl = response.data.data.userImage;
        
        // Clear existing states
        setImagePreview(null);
        setSelectedFile(null);
        
        // Update profile data with new image
        setProfileData(prev => ({
          ...prev,
          userImage: imageUrl
        }));

        // Update profile section cache with new image
        updateProfileSectionCache({
          userImage: imageUrl
        });
        
        // Force update both components
        setImageKey(prev => prev + 1);
        setProfileSuccess("Profile and image updated successfully!");

        // Fetch profile data again to ensure everything is in sync
        await fetchProfileData();

        // Reload the page after successful update
        window.location.reload();
      }

    } catch (error) {
      console.error("Error uploading image:", error);
      setProfileError(
        error.response?.data?.message || error.message || "Failed to upload image"
      );
    } finally {
      setIsLoading(false);
      setImageLoading(false);
    }
  };

  // Add this to fetch initial image
  useEffect(() => {
    const cachedImageUrl = localStorage.getItem('userProfileImage');
    if (cachedImageUrl) {
      setProfileData(prev => ({
        ...prev,
        userImage: cachedImageUrl
      }));
    }
  }, []);

  return (
    <ProfileSection
      activePath={location.pathname}
      forceUpdate={imageKey}
    >
      <div className="page-content">
        <div className="profile-card-wrapper">
          {/* Loading State */}
          {isLoadingProfile && (
            <div
              className="loading-state"
              style={{ padding: "40px", textAlign: "center" }}
            >
              <p>Loading profile data...</p>
            </div>
          )}

          {/* Settings Content */}
          {!isLoadingProfile && (
            <div className="settings-content">
              {/* Account Settings */}
              <div className="account-settings-section">
                <h3 className="section-title">Account settings</h3>
                <div className="account-settings-content">
                  <div className="profile-picture-upload">
                    <div className="profile-picture-preview">
                      <div className="profile-image-container">
                        <img
                          key={`profile-image-${imageKey}`}
                          src={imagePreview || profileData.userImage || DEFAULT_PROFILE_IMAGE}
                          alt="User profile"
                          className={`profile-picture-img ${imageLoading ? 'loading' : ''}`}
                          onError={(e) => {
                            console.error("Failed to load image:", e.target.src);
                            if (e.target.src !== DEFAULT_PROFILE_IMAGE) {
                              e.target.src = DEFAULT_PROFILE_IMAGE;
                              setProfileError("Failed to load profile image. Using default image instead.");
                            }
                            setImageLoading(false);
                            e.target.onerror = null;
                          }}
                          onLoad={() => {
                            setImageLoading(false);
                            setProfileError("");
                          }}
                        />
                        <div className="profile-upload-overlay">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            id="profile-image-input"
                            className="profile-file-input"
                          />
                          <label htmlFor="profile-image-input" className="profile-camera-icon-wrapper">
                            <FaCamera size={24} />
                          </label>
                        </div>
                      </div>
                      
                      <p className="profile-upload-hint">
                        Image size should be under 1MB and image ratio needs to be 1:1
                      </p>

                      {selectedFile && (
                        <div className="profile-file-info">
                          <p className="profile-file-size">
                            Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <div className="profile-file-actions">
                            <button
                              onClick={handleImageUpload}
                              disabled={isLoading}
                              className="profile-action-btn profile-upload-btn"
                            >
                              {isLoading ? (
                                <span className="profile-loading-text">Uploading...</span>
                              ) : (
                                <>Upload</>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedFile(null);
                                setImagePreview(null);
                              }}
                              disabled={isLoading}
                              className="profile-action-btn profile-cancel-btn"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="account-form-section">
                    <div className="ps-form-grid">
                      <div className="ps-form-group">
                        <Input
                          variant="label"
                          text="First name"
                          placeholder="First name"
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) =>
                            handleProfileInputChange(
                              "firstName",
                              e.target.value
                            )
                          }
                          disabled={isLoadingProfile}
                        />
                      </div>
                      <div className="ps-form-group">
                        <Input
                          variant="label"
                          text="Last name"
                          placeholder="Last name"
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) =>
                            handleProfileInputChange("lastName", e.target.value)
                          }
                          disabled={isLoadingProfile}
                        />
                      </div>
                    </div>
                    <div className="ps-form-group">
                      <Input
                        variant="label"
                        text="Username"
                        placeholder="Enter your username"
                        type="text"
                        value={profileData.username}
                        onChange={(e) =>
                          handleProfileInputChange("username", e.target.value)
                        }
                        disabled={isLoadingProfile}
                      />
                    </div>
                    <div className="ps-form-group">
                      <Input
                        variant="label"
                        text="Email"
                        placeholder="Email address"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          handleProfileInputChange("email", e.target.value)
                        }
                        disabled={isLoadingProfile}
                      />
                    </div>
                    <div className="ps-form-group">
                      <Input
                        variant="counter"
                        text="Title"
                        placeholder="Your title, profession or small biography"
                        counter={profileData.title.length}
                        maxCount={50}
                        type="text"
                        value={profileData.title}
                        onChange={(e) =>
                          handleProfileInputChange("title", e.target.value)
                        }
                        disabled={isLoadingProfile}
                      />
                    </div>

                    {/* Error and Success Messages */}
                    {profileError && (
                      <div
                        className="alert alert-error"
                        style={{
                          color: "#dc3545",
                          fontSize: "14px",
                          marginBottom: "10px",
                        }}
                      >
                        {profileError}
                      </div>
                    )}
                    {profileSuccess && (
                      <div
                        className="alert alert-success"
                        style={{
                          color: "#28a745",
                          fontSize: "14px",
                          marginBottom: "10px",
                        }}
                      >
                        {profileSuccess}
                      </div>
                    )}

                    <CustomButton
                      size="medium"
                      color="primary"
                      type="normal"
                      onClick={handleProfileSave}
                      disabled={isLoading || isLoadingProfile}
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </CustomButton>
                  </div>
                </div>
              </div>

              {/* Change Password */}
              <div className="change-password-section">
                <h3 className="section-title">Change password</h3>
                
                <PasswordInput
                  label="Current Password"
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordInputChange("currentPassword", e.target.value)}
                  disabled={isLoadingPassword}
                />

                <PasswordInput
                  label="New Password"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordInputChange("newPassword", e.target.value)}
                  disabled={isLoadingPassword}
                />

                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordInputChange("confirmPassword", e.target.value)}
                  disabled={isLoadingPassword}
                />

                {/* Password Error and Success Messages */}
                {passwordError && (
                  <div
                    className="alert alert-error"
                    style={{
                      color: "#dc3545",
                      fontSize: "14px",
                      marginBottom: "10px",
                    }}
                  >
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div
                    className="alert alert-success"
                    style={{
                      color: "#28a745",
                      fontSize: "14px",
                      marginBottom: "10px",
                    }}
                  >
                    {passwordSuccess}
                  </div>
                )}

                <CustomButton
                  size="medium"
                  color="primary"
                  type="normal"
                  onClick={handlePasswordSave}
                  disabled={
                    isLoadingPassword ||
                    !passwordData.currentPassword ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword
                  }
                >
                  {isLoadingPassword ? "Changing..." : "Change Password"}
                </CustomButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProfileSection>
  );
};

export default Component;
