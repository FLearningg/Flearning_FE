import React, { useState } from 'react'
import ProfileSection from '../CourseList/ProfileSection'
import { Link, useLocation } from 'react-router-dom';
import '../../assets/StudentCartPage/StudentCart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import CartPagePagination from './CartPagePagination';

function CartPage() {
    const location = useLocation();
    const Cart_DATA = [
        {
            courseImage: "/images/CourseImages.png",
            courseName: "The Ultimate Drawing Course - Beginner to Advanced",
            rating: 4.5,
            reviewCount: 10,
            price: 20.00,
            oldPrice: 49.03,
            courseAuthor: "John Doe"
        },
        {
            courseImage: "/images/CourseImages.png",
            courseName: "The Ultimate Drawing Course - Beginner to Advanced",
            rating: 4.5,
            reviewCount: 10,
            price: 20.00,
            oldPrice: 49.03,
            courseAuthor: "John Doe"
        },
        {
            courseImage: "/images/CourseImages.png",
            courseName: "The Ultimate Drawing Course - Beginner to Advanced",
            rating: 4.5,
            reviewCount: 10,
            price: 20.00,
            oldPrice: 49.03,
            courseAuthor: "John Doe"
        },
        {
            courseImage: "/images/CourseImages.png",
            courseName: "The Ultimate Drawing Course - Beginner to Advanced",
            rating: 4.5,
            reviewCount: 10,
            price: 20.00,
            oldPrice: 49.03,
            courseAuthor: "John Doe"
        },
        {
            courseImage: "/images/CourseImages.png",
            courseName: "The Complete JavaScript Course 2023: From Zero to Expert!",
            rating: 4.0,
            reviewCount: 5,
            price: 15.00,
            // oldPrice: 39.00,
            courseAuthor: "Jane Smith"
        },
    ];

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const totalPages = Math.ceil(Cart_DATA.length / itemsPerPage);

    // Get current page data
    const startIdx = (currentPage - 1) * itemsPerPage;
    const currentData = Cart_DATA.slice(startIdx, startIdx + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const toggleHeart = (index) => {
        // Logic to remove item from cart
        console.log('removed from cart', index);
    };

    return (
        <div>
            <ProfileSection
                avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
                name="Kevin Gilbert"
                title="Web Designer & Best-Selling Instructor"
                activePath={location.pathname}
                showMobileHeader={false}
            />
            <div className="cart-container">
                <div className="cart-content">
                    <div className="dashboard-header">
                        <h2>Cart ({Cart_DATA?.length})</h2>
                    </div>

                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col" className='text-secondary fw-medium p-3'>COURSE</th>
                                    <th scope="col" className='text-secondary fw-medium p-3'>PRICE</th>
                                    <th scope="col" className='text-secondary fw-medium p-3'>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((item, index) => (
                                    <tr key={startIdx + index}>
                                        <td className='p-3'>
                                            <div className="d-flex align-items-start gap-3 flex-nowrap">
                                                <img src={item.courseImage} className="cart-course-img" alt="course" />
                                                <div className="flex-shrink-1" style={{ minWidth: 0 }}>
                                                    <div className="cart-rating-star mb-1">
                                                        <FontAwesomeIcon icon={faStar} /> {item.rating} <span className="text-muted">({item.reviewCount} Review)</span>
                                                    </div>
                                                    {/* Link to course details page */}
                                                    <Link className='text-decoration-none text-reset' to={'#'}>
                                                        <div className="text-truncate fw-semibold">{item.courseName}</div>
                                                    </Link>
                                                    <div className="cart-course-author">Course by: {item.courseAuthor}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-start p-3">
                                            <span className="cart-price-current">${item.price.toFixed(2)}</span>
                                            {item.oldPrice &&
                                                <span className="cart-price-old ms-2">${item.oldPrice.toFixed(2)}</span>
                                            }
                                        </td>
                                        <td className="text-end p-3">
                                            <div className="d-flex gap-2 flex-nowrap">
                                                <button className="btn btn-light cart-button-buy-now border border-1 rounded-0">Buy Now</button>
                                                <button
                                                    className="btn cart-btn-fav rounded-0 p-2"
                                                    onClick={() => toggleHeart(startIdx + index)}
                                                    style={{ minWidth: 40 }}
                                                >
                                                    <FontAwesomeIcon icon={faTimesCircle} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination controls */}
                    <CartPagePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default CartPage;