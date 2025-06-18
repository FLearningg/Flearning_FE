// components/BestSelling.jsx
import Card from "../common/Card/Card"
import "../../assets/Categories/BestSelling.css";

export default function BestSelling() {
  const courses = [
    {
      id: 1,
      image: "/images/CourseImages.png",
      category: "DESIGN",
      categoryColor: "#ff6636",
      title: "Machine Learning A-Z™: Hands-On Python & R In Data...",
      price: "$57",
      rating: 5.0,
      students: "265.7K",
    },
    {
      id: 2,
      image: "/images/CourseImages.png",
      category: "DEVELOPMENTS",
      categoryColor: "#342f98",
      title: "The Complete 2021 Web Development Bootcamp",
      price: "$57",
      rating: 5.0,
      students: "265.7K",
    },
    {
      id: 3,
      image: "/images/CourseImages.png",
      category: "BUSINESS",
      categoryColor: "#15711f",
      title: "Learn Python Programming Masterclass",
      price: "$57",
      rating: 5.0,
      students: "265.7K",
    },
    {
      id: 4,
      image: "/images/CourseImages.png",
      category: "MARKETING",
      categoryColor: "#342f98",
      title: "The Complete Digital Marketing Course - 12 Courses in 1",
      price: "$57",
      rating: 5.0,
      students: "265.7K",
    },
    {
      id: 5,
      image: "/images/CourseImages.png",
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
              <Card 
                image={course.image}
                category={course.category}
                categoryBgColor={course.categoryColor}
                price={course.price}
                title={course.title}
                rating={course.rating}
                students={course.students}
                variant="normal"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
