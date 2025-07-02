import React from 'react';
import { Button, Row, Col, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Illustration_404 = 'https://firebasestorage.googleapis.com/v0/b/flearning-7f88f.firebasestorage.app/o/images%2F5224483%201.png?alt=media&token=6677dba8-3c3b-40d3-9e88-219bbdd52b9d';

const F_LEARNING_ORANGE = '#FF6B00';
const GRAY_TITLE = '#D0D5DD';
const PRIMARY_TEXT_COLOR = '#101828';
const SECONDARY_TEXT_COLOR = '#667085';

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 80px)',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 32px',
      }}
    >
      <Row
        align="middle"
        justify="center"
        gutter={[64, 0]}
        style={{ width: '100%', maxWidth: 1200 }}
      >
        {/* Text column */}
        <Col xs={24} md={12}>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <Title
              level={1}
              style={{
                color: GRAY_TITLE,
                fontWeight: 700,
                fontSize: 48,
                marginBottom: 0,
                lineHeight: 1.1,
              }}
            >
              Error 404
            </Title>
            <Title
              level={2}
              style={{
                color: PRIMARY_TEXT_COLOR,
                fontWeight: 700,
                fontSize: 32,
                margin: '16px 0 0 0',
                lineHeight: 1.2,
              }}
            >
              Oops! page not found
            </Title>
            <Paragraph
              style={{
                color: SECONDARY_TEXT_COLOR,
                fontSize: 16,
                margin: '24px 0 32px 0',
                lineHeight: 1.7,
              }}
            >
              Something went wrong. It&apos;s look that your requested could not be found. It&apos;s look like the link is broken or the page is removed.
            </Paragraph>
            <Button
              type="primary"
              size="large"
              style={{
                background: F_LEARNING_ORANGE,
                borderColor: F_LEARNING_ORANGE,
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                height: 48,
                padding: '0 32px',
              }}
              onClick={() => navigate('/')}
            >
              Go Back
            </Button>
          </div>
        </Col>
        {/* Image column */}
        <Col xs={24} md={12} style={{ textAlign: 'center' }}>
          <img
            src={Illustration_404}
            alt="404 Page Not Found"
            style={{
              width: '100%',
              maxWidth: 500,
              margin: '0 auto',
              display: 'block',
            }}
          />
        </Col>
      </Row>
    </div>
  );
}

export default ErrorPage;