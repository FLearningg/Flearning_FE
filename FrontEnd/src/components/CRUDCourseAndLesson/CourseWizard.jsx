import React, { useState } from "react";
import CourseForm from "./CourseForm";
import CourseFormAdvance from "./CourseFormAdvance";
import CourseCurriculum from "./CourseCurriculum";
import CoursePublish from "./CoursePublish";
import apiClient from "../../services/authService";
import { useNavigate } from "react-router-dom";

const CourseWizard = () => {
  const [step, setStep] = useState(0);
  const [courseData, setCourseData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleNext = (data) => {
    console.log(`Step ${step} data:`, data);
    setCourseData((prev) => {
      const newData = { ...prev, ...data };
      console.log("Updated courseData:", newData);
      return newData;
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

  const handleSubmit = async (messages) => {
    console.log("Token:", localStorage.getItem("accessToken"));
    setLoading(true);
    setError("");
    setSuccess("");
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
        level: courseData.level?.toLowerCase() || "",
        language: courseData.language?.toLowerCase() || "",
        duration: courseData.duration || "",
        message: messages,
        uploadedFiles: courseData.uploadedFiles,
        // Include other fields if they exist
        ...(courseData.topic && { topic: courseData.topic }),
        ...(courseData.category && { category: courseData.category }),
        ...(courseData.subCategory && { subCategory: courseData.subCategory }),
        ...(courseData.subtitleLanguage && {
          subtitleLanguage: courseData.subtitleLanguage,
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

      // Create the course with all sections/lessons in one call
      const res = await apiClient.post("/admin/courses", dataToSend);

      if (res.data && res.data.data) {
        const courseId = res.data.data._id;
        console.log("Course created with ID:", courseId);
        setSuccess("Course created successfully!");
        console.log("Course created:", res.data);
        navigate("/admin/courses/all");
      }
    } catch (err) {
      console.error("Error details:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to create course"
      );
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    <CourseForm key="step-0" initialData={courseData} onNext={handleNext} />,
    <CourseFormAdvance
      key="step-1"
      initialData={courseData}
      onNext={handleNext}
      onPrev={handlePrev}
    />,
    <CourseCurriculum
      key="step-2"
      initialData={courseData}
      onNext={handleNext}
      onPrev={handlePrev}
    />,
    <CoursePublish
      key="step-3"
      initialData={courseData}
      onPrev={handlePrev}
      onSubmit={handleSubmit}
    />,
  ];

  return <div>{steps[step]}</div>;
};

export default CourseWizard;
