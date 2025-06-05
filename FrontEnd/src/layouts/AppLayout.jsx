import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header'; // Đường dẫn đến Header
import Footer from '../components/footer/Footer'; // Import Footer component mới

const { Content } = Layout;

function AppLayout() {
  // Ước lượng chiều cao của Header, điều chỉnh cho chính xác
  // Chiều cao này có thể khác nhau giữa desktop và mobile, và phụ thuộc vào nội dung Header
  const headerHeight = '130px'; // Ví dụ: NavigationBar (khoảng 50-60px) + Navbar (khoảng 70-80px)

  return (
    <Layout className="layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Content 
        style={{ 
          paddingTop: headerHeight, 
          flex: '1 0 auto' // Đảm bảo Content chiếm không gian còn lại và đẩy Footer xuống dưới
        }}
      >
        {/* Outlet là nơi các component con của Route sẽ được render */}
        <Outlet />
      </Content>
      <Footer /> {/* Sử dụng Footer component */}
    </Layout>
  );
}  
  export default AppLayout;