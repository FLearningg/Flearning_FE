import React, { useState } from 'react';
import { message } from 'antd';
import {
  QuizTypeSelector,
  EssayQuizCreator,
  EssayQuizTaking,
  EssayQuizResult
} from '../../components/Quiz';
import {
  createEssayQuiz,
  submitEssayQuiz,
  gradeEssayAnswers,
  getEssayQuizResult
} from '../../services/quizService';
import './QuizPage.css';

/**
 * Example page demonstrating the complete Essay Quiz flow
 * 1. Select quiz type
 * 2. Create essay quiz (instructor)
 * 3. Take essay quiz (student)
 * 4. View results with AI grading
 */
const QuizPage = () => {
  const [step, setStep] = useState('select'); // select, create, take, result
  const [quizType, setQuizType] = useState(null);
  const [createdQuiz, setCreatedQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  // Step 1: Select quiz type
  const handleSelectType = (type) => {
    setQuizType(type);
    if (type === 'essay') {
      setStep('create'); // Go to essay creation
    } else {
      message.info('Quiz trắc nghiệm - sử dụng flow hiện tại của bạn');
      // Redirect to existing multiple choice quiz flow
    }
  };

  // Step 2: Create essay quiz
  const handleSaveEssayQuiz = async (quizData) => {
    try {
      const result = await createEssayQuiz(quizData);
      setCreatedQuiz(result.data.quiz);
      message.success('Tạo quiz tự luận thành công!');
      setStep('take'); // Move to taking quiz
    } catch (error) {
      message.error('Lỗi: ' + error.message);
      throw error;
    }
  };

  // Step 3: Submit essay quiz
  const handleSubmitQuiz = async (submissionData) => {
    try {
      const result = await submitEssayQuiz(
        submissionData.quizId,
        submissionData.essayAnswers
      );

      // Automatically trigger AI grading
      if (result.data.resultId) {
        message.info('Đang gửi bài cho AI chấm điểm...');
        
        const gradingResult = await gradeEssayAnswers(result.data.resultId);
        
        if (gradingResult.success) {
          // Fetch complete result
          const completeResult = await getEssayQuizResult(submissionData.quizId);
          setQuizResult(completeResult.data);
          message.success('AI đã chấm xong!');
          setStep('result');
        }
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
      throw error;
    }
  };

  // Step 4: Retake quiz
  const handleRetake = () => {
    setStep('take');
    setQuizResult(null);
  };

  return (
    <div className="quiz-page">
      {step === 'select' && (
        <QuizTypeSelector
          onSelectType={handleSelectType}
          defaultType="essay"
        />
      )}

      {step === 'create' && (
        <EssayQuizCreator
          onSave={handleSaveEssayQuiz}
          courseId={null} // Replace with actual courseId
          lessonId={null} // Replace with actual lessonId
        />
      )}

      {step === 'take' && createdQuiz && (
        <EssayQuizTaking
          quiz={createdQuiz}
          onSubmit={handleSubmitQuiz}
          existingResult={null}
        />
      )}

      {step === 'result' && quizResult && createdQuiz && (
        <EssayQuizResult
          quizResult={quizResult}
          quiz={createdQuiz}
          onRetake={handleRetake}
        />
      )}
    </div>
  );
};

export default QuizPage;
