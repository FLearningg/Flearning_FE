import React, { useState } from "react";
import { FaBook, FaClock, FaUsers } from "react-icons/fa";
import "../../assets/WatchCourse/CourseInfo.css";
import "../../assets/WatchCourse/CourseTabs.css";
import { useSelector } from "react-redux";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

const CourseInfo = ({
  lesson,
  students,
  lastUpdated,
  comments = [],
  commentsCount,
  loading,
  error,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  addingComment,
  updatingCommentId,
  deletingCommentId,
}) => {
  const { currentUser } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("description");
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  // Phân trang comment
  const [commentPage, setCommentPage] = useState(1);
  const commentsPerPage = 5;
  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const pagedComments = comments.slice(
    (commentPage - 1) * commentsPerPage,
    commentPage * commentsPerPage
  );

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const tabs = [
    { id: "description", label: "Description" },
    { id: "notes", label: "Lesson Notes" },
    { id: "attachments", label: "Attach File" },
    { id: "comments", label: "Comments" },
  ];

  const handleAdd = () => {
    if (newComment.trim()) {
      onAddComment && onAddComment(newComment);
      setNewComment("");
    }
  };

  const handleEdit = (comment) => {
    setEditCommentId(comment._id);
    setEditContent(comment.content);
  };

  const handleUpdate = (commentId) => {
    if (editContent.trim()) {
      onUpdateComment && onUpdateComment(commentId, editContent);
      setEditCommentId(null);
      setEditContent("");
    }
  };

  const handleDelete = (commentId) => {
    setPendingDeleteId(commentId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (pendingDeleteId) {
      onDeleteComment && onDeleteComment(pendingDeleteId);
      setPendingDeleteId(null);
      setDeleteModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
    setDeleteModalOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="ci-description-content">
            <h3>{lesson?.title}</h3>
            <p>{lesson?.description}</p>
          </div>
        );
      case "notes":
        return (
          <div className="ci-notes-content">
            <h3>Lesson Notes</h3>
            <div>{lesson?.lessonNotes || <i>No notes for this lesson.</i>}</div>
          </div>
        );
      case "attachments":
        return (
          <div className="ci-attachments-content">
            {lesson?.attachments && lesson.attachments.length > 0 ? (
              lesson.attachments.map((file, index) => (
                <div key={index} className="ci-attachment-item">
                  <span className="ci-file-icon">📎</span>
                  <span className="ci-file-name">{file.name}</span>
                  <a href={file.url} download className="ci-download-button">
                    Download
                  </a>
                </div>
              ))
            ) : (
              <i>No attachments for this lesson.</i>
            )}
          </div>
        );
      case "comments":
        return (
          <div className="ci-comments-content">
            <div className="ci-comments-header">
              <h3>Discussion ({commentsCount})</h3>
            </div>
            {loading && <div>Loading comments...</div>}
            {error && <div style={{ color: "red" }}>{error}</div>}
            <div className="ci-add-comment-section">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                disabled={addingComment}
              />
              <button
                onClick={handleAdd}
                disabled={addingComment || !newComment.trim()}
              >
                {addingComment ? "Adding..." : "Add Comment"}
              </button>
            </div>
            <div className="ci-comments-list">
              {comments.length === 0 && <div>No comments yet.</div>}
              {pagedComments.map((comment) => {
                const isAuthor =
                  currentUser && comment.authorId?._id === currentUser._id;
                return (
                  <div key={comment._id} className="ci-comment-item">
                    {comment.authorId?.userImage ? (
                      <img
                        className="ci-comment-avatar"
                        src={comment.authorId.userImage}
                        alt={comment.authorId?.firstName || "avatar"}
                      />
                    ) : (
                      <div
                        className="ci-comment-avatar"
                        style={{ background: "#e6e6e6" }}
                      ></div>
                    )}
                    <div className="ci-comment-main">
                      <div className="ci-comment-header">
                        <span className="ci-comment-author">
                          {comment.authorId?.firstName}{" "}
                          {comment.authorId?.lastName}
                        </span>
                        {comment.authorId?.role === "admin" && (
                          <span className="ci-comment-admin-badge">ADMIN</span>
                        )}
                        <span className="ci-comment-date">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {editCommentId === comment._id ? (
                        <div className="ci-edit-comment-section">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            disabled={updatingCommentId === comment._id}
                          />
                          <button
                            onClick={() => handleUpdate(comment._id)}
                            disabled={
                              updatingCommentId === comment._id ||
                              !editContent.trim()
                            }
                          >
                            {updatingCommentId === comment._id
                              ? "Saving..."
                              : "Save"}
                          </button>
                          <button
                            onClick={() => setEditCommentId(null)}
                            disabled={updatingCommentId === comment._id}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="ci-comment-content">
                          {comment.content}
                        </div>
                      )}
                      <div className="ci-comment-actions">
                        {isAuthor && editCommentId !== comment._id && (
                          <>
                            <button
                              onClick={() => handleEdit(comment)}
                              disabled={updatingCommentId === comment._id}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(comment._id)}
                              disabled={deletingCommentId === comment._id}
                            >
                              {deletingCommentId === comment._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="ci-comment-pagination">
                <button
                  onClick={() => setCommentPage((p) => Math.max(1, p - 1))}
                  disabled={commentPage === 1}
                >
                  Prev
                </button>
                <span>
                  Page {commentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCommentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={commentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ci-course-info">
      <div className="ci-info-header">
        <div className="ci-lesson-stats">
          <div className="ci-stat-item">
            <FaBook className="ci-stat-icon" />
            <span>{students} students</span>
          </div>
          <div className="ci-stat-item">
            <FaClock className="ci-stat-icon" />
            <span>Last updated: {formatDate(lastUpdated)}</span>
          </div>
          <div className="ci-stat-item">
            <FaUsers className="ci-stat-icon" />
            <span>{commentsCount} comments</span>
          </div>
        </div>
      </div>

      <div className="course-tabs-container">
        <div className="course-tabs">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`course-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>

      <div className="ci-tab-content">{renderContent()}</div>
      {deleteModalOpen && (
        <div className="ci-modal-overlay">
          <div className="ci-modal">
            <h4>Confirm Delete</h4>
            <p>Are you sure you want to delete this comment?</p>
            <div className="ci-modal-actions">
              <button onClick={confirmDelete}>Yes, Delete</button>
              <button onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseInfo;
