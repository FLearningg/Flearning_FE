import React from 'react';
import {
  Form, Input, Button, Checkbox, Typography, Row, Col, message as antdMessage,
} from 'antd';
import { MailOutlined, LockOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;
const F_LEARNING_ORANGE = '#FF6B00';
const ILLUSTRATION_BACKGROUND_COLOR = '#F5F3F9';
const illustrationSvgUrl = 'https://www.sauravsharan.com/_next/static/media/heroImage.039334ed.svg';

function SignUpPage() {
  const [messageApi, contextHolder] = antdMessage.useMessage();
  const navigate = useNavigate();
  const { register } = useAuth();

  const onFinish = async (values) => {
    try {
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      };
      await register(userData);
      navigate('/registration-success');
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      messageApi.error(error.response?.data?.message || 'Đăng ký thất bại.');
    }
  };

  return (
    <>
      {contextHolder}
      <Row style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
        <Col xs={0} md={10} lg={12} style={{
          backgroundColor: ILLUSTRATION_BACKGROUND_COLOR, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px',
        }}>
          <img src={illustrationSvgUrl} alt="Illustration" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </Col>
        <Col xs={24} md={14} lg={12} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 60px',
        }}>
          <div style={{ width: '100%', maxWidth: '480px' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>Create your account</Title>
            <Form name="signup_form" onFinish={onFinish} layout="vertical" size="large">
              <Text style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#595959' }}>Full Name</Text>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="firstName" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                    <Input placeholder="First name..." />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="lastName" rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}>
                    <Input placeholder="Last name" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập Email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}>
                <Input prefix={<MailOutlined style={{ color: '#BFBFBF' }} />} placeholder="Email address" />
              </Form.Item>
              <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]} hasFeedback>
                <Input.Password prefix={<LockOutlined style={{ color: '#BFBFBF' }} />} placeholder="Create password" />
              </Form.Item>
              <Form.Item name="confirmPassword" label="Confirm Password" dependencies={['password']} hasFeedback rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                  },
                }),
              ]}>
                <Input.Password prefix={<LockOutlined style={{ color: '#BFBFBF' }} />} placeholder="Confirm password" />
              </Form.Item>
              <Form.Item name="agreeTerms" valuePropName="checked" rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Bạn phải đồng ý với điều khoản!')),
                },
              ]}>
                <Checkbox>
                  I Agree with all of your{' '}
                  <Link to="/terms" style={{ color: F_LEARNING_ORANGE, fontWeight: 500 }}>Terms & Conditions</Link>
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block style={{
                  backgroundColor: F_LEARNING_ORANGE, borderColor: F_LEARNING_ORANGE, height: '48px', fontSize: '16px', fontWeight: 'bold',
                }} icon={<ArrowRightOutlined />} iconPosition="end">Create Account</Button>
              </Form.Item>
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">Already have an account? </Text>
                <Link to="/login" style={{ color: F_LEARNING_ORANGE, fontWeight: 'bold' }}>Sign In</Link>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default SignUpPage;
