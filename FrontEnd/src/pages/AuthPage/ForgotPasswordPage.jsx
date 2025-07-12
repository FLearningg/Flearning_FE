import React, { useState } from "react";
import { Form, Input, Button, Typography, Row, Col } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword } from "../../services/authService";

const F_LEARNING_ORANGE = "#FF6B00";
const { Title, Paragraph } = Typography;
const ILLUSTRATION_BACKGROUND_COLOR = "#F5F3F9";
const illustrationUrl =
  "https://user-images.githubusercontent.com/49222186/110210369-58458c80-7eb7-11eb-9d6e-2129358b3098.png"; // Reuse illustration

function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await forgotPassword(values.email);
      toast.success(response.data.message);
      setEmailSent(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const FormView = () => (
    <>
      <Title level={2} style={{ textAlign: "center", marginBottom: "12px" }}>
        Forgot Password?
      </Title>
      <Paragraph
        type="secondary"
        style={{ display: "block", textAlign: "center", marginBottom: "32px" }}
      >
        No worries, we'll send you reset instructions.
      </Paragraph>
      <Form
        name="forgot_password"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please enter a valid email!",
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Enter your email" />
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
            Send Reset Link
          </Button>
        </Form.Item>
        <div style={{ textAlign: "center" }}>
          <Link to="/login">
            <ArrowLeftOutlined /> Back to Sign In
          </Link>
        </div>
      </Form>
    </>
  );

  const SuccessView = () => (
    <div style={{ textAlign: "center" }}>
      <Title level={2}>Check your inbox</Title>
      <Paragraph>
        If an account with that email exists, we have sent password reset
        instructions to it. Please check your spam folder as well.
      </Paragraph>
      <Link to="/login">
        <Button type="primary" icon={<ArrowLeftOutlined />} size="large">
          Back to Sign In
        </Button>
      </Link>
    </div>
  );

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
          alt="Forgot Password Illustration"
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
          {emailSent ? <SuccessView /> : <FormView />}
        </div>
      </Col>
    </Row>
  );
}

export default ForgotPasswordPage;
