import React from 'react'
import Card from '../common/Card/Card'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import PopupCard from '../common/Card/PopupCard';


function BestSellingCourse() {
    const coursesInfo = [//sample data (must be an array)
        {
            cardProps: {
                image: '/images/CourseImages.png',
                category: 'Design',
                price: '53$',
                title: 'UI/UX Design Fundamentals',
                rating: 4.8,
                students: 1200,
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
            <div style={{ backgroundColor: "#ecebeb7c" }}>
                <div className="container py-5" >
                    <h3 className="text-center mb-5">Best selling courses</h3>
                    <div className="desktop-view">
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-5 g-3">
                            {coursesInfo.map((courseInfo, index) => (
                                <div className="col" key={index}>
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
                                />
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BestSellingCourse