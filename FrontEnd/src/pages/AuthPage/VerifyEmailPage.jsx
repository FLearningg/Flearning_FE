import React, { useEffect, useState, useRef } from 'react'; 
import { useParams, Link } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { verifyEmail } from '../../services/authService'; 

const VerifyEmailPage = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('loading');
    
    // 2. Tạo một ref để theo dõi việc gọi API
    const effectRan = useRef(false);

    useEffect(() => {
        // 3. Chỉ chạy logic nếu cờ là false
        if (effectRan.current === false) {
            const doVerify = async () => {
                if (!token) {
                    setStatus('error');
                    return;
                }
                try {
                    await verifyEmail(token);
                    setStatus('success');
                } catch (error) {
                    console.error("Lỗi xác thực:", error);
                    setStatus('error');
                }
            };
            doVerify();
        }

        // 4. Cleanup function: đặt cờ thành true sau lần chạy đầu tiên
        // Điều này đảm bảo logic bên trong if() sẽ không chạy lại ở lần thứ 2
        return () => {
            effectRan.current = true;
        }
    }, [token]); // Phụ thuộc vào token
    
        // 3. Chỉ chạy logic nếu cờ là false
        if (effectRan.current === false) {
            const doVerify = async () => {
                if (!token) {
                    setStatus('error');
                    return;
                }
                try {
                    await verifyEmail(token);
                    setStatus('success');
                } catch (error) {
                    console.error("Lỗi xác thực:", error);
                    setStatus('error');
                }
            };
            doVerify();
        }

        // 4. Cleanup function: đặt cờ thành true sau lần chạy đầu tiên
        // Điều này đảm bảo logic bên trong if() sẽ không chạy lại ở lần thứ 2
        return () => {
            effectRan.current = true;
        }
    }, [token]); // Phụ thuộc vào token

    // ... phần JSX không thay đổi ...
    if (status === 'loading') {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
    }

    if (status === 'success') {
        return (
            <Result
                status="success"
                title="Xác thực Email Thành Công!"
                subTitle="Tài khoản của bạn đã được kích hoạt. Bây giờ bạn có thể đăng nhập."
                extra={ <Button type="primary"><Link to="/login">Đi đến trang Đăng nhập</Link></Button> }
                extra={ <Button type="primary"><Link to="/login">Đi đến trang Đăng nhập</Link></Button> }
            />
        );
    }

    return (
        <Result
            status="error"
            title="Xác thực Thất Bại"
            subTitle="Liên kết xác thực không hợp lệ hoặc đã hết hạn."
            extra={ <Button type="primary"><Link to="/signup">Đăng ký lại</Link></Button> }
            extra={ <Button type="primary"><Link to="/signup">Đăng ký lại</Link></Button> }
        />
    );
};

export default VerifyEmailPage;