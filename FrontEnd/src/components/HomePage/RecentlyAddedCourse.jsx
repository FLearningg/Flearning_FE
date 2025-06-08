import React from 'react'
import PopupCard from '../common/Card/PopupCard';
import Card from '../common/Card/Card';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

function RecentlyAddedCourse() {
    const coursesInfo = [//sample data (must be an array)
        {
            cardProps: {
                image: '/images/CourseImages.png',
                category: 'Design',
                price: '53$',
                title: 'UI/UX Design Fundamentals',
                rating: 4.8,
                students: 1200,
                variant: 'large'
            },
            detailedProps: {
                title: 'UI/UX Design Fundamentals',
                author: 'John Doe',
                authorAvatar: '/images/author-avatar.png',
                rating: 4.8,
                ratingCount: 320,
                students: 1200,
                level: 'Beginner',
                duration: '8h 30m',
                price: '53$',
                oldPrice: '75$',
                discount: '29%',
                learnList: [
                    'Understand the basics of UI/UX design',
                    'Learn design thinking process',
                    'Work with popular design tools',
                    'Create wireframes and prototypes',
                    'Build a portfolio project'
                ]
            }
        },
        {
            cardProps: {
                image: '/images/CourseImages.png',
                category: 'Design',
                price: '53$',
                title: 'UI/UX Design Fundamentals',
                rating: 4.8,
                students: 1200,
                variant: 'large'
            },
            detailedProps: {
                title: 'UI/UX Design Fundamentals',
                author: 'John Doe',
                authorAvatar: '/images/author-avatar.png',
                rating: 4.8,
                ratingCount: 320,
                students: 1200,
                level: 'Beginner',
                duration: '8h 30m',
                price: '53$',
                oldPrice: '75$',
                discount: '29%',
                learnList: [
                    'Understand the basics of UI/UX design',
                    'Learn design thinking process',
                    'Work with popular design tools',
                    'Create wireframes and prototypes',
                    'Build a portfolio project'
                ]
            }
        },
        {
            cardProps: {
                image: '/images/CourseImages.png',
                category: 'Design',
                price: '53$',
                title: 'UI/UX Design Fundamentals',
                rating: 4.8,
                students: 1200,
                variant: 'large'
            },
            detailedProps: {
                title: 'UI/UX Design Fundamentals',
                author: 'John Doe',
                authorAvatar: '/images/author-avatar.png',
                rating: 4.8,
                ratingCount: 320,
                students: 1200,
                level: 'Beginner',
                duration: '8h 30m',
                price: '53$',
                oldPrice: '75$',
                discount: '29%',
                learnList: [
                    'Understand the basics of UI/UX design',
                    'Learn design thinking process',
                    'Work with popular design tools',
                    'Create wireframes and prototypes',
                    'Build a portfolio project'
                ]
            }
        },
        {
            cardProps: {
                image: '/images/CourseImages.png',
                category: 'Design',
                price: '53$',
                title: 'UI/UX Design Fundamentals',
                rating: 4.8,
                students: 1200,
                variant: 'large'
            },
            detailedProps: {
                title: 'UI/UX Design Fundamentals',
                author: 'John Doe',
                authorAvatar: '/images/author-avatar.png',
                rating: 4.8,
                ratingCount: 320,
                students: 1200,
                level: 'Beginner',
                duration: '8h 30m',
                price: '53$',
                oldPrice: '75$',
                discount: '29%',
                learnList: [
                    'Understand the basics of UI/UX design',
                    'Learn design thinking process',
                    'Work with popular design tools',
                    'Create wireframes and prototypes',
                    'Build a portfolio project'
                ]
            }
        }
    ]
    return (
        <>
            <div className="container my-5">
                <h3 className="text-center mb-5">Recently Added Courses</h3>
                <div className="desktop-view">
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
                        {coursesInfo?.map((courseInfo) => (
                            <div className="col">
                                <div>
                                    <PopupCard cardProps={courseInfo.cardProps} detailedProps={courseInfo.detailedProps} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* for mobile */}
                <div className="mobile-view">
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={1.2}
                        grabCursor={true}
                    >
                        <SwiperSlide>
                            <Card
                                image={'/images/CourseImages.png'}
                                category={'Design'}
                                price={'53$'}
                                title={'UI/UX Design Fundamentals'}
                                rating={4.8}
                                students={1200}
                                variant="large"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Card
                                image={'/images/CourseImages.png'}
                                category={'Design'}
                                price={'53$'}
                                title={'UI/UX Design Fundamentals'}
                                rating={4.8}
                                students={1200}
                                variant="large"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Card
                                image={'/images/CourseImages.png'}
                                category={'Design'}
                                price={'53$'}
                                title={'UI/UX Design Fundamentals'}
                                rating={4.8}
                                students={1200}
                                variant="large"
                            />
                        </SwiperSlide>
                    </Swiper>
                </div>
                <div className='d-flex justify-content-center mt-4'>
                    <button className='create-account-btn p-2 px-3 mt-4'>Browse All Course <FontAwesomeIcon icon={faChevronRight} /></button>
                </div>
            </div>
        </>
    )
}

export default RecentlyAddedCourse