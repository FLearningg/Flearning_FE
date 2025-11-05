import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import ArticleContent from "./ArticleContent";
import CourseContents from "./CourseContents";
import CourseInfo from "./CourseInfo";
import CourseHeader from "./CourseHeader";
import ReviewModal from "./ReviewModal";
import QuizContent from "./QuizContent";
import "../../assets/WatchCourse/WatchCourse.css";
import {
  getCourseInfo,
  getAllLessonsOfCourse,
  getLessonComments,
  addLessonComment,
  updateLessonComment,
  deleteLessonComment,
  markLessonCompleted,
  getCourseProgress,
  getCompletedLessonsDetails,
} from "../../services/watchCourseService";
import {
  getCourseFeedback,
  createCourseFeedback,
  updateCourseFeedback,
  getCourseAverageRating,
} from "../../services/feedbackService";
import certificateService from "../../services/certificateService";
// SỬA 1: Import CertificateDisplay, XÓA CourseCompletedModal
import CertificateDisplay from "./CertificateDisplay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Confetti from "react-confetti";
import useWindowSize from "../../hooks/useWindowSize";

const WatchCourse = ({ courseId: propCourseId }) => {
  const params = useParams();
  const courseId = propCourseId || params.courseId;

  // (Các state khác giữ nguyên)
  const [courseData, setCourseData] = useState(null);
  const [sections, setSections] = useState([]);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [errorCourse, setErrorCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessonComments, setLessonComments] = useState([]);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [errorLesson, setErrorLesson] = useState(null);
  const [addingComment, setAddingComment] = useState(false);
  const [updatingCommentId, setUpdatingCommentId] = useState(null);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [courseFeedback, setCourseFeedback] = useState(null);
  const [allLessonsCompleted, setAllLessonsCompleted] = useState(false);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  // SỬA 2: Xóa state của modal
  // const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  // (useEffect fetch khóa học, feedback, comments giữ nguyên)
  useEffect(() => {
    if (!courseId) return;
    setLoadingCourse(true);
    setErrorCourse(null);
    Promise.all([
      getCourseInfo(courseId),
      getAllLessonsOfCourse(courseId),
      getCompletedLessonsDetails(courseId),
      getCourseProgress(courseId),
    ])
      .then(([courseRes, sectionsRes, completedLessonsRes, progressRes]) => {
        setCourseData(courseRes.data);
        const sectionsData = sectionsRes.data.sections || [];
        setSections(sectionsData);
        const completedLessonsArr = Array.isArray(
          completedLessonsRes.data?.data
        )
          ? completedLessonsRes.data.data.map((lesson) => lesson._id)
          : [];
        setCompletedLessons(completedLessonsArr);
        const totalLessons = sectionsData.reduce((total, section) => {
          return total + (section.lessons ? section.lessons.length : 0);
        }, 0);
        const allLessonIds = sectionsData.reduce((ids, section) => {
          if (section.lessons) {
            ids.push(...section.lessons.map((lesson) => lesson._id));
          }
          return ids;
        }, []);
        const allCompleted =
          totalLessons > 0 &&
          allLessonIds.length > 0 &&
          allLessonIds.every((lessonId) =>
            completedLessonsArr.includes(lessonId)
          );
        setAllLessonsCompleted(allCompleted);
        if (allCompleted) {
          setShowConfetti(true);
        }
        const progressPercent = progressRes.data?.data?.progressPercentage || 0;
        setProgress(progressPercent);
        let firstUncompleted = null;
        for (const section of sectionsData) {
          for (const lesson of section.lessons || []) {
            if (!completedLessonsArr.includes(lesson._id)) {
              firstUncompleted = lesson;
              break;
            }
          }
          if (firstUncompleted) break;
        }
        if (
          !firstUncompleted &&
          sectionsData.length > 0 &&
          sectionsData[0].lessons?.length > 0
        ) {
          firstUncompleted = sectionsData[0].lessons[0];
        }
        if (firstUncompleted?.type === "quiz") {
          setCurrentLesson({
            ...firstUncompleted,
            id: firstUncompleted._id,
            videoUrl: null,
            description:
              firstUncompleted.description ||
              "Complete this quiz to proceed to the next lesson.",
            title: firstUncompleted.title,
            quizId:
              firstUncompleted?.quizId?._id ||
              firstUncompleted?.quizId ||
              (Array.isArray(firstUncompleted?.quizIds)
                ? firstUncompleted.quizIds[0]
                : undefined),
          });
        } else {
          setCurrentLesson(firstUncompleted);
        }
        setLoadingCourse(false);
      })
      .catch((err) => {
        setErrorCourse(err.response?.data?.message || "Lỗi khi tải khoá học");
        setLoadingCourse(false);
      });
  }, [courseId]);

  useEffect(() => {
    if (!courseId) return;
    getCourseFeedback(courseId)
      .then((res) => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const myFeedback = res.feedback.find((fb) => {
          if (!fb.userId) return false;
          if (typeof fb.userId === "string") {
            return (
              fb.userId === currentUser._id || fb.userId === currentUser.id
            );
          }
          return (
            fb.userId._id === currentUser._id ||
            fb.userId._id === currentUser.id
          );
        });
        setCourseFeedback(myFeedback || null);
      })
      .catch(() => setCourseFeedback(null));
  }, [courseId]);

  useEffect(() => {
    if (!currentLesson?._id) {
      setLessonComments([]);
      return;
    }
    setLoadingLesson(true);
    setErrorLesson(null);
    getLessonComments(currentLesson._id)
      .then((res) => {
        setLessonComments(res.data.comments || []);
        setLoadingLesson(false);
      })
      .catch((err) => {
        setErrorLesson(err.response?.data?.message || "Lỗi khi tải bình luận");
        setLoadingLesson(false);
      });
  }, [currentLesson]);

  // SỬA 3: Cập nhật Certificate handler (xóa setIsCompletedModalOpen)
  useEffect(() => {
    if (
      allLessonsCompleted &&
      !certificate &&
      !isGeneratingCertificate &&
      courseId
    ) {
      const createCertificateForUser = async () => {
        // XÓA DÒNG NÀY: setIsCompletedModalOpen(true);
        setIsGeneratingCertificate(true);

        try {
          const res = await certificateService.generateCertificate(courseId);
          setCertificate(res.data.certificate);
          setIsGeneratingCertificate(false);
        } catch (err) {
          console.error("Lỗi khi tạo chứng chỉ:", err);
          toast.error(
            err.response?.data?.message || "Có lỗi xảy ra khi tạo chứng chỉ."
          );
          setIsGeneratingCertificate(false);
        }
      };

      createCertificateForUser();
    }
  }, [allLessonsCompleted, courseId, certificate, isGeneratingCertificate]);

  // Hàm checkCourseCompletion (giữ nguyên)
  const checkCourseCompletion = async (updatedCompletedList) => {
    try {
      const progressRes = await getCourseProgress(courseId);
      const progressPercent = progressRes.data?.data?.progressPercentage || 0;
      setProgress(progressPercent);
      const totalLessons = sections.reduce((total, section) => {
        return total + (section.lessons ? section.lessons.length : 0);
      }, 0);
      const allLessonIds = sections.reduce((ids, section) => {
        if (section.lessons) {
          ids.push(...section.lessons.map((lesson) => lesson._id));
        }
        return ids;
      }, []);
      const allCompleted =
        totalLessons > 0 &&
        allLessonIds.length > 0 &&
        allLessonIds.every((lessonId) =>
          updatedCompletedList.includes(lessonId)
        );
      setAllLessonsCompleted(allCompleted);
      if (allCompleted) {
        console.log("REAL-TIME: Khóa học đã hoàn thành!");

        setShowConfetti(true);
      }
    } catch (e) {
      console.error("Lỗi khi kiểm tra tiến độ:", e);
    }
  };

  // (Các hàm handle comment, review, lesson... giữ nguyên)
  const handleAddComment = async (content) => {
    if (!currentLesson?._id || !content) return;
    setAddingComment(true);
    try {
      const res = await addLessonComment(currentLesson._id, content);
      toast.success(res.data?.message || "Comment added successfully!");
      const commentsRes = await getLessonComments(currentLesson._id);
      setLessonComments(commentsRes.data.comments || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment!");
    } finally {
      setAddingComment(false);
    }
  };
  const handleUpdateComment = async (commentId, content) => {
    if (!currentLesson?._id || !commentId || !content) return;
    setUpdatingCommentId(commentId);
    try {
      const res = await updateLessonComment(
        currentLesson._id,
        commentId,
        content
      );
      toast.success(res.data?.message || "Comment updated successfully!");
      const commentsRes = await getLessonComments(currentLesson._id);
      setLessonComments(commentsRes.data.comments || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update comment!");
    } finally {
      setUpdatingCommentId(null);
    }
  };
  const handleDeleteComment = async (commentId) => {
    if (!currentLesson?._id || !commentId) return;
    setDeletingCommentId(commentId);
    try {
      const res = await deleteLessonComment(currentLesson._id, commentId);
      toast.success(res.data?.message || "Comment deleted successfully!");
      const commentsRes = await getLessonComments(currentLesson._id);
      setLessonComments(commentsRes.data.comments || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete comment!");
    } finally {
      setDeletingCommentId(null);
    }
  };
  let encounteredFirstIncomplete = false;
  const mappedSections = sections.map((section) => {
    const lectures = (section.lessons || []).map((lesson) => {
      const isCompleted = completedLessons.includes(lesson._id);
      let locked = false;
      if (!isCompleted) {
        if (!encounteredFirstIncomplete) {
          locked = false;
          encounteredFirstIncomplete = true;
        } else {
          locked = true;
        }
      }
      return { ...lesson, id: lesson._id, completed: isCompleted, locked };
    });
    return { ...section, title: section.name, lectures };
  });
  const handleSelectLesson = (lesson) => {
    if (lesson.type === "quiz") {
      setCurrentLesson({
        ...lesson,
        videoUrl: null,
        description: "Complete this quiz to proceed to the next lesson.",
        title: lesson.title,
        quizId:
          lesson.quizId?._id ||
          lesson.quizId ||
          (Array.isArray(lesson.quizIds) ? lesson.quizIds[0] : undefined),
      });
    } else {
      setCurrentLesson(lesson);
    }
  };
  const handleReviewSubmit = async ({ rating, feedback }) => {
    try {
      if (courseFeedback) {
        await updateCourseFeedback(courseId, {
          content: feedback,
          rateStar: rating,
        });
        toast.success("Review updated successfully!");
      } else {
        await createCourseFeedback(courseId, {
          content: feedback,
          rateStar: rating,
        });
        toast.success("Review submitted successfully!");
      }
      const res = await getCourseFeedback(courseId);
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const myFeedback = res.feedback.find((fb) => {
        if (!fb.userId) return false;
        if (typeof fb.userId === "string") {
          return fb.userId === currentUser._id || fb.userId === currentUser.id;
        }
        return (
          fb.userId._id === currentUser._id || fb.userId._id === currentUser.id
        );
      });
      setCourseFeedback(myFeedback || null);
      await getCourseAverageRating(courseId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review!");
    }
    setIsReviewModalOpen(false);
  };
  const handleNextLecture = () => {
    if (!currentLesson || !sections.length) return;
    let found = false;
    for (let i = 0; i < sections.length; i++) {
      const lessons = sections[i].lessons || [];
      for (let j = 0; j < lessons.length; j++) {
        if (lessons[j]._id === currentLesson._id) {
          if (j + 1 < lessons.length) {
            setCurrentLesson(lessons[j + 1]);
            return;
          }
          if (i + 1 < sections.length && sections[i + 1].lessons?.length > 0) {
            setCurrentLesson(sections[i + 1].lessons[0]);
            return;
          }
          found = true;
          break;
        }
      }
      if (found) break;
    }
  };

  if (loadingCourse) return <div>Loading...</div>;
  if (errorCourse) return <div style={{ color: "red" }}>{errorCourse}</div>;
  if (!courseData) return <div>Không tìm thấy khoá học.</div>;

  return (
    <div className="f-watch-course-wrapper">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false} // Chạy 1 lần rồi ngưng
          onConfettiComplete={() => setShowConfetti(false)} // Tự động dọn dẹp
          style={{ zIndex: 2000 }} // Đảm bảo nó nằm trên cùng
        />
      )}
      <div className="f-watch-course-container">
        <CourseHeader
          courseData={courseData}
          onReviewClick={() => setIsReviewModalOpen(true)}
          reviewMode={!!courseFeedback}
          onNextLecture={handleNextLecture}
          showReviewButton={allLessonsCompleted}
          allLessonsCompleted={allLessonsCompleted}
          // SỬA 4: Sửa lại key cho đúng (url -> certificateUrl)
          certificateUrl={certificate?.certificateUrl}
          isGeneratingCertificate={isGeneratingCertificate}
          isLastLesson={(() => {
            if (!sections?.length || !currentLesson?._id) return false;
            const flat = sections.flatMap((s) => s.lessons || []);
            if (!flat.length) return false;
            const last = flat[flat.length - 1];
            return last?._id === currentLesson._id;
          })()}
        />
      </div>

      {/* SỬA 5: Thêm component CertificateDisplay ở đây */}
      {allLessonsCompleted && (
        <CertificateDisplay
          isGenerating={isGeneratingCertificate}
          certificate={certificate}
          courseTitle={courseData?.title || ""}
        />
      )}

      <div className="f-watch-course-main">
        <div className="f-watch-course-left">
          {currentLesson?.type === "quiz" ||
          Boolean(currentLesson?.quizData?.questions?.length) ? (
            <div className="f-quiz-section">
              <QuizContent
                lessonId={currentLesson?._id || currentLesson?.id}
                quizId={
                  currentLesson?.quizId?._id ||
                  currentLesson?.quizId ||
                  (Array.isArray(currentLesson?.quizIds)
                    ? currentLesson.quizIds[0]
                    : undefined)
                }
                quizData={currentLesson?.quizData}
                duration={currentLesson?.duration}
                // SỬA 6 (REAL-TIME): Cập nhật onQuizComplete
                onQuizComplete={async (quizResult) => {
                  if (quizResult.completed && currentLesson?._id && courseId) {
                    try {
                      await markLessonCompleted(courseId, currentLesson._id);
                      const updatedCompletedLessons = completedLessons.includes(
                        currentLesson._id
                      )
                        ? completedLessons
                        : [...completedLessons, currentLesson._id];
                      setCompletedLessons(updatedCompletedLessons);
                      // Gọi hàm check real-time
                      await checkCourseCompletion(updatedCompletedLessons);
                      handleNextLecture();
                    } catch (e) {
                      console.error("Error updating completion after quiz:", e);
                    }
                  }
                }}
              />
            </div>
          ) : currentLesson?.type === "article" ? (
            <div className="f-article-section">
              <ArticleContent
                title={currentLesson?.title}
                description={currentLesson?.description}
                lessonNotes={currentLesson?.lessonNotes}
                materialUrl={currentLesson?.materialUrl}
                lessonId={currentLesson?._id}
                onNext={handleNextLecture}
                // SỬA 7 (REAL-TIME): Cập nhật onAutoComplete
                onAutoComplete={async () => {
                  if (currentLesson?._id && courseId) {
                    try {
                      await markLessonCompleted(courseId, currentLesson._id);
                      const updatedCompletedLessons = completedLessons.includes(
                        currentLesson._id
                      )
                        ? completedLessons
                        : [...completedLessons, currentLesson._id];
                      setCompletedLessons(updatedCompletedLessons);
                      // Gọi hàm check real-time
                      await checkCourseCompletion(updatedCompletedLessons);
                    } catch (e) {
                      console.error("Error auto-completing article:", e);
                    }
                  }
                }}
              />
            </div>
          ) : (
            <>
              <div className="f-video-section">
                <VideoPlayer
                  videoUrl={
                    currentLesson?.materialUrl || currentLesson?.videoUrl
                  }
                  lessonTitle={currentLesson?.title}
                  lessonId={currentLesson?._id}
                  onProgress={(progress) => {
                    // Handle video progress
                  }}
                  // SỬA 8 (REAL-TIME): Cập nhật onEnded
                  onEnded={async () => {
                    if (currentLesson?._id && courseId) {
                      try {
                        await markLessonCompleted(courseId, currentLesson._id);
                        const updatedCompletedLessons =
                          completedLessons.includes(currentLesson._id)
                            ? completedLessons
                            : [...completedLessons, currentLesson._id];
                        setCompletedLessons(updatedCompletedLessons);
                        // Gọi hàm check real-time
                        await checkCourseCompletion(updatedCompletedLessons);
                      } catch (err) {
                        console.error("Error marking lesson completed:", err);
                      }
                    }
                  }}
                />
              </div>
              <div className="f-course-info-section">
                <CourseInfo
                  lesson={currentLesson}
                  students={courseData?.studentsCount}
                  lastUpdated={courseData?.lastUpdated}
                  commentsCount={lessonComments.length}
                  loading={loadingLesson}
                  error={errorLesson}
                  comments={lessonComments}
                  onAddComment={handleAddComment}
                  onUpdateComment={handleUpdateComment}
                  onDeleteComment={handleDeleteComment}
                  addingComment={addingComment}
                  updatingCommentId={updatingCommentId}
                  deletingCommentId={deletingCommentId}
                />
              </div>
            </>
          )}
        </div>
        <div className="f-content-section">
          <CourseContents
            contents={mappedSections}
            currentLesson={currentLesson}
            progress={progress}
            onSelectLesson={handleSelectLesson}
          />
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        defaultRating={courseFeedback?.rateStar || 0}
        defaultFeedback={courseFeedback?.content || ""}
        reviewMode={!!courseFeedback}
      />

      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default WatchCourse;
