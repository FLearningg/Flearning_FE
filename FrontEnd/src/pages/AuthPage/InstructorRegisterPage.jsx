import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, Upload, message, Checkbox, Steps, Select } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, BankOutlined, UploadOutlined, ArrowRightOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { registerUser } from '../../store/authSlice';
import { registerInstructor } from '../../services/authService';
import apiClient from '../../services/authService';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Step } = Steps;
const { Option } = Select;
const F_LEARNING_ORANGE = '#FF6B00';
const ILLUSTRATION_BACKGROUND_COLOR = '#F5F3F9';
const illustrationSvgUrl = 'https://www.sauravsharan.com/_next/static/media/heroImage.039334ed.svg';

// Expertise options
const EXPERTISE_OPTIONS = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Artificial Intelligence',
    'Cloud Computing',
    'DevOps',
    'Cybersecurity',
    'Blockchain',
    'UI/UX Design',
    'Graphic Design',
    'Digital Marketing',
    'Business & Management',
    'Finance & Accounting',
    'Language Learning',
    'Photography & Video',
    'Music',
    'Health & Fitness',
    'Personal Development',
    'Other'
];

function InstructorRegisterPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [uploadedDocuments, setUploadedDocuments] = useState([]); // Store uploaded document URLs
    const [uploadingFiles, setUploadingFiles] = useState(false); // Track upload progress
    const [currentStep, setCurrentStep] = useState(0);
    const [apiError, setApiError] = useState('');
    const [step1Data, setStep1Data] = useState(null); // Store step 1 data
    const { currentUser, isAuthenticated } = useSelector((state) => state.auth);

    // If already logged in, skip to step 2
    useEffect(() => {
        if (isAuthenticated && currentUser) {
            form.setFieldsValue({
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
            });
            // Store user data for step 1
            setStep1Data({
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                email: currentUser.email,
            });
            setCurrentStep(1);
        }
    }, [isAuthenticated, currentUser, form]);

    const handleNext = async () => {
        try {
            setApiError(''); // Clear previous errors

            if (currentStep === 0) {
                // Validate Step 1 fields
                await form.validateFields(['firstName', 'lastName', 'email', 'password', 'confirmPassword']);

                // Register user
                setLoading(true);
                const values = form.getFieldsValue();
                const userData = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password,
                    skipEmailVerification: true, // Don't send email yet, will send after instructor form
                };

                await dispatch(registerUser(userData)).unwrap();
                message.success('User account created successfully!');

                // Store step 1 data for later use
                setStep1Data({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                });

                setLoading(false);

                // Move to step 2
                setCurrentStep(1);
            } else if (currentStep === 1) {
                // Validate Step 2 fields and submit instructor registration
                await form.validateFields(['phone', 'expertise', 'experience']);
                await handleSubmitInstructor();
            }
        } catch (error) {
            setLoading(false);
            if (error.errorFields) {
                // Form validation error - show specific field errors
                const fieldNames = error.errorFields.map(field => field.name[0]).join(', ');
                setApiError(`Please fill in all required fields: ${fieldNames}`);
                // Scroll to first error field
                form.scrollToField(error.errorFields[0].name);
            } else {
                // API error
                console.error('Registration error:', error);
                // error from unwrap() is the rejected payload directly
                const errorMessage = error?.message || 'Registration failed. Please try again.';
                setApiError(errorMessage);
            }
        }
    };

    const handleSubmitInstructor = async () => {
        setLoading(true);
        setApiError(''); // Clear previous errors
        try {
            const values = form.getFieldsValue();

            // Use step1Data if available, otherwise use currentUser data (for already logged in users)
            const firstName = step1Data?.firstName || currentUser?.firstName;
            const lastName = step1Data?.lastName || currentUser?.lastName;
            const email = step1Data?.email || currentUser?.email;

            console.log('=== BEFORE SUBMITTING ===');
            console.log('uploadedDocuments state:', uploadedDocuments);
            console.log('uploadedDocuments length:', uploadedDocuments.length);

            const instructorData = {
                firstName,
                lastName,
                email,
                phone: values.phone,
                expertise: values.expertise,
                experience: values.experience,
                documents: uploadedDocuments, // Use uploaded document URLs
            };

            console.log('Frontend sending instructor data:', instructorData);
            console.log('Documents in payload:', instructorData.documents);

            const response = await registerInstructor(instructorData);

            // Move to step 3 briefly
            setCurrentStep(2);

            // Redirect to check email page
            setTimeout(() => {
                navigate('/check-email');
            }, 500);
        } catch (error) {
            console.error('Instructor registration error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to submit instructor registration. Please try again.';
            setApiError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const uploadProps = {
        onRemove: (file) => {
            // Remove from file list
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);

            // Remove from uploaded documents
            const docIndex = uploadedDocuments.findIndex(url => url.includes(file.name));
            if (docIndex !== -1) {
                const newDocs = [...uploadedDocuments];
                newDocs.splice(docIndex, 1);
                setUploadedDocuments(newDocs);
            }
        },
        beforeUpload: async (file) => {
            // Check file size (max 5MB)
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                message.error('File must be smaller than 5MB!');
                return false;
            }

            // Check file type (only PDF, DOC, DOCX, JPG, PNG)
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg',
                'image/png'
            ];
            if (!allowedTypes.includes(file.type)) {
                message.error('Only PDF, DOC, DOCX, JPG, and PNG files are allowed!');
                return false;
            }

            // Add to file list for UI display
            setFileList([...fileList, file]);

            // Upload to Firebase
            setUploadingFiles(true);
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('fileType', 'instructor-document');

                console.log('Uploading file:', file.name);
                const response = await apiClient.post('/public/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log('Upload response:', response.data);
                console.log('Document URL:', response.data.url);

                // Add uploaded URL to documents array
                setUploadedDocuments(prev => {
                    const newDocs = [...prev, response.data.url];
                    console.log('Updated uploadedDocuments:', newDocs);
                    return newDocs;
                });
                message.success(`${file.name} uploaded successfully!`);
            } catch (error) {
                console.error('Upload error:', error);
                message.error(`Failed to upload ${file.name}`);
                // Remove from file list if upload failed
                setFileList(prev => prev.filter(f => f.uid !== file.uid));
            } finally {
                setUploadingFiles(false);
            }

            return false; // Prevent auto upload by Ant Design
        },
        fileList,
        disabled: uploadingFiles,
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
                        {isAuthenticated ? 'Complete your instructor profile' : 'Create your account and register as an instructor'}
                    </Text>

                    <Steps
                        current={currentStep}
                        style={{ marginBottom: '40px' }}
                        size="small"
                        labelPlacement="vertical"
                    >
                        <Step title="Register account" />
                        <Step title="Instructor's profile" />
                        <Step title="Verify email" />
                        <Step title="Wait for approval" />
                    </Steps>

                    {apiError && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ marginBottom: '24px' }}>
                            {apiError}
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => setApiError('')}
                            ></button>
                        </div>
                    )}

                    <Form
                        form={form}
                        name="instructor_register_form"
                        layout="vertical"
                        size="large"
                        scrollToFirstError
                    >
                        {currentStep === 0 && (
                            <>
                                <Title level={5} style={{ marginBottom: '16px', color: '#262626' }}>Account Information</Title>

                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="firstName"
                                            label={<Text style={{ fontWeight: 500, color: '#595959' }}>First Name</Text>}
                                            rules={[{ required: true, message: 'Please enter your first name!' }]}
                                        >
                                            <Input
                                                prefix={<UserOutlined style={{ color: '#BFBFBF' }} />}
                                                placeholder="First name"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="lastName"
                                            label={<Text style={{ fontWeight: 500, color: '#595959' }}>Last Name</Text>}
                                            rules={[{ required: true, message: 'Please enter your last name!' }]}
                                        >
                                            <Input
                                                prefix={<UserOutlined style={{ color: '#BFBFBF' }} />}
                                                placeholder="Last name"
                                            />
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
                                    <Input
                                        prefix={<MailOutlined style={{ color: '#BFBFBF' }} />}
                                        placeholder="Email address"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    label={<Text style={{ fontWeight: 500, color: '#595959' }}>Password</Text>}
                                    rules={[
                                        { required: true, message: 'Please enter your password!' },
                                        { min: 6, message: 'Password must be at least 6 characters!' }
                                    ]}
                                    hasFeedback
                                >
                                    <Input.Password
                                        prefix={<LockOutlined style={{ color: '#BFBFBF' }} />}
                                        placeholder="Create password (min 6 characters)"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="confirmPassword"
                                    label={<Text style={{ fontWeight: 500, color: '#595959' }}>Confirm Password</Text>}
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                        { required: true, message: 'Please confirm your password!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Passwords do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined style={{ color: '#BFBFBF' }} />}
                                        placeholder="Confirm password"
                                    />
                                </Form.Item>
                            </>
                        )}

                        {currentStep === 1 && (
                            <>
                                <Title level={5} style={{ marginBottom: '16px', color: '#262626' }}>Contact Information</Title>

                                <Form.Item
                                    name="phone"
                                    label={<Text style={{ fontWeight: 500, color: '#595959' }}>Phone Number</Text>}
                                    rules={[{ required: true, message: 'Please enter your phone number!' }]}
                                >
                                    <Input
                                        prefix={<PhoneOutlined style={{ color: '#BFBFBF' }} />}
                                        placeholder="Phone number"
                                    />
                                </Form.Item>

                                <Title level={5} style={{ marginTop: '24px', marginBottom: '16px', color: '#262626' }}>Professional Information</Title>

                                <Form.Item
                                    name="expertise"
                                    label={<Text style={{ fontWeight: 500, color: '#595959' }}>Areas of Expertise</Text>}
                                    rules={[{ required: true, message: 'Please select your areas of expertise!' }]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Select your areas of expertise"
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {EXPERTISE_OPTIONS.map(option => (
                                            <Option key={option} value={option}>{option}</Option>
                                        ))}
                                    </Select>
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
                            </>
                        )}

                        <Form.Item style={{ marginTop: '32px', marginBottom: '0' }}>
                            <Button
                                type="primary"
                                onClick={handleNext}
                                block
                                loading={loading}
                                disabled={uploadingFiles} // Disable when uploading files
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
                                {uploadingFiles ? 'Uploading files...' : (currentStep === 0 ? 'Next: Instructor Information' : 'Submit Application')}
                            </Button>
                        </Form.Item>

                        {currentStep === 0 && (
                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <Text type="secondary">Already have an account? </Text>
                                <Link to="/login" style={{ color: F_LEARNING_ORANGE, fontWeight: 'bold' }}>Sign In</Link>
                            </div>
                        )}
                    </Form>
                </div>
            </Col>
        </Row>
    );
}

export default InstructorRegisterPage;
