import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import ProfileSection from '../CourseList/ProfileSection';
import '../../assets/PurchaseHistory/PurchaseHistory.css';

const PURCHASE_HISTORY = [
  {
    id: 1,
    date: '1st September, 2021 at 11:30 PM',
    courses: [
      {
        id: 1,
        title: 'Learn Ethical Hacking From Scratch',
        instructor: 'Marvin McKinney',
        rating: 4.7,
        reviews: 451444,
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 2,
        title: 'Mega Digital Marketing Course A-Z: 12 Courses in 1 + Updates',
        instructor: 'Esther Howard',
        rating: 4.7,
        reviews: 451444,
        price: 49.00,
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalCourses: 2,
    totalAmount: 75.00,
    paymentMethod: 'Credit Card',
    cardNumber: '4142 **** **** ****',
    expiryDate: '04/24'
  },
  {
    id: 2,
    date: '31st August, 2021 at 11:30 PM',
    totalCourses: 52,
    totalAmount: 507.00,
    paymentMethod: 'Credit Card'
  },
  {
    id: 3,
    date: '24th August, 2021 at 6:24 PM',
    totalCourses: 1,
    totalAmount: 89.00,
    paymentMethod: 'Credit Card'
  },
  {
    id: 4,
    date: '1st September, 2021 at 8:47 PM',
    totalCourses: 1,
    totalAmount: 25.00,
    paymentMethod: 'Credit Card'
  },
  {
    id: 5,
    date: '1st September, 2021 at 11:30 PM',
    totalCourses: 5,
    totalAmount: 89.00,
    paymentMethod: 'Credit Card'
  },
  {
    id: 6,
    date: '17th July, 2021 at 10:51 AM',
    totalCourses: 2,
    totalAmount: 140.00,
    paymentMethod: 'Credit Card'
  }
];

const CourseItem = ({ course }) => (
  <div className="flearning-course-item">
    <div className="flearning-course-image">
      <img src={course.image} alt={course.title} />
    </div>
    <div className="flearning-course-info">
      <div className="flearning-course-rating">
        <FaStar className="flearning-star-icon" />
        <span className="flearning-rating-value">{course.rating}</span>
        <span className="flearning-review-count">({course.reviews.toLocaleString()} Review)</span>
      </div>
      <h4>{course.title}</h4>
      <p className="flearning-course-instructor">Course by: {course.instructor}</p>
    </div>
    <div className="flearning-course-price">
      ${course.price.toFixed(2)}
    </div>
  </div>
);

const PurchaseCard = ({ purchase, isExpanded }) => {
  return (
    <div className={`flearning-purchase-card ${isExpanded ? 'flearning-purchase-card-expanded' : ''}`}>
      <div className="flearning-purchase-header">
        <div className="flearning-purchase-info">
          <div className="flearning-purchase-date">{purchase.date}</div>
          <div className="flearning-purchase-meta">
            <span className="flearning-meta-item">
              <img src="/icons/PlayCircle.png" alt="Courses" className="flearning-meta-icon" />
              {purchase.totalCourses} Courses
            </span>
            <span className="flearning-meta-item">
              <img src="/icons/CurrencyDollarSimple.png" alt="Amount" className="flearning-meta-icon" />
              ${purchase.totalAmount.toFixed(2)} USD
            </span>
            <span className="flearning-meta-item">
              <img src="/icons/CreditCard.png" alt="Payment" className="flearning-meta-icon" />
              {purchase.paymentMethod}
            </span>
          </div>
        </div>
        <button className="flearning-purchase-toggle" aria-label="Toggle purchase details">
          {isExpanded ? '↑' : '↓'}
        </button>
      </div>

      {isExpanded && (
        <div className="flearning-purchase-details">
          <div className="flearning-purchase-details-grid">
            <div className="flearning-courses-list">
              {purchase.courses.map(course => (
                <CourseItem key={course.id} course={course} />
              ))}
            </div>
            
            <div className="flearning-purchase-summary">
              <div className="flearning-summary-date">
                {purchase.date}
              </div>
              <div className="flearning-summary-details">
                <div className="flearning-summary-item">
                  <img src="/icons/PlayCircle.png" alt="Courses" className="flearning-summary-icon" />
                  <span>{purchase.totalCourses} Courses</span>
                </div>
                <div className="flearning-summary-item">
                  <img src="/icons/CurrencyDollarSimple.png" alt="Amount" className="flearning-summary-icon" />
                  <span>${purchase.totalAmount.toFixed(2)} USD</span>
                </div>
                <div className="flearning-summary-item">
                  <img src="/icons/CreditCard.png" alt="Payment" className="flearning-summary-icon" />
                  <span>{purchase.paymentMethod}</span>
                </div>
              </div>
              {purchase.cardNumber && (
                <div className="flearning-card-info">
                  <div className="flearning-card-number">
                    <img src="/icons/CreditCard.png" alt="Card" className="flearning-card-icon" />
                    <span>{purchase.cardNumber}</span>
                  </div>
                  <span className="flearning-card-expiry">{purchase.expiryDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PurchaseHistory = () => {
  const location = useLocation();

  return (
    <div className="flearning-purchase-container">
      <ProfileSection 
        avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
        name="Kevin Gilbert"
        title="Web Designer & Best-Selling Instructor"
        activePath={location.pathname}
        showMobileHeader={false}
      />

      <div className="flearning-purchase-content">
        <div className="flearning-purchase-header-main">
          <h2>Purchase History</h2>
        </div>

        <div className="flearning-purchase-list">
          {PURCHASE_HISTORY.map((purchase, index) => (
            <PurchaseCard 
              key={purchase.id} 
              purchase={purchase} 
              isExpanded={index === 0} 
            />
          ))}
        </div>

        <div className="flearning-purchase-footer">
          <p>Yay! You have seen all your purchase history. 😎</p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory; 