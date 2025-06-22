import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Typography, Row, Col, Divider, Space, Spin } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, googleLogin } from '../../store/authSlice';
import { GoogleLogin } from '@react-oauth/google';
import { resendVerificationLink } from '../../services/api/authService';

const { Title, Text } = Typography;
const F_LEARNING_ORANGE = '#FF6B00';
const ILLUSTRATION_BACKGROUND_COLOR = '#F5F3F9';
const illustrationLoginSvgUrl = 'https://user-images.githubusercontent.com/49222186/110210369-58458c80-7eb7-11eb-9d6e-2129358b3098.png';

function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, isAuthenticated } = useSelector((state) => state.auth);
    const [unverifiedEmail, setUnverifiedEmail] = useState(null);

    // --- State mới để quản lý tất cả các thông báo API ---
    const [apiAlert, setApiAlert] = useState({ show: false, type: '', message: '' });

    // State cho countdown
    const [countdown, setCountdown] = useState(0);
    const [isResendCooldown, setIsResendCooldown] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            // Nếu đã đăng nhập, chuyển về trang chủ
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        let timer;
        if (isResendCooldown && countdown > 0) {
            timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
        } else if (countdown === 0) {
            setIsResendCooldown(false);
        }
        return () => clearInterval(timer);
    }, [isResendCooldown, countdown]);

    const handleResendLink = async () => {
        if (isResendCooldown || !unverifiedEmail) return;
        setIsResendCooldown(true); // Vô hiệu hóa nút ngay lập tức
        try {
            const response = await resendVerificationLink(unverifiedEmail);
            // Hiển thị thông báo thành công bằng Bootstrap Alert
            setApiAlert({ show: true, type: 'success', message: response.data.message });
            setCountdown(60);
        } catch (error) {
            setApiAlert({ show: true, type: 'danger', message: error.response?.data?.message || 'Gửi lại link thất bại.' });
            setIsResendCooldown(false); // Bật lại nút nếu có lỗi
        }
    };
    
    const onFinish = (values) => {
        setUnverifiedEmail(null); 
        setApiAlert({ show: false }); // Ẩn thông báo cũ khi submit
        
        const credentials = { email: values.email, password: values.password };
        dispatch(loginUser(credentials))
            .unwrap()
            .then(() => {
                // Có thể hiển thị thông báo thành công ở trang chủ nếu muốn
                navigate('/');
            })
            .catch((error) => {
                if (error.errorCode === 'ACCOUNT_NOT_VERIFIED') {
                    setUnverifiedEmail(values.email);
                } else {
                    // Hiển thị lỗi sai mật khẩu bằng Bootstrap Alert
                    setApiAlert({ show: true, type: 'danger', message: error.message || 'Email hoặc mật khẩu không đúng.' });
                }
            });
    };

    const handleGoogleSuccess = (credentialResponse) => {
        dispatch(googleLogin(credentialResponse.credential))
            .unwrap()
            .then(() => navigate('/'))
            .catch((error) => {
                setApiAlert({ show: true, type: 'danger', message: error.message || 'Đăng nhập Google thất bại.' });
            });
    };

    if (isAuthenticated) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
    }

    return (
        <Row style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
            <Col xs={0} md={10} lg={12} style={{ backgroundColor: ILLUSTRATION_BACKGROUND_COLOR, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', overflow: 'hidden' }}>
                <img src={illustrationLoginSvgUrl} alt="Login Illustration" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </Col>
            <Col xs={24} md={14} lg={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 60px' }}>
                <div style={{ width: '100%', maxWidth: '450px' }}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>Sign in to your account</Title>
                    
                    {/* --- KHU VỰC HIỂN THỊ ALERT CỦA BOOTSTRAP --- */}

                    {/* Alert cho lỗi chưa xác thực */}
                    {unverifiedEmail && (
                        <div className="alert alert-warning alert-dismissible fade show" role="alert" style={{ marginBottom: '24px' }}>
                            <h5 className="alert-heading">Tài khoản chưa được xác thực</h5>
                            <p className="mb-0">
                                Vui lòng kiểm tra email hoặc nhấn vào nút 
                                <button className="btn btn-link p-0 ms-1" onClick={handleResendLink} disabled={isResendCooldown}>
                                    {isResendCooldown ? `Gửi lại sau (${countdown}s)` : 'Gửi lại link'}
                                </button>
                                để xác thực.
                            </p>
                            <button type="button" className="btn-close" onClick={() => setUnverifiedEmail(null)} aria-label="Close"></button>
                        </div>
                    )}

                    {/* Alert cho các thông báo API khác (sai mật khẩu, gửi link thành công...) */}
                    {apiAlert.show && (
                        <div className={`alert alert-${apiAlert.type} alert-dismissible fade show`} role="alert" style={{ marginBottom: '24px' }}>
                            {apiAlert.message}
                            <button type="button" className="btn-close" onClick={() => setApiAlert({ show: false })} aria-label="Close"></button>
                        </div>
                    )}

                    {/* --- KẾT THÚC KHU VỰC ALERT --- */}

                    <Form name="login_form" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical" size="large">
                        <Form.Item name="email" label={<Text style={{fontWeight: 500, color: '#595959' }}>Email</Text>} rules={[{ required: true, message: 'Vui lòng nhập email!' }, {type: 'email', message: 'Email không hợp lệ!'}]} style={{ marginBottom: '16px' }}>
                            <Input prefix={<UserOutlined style={{color: '#BFBFBF'}}/>} placeholder="Email address..." />
                        </Form.Item>
                        <Form.Item name="password" label={<Text style={{fontWeight: 500, color: '#595959' }}>Password</Text>} rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]} style={{ marginBottom: '16px' }}>
                            <Input.Password prefix={<LockOutlined style={{color: '#BFBFBF'}}/>} placeholder="Password" />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: '24px' }}>
                            <Form.Item name="remember" valuePropName="checked" noStyle><Checkbox>Remember me</Checkbox></Form.Item>
                            <Link to="/forgot-password" style={{ float: 'right', color: F_LEARNING_ORANGE }}>
                                Forgot password?
                            </Link>
                        </Form.Item>
                        <Form.Item style={{ marginBottom: '24px' }}>
                            <Button type="primary" htmlType="submit" block loading={isLoading} style={{ backgroundColor: F_LEARNING_ORANGE, borderColor: F_LEARNING_ORANGE, height: '48px', fontSize: '16px', fontWeight: 'bold' }} icon={<ArrowRightOutlined />} iconPosition="end">
                                Sign In
                            </Button>
                        </Form.Item>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <Text type="secondary">Don't have an account? </Text>
                            <Link to="/signup" style={{color: F_LEARNING_ORANGE, fontWeight: 'bold'}}>Create Account</Link>
                        </div>
                        <Divider plain><Text type="secondary" style={{fontSize: '12px', color: '#8c8c8c', fontWeight: 500}}>SIGN IN WITH</Text></Divider>
                        <Space direction="vertical" style={{ width: '100%', alignItems: 'center' }} size="middle">
                            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setApiAlert({ show: true, type: 'danger', message: 'Đăng nhập Google thất bại.' })} theme="outline" shape="rectangular" size="large" />
                        </Space>
                    </Form>
                </div>
            </Col>
        </Row>
    );
}

export default LoginPage;