import apiClient from "./authService";

// Get course info (title, subtitle, detail, material, thumbnail, trailer, level, duration, section)
export const getCourseInfo = (courseId) =>
  apiClient.get(`/watch-course/${courseId}`);

// Get lesson detail by lessonId
export const getLessonDetail = (lessonId) =>
  apiClient.get(`/watch-course/lesson/${lessonId}`);

// Get all lessons of a course (sections with lessons)
export const getAllLessonsOfCourse = (courseId) =>
  apiClient.get(`/watch-course/${courseId}/lessons`);

// Get all comments of a lesson (correct route)
export const getLessonComments = (lessonId) =>
  apiClient.get(`/watch-course/lesson/${lessonId}/comments`);

// Add a comment to a lesson (correct route)
export const addLessonComment = (lessonId, content) =>
  apiClient.post(`/watch-course/lesson/${lessonId}/comments`, { content });

// Update a comment of a lesson (correct route)
export const updateLessonComment = (lessonId, commentId, content) =>
  apiClient.put(`/watch-course/lesson/${lessonId}/comments/${commentId}`, {
    content,
  });

// Delete a comment of a lesson (correct route)
export const deleteLessonComment = (lessonId, commentId) =>
  apiClient.delete(`/watch-course/lesson/${lessonId}/comments/${commentId}`);

// Mark a lesson as completed
export const markLessonCompleted = (courseId, lessonId) =>
  apiClient.post(`/progress/${courseId}/lessons/${lessonId}/complete`);

// Get course progress for a user (returns progressPercentage)
export const getCourseProgress = (courseId) =>
  apiClient.get(`/progress/${courseId}`);

// Get details of completed lessons for a user in a course
export const getCompletedLessonsDetails = (courseId) =>
  apiClient.get(`/progress/${courseId}/completed-lessons`);
