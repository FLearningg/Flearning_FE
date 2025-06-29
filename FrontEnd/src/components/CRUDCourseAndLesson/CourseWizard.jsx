import React, { useState } from "react";
import CourseForm from "./CourseForm";
import CourseFormAdvance from "./CourseFormAdvance";
import CourseCurriculum from "./CourseCurriculum";
import CoursePublish from "./CoursePublish";
import apiClient from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CourseWizard = () => {
  const [step, setStep] = useState(0);
  const [courseData, setCourseData] = useState({});
  const [completedTabs, setCompletedTabs] = useState([]);
  const navigate = useNavigate();

  const handleNext = (data) => {
    console.log(`Step ${step} data:`, data);
    setCourseData((prev) => {
      const newData = { ...prev, ...data };
      console.log("Updated courseData:", newData);
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
    console.log(`Step ${step} back with data:`, data);
    if (data) {
      setCourseData((prev) => {
        const newData = { ...prev, ...data };
        console.log("Updated courseData on back:", newData);
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

  const handleSubmit = async (messages) => {
    console.log("Token:", localStorage.getItem("accessToken"));
    try {
      // Format data according to API requirements
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
        level: courseData.levelBackend || courseData.level?.toLowerCase() || "",
        language:
          courseData.languageBackend ||
          courseData.language?.toLowerCase() ||
          "",
        duration: courseData.duration || "",
        message: messages,
        uploadedFiles: courseData.uploadedFiles,
        // Always include categoryId and subCategoryId fields for API
        categoryId: courseData.categoryId || "",
        subCategoryId: courseData.subCategoryId || "",
        // Include other fields if they exist
        ...(courseData.topic && { topic: courseData.topic }),
        ...(courseData.subtitleLanguageBackend && {
          subtitleLanguage: courseData.subtitleLanguageBackend,
        }),
        ...(courseData.thumbnail && { thumbnail: courseData.thumbnail }),
        ...(courseData.trailer && { trailer: courseData.trailer }),
        // Add sections/lessons structure if available
        ...(courseData.curriculum &&
        Array.isArray(courseData.curriculum) &&
        courseData.curriculum.length > 0
          ? { sections: courseData.curriculum }
          : {}),
      };

      console.log("Sending formatted data:", dataToSend);
      console.log("Required fields check:");
      console.log("- title:", dataToSend.title);
      console.log("- subTitle:", dataToSend.subTitle);
      console.log("- detail.description:", dataToSend.detail?.description);
      console.log("- price:", dataToSend.price);
      console.log("- level:", dataToSend.level);
      console.log("- language:", dataToSend.language);
      console.log("- categoryId:", dataToSend.categoryId);
      console.log("- subCategoryId:", dataToSend.subCategoryId);

      // Create the course with all sections/lessons in one call
      const res = await apiClient.post("/admin/courses", dataToSend);

      if (res.data && res.data.data) {
        const courseId = res.data.data._id;
        console.log("Course created with ID:", courseId);

        // Mark the final tab as completed
        setCompletedTabs((prev) => {
          if (!prev.includes(3)) {
            return [...prev, 3];
          }
          return prev;
        });

        console.log("Course created:", res.data);
        navigate("/admin/courses/all");
      }
    } catch (err) {
      console.error("Error details:", err);
      toast.error(
        err.response?.data?.message || err.message || "Failed to create course"
      );
    }
  };

  const steps = [
    <CourseForm
      key="step-0"
      initialData={courseData}
      onNext={handleNext}
      completedTabs={completedTabs}
      onTabClick={handleTabClick}
    />,
    <CourseFormAdvance
      key="step-1"
      initialData={courseData}
      onNext={handleNext}
      onPrev={handlePrev}
      completedTabs={completedTabs}
      onTabClick={handleTabClick}
    />,
    <CourseCurriculum
      key="step-2"
      initialData={courseData}
      onNext={handleNext}
      onPrev={handlePrev}
      completedTabs={completedTabs}
      onTabClick={handleTabClick}
    />,
    <CoursePublish
      key="step-3"
      initialData={courseData}
      onPrev={handlePrev}
      onSubmit={handleSubmit}
      completedTabs={completedTabs}
      onTabClick={handleTabClick}
    />,
  ];

  return <div>{steps[step]}</div>;
};

export default CourseWizard;
