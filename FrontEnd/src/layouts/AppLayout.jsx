import React, { Suspense } from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import FinalHeaderAndSidebar from "../components/AdminHeaderAndSidebar/FinalHeaderAndSidebar";
import InstructorLayout from "../components/InstructorHeaderAndSidebar/InstructorLayout";

// Đảm bảo đường dẫn này là chính xác
const FloatingChatButton = React.lazy(() =>
  import("../components/GeminiChatBox/FloatingChatButton")
);

const { Content } = Layout;

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.includes("admin");
  const isInstructorRoute = location.pathname.includes("instructor");
  const headerHeight = "130px"; // Giả sử chiều cao header của bạn

  if (isAdminRoute) {
    return (
      <FinalHeaderAndSidebar>
        <Outlet />
      </FinalHeaderAndSidebar>
    );
  }

  if (isInstructorRoute) {
    return (
      <InstructorLayout>
        <Outlet />
      </InstructorLayout>
    );
  }

  return (
    <>
      <Layout
        className="layout"
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header />
        <Content
          style={{
            paddingTop: headerHeight,
            flex: "1 0 auto",
          }}
        >
          <Outlet />
        </Content>
        <Footer />
      </Layout>

      {/* Không hiển thị chatbot trên trang admin, đã được xử lý ở trên */}
      <Suspense fallback={null}>
        <FloatingChatButton />
      </Suspense>
    </>
  );
}

export default AppLayout;
