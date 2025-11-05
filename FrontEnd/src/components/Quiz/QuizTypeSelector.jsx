import React, { useState } from 'react';
import { Card, Radio, Space, Typography, Button, Alert } from 'antd';
import { FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './QuizTypeSelector.css';

const { Title, Text } = Typography;

/**
 * Component for selecting quiz type (Multiple Choice or Essay)
 * Used when instructor creates a new quiz
 */
const QuizTypeSelector = ({ onSelectType, defaultType = 'multiple-choice' }) => {
  const [selectedType, setSelectedType] = useState(defaultType);

  const handleConfirm = () => {
    onSelectType(selectedType);
  };

  return (
    <div className="quiz-type-selector">
      <Card className="selector-card">
        <Title level={3}>Chọn loại Quiz</Title>
        <Text type="secondary">
          Vui lòng chọn loại quiz bạn muốn tạo. Mỗi quiz chỉ có thể chứa một loại câu hỏi.
        </Text>

        <div className="quiz-type-options">
          <Radio.Group
            onChange={(e) => setSelectedType(e.target.value)}
            value={selectedType}
            className="radio-group"
          >
            <Space direction="vertical" size="large">
              <Card
                className={`option-card ${selectedType === 'multiple-choice' ? 'selected' : ''}`}
                onClick={() => setSelectedType('multiple-choice')}
                hoverable
              >
                <Radio value="multiple-choice">
                  <div className="option-content">
                    <CheckCircleOutlined className="option-icon mc-icon" />
                    <div className="option-text">
                      <Title level={4}>Quiz Trắc Nghiệm</Title>
                      <Text>
                        Câu hỏi trắc nghiệm và đúng/sai. Được chấm điểm tự động ngay lập tức.
                      </Text>
                      <ul className="feature-list">
                        <li>Tự động chấm điểm</li>
                        <li>Kết quả tức thì</li>
                        <li>Hỗ trợ ngân hàng câu hỏi</li>
                        <li>Có thể random câu hỏi</li>
                      </ul>
                    </div>
                  </div>
                </Radio>
              </Card>

              <Card
                className={`option-card ${selectedType === 'essay' ? 'selected' : ''}`}
                onClick={() => setSelectedType('essay')}
                hoverable
              >
                <Radio value="essay">
                  <div className="option-content">
                    <FileTextOutlined className="option-icon essay-icon" />
                    <div className="option-text">
                      <Title level={4}>Quiz Tự Luận</Title>
                      <Text>
                        Câu hỏi tự luận yêu cầu học sinh viết câu trả lời. Được chấm bởi AI.
                      </Text>
                      <ul className="feature-list">
                        <li>AI tự động chấm điểm</li>
                        <li>Phản hồi chi tiết từ AI</li>
                        <li>Đánh giá năng lực tư duy</li>
                        <li>Giới hạn độ dài câu trả lời</li>
                      </ul>
                    </div>
                  </div>
                </Radio>
              </Card>
            </Space>
          </Radio.Group>
        </div>

        {selectedType === 'essay' && (
          <Alert
            message="Lưu ý"
            description="Quiz tự luận sẽ được AI chấm điểm tự động. Kết quả có thể mất vài giây để xử lý."
            type="info"
            showIcon
            className="essay-notice"
          />
        )}

        <div className="action-buttons">
          <Button type="primary" size="large" onClick={handleConfirm}>
            Tiếp tục
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizTypeSelector;
