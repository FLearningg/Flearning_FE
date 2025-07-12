import React, { useState } from "react";
import { Form, Input, Button, Typography, Row, Col } from "antd";
import { LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../../services/authService";

const F_LEARNING_ORANGE = "#FF6B00";
const { Title, Paragraph } = Typography;
const ILLUSTRATION_BACKGROUND_COLOR = "#F5F3F9";
const illustrationUrl =
  "https://user-images.githubusercontent.com/49222186/110210369-58458c80-7eb7-11eb-9d6e-2129358b3098.png";

function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await resetPassword(token, values.newPassword);
      toast.success(
        response.data.message || "Password has been reset successfully!"
      );
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <Col
        xs={0}
        md={10}
        lg={12}
        style={{
          backgroundColor: ILLUSTRATION_BACKGROUND_COLOR,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        <img
          src={illustrationUrl}
          alt="Reset Password Illustration"
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      </Col>
      <Col
        xs={24}
        md={14}
        lg={12}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 60px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "450px" }}>
          <Title level={2} style={{ textAlign: "center" }}>
            Set New Password
          </Title>
          <Paragraph
            type="secondary"
            style={{
              display: "block",
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            Your new password must be different from previously used passwords.
          </Paragraph>
          <Form
            name="reset_password"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                {
                  required: true,
                  message: "Please enter your new password!",
                  min: 6,
                },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter new password"
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={["newPassword"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value)
                      return Promise.resolve();
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm new password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{
                  backgroundColor: F_LEARNING_ORANGE,
                  borderColor: F_LEARNING_ORANGE,
                  height: "48px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Reset Password
              </Button>
            </Form.Item>
            <div style={{ textAlign: "center" }}>
              <Link to="/login">
                <ArrowLeftOutlined /> Back to Sign In
              </Link>
            </div>
          </Form>
        </div>
      </Col>
    </Row>
  );
}

export default ResetPasswordPage;
