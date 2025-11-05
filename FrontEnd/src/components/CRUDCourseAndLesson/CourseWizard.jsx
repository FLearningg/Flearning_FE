import React, { useState, useEffect, useRef } from "react";
import CourseForm from "./CourseForm";
import CourseFormAdvance from "./CourseFormAdvance";
import CourseCurriculum from "./CourseCurriculum";
import CoursePublish from "./CoursePublish";
import apiClient from "../../services/authService";
import { getCourseById as getAdminCourseById } from "../../services/adminService";
import { 
  getCourseById as getInstructorCourseById,
  saveToDraft as saveCourseToDraft 
} from "../../services/instructorService";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const CourseWizard = () => {
  const [step, setStep] = useState(0);
  const [courseData, setCourseData] = useState({});
  const [completedTabs, setCompletedTabs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Use refs to prevent double toast calls and track data loading
  const toastShownRef = useRef(false);
  const submitToastShownRef = useRef(false);
  const currentCourseIdRef = useRef(null);

  // Detect if user is admin or instructor based on route
  const isAdmin = location.pathname.includes("/admin/");
  const isInstructor = location.pathname.includes("/instructor/");

  // Reset dataLoaded when switching to a different course
  useEffect(() => {
    if (currentCourseIdRef.current !== id) {
      setDataLoaded(false);
      toastShownRef.current = false;
      currentCourseIdRef.current = id;
    }
  }, [id]);

  // Check if we're in edit mode
  useEffect(() => {
    const isEdit = id && location.pathname.includes("/edit/");
    setIsEditMode(isEdit);

    if (isEdit && id && !dataLoaded) {
      fetchCourseData(id); // Luôn gọi API khi vào trang edit
    }
  }, [id, location.pathname, dataLoaded]);

  // Fetch course data for editing
  const fetchCourseData = async (courseId) => {
    setIsLoading(true);
    try {
      // Use appropriate service based on user role
      const getCourseById = isInstructor ? getInstructorCourseById : getAdminCourseById;
      const response = await getCourseById(courseId);

      // Handle different response structures
      let course;
      if (response.data && response.data.data) {
        course = response.data.data;
      } else if (response.data) {
        course = response.data;
      } else {
        course = response;
      }

      // Transform the course data to match the form structure based on Course model
      const transformedData = {
        title: course.title || "",
        subTitle: course.subTitle || course.subtitle || "",
        category: course.categoryIds?.[0]?.name || course.category || "",
        subCategory:
          course.categoryIds?.[1]?.name ||
          course.subCategory ||
          course.subcategory ||
          "",
        categoryId: course.categoryIds?.[0]?._id || course.categoryId || "",
        subCategoryId:
          course.categoryIds?.[1]?._id ||
          course.subCategoryId ||
          course.subcategoryId ||
          "",
        language:
          course.language === "vietnam"
            ? "Vietnamese"
            : course.language === "english"
            ? "English"
            : course.language || "",
        subtitleLanguage:
          course.subtitleLanguage === "vietnam"
            ? "Vietnamese"
            : course.subtitleLanguage === "english"
            ? "English"
            : course.subtitleLanguage || "",
        level:
          course.level === "beginner"
            ? "Beginner"
            : course.level === "intermediate"
            ? "Intermediate"
            : course.level === "advanced"
            ? "Advanced"
            : course.level || "",
        duration: course.duration || "",
        price: course.price ? course.price.toString() : "",
        detail: {
          description: course.detail?.description || "",
          willLearn: course.detail?.willLearn || [],
          targetAudience: course.detail?.targetAudience || [],
          requirement: course.detail?.requirement || [],
        },
        uploadedFiles: {
          image: course.thumbnail ? { url: course.thumbnail } : null,
          video: course.trailer ? { url: course.trailer } : null,
        },
        thumbnail: course.thumbnail || "",
        trailer: course.trailer || "",
        sections: Array.isArray(course.sections) ? course.sections : [],
        message: course.message || { welcome: "", congrats: "" },
        materials: course.materials || [],
        studentsEnrolled: course.studentsEnrolled || [],
        discountId: course.discountId || null,
        rating: course.rating || 0,
      };

      setCourseData(transformedData);

      // Mark all tabs as completed since we're editing an existing course
      setCompletedTabs([0, 1, 2, 3]);
      setDataLoaded(true);

      if (!toastShownRef.current) {
        toast.success("Course data loaded for editing");
        toastShownRef.current = true;
      }
    } catch (error) {
      // More specific error messages
      let errorMessage = "Failed to load course data for editing";
      if (error.response?.status === 404) {
        errorMessage = "Course not found";
      } else if (error.response?.status === 401) {
        errorMessage = "Unauthorized access";
      } else if (error.response?.status === 403) {
        errorMessage = "Access forbidden";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // For development/testing, use sample data if API fails
      if (process.env.NODE_ENV === "development" || !error.response) {
        const sampleCourseData = {
          title: "Sample Course Title",
          subTitle: "Sample Course Subtitle",

          category: "Development",
          subCategory: "Web Development",
          categoryIds: [], // Empty array for sample data to avoid validation issues
          language: "English",
          subtitleLanguage: "Vietnamese",
          level: "Beginner",
          duration: "10",
          price: "29.99",
          detail: {
            description:
              "This is a sample course description that explains what students will learn.",
            willLearn: [
              "Learn the fundamentals of web development",
              "Build responsive websites",
              "Master modern JavaScript frameworks",
            ],
            targetAudience: [
              "Beginners with no programming experience",
              "Students interested in web development",
              "Professionals looking to switch careers",
            ],
            requirement: [
              "Basic computer skills",
              "A computer with internet connection",
              "Willingness to learn",
            ],
          },
          uploadedFiles: {
            image: {
              url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
            },
            video: { url: "https://sample-video-url.com/trailer.mp4" },
          },
          thumbnail:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
          trailer: "https://sample-video-url.com/trailer.mp4",
          sections: [
            {
              title: "Introduction",
              lessons: [
                { title: "Welcome to the Course", duration: "5:00" },
                { title: "Course Overview", duration: "10:00" },
              ],
            },
          ],
          message: {
            welcome: "Welcome to our course! We're excited to have you here.",
            congrats:
              "Congratulations on completing the course! You've done great work.",
          },
          // Additional fields from Course model
          materials: ["PDF Guide", "Source Code", "Exercises"],
          studentsEnrolled: [],
          discountId: null,
          rating: 0,
        };

        setCourseData(sampleCourseData);
        setCompletedTabs([0, 1, 2, 3]);
        setDataLoaded(true);

        if (!toastShownRef.current) {
          toast.success("Course data loaded for editing (using sample data)");
          toastShownRef.current = true;
        }
        return;
      }

      toast.error(errorMessage);
      // Navigate to appropriate page based on role
      if (isInstructor) {
        navigate("/instructor/courses");
      } else {
        navigate("/admin/courses/all");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = (data) => {
    setCourseData((prev) => {
      const newData = { ...prev, ...data };
      return newData;
    });

    setCompletedTabs((prev) => {
      if (!prev.includes(step)) {
        return [...prev, step];
      }
      return prev;
    });

    setStep((prev) => prev + 1);
  };

  const handlePrev = (data) => {
    if (data) {
      setCourseData((prev) => {
        const newData = { ...prev, ...data };
        return newData;
      });
    }
    setStep((prev) => prev - 1);
  };

  const handleTabClick = (tabIndex) => {
    if (completedTabs.includes(tabIndex) || tabIndex <= step) {
      setStep(tabIndex);
    }
  };

  const handleSaveDraft = async (data) => {
    try {
      setIsLoading(true);
      
      // Merge new data with existing course data
      const updatedCourseData = { ...courseData, ...data };
      setCourseData(updatedCourseData);

      // Only instructors can save drafts
      if (!isInstructor) {
        toast.error("Only instructors can save drafts");
        return;
      }

      // Prepare data for backend
      const dataToSend = {
        title: updatedCourseData.title,
        subTitle: updatedCourseData.subTitle || updatedCourseData.subtitle,
        detail: {
          description: updatedCourseData.detail?.description || "",
          willLearn: updatedCourseData.detail?.willLearn || [],
          targetAudience: updatedCourseData.detail?.targetAudience || [],
          requirement: updatedCourseData.detail?.requirement || [],
        },
        price: parseFloat(updatedCourseData.price) || 0,
        level: updatedCourseData.level?.toLowerCase() || "beginner",
        language:
          updatedCourseData.language === "Vietnamese"
            ? "vietnam"
            : updatedCourseData.language === "English"
            ? "english"
            : updatedCourseData.language?.toLowerCase() || "vietnam",
        subtitleLanguage:
          updatedCourseData.subtitleLanguage === "Vietnamese"
            ? "vietnam"
            : updatedCourseData.subtitleLanguage === "English"
            ? "english"
            : updatedCourseData.subtitleLanguage?.toLowerCase() || "vietnam",
        duration: updatedCourseData.duration || "",
        categoryIds: updatedCourseData.categoryIds || [],
        thumbnail: updatedCourseData.thumbnail || "",
        trailer: updatedCourseData.trailer || "",
        materials: updatedCourseData.materials || [],
        message: updatedCourseData.message || { welcome: "", congrats: "" },
        sections: updatedCourseData.sections || [],
        status: "draft", // Ensure status is draft
      };

      let res;
      if (isEditMode && id) {
        // If editing existing course, use PUT endpoint
        res = await apiClient.put(`/instructor/courses/${id}`, dataToSend);
      } else {
        // If creating new course, use POST draft endpoint
        res = await saveCourseToDraft(dataToSend);
      }

      if (res.data && res.data.success) {
        toast.success(
          isEditMode 
            ? "Course draft updated successfully!" 
            : "Course saved as draft successfully!"
        );
        // Navigate to courses page
        navigate("/instructor/courses");
      }
    } catch (err) {
      console.error("Error saving draft:", err);
      toast.error(
        err.response?.data?.message || err.message || "Failed to save draft"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (messages) => {
    try {

      // Format data according to API requirements based on Course model
      const dataToSend = {
        title: courseData.title,
        subTitle: courseData.subTitle,
        detail: {
          description: courseData.detail?.description || "",
          willLearn: courseData.detail?.willLearn || [],
          targetAudience: courseData.detail?.targetAudience || [],
          requirement: courseData.detail?.requirement || [],
        },
        price: parseFloat(courseData.price) || 0,
        // Convert level to enum values
        level:
          courseData.level === "Beginner"
            ? "beginner"
            : courseData.level === "Intermediate"
            ? "intermediate"
            : courseData.level === "Advanced"
            ? "advanced"
            : courseData.level?.toLowerCase() || "",
        // Convert language to enum values
        language:
          courseData.language === "Vietnamese"
            ? "vietnam"
            : courseData.language === "English"
            ? "english"
            : courseData.language?.toLowerCase() || "",
        duration: courseData.duration || "",
        message: messages,
        // Extract thumbnail and trailer URLs from uploadedFiles
        ...(courseData.uploadedFiles?.image?.url && {
          thumbnail: courseData.uploadedFiles.image.url,
        }),
        ...(courseData.uploadedFiles?.video?.url && {
          trailer: courseData.uploadedFiles.video.url,
        }),
        // Also include the full uploadedFiles object for backwards compatibility
        uploadedFiles: courseData.uploadedFiles,
        // Handle categoryIds array - extract IDs from different possible formats
        categoryIds: (() => {
          // If we have categoryIds array with objects, extract _id
          if (Array.isArray(courseData.categoryIds) && courseData.categoryIds.length > 0) {
            return courseData.categoryIds.map(cat => 
              typeof cat === 'object' && cat._id ? cat._id : cat
            ).filter(Boolean);
          }
          
          // Fallback to individual categoryId and subCategoryId
          const ids = [];
          if (courseData.categoryId) ids.push(courseData.categoryId);
          if (courseData.subCategoryId) ids.push(courseData.subCategoryId);
          return ids;
        })(),
        // Include other fields if they exist

        ...(courseData.subtitleLanguage && {
          subtitleLanguage:
            courseData.subtitleLanguage === "Vietnamese"
              ? "vietnam"
              : courseData.subtitleLanguage === "English"
              ? "english"
              : courseData.subtitleLanguage?.toLowerCase() || "",
        }),
        ...(courseData.thumbnail && { thumbnail: courseData.thumbnail }),
        ...(courseData.trailer && { trailer: courseData.trailer }),
        // Add sections/lessons structure if available
        ...(courseData.sections &&
        Array.isArray(courseData.sections) &&
        courseData.sections.length > 0
          ? { sections: courseData.sections }
          : {}),
        // Include additional fields from model
        ...(courseData.materials && { materials: courseData.materials }),
        ...(courseData.discountId && { discountId: courseData.discountId }),
        ...(courseData.rating && { rating: courseData.rating }),
        // Submit for review sets status to pending
        status: "pending",
      };

      let res;
      if (isEditMode) {
        // Use appropriate endpoint based on role
        const endpoint = isInstructor ? `/instructor/courses/${id}` : `/admin/courses/${id}`;
        res = await apiClient.put(endpoint, dataToSend);
      } else {
        // Use appropriate endpoint based on role
        const endpoint = isInstructor ? "/instructor/courses" : "/admin/courses";
        res = await apiClient.post(endpoint, dataToSend);
      }
      if (res.data && res.data.data) {
        const courseId = res.data.data._id;

        // Mark the final tab as completed
        setCompletedTabs((prev) => {
          if (!prev.includes(3)) {
            return [...prev, 3];
          }
          return prev;
        });

        // Only show success toast once
        if (!submitToastShownRef.current) {
          toast.success(
            `Course ${isEditMode ? "updated" : "created"} successfully!`
          );
          submitToastShownRef.current = true;
        }
        // Navigate to appropriate page based on role
        if (isInstructor) {
          navigate("/instructor/courses");
        } else {
          navigate("/admin/courses/all");
        }
      } else if (res.data) {
        // Only show success toast once
        if (!submitToastShownRef.current) {
          toast.success(
            `Course ${isEditMode ? "updated" : "created"} successfully!`
          );
          submitToastShownRef.current = true;
        }
        // Navigate to appropriate page based on role
        if (isInstructor) {
          navigate("/instructor/courses");
        } else {
          navigate("/admin/courses/all");
        }
      }
    } catch (err) {
      // For development/testing, simulate success if API fails
      // if (process.env.NODE_ENV === "development" || !err.response) {
      //   // Mark the final tab as completed
      //   setCompletedTabs((prev) => {
      //     if (!prev.includes(3)) {
      //       return [...prev, 3];
      //     }
      //     return prev;
      //   });

      //   // Only show success toast once
      //   if (!submitToastShownRef.current) {
      //     toast.success(
      //       `Course ${
      //         isEditMode ? "updated" : "created"
      //       } successfully! (simulated)`
      //     );
      //     submitToastShownRef.current = true;
      //   }
      //   navigate("/admin/courses/all");
      //   return;
      // }

      // Only show error toast once
      if (!submitToastShownRef.current) {
        toast.error(
          err.response?.data?.message || err.message || "Failed to save course"
        );
        submitToastShownRef.current = true;
      }
    }
  };

  const steps = [
    <CourseForm
      key="step-0"
      initialData={courseData}
      onNext={handleNext}
      onSaveDraft={handleSaveDraft}
      completedTabs={completedTabs}
      onTabClick={handleTabClick}
      title={isEditMode ? "Edit Course" : "Create New Course"}
    />,
    <CourseFormAdvance
      key="step-1"
      initialData={courseData}
      onNext={handleNext}
      onPrev={handlePrev}
      onSaveDraft={handleSaveDraft}
      completedTabs={completedTabs}
      onTabClick={handleTabClick}
      courseId={id}
      isEditMode={isEditMode}
      onMediaSaved={() => {
        // Reload course data when media is saved with small delay to ensure DB is updated
        if (isEditMode && id) {         
          setTimeout(() => {
            fetchCourseData(id);
          }, 500); // 500ms delay to ensure database update is complete
        }
      }}
    />,
    <CourseCurriculum
      key="step-2"
      initialData={courseData}
      onNext={handleNext}
      onPrev={handlePrev}
      onSaveDraft={handleSaveDraft}
      completedTabs={completedTabs}
      onTabClick={handleTabClick}
      courseId={id || courseData._id || courseData.id}
    />,
    <CoursePublish
      key="step-3"
      initialData={courseData}
      onPrev={handlePrev}
      onSubmit={handleSubmit}
      onSaveDraft={handleSaveDraft}
      completedTabs={completedTabs}
      onTabClick={handleTabClick}
    />,
  ];

  return <div>{steps[step]}</div>;
};

export default CourseWizard;
