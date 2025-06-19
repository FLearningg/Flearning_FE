import { faArrowRight, faBullhorn, faCamera, faCreditCard, faCube, faDesktop, faHandshake, faHeartbeat, faLaptopCode, faMusic, faPaintBrush, faTags, faUserGraduate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'
import '../../assets/homepage/TopCategory.css'
import CustomButton from '../common/CustomButton/CustomButton'
import TopCategoryCard from './TopCategoryCard'
import { icon } from '@fortawesome/fontawesome-svg-core'

const categoryData = [
    {
        icon: faTags,
        bgColor: '#f0f0ff',
        iconColor: '#6366f1',
        title: 'Label',
        numberOfCourse: '63,476',
        linkToCategory: '/category/label'
    },
    {
        icon: faHandshake,
        bgColor: '#d0f0c0',
        iconColor: '#4caf50',
        title: 'Business',
        numberOfCourse: '52,822',
        linkToCategory: '/category/business'
    },
    {
        icon: faCreditCard,
        bgColor: '#ffe0b2',
        iconColor: '#ff9800',
        title: 'Finance & Accounting',
        numberOfCourse: '33,841',
        linkToCategory: '/category/finance-accounting'
    },
    {
        icon: faLaptopCode,
        bgColor: '#ffcccb',
        iconColor: '#ef4444',
        title: 'IT & Software',
        numberOfCourse: '22,649',
        linkToCategory: '/category/it-software'
    },
    {
        icon: faUserGraduate,
        bgColor: '#f0f8ff',
        iconColor: '#ff7f50',
        title: 'Personal Development',
        numberOfCourse: '20,126',
        linkToCategory: '/category/personal-development'
    },
    {
        icon: faDesktop,
        bgColor: '#f5f5f5',
        iconColor: '#9e9e9e',
        title: 'Office Productivity',
        numberOfCourse: '13,932',
        linkToCategory: '/category/office-productivity'
    },
    {
        icon: faBullhorn,
        bgColor: '#fff3e0',
        iconColor: '#ffb300',
        title: 'Marketing',
        numberOfCourse: '11,234',
        linkToCategory: '/category/marketing'
    },
    {
        icon: faCamera,
        bgColor: '#e0f7fa',
        iconColor: '#00bcd4',
        title: 'Photography',
        numberOfCourse: '9,876',
        linkToCategory: '/category/photography'
    },
    {
        icon: faMusic,
        bgColor: '#fce4ec',
        iconColor: '#d81b60',
        title: 'Music',
        numberOfCourse: '8,765',
        linkToCategory: '/category/music'
    },
    {
        icon: faPaintBrush,
        bgColor: '#f3e5f5',
        iconColor: '#ab47bc',
        title: 'Design',
        numberOfCourse: '7,654',
        linkToCategory: '/category/design'
    },
    {
        icon: faHeartbeat,
        bgColor: '#e8f5e9',
        iconColor: '#43a047',
        title: 'Health & Fitness',
        numberOfCourse: '6,543',
        linkToCategory: '/category/health-fitness'
    },
    {
        icon: faCube,
        bgColor: '#fffde7',
        iconColor: '#fbc02d',
        title: 'Data Science',
        numberOfCourse: '5,432',
        linkToCategory: '/category/data-science'
    }
]
function TopCategory() {
    return (
        <>
            <div className="container py-5">
                <h3 className="text-center mb-5">Browse top category</h3>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                    {categoryData?.map((category, index) => (
                        <TopCategoryCard
                            key={index}
                            icon={category.icon}
                            bgColor={category.bgColor}
                            iconColor={category.iconColor}
                            title={category.title}
                            numberOfCourse={category.numberOfCourse}
                            linkToCategory={category.linkToCategory}
                        />
                    ))}
                </div>

                <div className="text-center mt-5">
                    <p className="d-inline-block me-2">We have more category & subcategory.</p>
                    <Link to="#" className="browse-all">Browse All <FontAwesomeIcon icon={faArrowRight} /></Link>
                </div>
            </div >
        </>
    )
}

export default TopCategory