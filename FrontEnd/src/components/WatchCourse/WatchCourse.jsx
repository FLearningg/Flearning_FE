import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import CourseContents from "./CourseContents";
import CourseInfo from "./CourseInfo";
import CourseHeader from "./CourseHeader";
import ReviewModal from "./ReviewModal";
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

        // Debug logging
        console.log("Course completion status:", {
          totalLessons,
          completedLessons: completedLessonsArr.length,
          allLessonIds: allLessonIds.length,
          allCompleted,
        });

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
        setCurrentLesson(firstUncompleted);
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
  const mappedSections = sections.map((section) => ({
    ...section,
    title: section.name,
    lectures: (section.lessons || []).map((lesson) => ({
      ...lesson,
      id: lesson._id,
      completed: completedLessons.includes(lesson._id),
    })),
  }));

  const handleSelectLesson = (lesson) => {
    setCurrentLesson(lesson);
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
        />
      </div>
      <div className="f-watch-course-main">
        <div className="f-watch-course-left">
          <div className="f-video-section">
            <VideoPlayer
              videoUrl={currentLesson?.videoUrl}
              onProgress={(progress) => {
                // Handle video progress
              }}
              onEnded={async () => {
                if (currentLesson?._id && courseId) {
                  console.log(
                    "Video ended, marking lesson as completed:",
                    courseId,
                    currentLesson._id
                  );
                  try {
                    await markLessonCompleted(courseId, currentLesson._id);
                    console.log(
                      "Lesson marked as completed:",
                      currentLesson._id
                    );
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
                    const updatedCompletedLessons = completedLessons.includes(
                      currentLesson._id
                    )
                      ? completedLessons
                      : [...completedLessons, currentLesson._id];

                    const totalLessons = sections.reduce((total, section) => {
                      return (
                        total + (section.lessons ? section.lessons.length : 0)
                      );
                    }, 0);

                    // Get all lesson IDs from sections to ensure accurate comparison
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

                    // Debug logging
                    console.log("Updated course completion status:", {
                      totalLessons,
                      completedLessons: updatedCompletedLessons.length,
                      allLessonIds: allLessonIds.length,
                      allCompleted,
                    });
                  } catch (err) {
                    console.error("Error marking lesson completed:", err);
                    // Optionally: handle error
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
