import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Button, Tag, Spin, Alert, Collapse, Progress } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  FileTextOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import './EssayQuizResult.css';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

/**
 * Component to display essay quiz results with AI grading
 * Shows scores, feedback, strengths and improvements for each answer
 */
const EssayQuizResult = ({ quizResult, quiz, onRetake }) => {
  const [gradingStatus, setGradingStatus] = useState(quizResult.gradingStatus || 'pending');

  useEffect(() => {
    setGradingStatus(quizResult.gradingStatus || 'pending');
  }, [quizResult]);

  const getStatusTag = () => {
    switch (gradingStatus) {
      case 'completed':
        return <Tag color="success" icon={<CheckCircleOutlined />}>Đã chấm xong</Tag>;
      case 'grading':
        return <Tag color="processing" icon={<ClockCircleOutlined />}>Đang chấm điểm...</Tag>;
      case 'failed':
        return <Tag color="error">Lỗi chấm điểm</Tag>;
      default:
        return <Tag color="warning" icon={<ClockCircleOutlined />}>Chờ chấm điểm</Tag>;
    }
  };

  const getTotalScore = () => {
    if (gradingStatus !== 'completed' || !quizResult.essayAnswers) {
      return 0;
    }
    return quizResult.essayAnswers.reduce((sum, ans) => sum + (ans.aiScore || 0), 0);
  };

  const getMaxScore = () => {
    if (!quizResult.essayAnswers) return 0;
    return quizResult.essayAnswers.reduce((sum, ans) => sum + (ans.maxScore || 10), 0);
  };

  const getScorePercentage = () => {
    const max = getMaxScore();
    if (max === 0) return 0;
    return Math.round((getTotalScore() / max) * 100);
  };

  const isPassed = () => {
    return getScorePercentage() >= 80;
  };

  if (gradingStatus === 'pending' || gradingStatus === 'grading') {
    return (
      <div className="essay-result-loading">
        <Card className="loading-card">
          <Space direction="vertical" align="center" size="large" style={{ width: '100%' }}>
            <Spin size="large" />
            <Title level={4}>
              {gradingStatus === 'grading' ? 'AI đang chấm bài của bạn...' : 'Bài làm đang chờ chấm điểm'}
            </Title>
            <Text type="secondary">
              Quá trình này có thể mất vài giây. Vui lòng đợi...
            </Text>
            {getStatusTag()}
          </Space>
        </Card>
      </div>
    );
  }

  if (gradingStatus === 'failed') {
    return (
      <div className="essay-result-error">
        <Card className="error-card">
          <Space direction="vertical" align="center" size="large" style={{ width: '100%' }}>
            <Alert
              message="Lỗi chấm điểm"
              description="Đã xảy ra lỗi khi AI chấm bài. Vui lòng liên hệ giảng viên hoặc thử lại sau."
              type="error"
              showIcon
            />
            {getStatusTag()}
            <Button type="primary" onClick={onRetake}>
              Làm lại
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div className="essay-quiz-result">
      {/* Score Overview */}
      <Card className="score-card">
        <div className="score-header">
          <TrophyOutlined className="trophy-icon" />
          <div className="score-info">
            <Title level={2}>{getScorePercentage()}%</Title>
            <Text type="secondary">
              {getTotalScore()} / {getMaxScore()} điểm
            </Text>
          </div>
          <div className="pass-status">
            {isPassed() ? (
              <Tag color="success" className="status-tag">ĐẠT</Tag>
            ) : (
              <Tag color="error" className="status-tag">CHƯA ĐẠT</Tag>
            )}
          </div>
        </div>

        <Progress
          percent={getScorePercentage()}
          strokeColor={isPassed() ? '#52c41a' : '#ff4d4f'}
          className="score-progress"
        />

        <div className="quiz-meta">
          <Space>
            <Text type="secondary">
              <FileTextOutlined /> {quiz.title}
            </Text>
            <Text type="secondary">
              <ClockCircleOutlined /> {new Date(quizResult.takenAt).toLocaleString('vi-VN')}
            </Text>
          </Space>
          {getStatusTag()}
        </div>
      </Card>

      {/* Detailed Results */}
      <Card className="details-card" title="Chi tiết từng câu">
        <Collapse accordion>
          {quizResult.essayAnswers?.map((answer, index) => (
            <Panel
              header={
                <div className="answer-panel-header">
                  <Text strong>Câu {index + 1}</Text>
                  <Tag color={answer.aiScore >= (answer.maxScore * 0.8) ? 'success' : 'warning'}>
                    {answer.aiScore || 0} / {answer.maxScore} điểm
                  </Tag>
                </div>
              }
              key={index}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* Question */}
                <div className="question-section">
                  <Text strong>Câu hỏi:</Text>
                  <Paragraph className="question-text">{answer.questionContent}</Paragraph>
                </div>

                {/* Student Answer */}
                <div className="answer-section">
                  <Text strong>Câu trả lời của bạn:</Text>
                  <Card className="answer-card" bordered={false}>
                    <Paragraph className="answer-text">{answer.studentAnswer}</Paragraph>
                  </Card>
                </div>

                {/* AI Feedback */}
                {answer.aiFeedback && (
                  <div className="feedback-section">
                    <Text strong>Nhận xét từ AI:</Text>
                    <Alert
                      message={answer.aiFeedback}
                      type="info"
                      className="feedback-alert"
                    />
                  </div>
                )}

                {/* Strengths */}
                {answer.strengths && answer.strengths.length > 0 && (
                  <div className="strengths-section">
                    <Text strong className="section-title success-text">
                      ✓ Điểm mạnh:
                    </Text>
                    <ul className="strength-list">
                      {answer.strengths.map((strength, idx) => (
                        <li key={idx}>
                          <CheckCircleOutlined className="icon-success" /> {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {answer.improvements && answer.improvements.length > 0 && (
                  <div className="improvements-section">
                    <Text strong className="section-title warning-text">
                      ⚠ Cần cải thiện:
                    </Text>
                    <ul className="improvement-list">
                      {answer.improvements.map((improvement, idx) => (
                        <li key={idx}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Grading Info */}
                <div className="grading-info">
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Chấm bởi: {answer.gradingModel || 'AI'} | 
                    Thời gian: {answer.gradedAt ? new Date(answer.gradedAt).toLocaleString('vi-VN') : 'N/A'}
                  </Text>
                </div>
              </Space>
            </Panel>
          ))}
        </Collapse>
      </Card>

      {/* Actions */}
      <Card className="actions-card">
        <Space size="large">
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={onRetake}
            size="large"
          >
            Làm lại
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default EssayQuizResult;
