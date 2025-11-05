import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spin, Result, Button, Row, Col, Typography, Card } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, MailOutlined, ClockCircleOutlined, RocketOutlined } from '@ant-design/icons';
import { verifyInstructorApplication } from '../../services/authService';

const { Title, Paragraph, Text } = Typography;
const F_LEARNING_ORANGE = '#FF6B00';

const InstructorVerifyApplicationPage = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'

    // Ref để xử lý React.StrictMode, đảm bảo useEffect chỉ chạy logic 1 lần
    const effectRan = useRef(false);

    useEffect(() => {
        // Chỉ chạy logic nếu đây là lần render đầu tiên (hoặc token thay đổi)
        if (effectRan.current === false) {
            const doVerify = async () => {
                if (!token) {
                    setStatus('error');
                    return;
                }
                try {
                    // Gọi API để xác thực application
                    await verifyInstructorApplication(token);
                    setStatus('success');
                } catch (error) {
                    console.error("Lỗi xác thực application:", error);
                    setStatus('error');
                }
            };

            doVerify();
        }

        // Đánh dấu là effect đã chạy.
        return () => {
            effectRan.current = true;
        }
    }, [token]);

    // Hiển thị loading spinner
    if (status === 'loading') {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
                <Card style={{ textAlign: 'center', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <Spin size="large" />
                    <Title level={4} style={{ marginTop: '20px', color: '#595959' }}>
                        Verifying your application...
                    </Title>
                    <Text type="secondary">Please wait while we process your instructor application</Text>
                </Card>
            </div>
        );
    }

    // Hiển thị khi thành công
    if (status === 'success') {
        return (
            <Row justify="center" align="middle" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
                <Col xs={22} sm={20} md={16} lg={12} xl={10}>
                    <Card
                        style={{
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            background: `linear-gradient(135deg, ${F_LEARNING_ORANGE} 0%, #ff8534 100%)`,
                            padding: '40px',
                            textAlign: 'center'
                        }}>
                            <RocketOutlined style={{ fontSize: '72px', color: 'white' }} />
                            <Title level={2} style={{ color: 'white', marginTop: '20px', marginBottom: '10px' }}>
                                Application Verified!
                            </Title>
                            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                                Your application is now being reviewed by our AI system
                            </Text>
                        </div>

                        <div style={{ padding: '40px' }}>
                            <Title level={4} style={{ marginBottom: '20px', color: '#262626' }}>
                                What's Happening Now?
                            </Title>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px', marginRight: '12px', marginTop: '2px' }} />
                                    <div>
                                        <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                                            Application Verified
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: '14px' }}>
                                            Your application has been successfully verified
                                        </Text>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <RocketOutlined style={{ color: F_LEARNING_ORANGE, fontSize: '20px', marginRight: '12px', marginTop: '2px' }} />
                                    <div>
                                        <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                                            AI Review in Progress
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: '14px' }}>
                                            Our AI is automatically analyzing your application right now
                                        </Text>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <MailOutlined style={{ color: '#1890ff', fontSize: '20px', marginRight: '12px', marginTop: '2px' }} />
                                    <div>
                                        <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                                            Check Your Email
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: '14px' }}>
                                            You'll receive a notification email within minutes with the review result
                                        </Text>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                background: '#e6f7ff',
                                border: '1px solid #91d5ff',
                                borderRadius: '8px',
                                padding: '16px',
                                marginTop: '24px',
                                marginBottom: '24px'
                            }}>
                                <Text style={{ color: '#0050b3', fontSize: '14px' }}>
                                    <strong>💡 Quick Review:</strong> Our AI system typically completes the review within 1-2 minutes. 
                                    If approved, you'll be able to start teaching immediately!
                                </Text>
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                block
                                style={{
                                    backgroundColor: F_LEARNING_ORANGE,
                                    borderColor: F_LEARNING_ORANGE,
                                    height: '48px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    borderRadius: '8px'
                                }}
                            >
                                <Link to="/login" style={{ color: 'white' }}>
                                    Go to Login
                                </Link>
                            </Button>

                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <Link to="/" style={{ color: F_LEARNING_ORANGE }}>
                                    Back to Homepage
                                </Link>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        );
    }

    // Mặc định hiển thị khi thất bại
    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
            <Col xs={22} sm={20} md={16} lg={12} xl={10}>
                <Card
                    style={{
                        borderRadius: '16px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{
                        background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
                        padding: '40px',
                        textAlign: 'center'
                    }}>
                        <CloseCircleOutlined style={{ fontSize: '72px', color: 'white' }} />
                        <Title level={2} style={{ color: 'white', marginTop: '20px', marginBottom: '10px' }}>
                            Verification Failed
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                            We couldn't verify your application
                        </Text>
                    </div>

                    <div style={{ padding: '40px' }}>
                        <Paragraph style={{ fontSize: '15px', color: '#595959', marginBottom: '24px' }}>
                            The verification link is invalid or has expired. This could happen if:
                        </Paragraph>

                        <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
                            <li style={{ marginBottom: '8px', color: '#8c8c8c' }}>
                                The link has already been used
                            </li>
                            <li style={{ marginBottom: '8px', color: '#8c8c8c' }}>
                                The link has expired (valid for 24 hours)
                            </li>
                            <li style={{ marginBottom: '8px', color: '#8c8c8c' }}>
                                The link was copied incorrectly
                            </li>
                            <li style={{ marginBottom: '8px', color: '#8c8c8c' }}>
                                Your account email is not verified yet
                            </li>
                        </ul>

                        <Button
                            type="primary"
                            size="large"
                            block
                            style={{
                                backgroundColor: F_LEARNING_ORANGE,
                                borderColor: F_LEARNING_ORANGE,
                                height: '48px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                borderRadius: '8px',
                                marginBottom: '12px'
                            }}
                        >
                            <Link to="/login" style={{ color: 'white' }}>
                                Go to Login
                            </Link>
                        </Button>

                        <div style={{ textAlign: 'center', marginTop: '16px' }}>
                            <Text type="secondary">Need help? </Text>
                            <Link to="/contact" style={{ color: F_LEARNING_ORANGE, fontWeight: 'bold' }}>
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default InstructorVerifyApplicationPage;
