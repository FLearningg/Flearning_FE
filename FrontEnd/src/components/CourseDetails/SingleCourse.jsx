import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import CourseHeader from "./CourseHeader";
import CourseDescription from "./CourseDescription";
import Curriculum from "./Curriculum";
import CourseRating from "./CourseRating";
import StudentFeedback from "./StudentFeedback";
import PricingCard from "./PricingCard";
import { Facebook, Twitter, Mail, MessageCircle } from "lucide-react";
import "../../assets/CourseDetails/SingleCourse.css";
import { getCourseById } from "../../services/courseService";

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
  const breadcrumb = course.breadcrumb ?? [
    "Home > Development > Web Development > Webflow",
  ];

  const title = course.title ?? "S-Title";
  const subtitle = course.subTitle ?? "S-Subtitle";
  const instructors = course.instructors ?? [
    { name: "Thien Huynh", img: "/images/connect_us.png" },
  ];
  const heroImage =
    course.thumbnail ?? "/images/two-business-partners-working-office.png";
  const trailer = /*course.trailer ??*/ {
    url: "https://video.twimg.com/ext_tw_video/1009501301976326144/pu/vid/1280x720/oGf8vbus_bDega0M.mp4?tag=3",
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

  const pricing = {
    // currentPrice: course.price - (course.discountId?.value ?? 0),
    currentPrice: (() => {
      if (course.discountId) {
        if (course.discountId.typee === "fixedAmount") {
          return Math.max(0, course.price - course.discountId.value);
        } else if (course.discountId.typee === "percent") {
          return Math.max(
            0,
            course.price * (1 - course.discountId.value / 100)
          );
        }
      }
      return course.price;
    })(),
    originalPrice: course.price,
    discount: course.discountId?.description ?? "",
    timeLeft: course.discountId?.endDate
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

  const rating = [
    { rateStar: 5 },
    { rateStar: 5 },
    { rateStar: 5 },
    { rateStar: 5 },
    { rateStar: 5 },
    { rateStar: 5 },
    { rateStar: 5 },
    { rateStar: 5 },
    { rateStar: 4 },
    { rateStar: 4 },
    { rateStar: 4 },
    { rateStar: 3 },
    { rateStar: 2 },
    { rateStar: 1 },
  ];

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

  const feedback = course.feedback ?? [
    {
      _id: "507f1f77bcf86cd799439011",
      content:
        "I appreciate the precise short videos (10 mins or less each) because overly long videos tend to make me lose focus. The instructor is very knowledgeable in Web Design and it shows as he shares his knowledge. These were my best 6 months of training. Thanks, Vako.",
      rateStar: 5,
      courseId: "64a7b8c9e1234567890abcde",
      userId: {
        name: "Guy Hawkins",
        avatar: "/images/connect_us.png",
      },
      createdAt: "2024-01-03T10:30:00Z",
    },
    {
      _id: "507f1f77bcf86cd799439012",
      content:
        "This course is just amazing! has great course content, the best practices, and a lot of real-world knowledge. I love the way of giving examples, the best tips by the instructor which are pretty interesting, fun and knowledgeable and I was never getting bored throughout the course. This course meets more than my expectation and, I made the best investment of time to learn and practice what I am passionate about. Thank you so much to our excellent instructor Vako!! Highly recommend this course! Take the next step.",
      rateStar: 5,
      courseId: "64a7b8c9e1234567890abcde",
      userId: {
        name: "Dianne Russell",
        avatar: "/images/connect_us.png",
      },
      createdAt: "2024-01-09T14:15:00Z",
    },
    {
      _id: "507f1f77bcf86cd799439013",
      content:
        "Webflow course was good, it coves design secrets, and to build responsive web pages, blog, and some more tricks and tips about webflow. I enjoyed the course and it helped me to add web development skills related to webflow in my toolbox. Thank you Vako.",
      rateStar: 4,
      courseId: "64a7b8c9e1234567890abcde",
      userId: {
        name: "Bessie Cooper",
        avatar: "/images/connect_us.png",
      },
      createdAt: "2024-01-09T08:45:00Z",
    },
    {
      _id: "507f1f77bcf86cd799439014",
      content:
        "I appreciate the precise short videos (10 mins or less each) because overly long videos tend to make me lose focus. The instructor is very knowledgeable in Web Design and it shows as he shares his knowledge. These were my best 6 months of training. Thanks, Vako.",
      rateStar: 5,
      courseId: "64a7b8c9e1234567890abcde",
      userId: {
        name: "Eleanor Pena",
        avatar: "/images/connect_us.png",
      },
      createdAt: "2024-01-08T16:20:00Z",
    },
    {
      _id: "507f1f77bcf86cd799439015",
      content:
        "GREAT Course! Instructor was very descriptive and professional. I learned a TON that is going to apply immediately to real life work. Thanks so much, cant wait for the next one!",
      rateStar: 3,
      courseId: "64a7b8c9e1234567890abcde",
      userId: {
        name: "Ralph Edwards",
        avatar: "/images/connect_us.png",
      },
      createdAt: "2024-01-07T11:10:00Z",
    },
    {
      _id: "507f1f77bcf86cd799439016",
      content:
        "This should be one of the best course I ever made about UXUI in Udemy. Highly recommend to those who is new to UXUI and want to become UXUI freelancer!",
      rateStar: 5,
      courseId: "64a7b8c9e1234567890abcde",
      userId: {
        name: "Arlene McCoy",
        avatar: "/images/connect_us.png",
      },
      createdAt: "2024-01-03T09:00:00Z",
    },
  ];

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
              breadcrumb={breadcrumb}
              title={title}
              subtitle={subtitle}
              instructors={instructors}
              rating={rating.overall}
              totalRatings={rating.totalRatings}
              heroImage={heroImage}
              trailer={trailer}
              activeTab={null}
              setActiveTab={handleTabClick}
              isScreenSmall={isScreenSmall}
              onBurgerClick={() => setIsModalOpen(true)}
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
              {rating ? (
                <CourseRating rawRatings={rating} />
              ) : (
                <p className="text-muted">Rating not available</p>
              )}
              {feedback.length > 0 ? (
                <StudentFeedback feedback={feedback} />
              ) : (
                <p className="text-muted">Student feedback not available</p>
              )}
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
