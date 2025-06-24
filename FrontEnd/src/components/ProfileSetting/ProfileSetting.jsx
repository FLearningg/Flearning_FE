import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import ProfileSection from "../CourseList/ProfileSection";
import CustomButton from "../common/CustomButton/CustomButton";
import Input from "../common/Input";
import { getProfile, updateProfile } from "../../services/profileService";
import { changePassword } from "../../services/authService";
import "../../assets/ProfileSetting/ProfileSetting.css";

const DEFAULT_PROFILE_IMAGE = "https://lh3.googleusercontent.com/d/1TVCGnVdymo_X-21AV2bn1mhVRN0weMCn=s400";

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
  const [imageKey, setImageKey] = useState(0); // Force image re-render

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

  // Error states
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Success states
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // State for showing/hiding actual password text
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoadingProfile(true);
      setProfileError(""); // Clear any previous errors

      console.log("Fetching profile data...");
      const response = await getProfile();
      console.log("Profile response:", response);

      // Backend trả về { success: true, data: {...} }
      const data = response.data.data;
      console.log("Profile data:", data);

      setProfileData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        username: data.userName || "", // Backend trả về userName
        email: data.email || "",
        title: data.biography || "", // Backend trả về biography
        userImage: data.userImage ? data.userImage.trim() : DEFAULT_PROFILE_IMAGE,
      });

      // Debug: Log exact userImage URL from backend
      console.log("Backend userImage URL:", data.userImage);
      console.log("userImage type:", typeof data.userImage);
      console.log("userImage length:", data.userImage?.length);

      console.log("Profile data set successfully");
    } catch (error) {
      console.error("Error fetching profile:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);

      let errorMessage = "Failed to load profile data";

      if (error.response?.status === 401) {
        errorMessage = "Authentication required. Please login again.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setProfileError(errorMessage);
    } finally {
      setIsLoadingProfile(false);
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

      // Map frontend data to backend format
      const backendData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        userName: profileData.username, // Frontend username -> backend userName
        email: profileData.email,
        biography: profileData.title, // Frontend title -> backend biography
        // userImage không được gửi vì user không thể edit từ form này
      };

      console.log("Sending profile data:", backendData);
      const response = await updateProfile(backendData);
      console.log("Update response:", response);

      setProfileSuccess("Profile updated successfully!");

      // Force image re-render and refresh profile data
      setImageKey(prev => prev + 1);
      await fetchProfileData();
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

      // Create FormData for file upload
      const formData = new FormData();
      // Backend multer expects 'userImage' field name
      formData.append("userImage", selectedFile);

      // Add other profile data
      formData.append("firstName", profileData.firstName);
      formData.append("lastName", profileData.lastName);
      formData.append("userName", profileData.username);
      formData.append("email", profileData.email);
      formData.append("biography", profileData.title);

      console.log("Uploading image...");

      // Call API with FormData
      const response = await updateProfile(formData);
      console.log("Upload response:", response);

      setProfileSuccess("Profile and image updated successfully!");

      // Clear file selection
      setSelectedFile(null);
      setImagePreview(null);

      // Force image re-render and refresh profile data to get new image URL
      setImageKey(prev => prev + 1);
      await fetchProfileData();
    } catch (error) {
      console.error("Error uploading image:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);
      console.error("Error response headers:", error.response?.headers);
      console.error("Error message:", error.message);
      console.error(
        "Full error object:",
        JSON.stringify(error.response?.data, null, 2)
      );

      setProfileError(
        error.response?.data?.message || "Failed to upload image"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileSection
      avatar={profileData.userImage || "/images/defaultImageUser.png"}
      name={
        profileData.firstName || profileData.lastName
          ? `${profileData.firstName} ${profileData.lastName}`.trim()
          : "User"
      }
      title={profileData.title || "Student"}
      activePath={location.pathname}
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
                  <div className="profile-picture-section">
                    <div className="profile-picture-upload">
                      <div className="profile-picture-preview">
                        <img
                          key={`${profileData.userImage || 'default'}-${imageKey}`} // Force re-render when URL changes
                          src={
                            imagePreview ||
                            (profileData.userImage ? 
                              `${profileData.userImage}${profileData.userImage.includes('?') ? '&' : '?'}t=${Date.now()}` : 
                              DEFAULT_PROFILE_IMAGE)
                          }
                          alt="User profile"
                          width={200}
                          height={200}
                          className="profile-picture-img"
                          onLoad={(e) => {
                            console.log('Image loaded successfully:', e.target.src);
                          }}
                          onError={(e) => {
                            console.error('Error loading image:', e.target.src);
                            console.error('Original profileData.userImage:', profileData.userImage);
                            console.error('Image src after processing:', e.target.src);
                            console.error('Fallback to default image');
                            e.target.src = DEFAULT_PROFILE_IMAGE;
                            e.target.onerror = null; // Prevent infinite loop
                          }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          style={{ display: "none" }}
                          id="profile-image-input"
                        />
                        <button
                          className="upload-overlay-btn"
                          onClick={() =>
                            document
                              .getElementById("profile-image-input")
                              .click()
                          }
                          disabled={isLoading}
                        >
                          📤 {selectedFile ? "Change Photo" : "Upload Photo"}
                        </button>
                      </div>
                      <p className="upload-hint">
                        Image size should be under 1MB and image ratio needs to
                        be 1:1
                      </p>

                      {/* File Selection Info */}
                      {selectedFile && (
                        <div
                          style={{
                            marginTop: "10px",
                            padding: "10px",
                            background: "#f8f9fa",
                            borderRadius: "4px",
                          }}
                        >
                          <p
                            style={{
                              margin: "0 0 5px 0",
                              fontSize: "14px",
                              color: "#495057",
                            }}
                          >
                            Selected: {selectedFile.name}
                          </p>
                          <p
                            style={{
                              margin: "0 0 10px 0",
                              fontSize: "12px",
                              color: "#6c757d",
                            }}
                          >
                            Size: {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                            MB
                          </p>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={handleImageUpload}
                              disabled={isLoading}
                              style={{
                                background: "#28a745",
                                color: "white",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                cursor: isLoading ? "not-allowed" : "pointer",
                              }}
                            >
                              {isLoading ? "Uploading..." : "✓ Upload & Save"}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedFile(null);
                                setImagePreview(null);
                              }}
                              disabled={isLoading}
                              style={{
                                background: "#6c757d",
                                color: "white",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                cursor: isLoading ? "not-allowed" : "pointer",
                              }}
                            >
                              ✕ Cancel
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
