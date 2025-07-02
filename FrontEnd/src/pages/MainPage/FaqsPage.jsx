import React, { useState } from 'react';
import { Collapse, Form, Input, Button, Typography, Breadcrumb, Row, Col, Card, Space } from 'antd';
import { HomeOutlined, MessageOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const sidebarQuestions = [
  'How do I enroll in a course?',
  'Can I get a certificate after completion?',
  'How do I reset my password?',
  'How can I contact the instructor?',
  'What payment methods are accepted?',
  'Can I access courses offline?',
  'How do I become an instructor?',
  'Is there a refund policy?',
];

const faqData = [
  {
    key: '1',
    label: 'How do I enroll in a course?',
    content: (
      <>
        <Paragraph>
          To enroll in a course, simply browse our course catalog, select the course you are interested in, and click the "Enroll Now" button. You will be guided through the payment and registration process.
        </Paragraph>
        <ol>
          <li>Browse or search for your desired course.</li>
          <li>Click on the course to view details.</li>
          <li>Click "Enroll Now" and follow the instructions.</li>
        </ol>
        <Paragraph>
          Once enrolled, you can access the course materials anytime from your dashboard.
        </Paragraph>
      </>
    ),
  },
  {
    key: '2',
    label: 'Can I get a certificate after completion?',
    content: (
      <Paragraph>
        Yes! After successfully completing a course and passing all required assessments, you will receive a digital certificate of completion, which you can download and share.
      </Paragraph>
    ),
  },
  {
    key: '3',
    label: 'How do I reset my password?',
    content: (
      <Paragraph>
        Click on "Forgot Password" at the login page, enter your registered email, and follow the instructions sent to your inbox to reset your password.
      </Paragraph>
    ),
  },
  {
    key: '4',
    label: 'How can I contact the instructor?',
    content: (
      <Paragraph>
        You can contact the instructor via the course Q&A section or by sending a direct message if the instructor has enabled this feature.
      </Paragraph>
    ),
  },
  {
    key: '5',
    label: 'What payment methods are accepted?',
    content: (
      <Paragraph>
        We accept major credit cards, PayPal, and other local payment methods depending on your country.
      </Paragraph>
    ),
  },
  {
    key: '6',
    label: 'Can I access courses offline?',
    content: (
      <Paragraph>
        Currently, our courses are available online only. However, you can download some resources for offline use if provided by the instructor.
      </Paragraph>
    ),
  },
  {
    key: '7',
    label: 'How do I become an instructor?',
    content: (
      <Paragraph>
        To become an instructor, click on "Become an Instructor" at the top menu and fill out the application form. Our team will review your application and contact you soon.
      </Paragraph>
    ),
  },
  {
    key: '8',
    label: 'Is there a refund policy?',
    content: (
      <Paragraph>
        Yes, we offer a 7-day refund policy for most courses. Please refer to our refund policy page for more details.
      </Paragraph>
    ),
  },
];

function FaqsPage() {
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState([]); // All panels closed by default
  const [selectedSidebar, setSelectedSidebar] = useState(null);

  const onFinishContactForm = (values) => {
    alert('Thank you for your question! Our support team will contact you soon.');
    form.resetFields();
  };

  // When clicking sidebar, open corresponding panel
  const handleSidebarClick = (idx) => {
    setSelectedSidebar(idx);
    setActiveKey([(idx + 1).toString()]);
  };

  return (
    <div style={{
      background: '#f7f9fb',
      minHeight: 'calc(100vh - 120px)',
      padding: '0 0 48px 0'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 0 0 0' }}>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item href="/">
            <HomeOutlined />
            <span>Home</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <QuestionCircleOutlined />
            <span>FAQs</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Title level={2} style={{ fontWeight: 700, marginBottom: 32, textAlign: 'center' }}>
          Frequently Asked Questions
        </Title>
        <Row gutter={[32, 32]} align="start">
          {/* Sidebar */}
          <Col xs={24} md={5}>
            <Card
              bodyStyle={{ padding: 0 }}
              style={{
                borderRadius: 8,
                border: 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
              }}
            >
              {sidebarQuestions.map((q, idx) => (
                <div
                  key={q}
                  onClick={() => handleSidebarClick(idx)}
                  style={{
                    cursor: 'pointer',
                    padding: '14px 18px',
                    background: selectedSidebar === idx ? '#FF6B00' : '#fff',
                    color: selectedSidebar === idx ? '#fff' : '#101828',
                    fontWeight: selectedSidebar === idx ? 600 : 400,
                    borderBottom: idx !== sidebarQuestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {q}
                </div>
              ))}
            </Card>
          </Col>
          {/* Accordion */}
          <Col xs={24} md={11}>
            <Collapse
              accordion
              activeKey={activeKey}
              onChange={key => setActiveKey(Array.isArray(key) ? key : [key])}
              expandIconPosition="end"
              bordered={false}
              style={{ background: 'transparent' }}
            >
              {faqData.map((faq, idx) => (
                <Panel
                  header={
                    <span style={{
                      fontWeight: 600,
                      color: '#101828'
                    }}>
                      {faq.label}
                    </span>
                  }
                  key={faq.key}
                  style={{
                    marginBottom: 16,
                    background: '#fff',
                    color: '#101828',
                    borderRadius: 8,
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                  showArrow
                  extra={null}
                >
                  <div style={{ color: '#101828' }}>
                    {faq.content}
                  </div>
                </Panel>
              ))}
            </Collapse>
          </Col>
          {/* Form */}
          <Col xs={24} md={8}>
            <div style={{
              background: '#fff',
              borderRadius: 8,
              padding: 24,
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
            }}>
              <Space style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
                <MessageOutlined style={{ color: '#FF6B00' }} />
                Still have questions?
              </Space>
              <Paragraph type="secondary" style={{ marginBottom: 16, color: '#667085' }}>
                If you can't find your answer here, please send us your question and our support team will assist you as soon as possible.
              </Paragraph>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinishContactForm}
                name="faq_contact_form"
              >
                <Form.Item
                  name="subject"
                  label="Subject"
                  rules={[{ required: true, message: 'Please enter your subject!' }]}
                  style={{ marginBottom: 12 }}
                >
                  <Input placeholder="Subject" size="large" style={{ borderRadius: 4 }} />
                </Form.Item>
                <Form.Item
                  name="message"
                  label="Message"
                  rules={[{ required: true, message: 'Please enter your message!' }]}
                  style={{ marginBottom: 16 }}
                >
                  <Input.TextArea rows={4} placeholder="Message" size="large" style={{ borderRadius: 4 }} />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    style={{
                      background: '#FF6B00',
                      borderColor: '#FF6B00',
                      borderRadius: 4,
                      fontWeight: 600
                    }}
                  >
                    Submit Question
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default FaqsPage;