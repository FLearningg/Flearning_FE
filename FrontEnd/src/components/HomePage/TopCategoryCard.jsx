import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
function TopCategoryCard({ icon, bgColor, iconColor, title, numberOfCourse, linkToCategory }) {
    return (
        <>
            <div className="col">
                <Link to={linkToCategory} className="text-decoration-none text-reset">
                    <div className='card category-card h-100' style={{backgroundColor: bgColor}}>
                        <div className="card-body card-body-category">
                            <div className="category-header">
                                <div className='category-icon' style={{backgroundColor: iconColor}}>
                                    <FontAwesomeIcon icon={icon} />
                                </div>
                                <h5 className="card-title card-category-title">{title}</h5>
                            </div>
                            <p className="card-text card-category-text">{numberOfCourse} Courses</p>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default TopCategoryCard