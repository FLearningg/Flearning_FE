import React from 'react';
import { Link } from 'react-router-dom';
import { Result, Button, Row, Col } from 'antd';

const RegistrationSuccessPage = () => {
    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Col>
                <Result
                    status="success"
                    title="Đăng Ký Thành Công!"
                    subTitle="Chúng tôi đã gửi một email xác thực đến hòm thư của bạn. Vui lòng kiểm tra và làm theo hướng dẫn để kích hoạt tài khoản."
                    extra={[
                        <Button type="primary" key="login">
                            <Link to="/login">Đi đến trang Đăng nhập</Link>
                        </Button>,
                    ]}
                />
            </Col>
        </Row>
    );
};

export default RegistrationSuccessPage;