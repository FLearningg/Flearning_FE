import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card/Card';
import SearchBox from '../common/search/SearchBox/SearchBox';
import '../../assets/AdminMyCourse/AdminAllCourse.css';

const AdminAllCourse = ({ title = "My Courses" }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('latest');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Sample course data - in real app this would come from API
  const coursesData = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
      category: "DEVELOPMENTS",
      categoryBgColor: "#e8f4fd",
      categoryTextColor: "#1e40af",
      price: "$24.00",
      title: "Premiere Pro for Beginners: Video Editing in Premiere",
      rating: 4.9,
      students: "982,941",
      actions: ["View Details", "Edit Course", "Delete Course"]
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=200&fit=crop",
      category: "DEVELOPMENTS",
      categoryBgColor: "#e8f4fd",
      categoryTextColor: "#1e40af",
      price: "$49.00",
      title: "Learn Python Programming Masterclass",
      rating: 4.0,
      students: "511,123",
      actions: ["View Details", "Edit Course", "Delete Course"]
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&h=200&fit=crop",
      category: "DEVELOPMENTS",
      categoryBgColor: "#e8f4fd",
      categoryTextColor: "#1e40af",
      price: "$23.00",
      originalPrice: "$36.00",
      title: "Data Structures & Algorithms Essentials (2021)",
      rating: 5.0,
      students: "197,837",
      actions: ["View Details", "Edit Course", "Delete Course"]
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
      category: "DEVELOPMENTS",
      categoryBgColor: "#e8f4fd",
      categoryTextColor: "#1e40af",
      price: "$89.00",
      title: "Machine Learning A-Z™: Hands-On Python & R In Data Science",
      rating: 4.5,
      students: "211,434",
      actions: ["View Details", "Edit Course", "Delete Course"]
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop",
      category: "DEVELOPMENTS",
      categoryBgColor: "#e8f4fd",
      categoryTextColor: "#1e40af",
      price: "$16.00",
      title: "Complete Blender Creator: Learn 3D Modelling for Beginners",
      rating: 3.5,
      students: "435,671",
      actions: ["View Details", "Edit Course", "Delete Course"]
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&h=200&fit=crop",
      category: "DEVELOPMENTS",
      categoryBgColor: "#e8f4fd",
      categoryTextColor: "#1e40af",
      price: "$13.00",
      title: "SQL for NEWBS: Weekender Crash Course",
      rating: 4.7,
      students: "154,817",
      actions: ["View Details", "Edit Course", "Delete Course"]
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
      category: "DEVELOPMENTS",
      categoryBgColor: "#e8f4fd",
      categoryTextColor: "#1e40af",
      price: "$57.00",
      originalPrice: "$87.00",
      title: "SEO 2021: Complete SEO Training + SEO for WordPress Websites",
      rating: 4.9,
      students: "181,811",
      actions: ["View Details", "Edit Course", "Delete Course"]
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop",
      category: "DEVELOPMENTS",
      categoryBgColor: "#e8f4fd",
      categoryTextColor: "#1e40af",
      price: "$32.00",
      title: "Angular - The Complete Guide (2021 Edition)",
      rating: 4.6,
      students: "236,568",
      actions: ["View Details", "Edit Course", "Delete Course"]
    },
    {
      id: 9,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
      category: "DEVELOPMENTS",
      categoryBgColor: "#e8f4fd",
      categoryTextColor: "#1e40af",
      price: "$80.00",
      title: "Graphic Design Masterclass - Learn GREAT Design",
      rating: 5.0,
      students: "1,356,236",
      actions: ["View Details", "Edit Course", "Delete Course"]
    },
    {
      id: 10,
      image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=300&h=200&fit=crop",
      category: "DEVELOPMENTS",
      categoryBgColor: "#e8f4fd",
      categoryTextColor: "#1e40af",
      price: "$24.00",
      originalPrice: "$49.00",
      title: "[NEW] Ultimate AWS Certified Cloud Practitioner - 2021",
      rating: 4.5,
      students: "435,671",
      actions: ["View Details", "Edit Course", "Delete Course"]
    },
    {
      id: 11,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
      category: "DEVELOPMENTS",
      categoryBgColor: "#e8f4fd",
      categoryTextColor: "#1e40af",
      price: "$16.00",
      title: "2021 Complete Python Bootcamp From Zero to Hero in Python",
      rating: 4.3,
      students: "435,871",
      actions: ["View Details", "Edit Course", "Delete Course"]
    },
    {
      id: 12,
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop",
      category: "DEVELOPMENTS",
      categoryBgColor: "#e8f4fd",
      categoryTextColor: "#1e40af",
      price: "$35.00",
      title: "Instagram Marketing 2021: Complete Guide To Instagram Growth",
      rating: 4.9,
      students: "854",
      actions: ["View Details", "Edit Course", "Delete Course"]
    },
    {
      id: 13,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop",
      category: "DEVELOPMENTS",
      categoryBgColor: "#e8f4fd",
      categoryTextColor: "#1e40af",
      price: "$23.00",
      originalPrice: "$35.00",
      title: "Complete Adobe Lightroom Megacourse: Beginner to Expert",
      rating: 4.8,
      students: "854",
      actions: ["View Details", "Edit Course", "Delete Course"]
    },
    {
      id: 14,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop",
      category: "DEVELOPMENTS",
      categoryBgColor: "#e8f4fd",
      categoryTextColor: "#1e40af",
      price: "$89.00",
      title: "The Python Mega Course: Build 10 Real World Applications",
      rating: 4.7,
      students: "154,817",
      actions: ["View Details", "Edit Course", "Delete Course"]
    },
    {
      id: 15,
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=300&h=200&fit=crop",
      category: "DEVELOPMENTS",
      categoryBgColor: "#e8f4fd",
      categoryTextColor: "#1e40af",
      price: "$35.00",
      title: "The Ultimate Drawing Course - Beginner to Advanced",
      rating: 4.5,
      students: "2,711",
      actions: ["View Details", "Edit Course", "Delete Course"]
    },
    {
      id: 16,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
      category: "DEVELOPMENTS",
      categoryBgColor: "#e8f4fd",
      categoryTextColor: "#1e40af",
      price: "$8.00",
      originalPrice: "$200",
      title: "Machine Learning A-Z™: Hands-On Python & R In Data Science",
      rating: 4.1,
      students: "451,444",
      actions: ["View Details", "Edit Course", "Delete Course"]
    }
  ];

  // Filter courses based on search and filters
  const filteredCourses = coursesData.filter(course => {
    const matchesCategory = categoryFilter === 'all' || course.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesRating = ratingFilter === 'all' || 
      (ratingFilter === '4+' && course.rating >= 4) ||
      (ratingFilter === '3+' && course.rating >= 3);
    
    return matchesCategory && matchesRating;
  });

  // Handle course click - navigate to AdminMyCourse with course details
  const handleCourseClick = (course) => {
    navigate(`/admin/courses/${course.id}`, { state: { courseData: course } });
  };

  // Menu actions for each course
  const getMenuActions = (course) => [
    {
      label: 'View Details',
      type: 'primary',
      icon: '👁️'
    },
    {
      label: 'Edit Course',
      type: 'secondary',
      icon: '✏️'
    },
    {
      label: 'Delete Course',
      type: 'danger',
      icon: '🗑️'
    }
  ];

  // Handle menu action
  const handleMenuAction = (course, action) => {
    switch (action.label) {
      case 'View Details':
        handleCourseClick(course);
        break;
      case 'Edit Course':
        navigate(`/admin/courses/basic-information?edit=${course.id}`);
        break;
      case 'Delete Course':
        if (window.confirm('Are you sure you want to delete this course?')) {
          console.log('Delete course:', course.id);
        }
        break;
      default:
        break;
    }
  };

  // Enhanced Card component with admin actions
  const AdminCourseCard = ({ course }) => {
    return (
      <div 
        className="admin-course-card-wrapper"
        onClick={() => handleCourseClick(course)}
      >
        <Card
          image={course.image}
          category={course.category}
          categoryBgColor={course.categoryBgColor}
          categoryTextColor={course.categoryTextColor}
          price={course.price}
          title={course.title}
          rating={course.rating}
          students={course.students}
          variant="admin"
          menuActions={getMenuActions(course)}
          onMenuAction={(action) => handleMenuAction(course, action)}
        />
      </div>
    );
  };

  // Sample search data for SearchBox
  const searchData = coursesData.map(course => ({
    id: course.id,
    label: course.title,
    category: course.category
  }));

  // Handle search selection
  const handleSearchSelect = (selectedItem) => {
    const course = coursesData.find(c => c.id === selectedItem.id);
    if (course) {
      handleCourseClick(course);
    }
  };

  // Handle category click
  const handleCategoryClick = () => {
    console.log('Category clicked');
  };

  return (
    <div className="admin-all-courses">
      {/* Filters */}
      <div className="aac-filters">
        <SearchBox
          data={searchData}
          placeholder="Search in your courses..."
          onSelect={handleSearchSelect}
          onCategoryClick={handleCategoryClick}
          categoryLabel="Browse"
          containerClassName="aac-search-box"
        />

        <select 
          className="aac-filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
        </select>

        <select 
          className="aac-filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Category</option>
          <option value="developments">Development</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
          <option value="marketing">Marketing</option>
        </select>

        <select 
          className="aac-filter-select"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
        >
          <option value="all">4 Star & Up</option>
          <option value="4+">4+ Stars</option>
          <option value="3+">3+ Stars</option>
          <option value="all">All Ratings</option>
        </select>
      </div>

      {/* Courses Grid */}
      <div className="aac-courses-grid">
        {filteredCourses.map((course) => (
          <AdminCourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Pagination */}
      <div className="aac-pagination">
        <button className="aac-page-btn aac-page-prev">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="aac-page-numbers">
          <button className="aac-page-btn">1</button>
          <button className="aac-page-btn aac-page-active">2</button>
          <button className="aac-page-btn">3</button>
          <button className="aac-page-btn">4</button>
        </div>
        
        <button className="aac-page-btn aac-page-next">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>


    </div>
  );
};

export default AdminAllCourse; 