import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import ProctorMonitor from '../../components/Proctoring/ProctorMonitor';
import { EssayQuizTaking } from '../../components/Quiz';
import {
  startProctoringSession,
  logViolation,
  endProctoringSession
} from '../../services/proctoringService';
import { submitEssayQuiz } from '../../services/quizService';
import './ProctorQuizPage.css';

/**
 * Proctored Quiz Taking Page
 * Wraps quiz with proctoring monitor
 * Auto-locks on violations
 */
const ProctorQuizPage = ({ quiz, onComplete }) => {
  const [proctoringSessionId, setProctoringSessionId] = useState(null);
  const [quizLocked, setQuizLocked] = useState(false);
  const [lockReason, setLockReason] = useState('');

  useEffect(() => {
    // Start proctoring when component mounts
    initProctoring();

    return () => {
      // End proctoring when component unmounts
      if (proctoringSessionId) {
        endProctoring('completed');
      }
    };
  }, []);

  /**
   * Initialize proctoring session
   */
  const initProctoring = async () => {
    try {
      const result = await startProctoringSession(quiz._id);
      
      if (result.success) {
        setProctoringSessionId(result.data.sessionId);
        message.success('Bắt đầu giám sát. Vui lòng giữ toàn màn hình và camera bật.');
      }
    } catch (error) {
      message.error('Không thể khởi động giám sát: ' + error.message);
    }
  };

  /**
   * Handle violation detected
   */
  const handleViolation = async (sessionId, violationType, details) => {
    try {
      const result = await logViolation(sessionId, violationType, details);

      if (result.success) {
        // Check if locked
        if (result.data.isLocked) {
          setQuizLocked(true);
          setLockReason(result.data.lockReason);
          
          // End session as locked
          await endProctoring('locked');
          
          message.error('Bài thi đã bị khóa do vi phạm!');
        }

        // Return data for ProctorMonitor to update UI
        return result.data;
      }
    } catch (error) {
      console.error('Failed to log violation:', error);
    }
  };

  /**
   * Handle quiz locked
   */
  const handleLocked = async (reason) => {
    setQuizLocked(true);
    setLockReason(reason);
    
    message.error({
      content: 'Bài thi bị khóa: ' + reason,
      duration: 0 // Don't auto close
    });

    // End proctoring session
    if (proctoringSessionId) {
      await endProctoring('locked');
    }

    // Notify parent after 3 seconds
    setTimeout(() => {
      if (onComplete) {
        onComplete({ locked: true, reason });
      }
    }, 3000);
  };

  /**
   * End proctoring session
   */
  const endProctoring = async (status) => {
    if (!proctoringSessionId) return;

    try {
      await endProctoringSession(proctoringSessionId, status);
    } catch (error) {
      console.error('Failed to end proctoring:', error);
    }
  };

  /**
   * Handle quiz submission
   */
  const handleQuizSubmit = async (submissionData) => {
    try {
      // Add proctoring session ID to submission
      const result = await submitEssayQuiz(
        submissionData.quizId,
        submissionData.essayAnswers
      );

      // End proctoring as completed
      if (proctoringSessionId) {
        await endProctoring('completed');
      }

      message.success('Nộp bài thành công!');

      // Notify parent
      if (onComplete) {
        onComplete({ 
          locked: false, 
          resultId: result.data.resultId,
          proctoringSessionId 
        });
      }
    } catch (error) {
      message.error('Lỗi khi nộp bài: ' + error.message);
      throw error;
    }
  };

  return (
    <ProctorMonitor
      sessionId={proctoringSessionId}
      onViolation={handleViolation}
      onLocked={handleLocked}
      isActive={!quizLocked}
    >
      {!quizLocked ? (
        <EssayQuizTaking
          quiz={quiz}
          onSubmit={handleQuizSubmit}
        />
      ) : (
        <div className="quiz-locked-message">
          <h2>Bài thi đã bị khóa</h2>
          <p>{lockReason}</p>
          <p>Vui lòng liên hệ giảng viên để được hỗ trợ.</p>
        </div>
      )}
    </ProctorMonitor>
  );
};

export default ProctorQuizPage;
