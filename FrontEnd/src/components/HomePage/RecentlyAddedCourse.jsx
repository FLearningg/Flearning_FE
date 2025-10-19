import React, { useEffect } from "react";
import PopupCard from "../common/Card/PopupCard";
import Card from "../common/Card/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { getRecentlyAddedCourses } from "../../services/courseService";
import { Link } from "react-router-dom";
import LoaddingComponent from "../common/Loadding/LoaddingComponent";
function RecentlyAddedCourse() {
  const dispatch = useDispatch();
  const coursesInfo1 = useSelector(
    (state) => state.courses.recentlyAdded.recentlyCourses
  );
  const isLoading = useSelector(
    (state) => state.courses.recentlyAdded.isLoading
  );
  useEffect(() => {
    const fetchRecentlyCourses = async () => {
      await getRecentlyAddedCourses(dispatch);
    };
    fetchRecentlyCourses();
  }, [dispatch]);
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

  // Format price with dot separator (e.g., 250.000đ)
  const formatPrice = (price) => {
    return Math.round(price)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Log to check course data and status
  console.log("Recently Added Courses Data:", coursesInfo1);
  console.log(
    "Course statuses:",
    coursesInfo1?.map((c) => ({ title: c.title, status: c.status }))
  );

  const coursesInfo = coursesInfo1
    ?.filter((course) => {
      // Accept multiple active statuses: active, approved, published
      const validStatuses = ["active", "approved", "published"];
      return validStatuses.includes(course.status?.toLowerCase());
    })
    .map((course) => {
      let finalPrice = course.price;
      let discountText = "";
      if (isDiscountValid(course.discountId)) {
        if (course.discountId.type === "fixedAmount") {
          finalPrice = Math.max(0, course.price - course.discountId.value);
          discountText = `-${formatPrice(course.discountId.value)} VND`;
        } else if (course.discountId.type === "percent") {
          finalPrice = Math.max(
            0,
            course.price * (1 - course.discountId.value / 100)
          );
          discountText = `-${course.discountId.value}%`;
        }
      }
      return {
        cardProps: {
          image: course.thumbnail,
          category: course?.categoryIds?.[0]?.name || "Uncategorized",
          price: `${formatPrice(finalPrice)} VND`,
          title: course.title,
          rating: course?.rating || 0, // If there is a rating field, take it, otherwise 0
          students: course.studentsEnrolled?.length || 0,
          variant: "large",
          linkToCourseDetail: `/course/${course._id}`,
        },
        detailedProps: {
          courseId: course._id,
          title: course.title,
          author: "Admin", // If there is an author field, take it
          authorAvatar: "/images/admin-image.png", // If there is one, take it
          rating: course.rating || 0, // If there is one, take it
          ratingCount: 0, // If there is one, take it
          students: course.studentsEnrolled?.length || 0,
          level: course.level,
          duration: course.duration,
          price: `${formatPrice(finalPrice)} VND`,
          oldPrice: isDiscountValid(course.discountId)
            ? `${formatPrice(course.price)} VND`
            : "",
          discount: discountText,
          learnList: course.detail?.willLearn || [],
        },
      };
    });
  return (
    <>
      <div className="container my-5">
        <h3 className="text-center mb-5">Recently Added Courses</h3>
        {isLoading ? (
          <LoaddingComponent />
        ) : (
          <div className="desktop-view">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
              {coursesInfo?.map((courseInfo, index) => (
                <div className="col" key={index}>
                  <div className="mb-5">
                    <PopupCard
                      cardProps={courseInfo.cardProps}
                      detailedProps={courseInfo.detailedProps}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* for mobile */}
        <div className="mobile-view">
          <Swiper
            spaceBetween={20}
            slidesPerView={1.7}
            grabCursor={true}
            breakpoints={{
              768: {
                slidesPerView: 2.5,
              },
            }}
          >
            {coursesInfo?.map((courseInfo, index) => (
              <SwiperSlide key={index}>
                <Card
                  image={courseInfo.cardProps.image}
                  category={courseInfo.cardProps.category}
                  price={courseInfo.cardProps.price}
                  title={courseInfo.cardProps.title}
                  rating={courseInfo.cardProps.rating}
                  students={courseInfo.cardProps.students}
                  linkToCourseDetail={courseInfo.cardProps.linkToCourseDetail}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <Link
          to={"/category"}
          className="d-flex justify-content-center mt-4 text-decoration-none"
        >
          <button className="create-account-btn p-2 px-3 mt-4">
            Browse All Course <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </Link>
      </div>
    </>
  );
}

export default RecentlyAddedCourse;
