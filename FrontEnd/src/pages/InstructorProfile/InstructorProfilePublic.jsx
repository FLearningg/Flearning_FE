import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaGlobe, FaLinkedin, FaTwitter, FaYoutube, FaFacebook, FaStar, FaUserFriends } from "react-icons/fa";
import { getPublicProfile, getInstructorStats } from "../../services/instructorService";
import { getInstructorCourses } from "../../services/instructorService";
import "../../assets/InstructorProfile/InstructorProfilePublic.css";

const DEFAULT_PROFILE_IMAGE = "/images/defaultImageUser.png";

const InstructorProfilePublic = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  console.log("🚀 Component Rendered!");
  console.log("🔑 userId from params:", userId);
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("courses");
  
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    averageRating: 0,
    totalReviews: 0,
  });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    console.log("📡 useEffect triggered, userId:", userId);
    if (userId) {
      console.log("✅ Calling fetchProfileData...");
      fetchProfileData();
    } else {
      console.log("❌ No userId found!");
    }
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch profile
      const profileResponse = await getPublicProfile(userId);
      console.log("🔍 Full Response:", profileResponse);
      console.log("🔍 Response Data:", profileResponse.data);
      
      const data = profileResponse.data.data;
      console.log("🔍 Parsed Data:", data);
      
      // Set profile data with correct structure
      setProfileData({
        userId: data.user,
        ...data.profile
      });

      // Set stats from response
      setStats(data.statistics);
      
      // Set courses from response (backend already filters active courses)
      console.log("📚 All courses from backend:", data.courses);
      setCourses(data.courses || []);

    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      console.error("❌ Error response:", error.response?.data);
      setProfileData(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="ipp-loading">
        <div className="ipp-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="ipp-error">
        <h2>Profile not found</h2>
        <p>The instructor profile you're looking for doesn't exist.</p>
      </div>
    );
  }

  const fullName = `${profileData.userId?.firstName || ""} ${profileData.userId?.lastName || ""}`.trim();

  return (
    <div className="ipp-container">
      {/* Header Section with Gradient Background */}
      <div className="ipp-header">
        <div className="ipp-header-content">
          <div className="ipp-avatar-section">
            <img
              src={profileData.userId?.userImage || DEFAULT_PROFILE_IMAGE}
              alt={fullName}
              className="ipp-avatar"
              onError={(e) => {
                e.target.src = DEFAULT_PROFILE_IMAGE;
              }}
            />
          </div>
          
          <div className="ipp-info-section">
            <h1 className="ipp-name">
              {fullName}
              {stats.averageRating >= 4.5 && (
                <span className="ipp-badge">
                  <FaStar style={{ fontSize: '10px' }} /> Top Rated
                </span>
              )}
            </h1>
            {profileData.headline && (
              <p className="ipp-headline">{profileData.headline}</p>
            )}
            
            {/* Stats Row - Inline format like Figma */}
            <div className="ipp-stats">
              <div className="ipp-stat">
                <FaStar className="ipp-stat-icon" />
                <span className="ipp-stat-value">{stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '0.0'}</span>
                <span className="ipp-stat-label">Instructor rating</span>
              </div>
              <div className="ipp-stat">
                <span className="ipp-stat-value">{stats.totalReviews.toLocaleString()}</span>
                <span className="ipp-stat-label">Reviews</span>
              </div>
              <div className="ipp-stat">
                <span className="ipp-stat-value">{stats.totalStudents.toLocaleString()}</span>
                <span className="ipp-stat-label">Students</span>
              </div>
              <div className="ipp-stat">
                <span className="ipp-stat-value">{stats.totalCourses}</span>
                <span className="ipp-stat-label">Courses</span>
              </div>
            </div>

            {/* Social Links */}
            {(profileData.website || 
              profileData.socialLinks?.linkedin || 
              profileData.socialLinks?.twitter || 
              profileData.socialLinks?.youtube || 
              profileData.socialLinks?.facebook) && (
              <div className="ipp-social-links">
                {profileData.website && (
                  <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="ipp-social-link">
                    <FaGlobe />
                  </a>
                )}
                {profileData.socialLinks?.linkedin && (
                  <a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="ipp-social-link">
                    <FaLinkedin />
                  </a>
                )}
                {profileData.socialLinks?.twitter && (
                  <a href={profileData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="ipp-social-link">
                    <FaTwitter />
                  </a>
                )}
                {profileData.socialLinks?.youtube && (
                  <a href={profileData.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="ipp-social-link">
                    <FaYoutube />
                  </a>
                )}
                {profileData.socialLinks?.facebook && (
                  <a href={profileData.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="ipp-social-link">
                    <FaFacebook />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area - 2 Column Layout */}
      <div className="ipp-main-content">
        {/* Left Sidebar - About Me */}
        <aside className="ipp-sidebar">
          <div className="ipp-about">
            <h2 className="ipp-sidebar-title">About Me</h2>
            {profileData.bio && (
              <div className="ipp-section">
                <p className="ipp-bio">{profileData.bio}</p>
              </div>
            )}

            {profileData.expertise && profileData.expertise.length > 0 && (
              <div className="ipp-section">
                <h3 className="ipp-section-subtitle">Expertise</h3>
                <div className="ipp-expertise-tags">
                  {profileData.expertise.map((exp, index) => (
                    <span key={index} className="ipp-expertise-tag">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profileData.experience && (
              <div className="ipp-section">
                <h3 className="ipp-section-subtitle">Experience</h3>
                <p className="ipp-experience">{profileData.experience}</p>
              </div>
            )}
          </div>
        </aside>

        {/* Right Content - Courses & Reviews */}
        <div className="ipp-right-content">
          {/* Tabs for Courses and Reviews */}
          <div className="ipp-tabs">
            <button
              className={`ipp-tab ${activeTab === "courses" ? "active" : ""}`}
              onClick={() => setActiveTab("courses")}
            >
              Courses
            </button>
            <button
              className={`ipp-tab ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </div>

          {/* Tab Content */}
          <div className="ipp-tab-content">
            {activeTab === "courses" && (
              <div className="ipp-courses">
                <h2 className="ipp-courses-title">
                  {fullName}'s Courses
                </h2>
                <p className="ipp-courses-count">({courses.length.toLocaleString()})</p>
                <div className="ipp-courses-grid">
                  {courses.map((course) => (
                    <div 
                      key={course._id} 
                      className="ipp-course-card"
                      onClick={() => navigate(`/course/${course._id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="ipp-course-image">
                        <img src={course.thumbnail || "/images/default-course.png"} alt={course.title} />
                        <span className="ipp-course-category">
                          {course.category?.name || 'General'}
                        </span>
                      </div>
                      <div className="ipp-course-content">
                        <h3 className="ipp-course-title">{course.title}</h3>
                        <div className="ipp-course-meta">
                          <div className="ipp-course-rating">
                            <FaStar /> {course.averageRating ? course.averageRating.toFixed(1) : '0.0'}
                          </div>
                          <div className="ipp-course-students">
                            <FaUserFriends style={{ fontSize: '14px' }} /> 
                            {course.enrollmentCount ? course.enrollmentCount.toLocaleString() : '0'} students
                          </div>
                        </div>
                        <div className="ipp-course-price">
                          {course.price ? course.price.toLocaleString('vi-VN') : '0'} VND
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {courses.length === 0 && (
                  <div className="ipp-empty">
                  <p>No courses available yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="ipp-reviews">
              <h2>Student Feedback</h2>
              <div className="ipp-empty">
                <p>Reviews will be displayed here.</p>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfilePublic;