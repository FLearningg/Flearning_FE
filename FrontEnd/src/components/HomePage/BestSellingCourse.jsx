import React, { useEffect } from "react";
import Card from "../common/Card/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import PopupCard from "../common/Card/PopupCard";
import { useDispatch, useSelector } from "react-redux";
import { getBestSellingCourses } from "../../services/courseService";
import LoaddingComponent from "../common/Loadding/LoaddingComponent";

function BestSellingCourse() {
  const courseInfo1 = useSelector(
    (state) => state.courses.bestSelling.bestSellingCourses
  );
  const isLoading = useSelector((state) => state.courses.bestSelling.isLoading);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchBestSellingCourses = async () => {
      await getBestSellingCourses(dispatch);
    };
    fetchBestSellingCourses();
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

  const coursesInfo = courseInfo1
    ?.filter((course) => course.status === "active")
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
          linkToCourseDetail: `/course/${course._id}`,
        },
        detailedProps: {
          courseId: course._id,
          title: course.title,
          author: course.createdBy 
            ? `${course.createdBy.firstName || ''} ${course.createdBy.lastName || ''}`.trim() || "Instructor"
            : "Instructor",
          authorAvatar: course.createdBy?.userImage || "/images/defaultImageUser.png",
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
      <div style={{ backgroundColor: "#ecebeb7c" }}>
        <div className="container py-5">
          <h3 className="text-center mb-5">Best selling courses</h3>
          {isLoading ? (
            <LoaddingComponent></LoaddingComponent>
          ) : (
            <>
              <div className="desktop-view">
                <div className="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-3">
                  {coursesInfo.map((courseInfo, index) => (
                    <div className="col" key={index}>
                      <div>
                        <PopupCard
                          cardProps={courseInfo.cardProps}
                          detailedProps={courseInfo.detailedProps}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* for mobile */}
          <div className="mobile-view">
            <Swiper
              spaceBetween={20}
              slidesPerView={1.5}
              grabCursor={true}
              breakpoints={{
                640: {
                  slidesPerView: 2.5,
                },
                768: {
                  slidesPerView: 3.5,
                },
              }}
            >
              {coursesInfo.map((courseInfo, index) => (
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
        </div>
      </div>
    </>
  );
}

export default BestSellingCourse;
