import { Star, User } from "lucide-react";
import "../../assets/Categories/CourseCard.css"; //

export default function CourseCard({ course }) {
  return (
    <div className="course-card card h-100 shadow-sm">
      {/* Course Image */}
      <img
        src={course.image}
        alt={course.title}
        className="card-img-top course-card-img"
      />

      {/* Course Body */}
      <div className="card-body px-3 py-3">
        {/* Category and Price */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="course-category badge text-uppercase">
            {course.category}
          </span>
          <span className="course-price fw-bold">
            ${course.price}
          </span>
        </div>

        {/* Title */}
        <h6 className="course-title fw-semibold mb-3">
          {course.title}
        </h6>

        {/* Rating + Students */}
        <div className="d-flex justify-content-start align-items-center gap-4 border-top pt-2">
          <div className="d-flex align-items-center gap-1 text-dark">
            <Star size={16} fill="#fd8e1f" color="#fd8e1f" />
            <span className="small fw-medium">{course.rating}</span>
          </div>
          <div className="d-flex align-items-center gap-1 text-muted">
            <User size={16} />
            <span className="small">{course.students} students</span>
          </div>
        </div>
      </div>
    </div>
  );
}
