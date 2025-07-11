import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getBestSellingCourses } from "../../services/courseService";
import Card from "../common/Card/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../../assets/Categories/BestSelling.css";

const Loading = () => <div className="text-center w-100">Loading...</div>;

const CourseCard = ({ course, onClick }) => (
  <div style={{ cursor: "pointer" }} onClick={() => onClick(course._id)}>
    <Card
      image={course.thumbnail}
      category={
        <span style={{ fontSize: "0.5rem" }}>
          {course?.categoryIds?.[0]?.name || "Uncategorized"}
        </span>
      }
      categoryBgColor={course.categoryColor || "rgb(255, 238, 232)"}
      price={`${course.price}$`}
      title={course.title}
      rating={course?.rating || 0}
      students={(course.studentsEnrolled?.length || 0).toLocaleString()}
      variant="normal"
    />
  </div>
);

export default function BestSelling() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const courses = useSelector(
    (state) => state.courses.bestSelling.bestSellingCourses
  );
  const loading = useSelector((state) => state.courses.bestSelling.isLoading);

  useEffect(() => {
    const fetchBestSellingCourses = async () => {
      await getBestSellingCourses(dispatch);
    };
    fetchBestSellingCourses();
  }, [dispatch]);

  const handleCardClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <section className="best-selling-section py-5 bg-white">
      <div className="container">
        <h2 className="text-center fw-bold section-title">
          Best selling courses in Web Development
        </h2>

        {/* Desktop ≥1377px: Grid */}
        <div className="row g-4 d-none d-xxl-flex">
          {loading ? (
            <Loading />
          ) : (
            courses.map((course) => (
              <div
                key={course._id}
                className="col-12 col-md-6 col-lg-4 col-xl-2-4"
              >
                <CourseCard course={course} onClick={handleCardClick} />
              </div>
            ))
          )}
        </div>

        {/* Swiper 992px–1377px: 3.5 slides */}
        <div className="d-none d-lg-block d-xxl-none mt-4">
          {loading ? (
            <Loading />
          ) : (
            <Swiper spaceBetween={20} slidesPerView={3.5} grabCursor={true}>
              {courses.map((course) => (
                <SwiperSlide key={course._id}>
                  <CourseCard course={course} onClick={handleCardClick} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* Mobile <992px: Swiper 1.2–2.5 slides */}
        <div className="d-lg-none mt-4">
          {loading ? (
            <Loading />
          ) : (
            <Swiper
              spaceBetween={20}
              slidesPerView={1.2}
              grabCursor={true}
              breakpoints={{
                576: { slidesPerView: 2 },
                768: { slidesPerView: 2.5 },
              }}
            >
              {courses.map((course) => (
                <SwiperSlide key={course._id}>
                  <CourseCard course={course} onClick={handleCardClick} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
}
