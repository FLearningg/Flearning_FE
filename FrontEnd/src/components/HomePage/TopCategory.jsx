import { faArrowRight, faBullhorn, faCamera, faCreditCard, faCube, faDesktop, faHandshake, faHeartbeat, faLaptopCode, faMusic, faPaintBrush, faTags, faUserGraduate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'
import '../../assets/homepage/TopCategory.css'
import CustomButton from '../common/CustomButton/CustomButton'

function TopCategory() {
    return (
        <>
            <div className="container py-5">
                <h3 className="text-center mb-5">Browse top category</h3>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">

                    <div className="col">
                        <Link to="" className="text-decoration-none text-reset">
                            <div className="card category-card bg-light-purple h-100">
                                <div className="card-body card-body-category">
                                    <div className="category-header">
                                        <div className="category-icon purple-icon">
                                            <FontAwesomeIcon icon={faTags} />
                                        </div>
                                        <h5 className="card-title card-category-title">Label</h5>
                                    </div>
                                    <p className="card-text card-category-text">63,476 Courses</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col">
                        <Link to="" className="text-decoration-none text-reset">
                            <div className="card category-card bg-light-green h-100">
                                <div className="card-body card-body-category">
                                    <div className="category-header">
                                        <div className="category-icon green-icon">
                                            <FontAwesomeIcon icon={faHandshake} />
                                        </div>
                                        <h5 className="card-title card-category-title">Business</h5>
                                    </div>
                                    <p className="card-text card-category-text">52,822 Courses</p>
                                </div>
                            </div>
                        </Link>
                    </div>



                    <div className="col">
                        <Link to="" className="text-decoration-none text-reset">
                            <div className="card category-card bg-light-orange h-100">
                                <div className="card-body card-body-category">
                                    <div className="category-header">
                                        <div className="category-icon orange-icon">
                                            <FontAwesomeIcon icon={faCreditCard} />
                                        </div>
                                        <h5 className="card-title card-category-title">Finance & Accounting</h5>
                                    </div>
                                    <p className="card-text card-category-text">33,841 Courses</p>
                                </div>
                            </div>
                        </Link>
                    </div>



                    <div className="col">
                        <Link to="" className="text-decoration-none text-reset">
                            <div className="card category-card bg-light-red h-100">
                                <div className="card-body card-body-category">
                                    <div className="category-header">
                                        <div className="category-icon red-icon">
                                            <FontAwesomeIcon icon={faLaptopCode} />
                                        </div>
                                        <h5 className="card-title card-category-title">IT & Software</h5>
                                    </div>
                                    <p className="card-text card-category-text">22,649 Courses</p>
                                </div>
                            </div>
                        </Link>
                    </div>


                    <div className="col">
                        <Link to="" className="text-decoration-none text-reset">
                            <div className="card category-card bg-light-coral h-100">
                                <div className="card-body card-body-category">
                                    <div className="category-header">
                                        <div className="category-icon coral-icon">
                                            <FontAwesomeIcon icon={faUserGraduate} />
                                        </div>
                                        <h5 className="card-title card-category-title">Personal Development</h5>
                                    </div>
                                    <p className="card-text card-category-text">20,126 Courses</p>
                                </div>
                            </div>
                        </Link>
                    </div>


                    <div className="col">
                        <Link to="" className="text-decoration-none text-reset">
                            <div className="card category-card bg-light-gray h-100">
                                <div className="card-body card-body-category">
                                    <div className="category-header">
                                        <div className="category-icon gray-icon">
                                            <FontAwesomeIcon icon={faDesktop} />
                                        </div>
                                        <h5 className="card-title card-category-title">Office Productivity</h5>
                                    </div>
                                    <p className="card-text card-category-text">13,932 Courses</p>
                                </div>
                            </div>
                        </Link>
                    </div>


                    <div className="col">
                        <Link to="" className="text-decoration-none text-reset">
                            <div className="card category-card bg-light-purple h-100">
                                <div className="card-body card-body-category">
                                    <div className="category-header">
                                        <div className="category-icon purple-icon">
                                            <FontAwesomeIcon icon={faBullhorn} />
                                        </div>
                                        <h5 className="card-title card-category-title">Marketing</h5>
                                    </div>
                                    <p className="card-text card-category-text">12,068 Courses</p>
                                </div>
                            </div>
                        </Link>
                    </div>


                    <div className="col">
                        <Link to="" className="text-decoration-none text-reset">
                            <div className="card category-card bg-light-gray h-100">
                                <div className="card-body card-body-category">
                                    <div className="category-header">
                                        <div className="category-icon dark-gray-icon">
                                            <FontAwesomeIcon icon={faCamera} />
                                        </div>
                                        <h5 className="card-title card-category-title">Photography & Video</h5>
                                    </div>
                                    <p className="card-text card-category-text">6,196 Courses</p>
                                </div>
                            </div>
                        </Link>
                    </div>


                    <div className="col">
                        <Link to="" className="text-decoration-none text-reset">
                            <div className="card category-card bg-light-orange h-100">
                                <div className="card-body card-body-category">
                                    <div className="category-header">
                                        <div className="category-icon orange-icon">
                                            <FontAwesomeIcon icon={faCube} />
                                        </div>
                                        <h5 className="card-title card-category-title">Lifestyle</h5>
                                    </div>
                                    <p className="card-text card-category-text">2,736 Courses</p>
                                </div>
                            </div>
                        </Link>
                    </div>


                    <div className="col">
                        <Link to="" className="text-decoration-none text-reset">
                            <div className="card category-card bg-light-coral h-100">
                                <div className="card-body card-body-category">
                                    <div className="category-header">
                                        <div className="category-icon coral-icon">
                                            <FontAwesomeIcon icon={faPaintBrush} />
                                        </div>
                                        <h5 className="card-title card-category-title">Design</h5>
                                    </div>
                                    <p className="card-text card-category-text">2,600 Courses</p>
                                </div>
                            </div>
                        </Link>
                    </div>


                    <div className="col">
                        <Link to="" className="text-decoration-none text-reset">
                            <div className="card category-card bg-light-green h-100">
                                <div className="card-body card-body-category">
                                    <div className="category-header">
                                        <div className="category-icon green-icon">
                                            <FontAwesomeIcon icon={faHeartbeat} />
                                        </div>
                                        <h5 className="card-title card-category-title">Health & Fitness</h5>
                                    </div>
                                    <p className="card-text card-category-text">1,678 Courses</p>
                                </div>
                            </div>
                        </Link>
                    </div>


                    <div className="col">
                        <Link to="" className="text-decoration-none text-reset">
                            <div className="card category-card bg-light-orange h-100">
                                <div className="card-body card-body-category">
                                    <div className="category-header">
                                        <div className="category-icon orange-icon">
                                            <FontAwesomeIcon icon={faMusic} />
                                        </div>
                                        <h5 className="card-title card-category-title">Music</h5>
                                    </div>
                                    <p className="card-text card-category-text">959 Courses</p>
                                </div>
                            </div>
                        </Link>
                    </div>

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