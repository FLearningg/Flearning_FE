import React, { useState } from 'react';
import { Form, Input, Button, Typography, Row, Col, Upload, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, BankOutlined, UploadOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { registerInstructor } from '../../services/authService';

const { Title, Text } = Typography;
const { TextArea } = Input;
const F_LEARNING_ORANGE = '#FF6B00';
const ILLUSTRATION_BACKGROUND_COLOR = '#F5F3F9';
const illustrationSvgUrl = 'https://www.sauravsharan.com/_next/static/media/heroImage.039334ed.svg';

function InstructorRegisterPage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Prepare data for API
            const instructorData = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phone: values.phone,
                bio: values.bio,
                expertise: values.expertise,
                experience: values.experience,
                bankName: values.bankName,
                accountNumber: values.accountNumber,
                accountHolderName: values.accountHolderName,
                documents: [], // TODO: Handle file upload to Firebase/cloud storage
            };

            // Call API
            const response = await registerInstructor(instructorData);

            message.success(response.data.message || 'Instructor registration submitted successfully!');

            // Reset form
            form.resetFields();
            setFileList([]);

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to submit registration. Please try again.';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const uploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            // Check file size (max 5MB)
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                message.error('File must be smaller than 5MB!');
                return false;
            }

            setFileList([...fileList, file]);
            return false; // Prevent auto upload
        },
        fileList,
    };

    return (
        <Row style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
            <Col xs={0} md={10} lg={12} style={{ backgroundColor: ILLUSTRATION_BACKGROUND_COLOR, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', overflow: 'hidden' }}>
                <img src={illustrationSvgUrl} alt="Illustration" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </Col>
            <Col xs={24} md={14} lg={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 60px', overflowY: 'auto' }}>
                <div style={{ width: '100%', maxWidth: '600px' }}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: '10px' }}>
                        Become an Instructor
                    </Title>
                    <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '30px' }}>
                        Fill in your information to complete the registration
                    </Text>

                    <Form
                        form={form}
                        name="instructor_register_form"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                        scrollToFirstError
                    >
                        <Title level={5} style={{ marginBottom: '16px', color: '#262626' }}>Personal Information</Title>

                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="firstName"
                                    label={<Text style={{ fontWeight: 500, color: '#595959' }}>First Name</Text>}
                                    rules={[{ required: true, message: 'Please enter your first name!' }]}
                                >
                                    <Input prefix={<UserOutlined style={{ color: '#BFBFBF' }} />} placeholder="First name" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="lastName"
                                    label={<Text style={{ fontWeight: 500, color: '#595959' }}>Last Name</Text>}
                                    rules={[{ required: true, message: 'Please enter your last name!' }]}
                                >
                                    <Input prefix={<UserOutlined style={{ color: '#BFBFBF' }} />} placeholder="Last name" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="email"
                            label={<Text style={{ fontWeight: 500, color: '#595959' }}>Email</Text>}
                            rules={[
                                { required: true, message: 'Please enter your email!' },
                                { type: 'email', message: 'Please enter a valid email!' }
                            ]}
                        >
                            <Input prefix={<MailOutlined style={{ color: '#BFBFBF' }} />} placeholder="Email address" />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label={<Text style={{ fontWeight: 500, color: '#595959' }}>Phone Number</Text>}
                            rules={[{ required: true, message: 'Please enter your phone number!' }]}
                        >
                            <Input prefix={<PhoneOutlined style={{ color: '#BFBFBF' }} />} placeholder="Phone number" />
                        </Form.Item>

                        <Form.Item
                            name="bio"
                            label={<Text style={{ fontWeight: 500, color: '#595959' }}>Bio</Text>}
                            rules={[
                                { required: true, message: 'Please enter your bio!' },
                                { min: 50, message: 'Bio must be at least 50 characters!' }
                            ]}
                        >
                            <TextArea
                                rows={4}
                                placeholder="Tell us about yourself, your expertise, and teaching experience..."
                                showCount
                                maxLength={500}
                            />
                        </Form.Item>

                        <Title level={5} style={{ marginTop: '24px', marginBottom: '16px', color: '#262626' }}>Professional Information</Title>

                        <Form.Item
                            name="expertise"
                            label={<Text style={{ fontWeight: 500, color: '#595959' }}>Areas of Expertise</Text>}
                            rules={[{ required: true, message: 'Please enter your areas of expertise!' }]}
                        >
                            <Input placeholder="e.g. Web Development, Data Science, Marketing" />
                        </Form.Item>

                        <Form.Item
                            name="experience"
                            label={<Text style={{ fontWeight: 500, color: '#595959' }}>Teaching Experience</Text>}
                            rules={[{ required: true, message: 'Please describe your teaching experience!' }]}
                        >
                            <TextArea
                                rows={3}
                                placeholder="Describe your previous teaching or training experience..."
                                showCount
                                maxLength={300}
                            />
                        </Form.Item>

                        <Title level={5} style={{ marginTop: '24px', marginBottom: '16px', color: '#262626' }}>Payment Information</Title>

                        <Form.Item
                            name="bankName"
                            label={<Text style={{ fontWeight: 500, color: '#595959' }}>Bank Name</Text>}
                            rules={[{ required: true, message: 'Please enter your bank name!' }]}
                        >
                            <Input prefix={<BankOutlined style={{ color: '#BFBFBF' }} />} placeholder="Bank name" />
                        </Form.Item>

                        <Form.Item
                            name="accountNumber"
                            label={<Text style={{ fontWeight: 500, color: '#595959' }}>Account Number</Text>}
                            rules={[{ required: true, message: 'Please enter your account number!' }]}
                        >
                            <Input prefix={<BankOutlined style={{ color: '#BFBFBF' }} />} placeholder="Account number" />
                        </Form.Item>

                        <Form.Item
                            name="accountHolderName"
                            label={<Text style={{ fontWeight: 500, color: '#595959' }}>Account Holder Name</Text>}
                            rules={[{ required: true, message: 'Please enter account holder name!' }]}
                        >
                            <Input prefix={<UserOutlined style={{ color: '#BFBFBF' }} />} placeholder="Account holder name" />
                        </Form.Item>

                        <Title level={5} style={{ marginTop: '24px', marginBottom: '16px', color: '#262626' }}>Documents</Title>

                        <Form.Item
                            name="documents"
                            label={<Text style={{ fontWeight: 500, color: '#595959' }}>Certificates / Credentials (Optional)</Text>}
                            extra="Upload relevant certificates, credentials, or documents (Max 5MB per file)"
                        >
                            <Upload {...uploadProps} multiple maxCount={5}>
                                <Button icon={<UploadOutlined />}>Select Files</Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item style={{ marginTop: '32px', marginBottom: '0' }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={loading}
                                style={{
                                    backgroundColor: F_LEARNING_ORANGE,
                                    borderColor: F_LEARNING_ORANGE,
                                    height: '48px',
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                }}
                                icon={<ArrowRightOutlined />}
                                iconPosition="end"
                            >
                                Submit Application
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Col>
        </Row>
    );
}

export default InstructorRegisterPage;
