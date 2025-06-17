import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { verifyEmail } from '../../services/api/authService';

const VerifyEmailPage = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const doVerify = async () => {
            if (!token) {
                setStatus('error');
                return;
            }
            try {
                await verifyEmail(token);
                setStatus('success');
            } catch (error) {
                setStatus('error');
            }
        };
        doVerify();
    }, [token]);

    if (status === 'loading') {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
    }

    if (status === 'success') {
        return (
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
        );
    }

    return (
        <Result
            status="error"
            title="Xác thực Thất Bại"
            subTitle="Liên kết xác thực không hợp lệ hoặc đã hết hạn."
            extra={
                <Button type="primary">
                    <Link to="/signup">Đăng ký lại</Link>
                </Button>
            }
        />
    );
};

export default VerifyEmailPage;