import apiClient from "./authService";
import { 
  getSummaryFromCache, 
  saveSummaryToCache 
} from "./summaryStorageService";

/**
 * Summarize video content using AI
 * Kiểm tra localStorage trước, nếu không có thì gọi API và lưu vào localStorage
 * @param {string} materialUrl - Firebase Storage URL of the video
 * @param {string} materialId - Optional material ID for tracking
 * @returns {Promise} API response with summary
 */
export const summarizeVideo = async (materialUrl, materialId = null) => {
  try {
    // Kiểm tra cache trong localStorage trước
    const cachedSummary = getSummaryFromCache(materialUrl, 'video');
    
    if (cachedSummary) {
      console.log("📱 Sử dụng tóm tắt video từ localStorage");
      return {
        success: true,
        message: "Video summary loaded from localStorage",
        data: {
          summary: cachedSummary.summary,
          materialUrl: cachedSummary.materialUrl,
          materialId,
          cached: true,
          cacheSource: 'localStorage',
          meta: {
            ...cachedSummary.metadata,
            loadedAt: new Date().toISOString(),
          }
        }
      };
    }

    // Nếu không có cache, gọi API
    console.log("🌐 Gọi API để tạo tóm tắt video mới");
    const response = await apiClient.post("/ai/summarize-video", {
      materialUrl,
      materialId,
    });

    // Lưu kết quả vào localStorage
    if (response.data.success && response.data.data?.summary) {
      saveSummaryToCache(
        materialUrl, 
        'video', 
        response.data.data.summary,
        {
          materialId,
          model: response.data.data.meta?.model,
          generatedAt: response.data.data.meta?.generatedAt,
          userId: response.data.data.meta?.userId,
        }
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error summarizing video:", error);
    throw error;
  }
};

/**
 * Summarize article/document content using AI
 * Kiểm tra localStorage trước, nếu không có thì gọi API và lưu vào localStorage
 * @param {string} materialUrl - Firebase Storage URL of the document
 * @param {string} materialId - Optional material ID for tracking
 * @returns {Promise} API response with summary
 */
export const summarizeArticle = async (materialUrl, materialId = null) => {
  try {
    // Kiểm tra cache trong localStorage trước
    const cachedSummary = getSummaryFromCache(materialUrl, 'article');
    
    if (cachedSummary) {
      console.log("📱 Sử dụng tóm tắt article từ localStorage");
      return {
        success: true,
        message: "Article summary loaded from localStorage",
        data: {
          summary: cachedSummary.summary,
          materialUrl: cachedSummary.materialUrl,
          materialId,
          cached: true,
          cacheSource: 'localStorage',
          meta: {
            ...cachedSummary.metadata,
            loadedAt: new Date().toISOString(),
          }
        }
      };
    }

    // Nếu không có cache, gọi API
    console.log("🌐 Gọi API để tạo tóm tắt article mới");
    const response = await apiClient.post("/ai/summarize-article", {
      materialUrl,
      materialId,
    });

    // Lưu kết quả vào localStorage
    if (response.data.success && response.data.data?.summary) {
      saveSummaryToCache(
        materialUrl, 
        'article', 
        response.data.data.summary,
        {
          materialId,
          model: response.data.data.meta?.model,
          generatedAt: response.data.data.meta?.generatedAt,
          userId: response.data.data.meta?.userId,
        }
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error summarizing article:", error);
    throw error;
  }
};

/**
 * Generic summarize function that determines type based on material URL or lesson type
 * @param {string} materialUrl - Firebase Storage URL of the material
 * @param {string} lessonType - Type of lesson ('video' or 'article')
 * @param {string} materialId - Optional material ID for tracking
 * @returns {Promise} API response with summary
 */
export const summarizeMaterial = async (materialUrl, lessonType, materialId = null) => {
  if (!materialUrl) {
    throw new Error("Material URL is required");
  }

  if (!lessonType) {
    throw new Error("Lesson type is required");
  }

  switch (lessonType.toLowerCase()) {
    case "video":
      return summarizeVideo(materialUrl, materialId);
    case "article":
      return summarizeArticle(materialUrl, materialId);
    default:
      throw new Error(`Unsupported lesson type: ${lessonType}`);
  }
};
