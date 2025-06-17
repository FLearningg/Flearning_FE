import React, { useCallback } from 'react';
import {
  Form, Input, Button, Checkbox, Typography, Row, Col, Divider, Space, message as antdMessage,
} from 'antd';
import { UserOutlined, LockOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';

const { Title, Text } = Typography;
const F_LEARNING_ORANGE = '#FF6B00';
const ILLUSTRATION_BACKGROUND_COLOR = '#F5F3F9';
const illustrationLoginSvgUrl = 'https://user-images.githubusercontent.com/49222186/110210369-58458c80-7eb7-11eb-9d6e-2129358b3098.png';

function LoginPage() {
  const [messageApi, contextHolder] = antdMessage.useMessage();
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const onFinish = async (values) => {
    try {
      await login({ email: values.email, password: values.password });
      messageApi.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      messageApi.error(error.response?.data?.message || 'Email hoặc mật khẩu không đúng.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      messageApi.success('Đăng nhập với Google thành công!');
      navigate('/');
    } catch (error) {
      console.error('Lỗi đăng nhập Google:', error);
      messageApi.error(error.response?.data?.message || 'Đăng nhập Google thất bại.');
    }
  };

  const handleGoogleError = useCallback(() => {
    setTimeout(() => {
      messageApi.error("Đăng nhập Google thất bại.");
    }, 0);
  }, [messageApi]);

  return (
    <>
      {contextHolder}
      <Row style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
        <Col xs={0} md={10} lg={12} style={{
          backgroundColor: ILLUSTRATION_BACKGROUND_COLOR, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px',
        }}>
          <img src={illustrationLoginSvgUrl} alt="Login Illustration" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </Col>
        <Col xs={24} md={14} lg={12} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 60px',
        }}>
          <div style={{ width: '100%', maxWidth: '450px' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>Sign in to your account</Title>
            <Form name="login_form" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical" size="large">
              <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}>
                <Input prefix={<UserOutlined style={{ color: '#BFBFBF' }} />} placeholder="Email address..." />
              </Form.Item>
              <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                <Input.Password prefix={<LockOutlined style={{ color: '#BFBFBF' }} />} placeholder="Password" />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block style={{
                  backgroundColor: F_LEARNING_ORANGE, borderColor: F_LEARNING_ORANGE, height: '48px', fontSize: '16px', fontWeight: 'bold',
                }} icon={<ArrowRightOutlined />} iconPosition="end">Sign In</Button>
              </Form.Item>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Text type="secondary">Don't have an account? </Text>
                <Link to="/signup" style={{ color: F_LEARNING_ORANGE, fontWeight: 'bold' }}>Create Account</Link>
              </div>
              <Divider plain>
                <Text type="secondary" style={{ fontSize: '12px', color: '#8c8c8c', fontWeight: 500 }}>SIGN IN WITH</Text>
              </Divider>
              <Space direction="vertical" style={{ width: '100%', alignItems: 'center' }} size="middle">
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} theme="outline" shape="rectangular" size="large" />
              </Space>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default LoginPage;
