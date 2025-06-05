import React from 'react';
import { Form, Input, Button, Checkbox, Typography, Row, Col, Divider, Space } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookFilled, AppleFilled, ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const F_LEARNING_ORANGE = '#FF6B00';
const ILLUSTRATION_BACKGROUND_COLOR = '#F5F3F9'; // Màu nền tím nhạt cho cột hình ảnh

// URL của hình ảnh SVG bạn cung cấp cho trang Login
const illustrationLoginSvgUrl = 'https://user-images.githubusercontent.com/49222186/110210369-58458c80-7eb7-11eb-9d6e-2129358b3098.png';

function LoginPage() {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    alert('Login Successful (demo)!');
    // navigate('/dashboard'); 
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
          src={illustrationLoginSvgUrl} 
          alt="[Hình ảnh minh họa đăng nhập]"
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
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '40px 60px' 
        }}
      >
        {/* Form hòa vào nền, không còn card trắng */}
        <div 
          style={{ 
            width: '100%', 
            maxWidth: '450px', // Giữ lại maxWidth để form không quá rộng
          }}
        >
          <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
            Sign in to your account
          </Title>
          {/* Đoạn text "Welcome back! Please enter your details." có thể thêm ở đây nếu muốn */}
          {/* <Text type="secondary" style={{ textAlign: 'center', display: 'block', marginBottom: '30px' }}>
            Welcome back! Please enter your details.
          </Text> */}
          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="emailOrUsername"
              label={<Text style={{fontWeight: 500, color: '#595959' }}>Email</Text>} // Label là "Email" theo Figma
              rules={[{ required: true, message: 'Please input your Username or Email!' }]}
              style={{ marginBottom: '16px' }}
            >
              <Input prefix={<UserOutlined style={{color: '#BFBFBF'}}/>} placeholder="Username or email address..." />
            </Form.Item>

            <Form.Item
              name="password"
              label={<Text style={{fontWeight: 500, color: '#595959' }}>Password</Text>}
              rules={[{ required: true, message: 'Please input your Password!' }]}
              style={{ marginBottom: '16px' }}
            >
              <Input.Password prefix={<LockOutlined style={{color: '#BFBFBF'}}/>} placeholder="Password" />
            </Form.Item>

            <Form.Item style={{ marginBottom: '24px' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              {/* Link "Forgot password?" có thể thêm ở đây nếu cần */}
              {/* <Link to="/forgot-password" style={{ float: 'right', color: F_LEARNING_ORANGE }}>
                Forgot password?
              </Link> */}
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
                Sign In
              </Button>
            </Form.Item>
            
            {/* Link "Don't have an account? Create Account" ở dưới form */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Text type="secondary">Don't have an account? </Text>
                <Link to="/signup" style={{color: F_LEARNING_ORANGE, fontWeight: 'bold'}}>Create Account</Link>
            </div>


            <Divider plain><Text type="secondary" style={{fontSize: '12px', color: '#8c8c8c', fontWeight: 500}}>SIGN IN WITH</Text></Divider>

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

export default LoginPage;
