import apiClient from "./authService";

// Delete lesson file (video/article)
export const deleteLessonFile = async (lessonId) => {
  try {
    const response = await apiClient.delete(`/admin/lessons/${lessonId}/file`);
    return response.data;
  } catch (error) {
    console.error("Error deleting lesson file:", error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete lesson file";
    throw new Error(message);
  }
};

// Update lesson file (video/article)
export const updateLessonFile = async (lessonId, file) => {
  try {
    // First, upload the file to get the URL
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", "lesson");

    const uploadResponse = await apiClient.post("/admin/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!uploadResponse.data || !uploadResponse.data.url) {
      throw new Error("Failed to upload file");
    }

    // Then, update the lesson with the file URL
    const updateData = {
      fileUrl: uploadResponse.data.url,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    };

    const response = await apiClient.put(`/admin/lessons/${lessonId}/file`, updateData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating lesson file:", error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to update lesson file";
    throw new Error(message);
  }
};

