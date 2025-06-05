import React from 'react';
import { Collapse, Form, Input, Button, Typography, Breadcrumb, Row, Col, Card, Space } from 'antd';
import { HomeOutlined, MessageOutlined, SendOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const faqData = [
    {
        key: '1',
        label: 'How do I enroll in a course?',
        children: <Paragraph>To enroll in a course, simply browse our course catalog, select the course you\'re interested in, and click the "Enroll Now" button. You\'ll be guided through a secure checkout process. You can also add multiple courses to your cart before proceeding to checkout.</Paragraph>,
    },
    {
        key: '2',
        label: 'Can I access courses on my mobile device?',
        children: <Paragraph>Yes! The F-Learning platform is fully responsive and accessible on all devices, including desktops, tablets, and smartphones. Learn anytime, anywhere. We also have dedicated mobile apps for iOS and Android for an optimized learning experience.</Paragraph>,
    },
    {
        key: '3',
        label: 'What is the refund policy?',
        children: <Paragraph>We offer a 30-day money-back guarantee on most courses. If you\'re not satisfied with a course for any reason, you can request a full refund within 30 days of purchase. Please check the specific course details for any exceptions.</Paragraph>,
    },
    {
        key: '4',
        label: 'How can I contact support?',
        children: <Paragraph>You can contact our support team by using the contact form on this page or by emailing us at support@flearning.example.com. We strive to respond to all inquiries within 24 business hours. You can also check our Help Center for instant answers.</Paragraph>,
    },
    {
        key: '5',
        label: 'Are there any prerequisites for the courses?',
        children: <Paragraph>Prerequisites vary by course. Each course description page clearly lists any required prior knowledge or skills. Many of our beginner courses have no prerequisites at all!</Paragraph>,
    },
];

function FaqsPage({ setCurrentPage }) { // Hoặc navigateTo nếu dùng hash routing
  const [form] = Form.useForm();

  const onFinishContactForm = (values) => {
    console.log('Received values of form: ', values);
    alert('Contact form submitted (demo)! Check console for values.');
    form.resetFields();
  };

  return (
    <div style={{
        padding: '24px 48px', // Điều chỉnh padding cho phù hợp
        background: '#f0f2f5', // Màu nền tiêu chuẩn của Ant Design cho trang
        minHeight: 'calc(100vh - 160px)' // Điều chỉnh dựa trên chiều cao header/footer
    }}>
      <Breadcrumb style={{ marginBottom: '24px' }}>
        <Breadcrumb.Item onClick={() => setCurrentPage('home')} style={{cursor: 'pointer'}}>
          <HomeOutlined />
          <span>Home</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <QuestionCircleOutlined />
          <span>FAQs</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
        Frequently Asked Questions
      </Title>

      <Row gutter={[32, 32]}> {/* gutter cho khoảng cách giữa các cột */}
        <Col xs={24} md={16}> {/* FAQs chiếm 2/3 chiều rộng trên màn hình lớn */}
          <Card bordered={false} style={{ borderRadius: '8px' }}>
            <Collapse accordion defaultActiveKey={['1']} bordered={false} expandIconPosition="end">
              {faqData.map(faq => (
                <Panel
                  header={<Text strong>{faq.label}</Text>}
                  key={faq.key}
                  style={{
                    background: '#fff', // Nền trắng cho từng panel
                    borderBottom: '1px solid #f0f0f0', // Đường kẻ mảnh giữa các panel
                    borderRadius: '0 !important' // Loại bỏ bo góc mặc định của panel nếu cần
                  }}
                >
                  {faq.children}
                </Panel>
              ))}
            </Collapse>
          </Card>
        </Col>

        <Col xs={24} md={8}> {/* Form liên hệ chiếm 1/3 chiều rộng */}
          <Card
            title={<Space><MessageOutlined />Don't find your answer?</Space>}
            bordered={false}
            style={{
                borderRadius: '8px',
                position: 'sticky',
                top: '100px' // Điều chỉnh giá trị top này dựa trên chiều cao header của bạn
            }}
          >
            <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
              Send us a message, and we'll get back to you as soon as possible.
            </Paragraph>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinishContactForm}
              name="faq_contact_form"
            >
              <Form.Item
                name="name"
                label="Your Name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input placeholder="Enter your name" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'The input is not valid E-mail!' }
                ]}
              >
                <Input placeholder="you@example.com" />
              </Form.Item>
              <Form.Item
                name="message"
                label="Message"
                rules={[{ required: true, message: 'Please input your message!' }]}
              >
                <Input.TextArea rows={4} placeholder="Write your message here..." />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SendOutlined />} block size="large" style={{ borderRadius: '8px' }}>
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export default FaqsPage;