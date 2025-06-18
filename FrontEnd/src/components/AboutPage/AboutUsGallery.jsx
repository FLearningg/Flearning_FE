import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'

function AboutUsGallery() {
    return (
        <>
            <div style={{ margin: '5% auto' }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-5">
                            <div className="px-4 px-md-5 py-3 text-center text-md-start">
                                <p className='about-us-mini-title mb-1'>OUR GALLERY</p>
                                <p className='about-us-title mb-2'>We’ve been here almost 17 years</p>
                                <p className='about-us-description'>
                                    Discover the moments that define us. Our gallery showcases the essence of our journey,
                                    capturing the spirit of our community and the impact we strive to make.
                                </p>
                                <Link to="/" className='mt-3'>
                                    <button className='learn-with-us-btn p-2 px-3'>
                                        Learn with Us <FontAwesomeIcon icon={faArrowRight} className='ps-2' />
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="col-12 col-md-7">
                            <div className="d-flex justify-content-center justify-content-md-end p-3">
                                <img src="/images/Gallery.png" alt="About Us Gallery" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AboutUsGallery