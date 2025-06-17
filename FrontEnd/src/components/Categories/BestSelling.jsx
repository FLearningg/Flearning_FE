// components/BestSelling.jsx
import CourseCard from "./CourseCard"
import "../../assets/Categories/BestSelling.css";

export default function BestSelling() {
  const courses = [
    {
      id: 1,
      image: "/placeholder.svg?height=200&width=320",
      category: "DESIGN",
      categoryColor: "#ff6636",
      title: "Machine Learning A-Z™: Hands-On Python & R In Data...",
      price: "$57",
      rating: 5.0,
      students: "265.7K",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=200&width=320",
      category: "DEVELOPMENTS",
      categoryColor: "#342f98",
      title: "The Complete 2021 Web Development Bootcamp",
      price: "$57",
      rating: 5.0,
      students: "265.7K",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=200&width=320",
      category: "BUSINESS",
      categoryColor: "#15711f",
      title: "Learn Python Programming Masterclass",
      price: "$57",
      rating: 5.0,
      students: "265.7K",
    },
    {
      id: 4,
      image: "/placeholder.svg?height=200&width=320",
      category: "MARKETING",
      categoryColor: "#342f98",
      title: "The Complete Digital Marketing Course - 12 Courses in 1",
      price: "$57",
      rating: 5.0,
      students: "265.7K",
    },
    {
      id: 5,
      image: "/placeholder.svg?height=200&width=320",
      category: "IT & SOFTWARE",
      categoryColor: "#fd8e1f",
      title: "Reiki Level I, II and Master/Teacher Program",
      price: "$57",
      rating: 5.0,
      students: "265.7K",
    },
  ]

  return (
    <section className="best-selling-section py-5 bg-white">
      <div className="container">
        <h2 className="text-center fw-bold section-title">
          Best selling courses in Web Development
        </h2>

        <div className="row g-4">
          {courses.map((course) => (
            <div key={course.id} className="col-12 col-md-6 col-lg-4 col-xl-2-4">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
