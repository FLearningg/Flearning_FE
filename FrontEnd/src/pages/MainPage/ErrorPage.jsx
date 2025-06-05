import React from 'react';
import { Result, Button, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons'; // Tùy chọn: cho icon nút

const { Title, Paragraph } = Typography;

function ErrorPage({ setCurrentPage }) { // Hoặc navigateTo nếu dùng hash routing
  return (
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 'calc(100vh - 160px)', // Điều chỉnh minHeight dựa trên header/footer của bạn
        padding: '20px', 
        background: '#fff' 
    }}>
      <Result
        status="404"
        title={<Title level={1} style={{ color: '#ff4d4f', marginBottom: '8px' }}>404</Title>} // Màu đỏ của Ant Design cho lỗi
        subTitle={
          <Paragraph style={{ fontSize: '18px', color: 'rgba(0, 0, 0, 0.65)' }}>
            Sorry, the page you visited does not exist.
          </Paragraph>
        }
        extra={
          <Button 
            type="primary" 
            icon={<HomeOutlined />} // Icon tùy chọn
            onClick={() => setCurrentPage('home')} // Hoặc navigateTo('home')
            size="large"
            style={{ borderRadius: '8px' }} // Sử dụng token borderRadius từ theme nếu có
          >
            Back Home
          </Button>
        }
      />
      <div style={{ 
          textAlign: 'center', 
          marginTop: '48px', 
          paddingTop: '24px', 
          borderTop: '1px solid #f0f0f0', // Đường kẻ phân cách của Ant Design
          width: '100%', 
          maxWidth: '600px' 
      }}>
        <Paragraph type="secondary" style={{ fontSize: '12px' }}>
          &copy; {new Date().getFullYear()} F-Learning. Designed by YourTeam.
          <Button type="link" size="small" onClick={() => setCurrentPage('faq')} style={{ marginLeft: '8px' }}>FAQs</Button>
          <Button type="link" size="small">Privacy Policy</Button>
          <Button type="link" size="small">Terms & Conditions</Button>
        </Paragraph>
      </div>
    </div>
  );
}
export default ErrorPage;