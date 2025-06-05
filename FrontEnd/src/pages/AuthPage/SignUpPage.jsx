import React from 'react';
import { Form, Input, Button, Checkbox, Typography, Row, Col, Divider, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined, FacebookFilled, AppleFilled, ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const F_LEARNING_ORANGE = '#FF6B00';
const ILLUSTRATION_BACKGROUND_COLOR = '#F5F3F9';

const illustrationSvgUrl = 'https://www.sauravsharan.com/_next/static/media/heroImage.039334ed.svg';

function SignUpPage() {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    alert('Sign Up Successful (demo)! Please login.');
    navigate('/login');
  };

  return (
    <Row style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Cột hình ảnh minh họa SVG */}
      <Col 
        xs={0} 
        md={10} 
        lg={12}
        style={{ 
          backgroundColor: ILLUSTRATION_BACKGROUND_COLOR,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          overflow: 'hidden'
        }}
      >
        <img 
          src={illustrationSvgUrl} 
          alt="[Hình ảnh minh họa đăng ký]"
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%',
            objectFit: 'contain' 
          }} 
        />
      </Col>

      {/* Cột Form */}
      <Col 
        xs={24} 
        md={14} 
        lg={12}
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', // Căn giữa form theo chiều ngang
          justifyContent: 'center', 
          padding: '40px 60px' // Tăng padding cho cột form
        }}
      >
        <div 
          style={{ 
            width: '100%', // Form chiếm toàn bộ chiều rộng của padding container
            maxWidth: '480px', // Giữ lại maxWidth để form không quá rộng trên màn hình lớn
          }}
        >
          <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' /* Tăng khoảng cách dưới tiêu đề */ }}>
            Create your account
          </Title>
          <Form
            name="signup_form"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Text style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#595959' }}>Full Name</Text>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="firstName"
                  rules={[{ required: true, message: 'Please input your first name!' }]}
                  style={{ marginBottom: '16px' }}
                >
                  <Input placeholder="First name..." />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="lastName"
                  rules={[{ required: true, message: 'Please input your last name!' }]}
                  style={{ marginBottom: '16px' }}
                >
                  <Input placeholder="Last name" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="username"
              label={<Text style={{fontWeight: 500, color: '#595959' }}>Username</Text>}
              rules={[{ required: true, message: 'Please input your Username!' }]}
              style={{ marginBottom: '16px' }}
            >
              <Input prefix={<UserOutlined style={{color: '#BFBFBF'}}/>} placeholder="Username..." />
            </Form.Item>

            <Form.Item
              name="email"
              label={<Text style={{fontWeight: 500, color: '#595959' }}>Email</Text>}
              rules={[
                { required: true, message: 'Please input your Email!' },
                { type: 'email', message: 'The input is not valid E-mail!' }
              ]}
              style={{ marginBottom: '16px' }}
            >
              <Input prefix={<MailOutlined style={{color: '#BFBFBF'}}/>} placeholder="Email address" />
            </Form.Item>

            <Form.Item
              name="password"
              label={<Text style={{fontWeight: 500, color: '#595959' }}>Password</Text>}
              rules={[{ required: true, message: 'Please input your Password!' }]}
              hasFeedback
              style={{ marginBottom: '16px' }}
            >
              <Input.Password prefix={<LockOutlined style={{color: '#BFBFBF'}}/>} placeholder="Create password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<Text style={{fontWeight: 500, color: '#595959' }}>Confirm Password</Text>}
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
              style={{ marginBottom: '20px' }}
            >
              <Input.Password prefix={<LockOutlined style={{color: '#BFBFBF'}}/>} placeholder="Confirm password" />
            </Form.Item>

            <Form.Item 
              name="agreeTerms" 
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('You must accept the terms and conditions')),
                },
              ]}
              style={{ marginBottom: '24px' }}
            >
              <Checkbox>
                I Agree with all of your <Link to="/terms" style={{color: F_LEARNING_ORANGE, fontWeight: 500}}>Terms & Conditions</Link>
              </Checkbox>
            </Form.Item>

            <Form.Item style={{ marginBottom: '24px' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                style={{ backgroundColor: F_LEARNING_ORANGE, borderColor: F_LEARNING_ORANGE, height: '48px', fontSize: '16px', fontWeight: 'bold' }}
                icon={<ArrowRightOutlined />}
                iconPosition="end"
              >
                Create Account
              </Button>
            </Form.Item>

            <Divider plain><Text type="secondary" style={{fontSize: '12px', color: '#8c8c8c', fontWeight: 500}}>SIGN UP WITH</Text></Divider>

            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Button block icon={<GoogleOutlined />} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px', fontSize: '16px', borderColor: '#D9D9D9', color: '#595959' }}>
                Google
              </Button>
              <Button block icon={<FacebookFilled />} style={{ backgroundColor: '#1877F2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px', fontSize: '16px', borderColor: '#1877F2' }}>
                Facebook
              </Button>
              <Button block icon={<AppleFilled />} style={{ backgroundColor: '#000000', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px', fontSize: '16px', borderColor: '#000000' }}>
                Apple
              </Button>
            </Space>
          </Form>
        </div>
      </Col>
    </Row>
  );
}

export default SignUpPage;
