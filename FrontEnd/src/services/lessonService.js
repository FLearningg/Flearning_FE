import apiClient from "./authService";
import { uploadFile as uploadFileService } from "./uploadService";

// Delete lesson file (video/article)
export const deleteLessonFile = async (lessonId) => {
  try {
    const response = await apiClient.delete(`/instructor/lessons/${lessonId}/file`);
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
    // Upload the file using uploadService (auto-detects role)
    const uploadResponse = await uploadFileService(file, {
      fileType: "lesson",
    });

    if (!uploadResponse || !uploadResponse.url) {
      throw new Error("Failed to upload file");
    }

    // Then, update the lesson with the file URL
    const updateData = {
      fileUrl: uploadResponse.url,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    };

    const response = await apiClient.put(`/instructor/lessons/${lessonId}/file`, updateData, {
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

