# Quiz Components - Tự Luận & Trắc Nghiệm Riêng Biệt

## 📋 Tổng quan

Hệ thống quiz hỗ trợ **2 loại quiz riêng biệt**:
1. **Quiz Trắc Nghiệm** - Multiple choice và True/False (flow hiện tại)
2. **Quiz Tự Luận** - Essay questions với AI auto-grading (mới)

## 🎯 Components Mới

### 1. QuizTypeSelector
Component cho phép giảng viên chọn loại quiz muốn tạo.

**Props:**
- `onSelectType`: (type) => void - Callback khi chọn loại quiz
- `defaultType`: string - Loại mặc định ('multiple-choice' | 'essay')

**Usage:**
```jsx
<QuizTypeSelector
  onSelectType={(type) => console.log('Selected:', type)}
  defaultType="essay"
/>
```

### 2. EssayQuizCreator
Component để giảng viên tạo quiz chỉ chứa câu hỏi tự luận.

**Props:**
- `onSave`: (quizData) => Promise - Callback khi lưu quiz
- `initialData`: object - Dữ liệu quiz để edit (optional)
- `courseId`: string - ID khóa học
- `lessonId`: string - ID bài học (optional)

**Quiz Data Structure:**
```javascript
{
  title: string,
  description: string,
  courseId: string,
  lessonId: string,
  quizType: 'essay',
  questions: [
    {
      content: string,           // Nội dung câu hỏi
      type: 'essay',
      essayGuideline: string,    // Hướng dẫn chấm điểm cho AI
      essayMaxLength: number,    // Số ký tự tối đa (default: 1000)
      score: number,             // Điểm tối đa (default: 10)
      order: number
    }
  ]
}
```

**Usage:**
```jsx
<EssayQuizCreator
  onSave={handleSaveQuiz}
  courseId="course123"
  lessonId="lesson456"
/>
```

### 3. EssayQuizTaking
Component để học sinh làm bài quiz tự luận.

**Props:**
- `quiz`: object - Dữ liệu quiz
- `onSubmit`: (submissionData) => Promise - Callback khi nộp bài
- `existingResult`: object - Kết quả cũ nếu làm lại (optional)

**Submission Data Structure:**
```javascript
{
  quizId: string,
  essayAnswers: [
    {
      questionIndex: number,
      questionContent: string,
      studentAnswer: string,
      maxScore: number
    }
  ],
  submittedAt: Date
}
```

**Features:**
- Hiển thị từng câu hỏi với guideline
- Đếm số ký tự real-time
- Giới hạn độ dài câu trả lời
- Timer (nếu quiz có time limit)
- Progress tracking

**Usage:**
```jsx
<EssayQuizTaking
  quiz={quizData}
  onSubmit={handleSubmitQuiz}
  existingResult={previousResult}
/>
```

### 4. EssayQuizResult
Component hiển thị kết quả quiz tự luận với AI grading.

**Props:**
- `quizResult`: object - Kết quả quiz từ backend
- `quiz`: object - Dữ liệu quiz gốc
- `onRetake`: () => void - Callback khi làm lại

**Result Data Structure:**
```javascript
{
  _id: string,
  userId: string,
  quizId: string,
  gradingStatus: 'pending' | 'grading' | 'completed' | 'failed',
  takenAt: Date,
  essayAnswers: [
    {
      questionIndex: number,
      questionContent: string,
      studentAnswer: string,
      aiScore: number,           // Điểm AI chấm
      aiFeedback: string,        // Nhận xét
      strengths: string[],       // Điểm mạnh
      improvements: string[],    // Cần cải thiện
      maxScore: number,
      gradedAt: Date,
      gradingModel: string       // Model AI đã dùng
    }
  ]
}
```

**Features:**
- Hiển thị tổng điểm và phần trăm
- Chi tiết từng câu với feedback từ AI
- Điểm mạnh và cần cải thiện
- Trạng thái chấm điểm (pending/grading/completed)
- Nút làm lại quiz

**Usage:**
```jsx
<EssayQuizResult
  quizResult={result}
  quiz={quizData}
  onRetake={handleRetake}
/>
```

## 🔧 Service Functions

### quizService.js - New Functions

#### createEssayQuiz(quizData)
Tạo quiz tự luận mới.

```javascript
import { createEssayQuiz } from '@/services/quizService';

const quizData = {
  title: 'Quiz Tự Luận Chương 1',
  description: 'Đánh giá kiến thức chương 1',
  courseId: 'course123',
  questions: [
    {
      content: 'Phân tích vai trò của AI trong giáo dục',
      type: 'essay',
      essayGuideline: 'Câu trả lời cần: định nghĩa AI, ví dụ ứng dụng, lợi ích và thách thức',
      essayMaxLength: 1500,
      score: 20
    }
  ]
};

const result = await createEssayQuiz(quizData);
```

#### submitEssayQuiz(quizId, essayAnswers)
Nộp bài quiz tự luận.

```javascript
import { submitEssayQuiz } from '@/services/quizService';

const essayAnswers = [
  {
    questionIndex: 0,
    questionContent: 'Phân tích vai trò của AI...',
    studentAnswer: 'AI đóng vai trò quan trọng...',
    maxScore: 20
  }
];

const result = await submitEssayQuiz('quiz123', essayAnswers);
```

#### gradeEssayAnswers(resultId)
Trigger AI chấm điểm cho bài làm.

```javascript
import { gradeEssayAnswers } from '@/services/quizService';

const gradingResult = await gradeEssayAnswers('result123');
// AI sẽ chấm điểm tự động
```

