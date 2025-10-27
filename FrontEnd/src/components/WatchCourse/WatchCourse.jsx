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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const WatchCourse = ({ courseId: propCourseId }) => {
  const params = useParams();
  const courseId = propCourseId || params.courseId;

  // Main course info
  const [courseData, setCourseData] = useState(null);
  const [sections, setSections] = useState([]);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [errorCourse, setErrorCourse] = useState(null);

  // Lesson & comments
  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessonComments, setLessonComments] = useState([]);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [errorLesson, setErrorLesson] = useState(null);
  const [addingComment, setAddingComment] = useState(false);
  const [updatingCommentId, setUpdatingCommentId] = useState(null);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  // UI state
  const [progress, setProgress] = useState(0); // Progress should be dynamic
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Track completed lessons
  const [completedLessons, setCompletedLessons] = useState([]);
  const [courseFeedback, setCourseFeedback] = useState(null);
  const [allLessonsCompleted, setAllLessonsCompleted] = useState(false);

  // Fetch course info and sections/lessons
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

        // Calculate total lessons and check if all are completed
        const totalLessons = sectionsData.reduce((total, section) => {
          return total + (section.lessons ? section.lessons.length : 0);
        }, 0);

        // Get all lesson IDs from sections to ensure accurate comparison
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

        // Set progress percentage
        const progressPercent = progressRes.data?.data?.progressPercentage || 0;
        setProgress(progressPercent);
        // Auto-select first uncompleted lesson
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
        // If all lessons completed, select first lesson
        if (
          !firstUncompleted &&
          sectionsData.length > 0 &&
          sectionsData[0].lessons?.length > 0
        ) {
          firstUncompleted = sectionsData[0].lessons[0];
        }
        // Ensure quiz lessons are prepared properly
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

  // Fetch comments when currentLesson changes
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

  // Comment handlers
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

  // Map API sections/lessons to CourseContents expected format
  // Also compute sequential locking: only lessons up to the first incomplete are unlocked
  let encounteredFirstIncomplete = false;
  const mappedSections = sections.map((section) => {
    const lectures = (section.lessons || []).map((lesson) => {
      const isCompleted = completedLessons.includes(lesson._id);
      let locked = false;
      if (!isCompleted) {
        if (!encounteredFirstIncomplete) {
          locked = false; // first incomplete is unlocked
          encounteredFirstIncomplete = true;
        } else {
          locked = true; // subsequent incompletes are locked
        }
      }
      return {
        ...lesson,
        id: lesson._id,
        completed: isCompleted,
        locked,
      };
    });
    return { ...section, title: section.name, lectures };
  });

  const handleSelectLesson = (lesson) => {
    // Nếu là quiz, cập nhật state nhưng không load video
    if (lesson.type === "quiz") {
      setCurrentLesson({
        ...lesson,
        videoUrl: null, // Không có video cho quiz
        description: "Complete this quiz to proceed to the next lesson.",
        title: lesson.title,
        // ensure quizId is available for QuizContent
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
      // Refetch feedback
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
      // Gọi API cập nhật rating trung bình
      await getCourseAverageRating(courseId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review!");
    }
    setIsReviewModalOpen(false);
  };

  const handleNextLecture = () => {
    if (!currentLesson || !sections.length) return;
    // Tìm section chứa currentLesson
    let found = false;
    for (let i = 0; i < sections.length; i++) {
      const lessons = sections[i].lessons || [];
      for (let j = 0; j < lessons.length; j++) {
        if (lessons[j]._id === currentLesson._id) {
          // Nếu còn bài tiếp theo trong section
          if (j + 1 < lessons.length) {
            setCurrentLesson(lessons[j + 1]);
            return;
          }
          // Nếu hết section, chuyển sang bài đầu của section tiếp theo
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
      <div className="f-watch-course-container">
        <CourseHeader
          courseData={courseData}
          onReviewClick={() => setIsReviewModalOpen(true)}
          reviewMode={!!courseFeedback}
          onNextLecture={handleNextLecture}
          showReviewButton={allLessonsCompleted}
          allLessonsCompleted={allLessonsCompleted}
          isLastLesson={(() => {
            if (!sections?.length || !currentLesson?._id) return false;
            const flat = sections.flatMap((s) => s.lessons || []);
            if (!flat.length) return false;
            const last = flat[flat.length - 1];
            return last?._id === currentLesson._id;
          })()}
        />
      </div>
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
                onQuizComplete={async (quizResult) => {
                  if (quizResult.completed && currentLesson?._id && courseId) {
                    try {
                      // Mark quiz lesson as completed like video lessons
                      await markLessonCompleted(courseId, currentLesson._id);
                      setCompletedLessons((prev) =>
                        prev.includes(currentLesson._id)
                          ? prev
                          : [...prev, currentLesson._id]
                      );

                      // Update progress
                      const progressRes = await getCourseProgress(courseId);
                      const progressPercent =
                        progressRes.data?.data?.progressPercentage || 0;
                      setProgress(progressPercent);

                      // Auto move to next lesson
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
                onNext={handleNextLecture}
                onAutoComplete={async () => {
                  if (currentLesson?._id && courseId) {
                    try {
                      await markLessonCompleted(courseId, currentLesson._id);
                      // refresh completed lessons from server to ensure persistence across reloads
                      try {
                        const completedLessonsRes =
                          await getCompletedLessonsDetails(courseId);
                        const completedLessonsArr = Array.isArray(
                          completedLessonsRes.data?.data
                        )
                          ? completedLessonsRes.data.data.map(
                              (lesson) => lesson._id
                            )
                          : [];
                        setCompletedLessons(completedLessonsArr);
                      } catch (e) {
                        // fallback to optimistic update
                        setCompletedLessons((prev) =>
                          prev.includes(currentLesson._id)
                            ? prev
                            : [...prev, currentLesson._id]
                        );
                      }
                      const progressRes = await getCourseProgress(courseId);
                      const progressPercent =
                        progressRes.data?.data?.progressPercentage || 0;
                      setProgress(progressPercent);
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
                  videoUrl={currentLesson?.videoUrl}
                  onProgress={(progress) => {
                    // Handle video progress
                  }}
                  onEnded={async () => {
                    if (currentLesson?._id && courseId) {
                      try {
                        await markLessonCompleted(courseId, currentLesson._id);
                        setCompletedLessons((prev) =>
                          prev.includes(currentLesson._id)
                            ? prev
                            : [...prev, currentLesson._id]
                        );

                        // Update progress after marking complete
                        const progressRes = await getCourseProgress(courseId);
                        const progressPercent =
                          progressRes.data?.data?.progressPercentage || 0;
                        setProgress(progressPercent);

                        // Check if all lessons are now completed
                        const updatedCompletedLessons =
                          completedLessons.includes(currentLesson._id)
                            ? completedLessons
                            : [...completedLessons, currentLesson._id];

                        const totalLessons = sections.reduce(
                          (total, section) => {
                            return (
                              total +
                              (section.lessons ? section.lessons.length : 0)
                            );
                          },
                          0
                        );

                        const allLessonIds = sections.reduce((ids, section) => {
                          if (section.lessons) {
                            ids.push(
                              ...section.lessons.map((lesson) => lesson._id)
                            );
                          }
                          return ids;
                        }, []);

                        const allCompleted =
                          totalLessons > 0 &&
                          allLessonIds.length > 0 &&
                          allLessonIds.every((lessonId) =>
                            updatedCompletedLessons.includes(lessonId)
                          );
                        setAllLessonsCompleted(allCompleted);
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
