import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import CourseHeader from "./CourseHeader";
import CourseDescription from "./CourseDescription";
import InstructorInfoCard from "./InstructorInfoCard";
import Curriculum from "./Curriculum";
import CourseRating from "./CourseRating";
import StudentFeedback from "./StudentFeedback";
import PricingCard from "./PricingCard";
import { Facebook, Twitter, Mail, MessageCircle } from "lucide-react";
import "../../assets/CourseDetails/SingleCourse.css";
import { getCourseById } from "../../services/courseService";
import { Link } from "react-router-dom";

export default function SingleCourse() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth < 1201);

  const overviewRef = useRef(null);
  const curriculumRef = useRef(null);
  const reviewRef = useRef(null);

  useEffect(() => {
    if (!courseId) return; // guard against empty param

    let isMounted = true; // prevents state updates on unmount
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const data = await getCourseById(courseId);
        if (isMounted) setCourse(data);
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourse();
    return () => {
      isMounted = false;
    }; // cleanup
  }, [courseId]);

  useEffect(() => {
    const handleResize = () => {
      setIsScreenSmall(window.innerWidth < 1201);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleTabClick = (tab) => {
    const refs = {
      overview: overviewRef,
      curriculum: curriculumRef,
      review: reviewRef,
    };
    refs[tab]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) return <div className="text-center p-5">Loading course...</div>;
  if (error) return <div className="text-center text-danger p-5">{error}</div>;

  if (!course) {
    return (
      <div className="text-center p-5">
        Could not find the requested course.
      </div>
    );
  }

  function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          overflow: "auto", // Cho phép scroll toàn modal nếu cần (đề phòng mobile)
        }}
        onClick={onClose}
      >
        <div
          className="course-modal"
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            maxWidth: "400px",
            width: "100%",
            maxHeight: "90vh", // Giới hạn chiều cao modal
            overflowY: "auto", // Cho phép cuộn nếu nội dung dài
          }}
          onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
        >
          {children}
        </div>
      </div>
    );
  }

  // === Render fallback for missing attributes ===
  const categoryInfo = course?.categoryIds?.[0];
  const title = course.title ?? "Course Details";
  const breadcrumbData = [
    { label: "Home", path: "/" },
    {
      label: categoryInfo?.name || "Category",
      path: "/courses",
    },
    { label: title, path: null },
  ];

  const subtitle = course.subTitle ?? "S-Subtitle";
  const heroImage =
    course.thumbnail ?? "/images/two-business-partners-working-office.png";
  const trailer = {
    url:
      course.trailer ||
      "https://video.twimg.com/ext_tw_video/1009501301976326144/pu/vid/1280x720/oGf8vbus_bDega0M.mp4?tag=3",
  };

  const detail = course.detail ?? {};

  const description = {
    description: detail.description
      ? [detail.description] // ép string thành array
      : [],

    willLearn: detail.willLearn ?? [],
    targetAudience: detail.targetAudience ?? [],
    requirement: detail.requirement ?? [],
  };

  const isDiscountValid = (discount) => {
    if (!discount) return false;
    if (discount.status && discount.status !== "active") return false;
    if (discount.endDate && new Date(discount.endDate) < new Date())
      return false;
    if (
      typeof discount.usageLimit === "number" &&
      discount.usageLimit > 0 &&
      typeof discount.usage === "number" &&
      discount.usage >= discount.usageLimit
    ) {
      return false;
    }
    return true;
  };

  const pricing = {
    currentPrice: (() => {
      if (isDiscountValid(course.discountId)) {
        if (course.discountId.type === "fixedAmount") {
          return Math.max(0, course.price - course.discountId.value);
        } else if (course.discountId.type === "percent") {
          return Math.max(
            0,
            course.price * (1 - course.discountId.value / 100)
          );
        }
      }
      return course.price;
    })(),
    originalPrice: course.price,
    discount: isDiscountValid(course.discountId)
      ? course.discountId?.description ?? ""
      : "",
    timeLeft:
      isDiscountValid(course.discountId) && course.discountId?.endDate
        ? `Ends on ${new Date(course.discountId.endDate).toLocaleDateString()}`
        : "",
    details: [
      { label: "Level", value: course.level ?? "All levels" },
      { label: "Duration", value: course.duration ?? "0h" },
      {
        label: "Students enrolled",
        value: course.studentsEnrolled?.length.toLocaleString() ?? "0",
      },
      { label: "Language", value: course.language ?? "English" },
      {
        label: "Subtitle language",
        value: course.subtitleLanguage ?? "None",
      },
    ],
    includes: course.materials ?? [],
    shareButtons: [
      {
        icon: Facebook,
        label: "Facebook",
        onClick: () => {
          const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=https://flearningg.vercel.app/course/${courseId}`;
          const popupWidth = 600;
          const popupHeight = 400;
          const left = window.screen.width / 2 - popupWidth / 2;
          const top = window.screen.height / 2 - popupHeight / 2;
          window.open(
            shareUrl,
            "FacebookSharePopup",
            `width=${popupWidth},height=${popupHeight},top=${top},left=${left},toolbar=0,status=0,resizable=1`
          );
        },
      },
      {
        icon: Twitter,
        label: "Twitter",
        onClick: () => {
          const shareUrl = `https://twitter.com/intent/tweet?url=https://flearningg.vercel.app/course/${courseId}`;
          const popupWidth = 600;
          const popupHeight = 400;

          // Lấy vị trí giữa màn hình
          const left = window.screen.width / 2 - popupWidth / 2;
          const top = window.screen.height / 2 - popupHeight / 2;

          // Mở popup
          window.open(
            shareUrl,
            "FacebookSharePopup",
            `width=${popupWidth},height=${popupHeight},top=${top},left=${left},toolbar=0,status=0,resizable=1`
          );
        },
      },
      { icon: Mail, label: "Mail" },
      { icon: MessageCircle, label: "Message" },
    ],
  };

  const curriculum = {
    sections: course.sections ?? [
      {
        _id: "section1",
        name: "Getting Started",
        courseId: "course1",
        lessons: [
          {
            _id: "lesson1",
            courseId: "course1",
            sectionId: "section1",
            title: "What's is Webflow?",
            duration: 451, // 7:31 in seconds
            order: 1,
          },
          {
            _id: "lesson2",
            courseId: "course1",
            sectionId: "section1",
            title: "Sign up in Webflow",
            duration: 451, // 7:31 in seconds
            order: 2,
          },
          {
            _id: "lesson3",
            courseId: "course1",
            sectionId: "section1",
            title: "Webflow Terms & Conditions",
            duration: 0, // Document type
            order: 3,
          },
          {
            _id: "lesson4",
            courseId: "course1",
            sectionId: "section1",
            title: "Teaser of Webflow",
            duration: 451, // 7:31 in seconds
            order: 4,
          },
          {
            _id: "lesson5",
            courseId: "course1",
            sectionId: "section1",
            title: "Practice Project",
            duration: 0, // Document type
            order: 5,
          },
        ],
        order: 1,
      },
      {
        _id: "section2",
        name: "Secret of Good Design",
        courseId: "course1",
        lessons: [
          {
            _id: "lesson6",
            courseId: "course1",
            sectionId: "section2",
            title: "Design Principles",
            duration: 20940, // 5h 49m in seconds
            order: 1,
          },
        ],
        order: 2,
      },
      {
        _id: "section3",
        name: "Practice Design Like an Artist",
        courseId: "course1",
        lessons: [
          {
            _id: "lesson8",
            courseId: "course1",
            sectionId: "section3",
            title: "Sketching Basics",
            duration: 3180, // 53m in seconds
            order: 1,
          },
        ],
        order: 3,
      },
      {
        _id: "section4",
        name: "Web Development (webflow)",
        courseId: "course1",
        lessons: [
          {
            _id: "lesson10",
            courseId: "course1",
            sectionId: "section4",
            title: "HTML Basics",
            duration: 36360, // 10h 6m in seconds
            order: 1,
          },
        ],
        order: 4,
      },
      {
        _id: "section5",
        name: "Secrets of Making Money Freelancing",
        courseId: "course1",
        lessons: [
          {
            _id: "lesson11",
            courseId: "course1",
            sectionId: "section5",
            title: "Finding Clients",
            duration: 2280, // 38m in seconds
            order: 1,
          },
        ],
        order: 5,
      },
      {
        _id: "section6",
        name: "Advanced",
        courseId: "course1",
        lessons: [
          {
            _id: "lesson12",
            courseId: "course1",
            sectionId: "section6",
            title: "Advanced Techniques",
            duration: 5460, // 91m in seconds
            order: 1,
          },
        ],
        order: 6,
      },
    ],
  };

  return (
    <div
      className="single-course-wrapper"
      style={{
        margin: "0 200px",
        backgroundColor: "#ffffff",
        paddingTop: "20px",
      }}
    >
      <div className="single-course container">
        <div className="row single-row">
          <div className="col-lg-8 single-col">
            <CourseHeader
              breadcrumb={breadcrumbData}
              title={title}
              subtitle={subtitle}
              heroImage={heroImage}
              trailer={trailer}
              activeTab={null}
              setActiveTab={handleTabClick}
              isScreenSmall={isScreenSmall}
              onBurgerClick={() => setIsModalOpen(true)}
              instructorCard={
                <InstructorInfoCard 
                  instructor={course.createdBy}
                />
              }
            />

            <div ref={overviewRef}>
              {description ? (
                <CourseDescription {...description} />
              ) : (
                <p className="text-muted">Course description not available</p>
              )}
            </div>

            <div ref={curriculumRef}>
              {curriculum.sections.length > 0 ? (
                <Curriculum {...curriculum} />
              ) : (
                <p className="text-muted">Curriculum not available</p>
              )}
            </div>

            <div ref={reviewRef}>
              <CourseRating courseId={courseId} />
              <StudentFeedback courseId={courseId} />
            </div>
          </div>

          {!isScreenSmall && (
            <div className="col-lg-4">
              {pricing ? (
                <PricingCard
                  currentPrice={pricing.currentPrice}
                  originalPrice={pricing.originalPrice}
                  discount={pricing.discount}
                  timeLeft={pricing.timeLeft}
                  details={pricing.details}
                  includes={pricing.includes}
                  shareButtons={pricing.shareButtons}
                  course={course}
                />
              ) : (
                <p className="text-muted">Pricing info not available</p>
              )}
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {pricing ? (
          <PricingCard
            currentPrice={pricing.currentPrice}
            originalPrice={pricing.originalPrice}
            discount={pricing.discount}
            timeLeft={pricing.timeLeft}
            details={pricing.details}
            includes={pricing.includes}
            shareButtons={pricing.shareButtons}
            course={course}
          />
        ) : (
          <p className="text-muted">Pricing info not available</p>
        )}
      </Modal>
    </div>
  );
}
