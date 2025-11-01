import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  surveyService,
  recommendationService,
} from "../services/learningPathService";

// Async thunks
export const submitSurvey = createAsyncThunk(
  "learningPath/submitSurvey",
  async (surveyData, { rejectWithValue }) => {
    try {
      const response = await surveyService.submitSurvey(surveyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to submit survey");
    }
  }
);

export const fetchPreferences = createAsyncThunk(
  "learningPath/fetchPreferences",
  async (_, { rejectWithValue }) => {
    try {
      const response = await surveyService.getPreferences();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch preferences");
    }
  }
);

export const updatePreferences = createAsyncThunk(
  "learningPath/updatePreferences",
  async (updateData, { rejectWithValue }) => {
    try {
      const response = await surveyService.updatePreferences(updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update preferences");
    }
  }
);

export const checkSurveyCompletion = createAsyncThunk(
  "learningPath/checkCompletion",
  async (_, { rejectWithValue }) => {
    try {
      const response = await surveyService.checkCompletion();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to check survey completion"
      );
    }
  }
);

export const generateLearningPath = createAsyncThunk(
  "learningPath/generate",
  // payload: optional - pass {} for AI auto-generate, or custom path data
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await recommendationService.generateLearningPath(
        payload
      );
      console.log("✅ generateLearningPath thunk response:", response);
      return response;
    } catch (error) {
      console.error("❌ generateLearningPath thunk error:", error);
      return rejectWithValue(
        error.message || "Failed to generate learning path"
      );
    }
  }
);

export const fetchLearningPath = createAsyncThunk(
  "learningPath/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await recommendationService.getLearningPath();
      console.log("📊 fetchLearningPath response:", response);
      return response;
    } catch (error) {
      console.error("❌ fetchLearningPath error:", error);
      // Return a specific error for 404 so we can handle it differently
      if (error.success === false || error.message?.includes("not found")) {
        return rejectWithValue({ notFound: true, message: error.message });
      }
      return rejectWithValue(error.message || "Failed to fetch learning path");
    }
  }
);

// Initial state
const initialState = {
  // Survey state
  preferences: null,
  surveyCompleted: false,
  surveyLoading: false,
  surveyError: null,

  // Learning path state
  learningPath: null,
  pathLoading: false,
  pathError: null,

  // UI state
  showSurveyModal: false,
  currentStep: 1,
};

// Slice
const learningPathSlice = createSlice({
  name: "learningPath",
  initialState,
  reducers: {
    // UI actions
    openSurveyModal: (state) => {
      state.showSurveyModal = true;
      state.currentStep = 1;
    },
    closeSurveyModal: (state) => {
      state.showSurveyModal = false;
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < 6) {
        state.currentStep += 1;
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    resetSurveyState: (state) => {
      state.preferences = null;
      state.surveyCompleted = false;
      state.surveyError = null;
      state.currentStep = 1;
    },
    clearPathError: (state) => {
      state.pathError = null;
    },
  },
  extraReducers: (builder) => {
    // Submit survey
    builder
      .addCase(submitSurvey.pending, (state) => {
        state.surveyLoading = true;
        state.surveyError = null;
      })
      .addCase(submitSurvey.fulfilled, (state, action) => {
        state.surveyLoading = false;
        state.preferences = action.payload.learningPreferences;
        state.surveyCompleted = true;
        state.showSurveyModal = false;
      })
      .addCase(submitSurvey.rejected, (state, action) => {
        state.surveyLoading = false;
        state.surveyError = action.payload;
      });

    // Fetch preferences
    builder
      .addCase(fetchPreferences.pending, (state) => {
        state.surveyLoading = true;
        state.surveyError = null;
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.surveyLoading = false;
        state.preferences = action.payload.learningPreferences;
        state.surveyCompleted =
          action.payload.learningPreferences?.surveyCompleted || false;
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.surveyLoading = false;
        state.surveyError = action.payload;
      });

    // Update preferences
    builder
      .addCase(updatePreferences.pending, (state) => {
        state.surveyLoading = true;
        state.surveyError = null;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.surveyLoading = false;
        state.preferences = action.payload.learningPreferences;
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.surveyLoading = false;
        state.surveyError = action.payload;
      });

    // Check survey completion
    builder
      .addCase(checkSurveyCompletion.pending, (state) => {
        state.surveyLoading = true;
      })
      .addCase(checkSurveyCompletion.fulfilled, (state, action) => {
        state.surveyLoading = false;
        state.surveyCompleted = action.payload.surveyCompleted;
        state.preferences = action.payload.learningPreferences;
      })
      .addCase(checkSurveyCompletion.rejected, (state, action) => {
        state.surveyLoading = false;
        state.surveyError = action.payload;
      });

    // Generate learning path
    builder
      .addCase(generateLearningPath.pending, (state) => {
        state.pathLoading = true;
        state.pathError = null;
      })
      .addCase(generateLearningPath.fulfilled, (state, action) => {
        state.pathLoading = false;
        console.log("✅ generateLearningPath.fulfilled payload:", action.payload);
        state.learningPath = action.payload.learningPath || action.payload;
      })
      .addCase(generateLearningPath.rejected, (state, action) => {
        state.pathLoading = false;
        state.pathError = action.payload;
      });

    // Fetch learning path
    builder
      .addCase(fetchLearningPath.pending, (state) => {
        state.pathLoading = true;
        state.pathError = null;
      })
      .addCase(fetchLearningPath.fulfilled, (state, action) => {
        state.pathLoading = false;
        console.log("✅ fetchLearningPath.fulfilled payload:", action.payload);
        // Backend returns { success: true, learningPath: {...} }
        state.learningPath = action.payload.learningPath || action.payload;
      })
      .addCase(fetchLearningPath.rejected, (state, action) => {
        state.pathLoading = false;
        // If it's a 404 (not found), don't set error - just show empty state
        if (action.payload?.notFound) {
          console.log("📋 Learning path not found - showing empty state");
          state.pathError = null;
          state.learningPath = null;
        } else {
          state.pathError = action.payload;
        }
      });
  },
});

// Export actions
export const {
  openSurveyModal,
  closeSurveyModal,
  setCurrentStep,
  nextStep,
  previousStep,
  resetSurveyState,
  clearPathError,
} = learningPathSlice.actions;

// Selectors
export const selectLearningPath = (state) => state.learningPath;
export const selectSurveyCompleted = (state) =>
  state.learningPath.surveyCompleted;
export const selectPreferences = (state) => state.learningPath.preferences;
export const selectRecommendedCourses = (state) =>
  state.learningPath.learningPath?.recommendedCourses || [];
export const selectPathSummary = (state) =>
  state.learningPath.learningPath?.pathSummary || null;

export default learningPathSlice.reducer;
