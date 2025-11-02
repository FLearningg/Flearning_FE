import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Form, InputNumber, Space, Typography, Alert, Spin, message } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import './EssayQuizCreator.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

/**
 * Component for creating Essay-only quizzes
 * Instructors can add essay questions with guidelines and max word count
 */
const EssayQuizCreator = ({ onSave, initialData = null, courseId, lessonId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([
    {
      key: Date.now(),
      content: '',
      essayGuideline: '',
      essayMaxLength: 1000,
      score: 10
    }
  ]);

  useEffect(() => {
    if (initialData?.questions) {
      setQuestions(
        initialData.questions.map((q, idx) => ({
          key: Date.now() + idx,
          content: q.content || '',
          essayGuideline: q.essayGuideline || '',
          essayMaxLength: q.essayMaxLength || 1000,
          score: q.score || 10
        }))
      );
    }
  }, [initialData]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        key: Date.now(),
        content: '',
        essayGuideline: '',
        essayMaxLength: 1000,
        score: 10
      }
    ]);
  };

  const removeQuestion = (key) => {
    if (questions.length === 1) {
      message.warning('Quiz phải có ít nhất 1 câu hỏi');
      return;
    }
    setQuestions(questions.filter(q => q.key !== key));
  };

  const updateQuestion = (key, field, value) => {
    setQuestions(
      questions.map(q => (q.key === key ? { ...q, [field]: value } : q))
    );
  };

  const handleSubmit = async (values) => {
    // Validate all questions
    const invalidQuestions = questions.filter(q => !q.content.trim());
    if (invalidQuestions.length > 0) {
      message.error('Vui lòng điền nội dung cho tất cả câu hỏi');
      return;
    }

    const quizData = {
      title: values.title,
      description: values.description,
      courseId: courseId || null,
      lessonId: lessonId || null,
      quizType: 'essay', // Mark as essay-only quiz
      questions: questions.map((q, index) => ({
        content: q.content.trim(),
        type: 'essay',
        essayGuideline: q.essayGuideline.trim(),
        essayMaxLength: q.essayMaxLength,
        score: q.score,
        order: index + 1
      }))
    };

    setLoading(true);
    try {
      await onSave(quizData);
      message.success('Tạo quiz tự luận thành công!');
    } catch (error) {
      message.error('Lỗi khi tạo quiz: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="essay-quiz-creator">
      <Card className="creator-card">
        <Title level={3}>Tạo Quiz Tự Luận</Title>
        <Alert
          message="Quiz chỉ chứa câu hỏi tự luận"
          description="Học sinh sẽ viết câu trả lời và AI sẽ tự động chấm điểm dựa trên hướng dẫn bạn cung cấp."
          type="info"
          showIcon
          className="info-alert"
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            title: initialData?.title || '',
            description: initialData?.description || ''
          }}
        >
          <Form.Item
            label="Tiêu đề Quiz"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề quiz" size="large" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
          >
            <TextArea
              placeholder="Mô tả về quiz này"
              rows={3}
            />
          </Form.Item>

          <div className="questions-section">
            <Title level={4}>Câu hỏi tự luận</Title>
            
            {questions.map((question, index) => (
              <Card
                key={question.key}
                className="question-card"
                title={`Câu hỏi ${index + 1}`}
                extra={
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeQuestion(question.key)}
                  >
                    Xóa
                  </Button>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <div>
                    <Text strong>Nội dung câu hỏi *</Text>
                    <TextArea
                      placeholder="Nhập nội dung câu hỏi..."
                      value={question.content}
                      onChange={(e) => updateQuestion(question.key, 'content', e.target.value)}
                      rows={3}
                      className="question-input"
                    />
                  </div>

                  <div>
                    <Text strong>Hướng dẫn chấm điểm cho AI *</Text>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                      AI sẽ dựa vào hướng dẫn này để chấm bài. Hãy mô tả các điểm cần có trong câu trả lời tốt.
                    </Text>
                    <TextArea
                      placeholder="Ví dụ: Câu trả lời tốt cần bao gồm: định nghĩa rõ ràng, ví dụ cụ thể, phân tích sâu..."
                      value={question.essayGuideline}
                      onChange={(e) => updateQuestion(question.key, 'essayGuideline', e.target.value)}
                      rows={4}
                      className="guideline-input"
                    />
                  </div>

                  <Space size="large">
                    <div>
                      <Text strong>Số ký tự tối đa</Text>
                      <InputNumber
                        min={100}
                        max={5000}
                        value={question.essayMaxLength}
                        onChange={(value) => updateQuestion(question.key, 'essayMaxLength', value)}
                        style={{ width: '150px', display: 'block', marginTop: 8 }}
                      />
                    </div>

                    <div>
                      <Text strong>Điểm tối đa</Text>
                      <InputNumber
                        min={1}
                        max={100}
                        value={question.score}
                        onChange={(value) => updateQuestion(question.key, 'score', value)}
                        style={{ width: '150px', display: 'block', marginTop: 8 }}
                      />
                    </div>
                  </Space>
                </Space>
              </Card>
            ))}

            <Button
              type="dashed"
              onClick={addQuestion}
              icon={<PlusOutlined />}
              block
              size="large"
              className="add-question-btn"
            >
              Thêm câu hỏi
            </Button>
          </div>

          <div className="action-buttons">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
              size="large"
            >
              Lưu Quiz
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default EssayQuizCreator;