#### getEssayQuizResult(quizId)
Lấy kết quả quiz với điểm AI đã chấm.

```javascript
import { getEssayQuizResult } from '@/services/quizService';

const result = await getEssayQuizResult('quiz123');
console.log(result.data.essayAnswers); // Có aiScore, aiFeedback, strengths, improvements
```

## 🎬 Flow hoàn chỉnh

### Flow Giảng Viên (Tạo Quiz)

```jsx
import { QuizTypeSelector, EssayQuizCreator } from '@/components/Quiz';
import { createEssayQuiz } from '@/services/quizService';

function InstructorQuizCreation() {
  const [step, setStep] = useState('select');
  const [quizType, setQuizType] = useState(null);

  const handleSelectType = (type) => {
    setQuizType(type);
    if (type === 'essay') {
      setStep('create');
    }
  };

  const handleSaveQuiz = async (quizData) => {
    const result = await createEssayQuiz(quizData);
    message.success('Tạo quiz thành công!');
  };

  return (
    <>
      {step === 'select' && (
        <QuizTypeSelector onSelectType={handleSelectType} />
      )}
      {step === 'create' && quizType === 'essay' && (
        <EssayQuizCreator
          onSave={handleSaveQuiz}
          courseId={courseId}
        />
      )}
    </>
  );
}
```

### Flow Học Sinh (Làm Quiz & Xem Kết Quả)

```jsx
import { EssayQuizTaking, EssayQuizResult } from '@/components/Quiz';
import { submitEssayQuiz, gradeEssayAnswers, getEssayQuizResult } from '@/services/quizService';

function StudentQuizTaking({ quiz }) {
  const [step, setStep] = useState('taking');
  const [result, setResult] = useState(null);

  const handleSubmit = async (submissionData) => {
    // 1. Submit answers
    const submitResult = await submitEssayQuiz(
      submissionData.quizId,
      submissionData.essayAnswers
    );

    // 2. Trigger AI grading
    await gradeEssayAnswers(submitResult.data.resultId);

    // 3. Fetch graded result
    const gradedResult = await getEssayQuizResult(quiz._id);
    setResult(gradedResult.data);
    setStep('result');
  };

  const handleRetake = () => {
    setStep('taking');
    setResult(null);
  };

  return (
    <>
      {step === 'taking' && (
        <EssayQuizTaking
          quiz={quiz}
          onSubmit={handleSubmit}
        />
      )}
      {step === 'result' && (
        <EssayQuizResult
          quizResult={result}
          quiz={quiz}
          onRetake={handleRetake}
        />
      )}
    </>
  );
}
```

## 🔌 Backend API Endpoints Required

### 1. Create Essay Quiz
```
POST /api/quiz/create-essay
Body: {
  title, description, courseId, lessonId, quizType: 'essay',
  questions: [{ content, type: 'essay', essayGuideline, essayMaxLength, score }]
}
Response: { success: true, data: { quiz } }
```

### 2. Submit Essay Quiz
```
POST /api/quiz/:quizId/submit
Body: {
  essayAnswers: [{ questionIndex, questionContent, studentAnswer, maxScore }]
}
Response: { success: true, data: { resultId, gradingStatus: 'pending' } }
```

### 3. Grade Essay Answers
```
POST /api/ai/grade-essay
Body: { resultId }
Response: { success: true, data: { gradingStatus: 'completed' } }
```

### 4. Get Quiz Result
```
GET /api/quiz/:quizId/result
Response: {
  success: true,
  data: {
    quizResult: {
      essayAnswers: [{ aiScore, aiFeedback, strengths, improvements }]
    }
  }
}
```

## 🎨 Styling

Mỗi component có file CSS riêng:
- `QuizTypeSelector.css`
- `EssayQuizCreator.css`
- `EssayQuizTaking.css`
- `EssayQuizResult.css`

Tất cả đều responsive và follow Ant Design theme.

## 📱 Responsive Design

Tất cả components được tối ưu cho:
- Desktop (>1200px)
- Tablet (768px - 1200px)
- Mobile (<768px)

## 🚀 Integration Guide

### 1. Import components
```javascript
import { 
  QuizTypeSelector, 
  EssayQuizCreator, 
  EssayQuizTaking, 
  EssayQuizResult 
} from '@/components/Quiz';
```

### 2. Import services
```javascript
import { 
  createEssayQuiz, 
  submitEssayQuiz, 
  gradeEssayAnswers, 
  getEssayQuizResult 
} from '@/services/quizService';
```

### 3. Use in your pages
Xem file `QuizPage.jsx` để biết ví dụ hoàn chỉnh.

## 🔐 Authentication

Tất cả API calls đều sử dụng `apiClient` từ `authService.js`, tự động attach JWT token.

## ⚠️ Notes

1. **Quiz Type Separation**: Quiz trắc nghiệm và tự luận hoàn toàn tách biệt
2. **AI Grading**: Cần gọi `gradeEssayAnswers()` sau khi submit để trigger AI
3. **Grading Status**: Check `gradingStatus` trước khi hiển thị điểm
4. **Character Limit**: Enforce ở cả frontend và backend
5. **Guidelines**: Hướng dẫn chấm điểm là bắt buộc cho câu hỏi tự luận

## 📞 Support

Nếu có vấn đề, check:
1. Backend API có trả về đúng format không
2. `gradingStatus` có được update không
3. AI service có hoạt động không
4. Console logs để debug

## 🎯 Next Steps

1. Tích hợp vào route hiện có
2. Thêm permission check (instructor vs student)
3. Add loading states
4. Error handling
5. Unit tests
