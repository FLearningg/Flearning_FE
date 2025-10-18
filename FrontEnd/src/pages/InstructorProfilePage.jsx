import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Card,
  Col,
  Row,
  Typography,
  Tag,
  Divider,
  Spin,
  Space,
  Button,
  Tabs,
  Rate,
  message,
} from "antd";
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  StarOutlined,
  GlobalOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./InstructorProfilePage.css";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const InstructorProfilePage = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchInstructorProfile();
  }, [userId]);

  const fetchInstructorProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/instructor/public/${userId}`
      );
      
      if (response.data.success) {
        setProfileData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching instructor profile:", error);
      message.error("Failed to load instructor profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="instructor-profile-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="instructor-profile-error">
        <Title level={3}>Instructor not found</Title>
      </div>
    );
  }

  const { user, profile, statistics, courses } = profileData;

  return (
    <div className="instructor-profile-page">
      {/* Header Section */}
      <div className="instructor-profile-header">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} sm={6} md={4}>
            <Avatar
              size={120}
              src={user.avatar}
              icon={<UserOutlined />}
              className="instructor-avatar"
            />
          </Col>
          <Col xs={24} sm={18} md={20}>
            <Title level={2} className="instructor-name">
              {user.firstName} {user.lastName}
            </Title>
            {profile.headline && (
              <Text className="instructor-headline">{profile.headline}</Text>
            )}
            <div className="instructor-stats">
              <Space size="large">
                <div className="stat-item">
                  <BookOutlined className="stat-icon" />
                  <Text strong>{statistics.totalCourses}</Text>
                  <Text type="secondary"> Courses</Text>
                </div>
                <div className="stat-item">
                  <TeamOutlined className="stat-icon" />
                  <Text strong>{statistics.totalStudents}</Text>
                  <Text type="secondary"> Students</Text>
                </div>
                <div className="stat-item">
                  <StarOutlined className="stat-icon" />
                  <Text strong>{statistics.averageRating.toFixed(1)}</Text>
                  <Text type="secondary"> Rating</Text>
                </div>
              </Space>
            </div>
            {/* Social Links */}
            {profile.socialLinks && (
              <div className="instructor-social-links">
                <Space>
                  {profile.website && (
                    <Button
                      type="link"
                      icon={<GlobalOutlined />}
                      href={profile.website}
                      target="_blank"
                    />
                  )}
                  {profile.socialLinks.linkedin && (
                    <Button
                      type="link"
                      icon={<LinkedinOutlined />}
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                    />
                  )}
                  {profile.socialLinks.twitter && (
                    <Button
                      type="link"
                      icon={<TwitterOutlined />}
                      href={profile.socialLinks.twitter}
                      target="_blank"
                    />
                  )}
                  {profile.socialLinks.youtube && (
                    <Button
                      type="link"
                      icon={<YoutubeOutlined />}
                      href={profile.socialLinks.youtube}
                      target="_blank"
                    />
                  )}
                  {profile.socialLinks.facebook && (
                    <Button
                      type="link"
                      icon={<FacebookOutlined />}
                      href={profile.socialLinks.facebook}
                      target="_blank"
                    />
                  )}
                </Space>
              </div>
            )}
          </Col>
        </Row>
      </div>

      <Divider />

      {/* Tabs Section */}
      <Tabs defaultActiveKey="about" className="instructor-tabs">
        <TabPane tab="About" key="about">
          <Card>
            <Title level={4}>About Me</Title>
            <Paragraph>
              {profile.bio || "No biography available yet."}
            </Paragraph>

            <Divider />

            <Title level={4}>Expertise</Title>
            <div className="expertise-tags">
              {profile.expertise && profile.expertise.length > 0 ? (
                profile.expertise.map((skill, index) => (
                  <Tag key={index} color="blue" className="expertise-tag">
                    {skill}
                  </Tag>
                ))
              ) : (
                <Text type="secondary">No expertise listed</Text>
              )}
            </div>

            <Divider />

            <Title level={4}>Experience</Title>
            <Paragraph>
              {profile.experience || "No experience information available."}
            </Paragraph>
          </Card>
        </TabPane>

        <TabPane tab={`Courses (${courses.length})`} key="courses">
          <Row gutter={[16, 16]}>
            {courses && courses.length > 0 ? (
              courses.map((course) => (
                <Col xs={24} sm={12} md={8} key={course._id}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={course.title}
                        src={course.thumbnail}
                        style={{ height: 180, objectFit: "cover" }}
                      />
                    }
                    onClick={() => (window.location.href = `/courses/${course._id}`)}
                  >
                    <Card.Meta
                      title={course.title}
                      description={
                        <div>
                          <div className="course-rating">
                            <Rate
                              disabled
                              defaultValue={course.rating}
                              style={{ fontSize: 14 }}
                            />
                            <Text type="secondary" style={{ marginLeft: 8 }}>
                              ({course.rating.toFixed(1)})
                            </Text>
                          </div>
                          <div className="course-price">
                            <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
                              ${course.price}
                            </Text>
                          </div>
                          <div className="course-students">
                            <TeamOutlined />
                            <Text type="secondary" style={{ marginLeft: 8 }}>
                              {course.totalStudents} students
                            </Text>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24}>
                <Card>
                  <Text type="secondary">No courses available yet.</Text>
                </Card>
              </Col>
            )}
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default InstructorProfilePage;
