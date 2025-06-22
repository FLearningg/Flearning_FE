import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spin, Result, Button, Row, Col } from 'antd';
import { verifyEmail } from '../../services/authService';

const VerifyEmailPage = () => {
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
                    // Gọi API để xác thực token
                    await verifyEmail(token);
                    setStatus('success');
                } catch (error) {
                    console.error("Lỗi xác thực email:", error);
                    setStatus('error');
                }
            };
            
            doVerify();
        }

        // Đánh dấu là effect đã chạy.
        // Trong StrictMode, React sẽ unmount và mount lại component,
        // cleanup function này sẽ chạy, và ở lần mount thứ 2, effectRan.current sẽ là true.
        return () => {
            effectRan.current = true;
        }
    }, [token]); // Phụ thuộc vào token, nếu token trên URL thay đổi, effect sẽ chạy lại

    // Hiển thị loading spinner
    if (status === 'loading') {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" tip="Đang xác thực..." />
            </div>
        );
    }

    // Hiển thị khi thành công
    if (status === 'success') {
        return (
            <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
                <Col>
                    <Result
                        status="success"
                        title="Xác thực Email Thành Công!"
                        subTitle="Tài khoản của bạn đã được kích hoạt. Bây giờ bạn có thể đăng nhập."
                        extra={
                            <Button type="primary">
                                <Link to="/login">Đi đến trang Đăng nhập</Link>
                            </Button>
                        }
                    />
                </Col>
            </Row>
        );
    }

    // Mặc định hiển thị khi thất bại
    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Col>
                <Result
                    status="error"
                    title="Xác thực Thất Bại"
                    subTitle="Liên kết xác thực không hợp lệ hoặc đã hết hạn. Vui lòng thử lại."
                    extra={
                        <Button type="primary">
                            <Link to="/login">Quay lại trang Đăng nhập</Link>
                        </Button>
                    }
                />
            </Col>
        </Row>
    );
};

export default VerifyEmailPage;