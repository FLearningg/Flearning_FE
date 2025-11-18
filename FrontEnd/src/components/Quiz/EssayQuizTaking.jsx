import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Typography, Space, Progress, message, Spin, Alert } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, SendOutlined } from '@ant-design/icons';
import './EssayQuizTaking.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

/**
 * Component for students to take essay-only quizzes
 * Shows questions one by one or all at once
 */
const EssayQuizTaking = ({ quiz, onSubmit, existingResult = null }) => {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [characterCounts, setCharacterCounts] = useState({});

  useEffect(() => {
    // Initialize answers from existing result if retaking
    if (existingResult?.essayAnswers) {
      const existingAnswers = {};
      existingResult.essayAnswers.forEach((ans) => {
        existingAnswers[ans.questionIndex] = ans.studentAnswer;
      });
      setAnswers(existingAnswers);
    }

    // Setup timer if quiz has time limit
    if (quiz.timeLimit) {
      setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
    }
  }, [quiz, existingResult]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit(true); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionIndex, value) => {
    const question = quiz.questions[questionIndex];
    const maxLength = question.essayMaxLength || 1000;

    if (value.length <= maxLength) {
      setAnswers({ ...answers, [questionIndex]: value });
      setCharacterCounts({ ...characterCounts, [questionIndex]: value.length });
    } else {
      message.warning(`Câu trả lời không được vượt quá ${maxLength} ký tự`);
    }
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit) {
      // Check if all questions are answered
      const unansweredQuestions = quiz.questions.filter(
        (_, index) => !answers[index] || answers[index].trim() === ''
      );

      if (unansweredQuestions.length > 0) {
        message.warning(`Bạn còn ${unansweredQuestions.length} câu chưa trả lời`);
        return;
      }
    }

    setLoading(true);

    try {
      // Format essay answers for submission
      const essayAnswers = quiz.questions.map((question, index) => ({
        questionIndex: index,
        questionContent: question.content,
        studentAnswer: answers[index] || '',
        maxScore: question.score || 10
      }));

      await onSubmit({
        quizId: quiz._id,
        essayAnswers: essayAnswers,
        submittedAt: new Date()
      });

      message.success('Nộp bài thành công! AI đang chấm điểm...');
    } catch (error) {
      message.error('Lỗi khi nộp bài: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const answeredCount = Object.values(answers).filter((a) => a && a.trim()).length;
    return Math.round((answeredCount / quiz.questions.length) * 100);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Text>Đang xử lý bài làm của bạn...</Text>
      </div>
    );
  }

  return (
    <div className="essay-quiz-taking">
      <Card className="quiz-header-card">
        <div className="quiz-header-content">
          <div>
            <Title level={3}>{quiz.title}</Title>
            <Text type="secondary">{quiz.description}</Text>
          </div>
          <div className="quiz-meta">
            {timeLeft !== null && (
              <div className="timer">
                <ClockCircleOutlined />
                <Text strong className={timeLeft < 300 ? 'time-warning' : ''}>
                  {formatTime(timeLeft)}
                </Text>
              </div>
            )}
            <div className="progress-info">
              <Text>Tiến độ: {getProgress()}%</Text>
              <Progress percent={getProgress()} showInfo={false} />
            </div>
          </div>
        </div>
      </Card>

      <Alert
        message="Lưu ý"
        description="Câu trả lời của bạn sẽ được AI chấm điểm tự động. Hãy viết rõ ràng, đầy đủ và có cấu trúc."
        type="info"
        showIcon
        className="instruction-alert"
      />

      <div className="questions-container">
        {quiz.questions.map((question, index) => (
          <Card
            key={index}
            className="question-card"
            title={
              <div className="question-header">
                <Text strong>Câu {index + 1}</Text>
                <Text type="secondary">({question.score || 10} điểm)</Text>
              </div>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div className="question-content">
                <Text>{question.content}</Text>
              </div>

              {question.essayGuideline && (
                <Alert
                  message="Gợi ý"
                  description={question.essayGuideline}
                  type="info"
                  className="hint-alert"
                />
              )}

              <div className="answer-area">
                <TextArea
                  placeholder="Nhập câu trả lời của bạn..."
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  rows={10}
                  className="essay-input"
                />
                <div className="character-count">
                  <Text type="secondary">
                    {characterCounts[index] || 0} / {question.essayMaxLength || 1000} ký tự
                  </Text>
                </div>
              </div>
            </Space>
          </Card>
        ))}
      </div>

      <Card className="submit-card">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div className="submit-summary">
            <CheckCircleOutlined className="summary-icon" />
            <div>
              <Text strong>Đã trả lời: {Object.values(answers).filter(a => a && a.trim()).length}/{quiz.questions.length} câu</Text>
              <br />
              <Text type="secondary">Kiểm tra kỹ trước khi nộp bài</Text>
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<SendOutlined />}
            onClick={() => handleSubmit(false)}
            loading={loading}
            block
          >
            Nộp bài
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default EssayQuizTaking;
