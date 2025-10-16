import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Typography, Button } from 'antd';
import { MailOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const F_LEARNING_ORANGE = '#FF6B00';

const CheckEmailPage = () => {
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
                        <MailOutlined style={{ fontSize: '72px', color: 'white' }} />
                        <Title level={2} style={{ color: 'white', marginTop: '20px', marginBottom: '10px' }}>
                            Check Your Email
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                            We've sent you a verification link
                        </Text>
                    </div>

                    <div style={{ padding: '40px' }}>
                        <Title level={4} style={{ marginBottom: '20px', color: '#262626' }}>
                            Almost there! 📧
                        </Title>

                        <Paragraph style={{ fontSize: '15px', color: '#595959', marginBottom: '24px' }}>
                            We've sent a verification email to your inbox. Please check your email and click the verification link to complete your instructor registration.
                        </Paragraph>

                        <div style={{
                            background: '#e6f7ff',
                            border: '1px solid #91d5ff',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '24px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <CheckCircleOutlined style={{ color: '#1890ff', fontSize: '20px', marginRight: '12px', marginTop: '2px' }} />
                                <div>
                                    <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                                        What's Next?
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: '14px' }}>
                                        Click the verification link in your email to verify your account and submit your instructor application.
                                    </Text>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: '#fff7e6',
                            border: '1px solid #ffd591',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '24px'
                        }}>
                            <Text style={{ color: '#ad6800', fontSize: '14px' }}>
                                <strong>Note:</strong> If you don't see the email, please check your spam or junk folder. The verification link will expire in 24 hours.
                            </Text>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '24px' }}>
                            <Link to="/login">
                                <Button
                                    type="default"
                                    size="large"
                                    style={{
                                        borderColor: F_LEARNING_ORANGE,
                                        color: F_LEARNING_ORANGE,
                                        height: '48px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        borderRadius: '8px',
                                        minWidth: '200px'
                                    }}
                                >
                                    Back to Login
                                </Button>
                            </Link>
                        </div>

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
};

export default CheckEmailPage;
