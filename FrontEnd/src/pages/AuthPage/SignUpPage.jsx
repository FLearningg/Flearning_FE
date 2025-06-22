import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Typography, Row, Col, Divider, Space, Spin } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/authSlice';

const { Title, Text } = Typography;
const F_LEARNING_ORANGE = '#FF6B00';
const ILLUSTRATION_BACKGROUND_COLOR = '#F5F3F9';
const illustrationSvgUrl = 'https://www.sauravsharan.com/_next/static/media/heroImage.039334ed.svg';

function SignUpPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, isAuthenticated } = useSelector((state) => state.auth);
    // State mới để quản lý thông báo lỗi
    const [apiError, setApiError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            // Nếu đã đăng nhập, chuyển về trang chủ
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const onFinish = (values) => {
        setApiError(''); // Xóa lỗi cũ khi submit lại
        
        const userData = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
        };

        dispatch(registerUser(userData))
            .unwrap()
            .then((response) => {
                navigate('/registration-success');
            })
            .catch((error) => {
                // Thay vì gọi message.error, chúng ta set state cho alert
                setApiError(error.message || 'Đăng ký thất bại, vui lòng thử lại.');
            });
    };

    if (isAuthenticated) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
    }

    return (
        <Row style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
            <Col xs={0} md={10} lg={12} style={{ backgroundColor: ILLUSTRATION_BACKGROUND_COLOR, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', overflow: 'hidden' }}>
                <img src={illustrationSvgUrl} alt="Illustration" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </Col>
            <Col xs={24} md={14} lg={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 60px' }}>
                <div style={{ width: '100%', maxWidth: '480px' }}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
                        Create your account
                    </Title>
                    
                    {/* --- KHU VỰC HIỂN THỊ ALERT LỖI CỦA BOOTSTRAP --- */}
                    {apiError && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ marginBottom: '24px' }}>
                            {apiError}
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => setApiError('')} 
                                aria-label="Close"
                            ></button>
                        </div>
                    )}
                    {/* --- KẾT THÚC KHU VỰC ALERT --- */}

                    <Form name="signup_form" onFinish={onFinish} layout="vertical" size="large" scrollToFirstError>
                        <Text style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#595959' }}>Full Name</Text>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item name="firstName" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]} style={{ marginBottom: '16px' }}>
                                    <Input placeholder="First name..." />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item name="lastName" rules={[{ required: true, message: 'Vui lòng nhập họ!' }]} style={{ marginBottom: '16px' }}>
                                    <Input placeholder="Last name" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="email" label={<Text style={{fontWeight: 500, color: '#595959' }}>Email</Text>} rules={[{ required: true, message: 'Vui lòng nhập Email!' }, { type: 'email', message: 'Email không đúng định dạng!' }]} style={{ marginBottom: '16px' }}>
                            <Input prefix={<MailOutlined style={{color: '#BFBFBF'}}/>} placeholder="Email address" />
                        </Form.Item>
                        <Form.Item name="password" label={<Text style={{fontWeight: 500, color: '#595959' }}>Password</Text>} rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!', min: 6 }]} hasFeedback style={{ marginBottom: '16px' }}>
                            <Input.Password prefix={<LockOutlined style={{color: '#BFBFBF'}}/>} placeholder="Create password (min 6 characters)" />
                        </Form.Item>
                        <Form.Item name="confirmPassword" label={<Text style={{fontWeight: 500, color: '#595959' }}>Confirm Password</Text>} dependencies={['password']} hasFeedback rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject(new Error('Hai mật khẩu không khớp!')); }, })]}>
                            <Input.Password prefix={<LockOutlined style={{color: '#BFBFBF'}}/>} placeholder="Confirm password" />
                        </Form.Item>
                        <Form.Item name="agreeTerms" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Bạn phải đồng ý với điều khoản!')) }]} style={{ marginBottom: '24px' }}>
                            <Checkbox>I Agree with all of your <Link to="/terms" style={{color: F_LEARNING_ORANGE, fontWeight: 500}}>Terms & Conditions</Link></Checkbox>
                        </Form.Item>
                        <Form.Item style={{ marginBottom: '24px' }}>
                            <Button type="primary" htmlType="submit" block loading={isLoading} style={{ backgroundColor: F_LEARNING_ORANGE, borderColor: F_LEARNING_ORANGE, height: '48px', fontSize: '16px', fontWeight: 'bold' }} icon={<ArrowRightOutlined />} iconPosition="end">
                                Create Account
                            </Button>
                        </Form.Item>
                        <div style={{ textAlign: 'center' }}>
                            <Text type="secondary">Already have an account? </Text>
                            <Link to="/login" style={{color: F_LEARNING_ORANGE, fontWeight: 'bold'}}>Sign In</Link>
                        </div>
                    </Form>
                </div>
            </Col>
        </Row>
    );
    return (
        <Row style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
            <Col xs={0} md={10} lg={12} style={{ backgroundColor: ILLUSTRATION_BACKGROUND_COLOR, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', overflow: 'hidden' }}>
                <img src={illustrationSvgUrl} alt="Illustration" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </Col>
            <Col xs={24} md={14} lg={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 60px' }}>
                <div style={{ width: '100%', maxWidth: '480px' }}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
                        Create your account
                    </Title>
                    
                    {/* --- KHU VỰC HIỂN THỊ ALERT LỖI CỦA BOOTSTRAP --- */}
                    {apiError && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ marginBottom: '24px' }}>
                            {apiError}
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => setApiError('')} 
                                aria-label="Close"
                            ></button>
                        </div>
                    )}
                    {/* --- KẾT THÚC KHU VỰC ALERT --- */}

                    <Form name="signup_form" onFinish={onFinish} layout="vertical" size="large" scrollToFirstError>
                        <Text style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#595959' }}>Full Name</Text>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item name="firstName" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]} style={{ marginBottom: '16px' }}>
                                    <Input placeholder="First name..." />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item name="lastName" rules={[{ required: true, message: 'Vui lòng nhập họ!' }]} style={{ marginBottom: '16px' }}>
                                    <Input placeholder="Last name" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="email" label={<Text style={{fontWeight: 500, color: '#595959' }}>Email</Text>} rules={[{ required: true, message: 'Vui lòng nhập Email!' }, { type: 'email', message: 'Email không đúng định dạng!' }]} style={{ marginBottom: '16px' }}>
                            <Input prefix={<MailOutlined style={{color: '#BFBFBF'}}/>} placeholder="Email address" />
                        </Form.Item>
                        <Form.Item name="password" label={<Text style={{fontWeight: 500, color: '#595959' }}>Password</Text>} rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!', min: 6 }]} hasFeedback style={{ marginBottom: '16px' }}>
                            <Input.Password prefix={<LockOutlined style={{color: '#BFBFBF'}}/>} placeholder="Create password (min 6 characters)" />
                        </Form.Item>
                        <Form.Item name="confirmPassword" label={<Text style={{fontWeight: 500, color: '#595959' }}>Confirm Password</Text>} dependencies={['password']} hasFeedback rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject(new Error('Hai mật khẩu không khớp!')); }, })]}>
                            <Input.Password prefix={<LockOutlined style={{color: '#BFBFBF'}}/>} placeholder="Confirm password" />
                        </Form.Item>
                        <Form.Item name="agreeTerms" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Bạn phải đồng ý với điều khoản!')) }]} style={{ marginBottom: '24px' }}>
                            <Checkbox>I Agree with all of your <Link to="/terms" style={{color: F_LEARNING_ORANGE, fontWeight: 500}}>Terms & Conditions</Link></Checkbox>
                        </Form.Item>
                        <Form.Item style={{ marginBottom: '24px' }}>
                            <Button type="primary" htmlType="submit" block loading={isLoading} style={{ backgroundColor: F_LEARNING_ORANGE, borderColor: F_LEARNING_ORANGE, height: '48px', fontSize: '16px', fontWeight: 'bold' }} icon={<ArrowRightOutlined />} iconPosition="end">
                                Create Account
                            </Button>
                        </Form.Item>
                        <div style={{ textAlign: 'center' }}>
                            <Text type="secondary">Already have an account? </Text>
                            <Link to="/login" style={{color: F_LEARNING_ORANGE, fontWeight: 'bold'}}>Sign In</Link>
                        </div>
                    </Form>
                </div>
            </Col>
        </Row>
    );
}

export default SignUpPage;