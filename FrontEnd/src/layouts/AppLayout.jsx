import React from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import FinalHeaderAndSidebar from "../components/AdminHeaderAndSidebar/FinalHeaderAndSidebar";

const { Content } = Layout;

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.includes("admin");
  // Ước lượng chiều cao của Header, điều chỉnh cho chính xác
  // Chiều cao này có thể khác nhau giữa desktop và mobile, và phụ thuộc vào nội dung Header
  const headerHeight = "130px"; // Ví dụ: NavigationBar (khoảng 50-60px) + Navbar (khoảng 70-80px)

  if (isAdminRoute) {
    return (
      <FinalHeaderAndSidebar>
        <Outlet />
      </FinalHeaderAndSidebar>
    );
  }

  return (
    <Layout
      className="layout"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />
      <Content
        style={{
          paddingTop: headerHeight,
          flex: "1 0 auto", // Đảm bảo Content chiếm không gian còn lại và đẩy Footer xuống dưới
        }}
      >
        {/* Outlet là nơi các component con của Route sẽ được render */}
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
}
export default AppLayout;
