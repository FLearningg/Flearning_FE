import React, { useEffect } from "react";
import Card from "../common/Card/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import PopupCard from "../common/Card/PopupCard";
import { useDispatch, useSelector } from "react-redux";
import { getBestSellingCourses } from "../../services/courseService";
import LoaddingComponent from "../common/Loadding/LoaddingComponent";
import { useNavigate } from "react-router-dom";

function BestSellingCourse() {
  const navigate = useNavigate();
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
  const coursesInfo = courseInfo1?.map((course) => {
    let finalPrice = course.price;
    let discountText = "";
    if (course.discountId) {
      if (course.discountId.typee === "fixedAmount") {
        finalPrice = Math.max(0, course.price - course.discountId.value);
        discountText = `-${course.discountId.value}$`;
      } else if (course.discountId.typee === "percent") {
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
        // price: `${course.price}$`,
        price: Number.isInteger(finalPrice)
          ? `${finalPrice}$`
          : `${parseFloat(finalPrice.toFixed(2))}$`,
        title: course.title,
        rating: course?.rating || 0, // If there is a rating field, take it, otherwise 0
        students: course.studentsEnrolled?.length || 0,
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
        price: `${finalPrice.toFixed(2)}$`,
        oldPrice: course.discountId ? `${course.price.toFixed(2)}$` : "",
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
