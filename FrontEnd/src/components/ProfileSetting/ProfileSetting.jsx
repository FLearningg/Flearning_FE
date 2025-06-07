import React from "react"
import { useLocation } from "react-router-dom"
import ProfileSection from "../CourseList/ProfileSection"
import CustomButton from "../common/CustomButton/CustomButton"
import Input from "../common/Input"

// Import the ProfileSetting CSS file
import "../../assets/ProfileSetting/ProfileSetting.css"

export default function Component() {
  const location = useLocation();

  return (
    <ProfileSection 
      avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
      name="Kevin Gilbert"
      title="Web Designer & Best-Selling Instructor"
      activePath={location.pathname}
    >
      <div className="page-content">
        <div className="profile-card-wrapper">
          {/* Settings Content */}
          <div className="settings-content">
            {/* Account Settings */}
            <div className="account-settings-section">
              <h3 className="section-title">Account settings</h3>
              <div className="account-settings-content">
                <div className="profile-picture-section">
                  <div className="profile-picture-upload">
                    <div className="profile-picture-preview">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80"
                        alt="User profile"
                        width={200}
                        height={200}
                        className="profile-picture-img"
                      />
                      <button
                        className="upload-overlay-btn"
                        onClick={() => console.log("Upload photo clicked")}
                      >
                        📤 Upload Photo
                      </button>
                    </div>
                    <p className="upload-hint">Image size should be under 1MB and image ration needs to be 1:1</p>
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
                      />
                    </div>
                    <div className="ps-form-group">
                      <Input
                        variant="label"
                        text="Last name"
                        placeholder="Last name"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="ps-form-group">
                    <Input
                      variant="label"
                      text="Username"
                      placeholder="Enter your username"
                      type="text"
                    />
                  </div>
                  <div className="ps-form-group">
                    <Input
                      variant="label"
                      text="Email"
                      placeholder="Email address"
                      type="email"
                    />
                  </div>
                  <div className="ps-form-group">
                    <Input
                      variant="counter"
                      text="Title"
                      placeholder="Your tittle, proffesion or small biography"
                      counter={0}
                      maxCount={50}
                      type="text"
                    />
                  </div>
                  <CustomButton
                    size="medium"
                    color="primary"
                    type="normal"
                    onClick={() => console.log("Save changes clicked")}
                  >
                    Save Changes
                  </CustomButton>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="change-password-section">
              <h3 className="section-title">Change password</h3>
              <div className="ps-form-group">
                <Input
                  variant="iconInside"
                  text="Current Password"
                  placeholder="Password"
                  type="password"
                  rightIcon="fas fa-eye"
                />
              </div>
              <div className="ps-form-group">
                <Input
                  variant="iconInside"
                  text="New Password"
                  placeholder="Password"
                  type="password"
                  rightIcon="fas fa-eye"
                />
              </div>
              <div className="ps-form-group">
                <Input
                  variant="iconInside"
                  text="Confirm Password"
                  placeholder="Confirm new password"
                  type="password"
                  rightIcon="fas fa-eye"
                />
              </div>
              <CustomButton
                size="medium"
                color="primary"
                type="normal"
                onClick={() => console.log("Change password clicked")}
              >
                Save Changes
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </ProfileSection>
  )
}
