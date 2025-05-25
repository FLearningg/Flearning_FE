import React from 'react'
import '../../assets/homepage/TrustedCompany.css';
function TrustedCompanies() {
    return (
        <>
            <div className='container my-5'>
                <div className="row g-4">
                    <div className="col-md-4">
                        <strong>
                            <p className='h3'>6.3k trusted companies</p>
                        </strong>
                        <p className='text-secondary'>
                            We are trusted by more than 6.3k companies worldwide.
                            Our platform is designed to help you learn and grow, no matter where you are in your career.
                            Join the thousands of professionals who have already benefited from our courses and resources.
                        </p>
                    </div>
                    <div className="col-md-8">
                        <div className="row g-4">
                            <div className="col-md-3 col-6">
                                <div className="d-flex align-items-center justify-content-center logo-company">
                                    <img src="/images/Netflix.png" alt="" />
                                </div>
                            </div>
                            <div className="col-md-3 col-6">
                                <div className="d-flex align-items-center justify-content-center logo-company">
                                    <img src="/images/youtube.png" alt="" />
                                </div>
                            </div>
                            <div className="col-md-3 col-6">
                                <div className="d-flex align-items-center justify-content-center logo-company">
                                    <img src="/images/Google.png" alt="" />
                                </div>
                            </div>
                            <div className="col-md-3 col-6">
                                <div className="d-flex align-items-center justify-content-center logo-company">
                                    <img src="/images/lenovo.png" alt="" />
                                </div>
                            </div>
                            <div className="col-md-3 col-6">
                                <div className="d-flex align-items-center justify-content-center logo-company">
                                    <img src="/images/slack.png" alt="" />
                                </div>
                            </div>
                            <div className="col-md-3 col-6">
                                <div className="d-flex align-items-center justify-content-center logo-company">
                                    <img src="/images/verizon.png" alt="" />
                                </div>
                            </div>
                            <div className="col-md-3 col-6">
                                <div className="d-flex align-items-center justify-content-center logo-company">
                                    <img src="/images/lexmark.png" alt="" />
                                </div>
                            </div>
                            <div className="col-md-3 col-6">
                                <div className="d-flex align-items-center justify-content-center logo-company">
                                    <img src="/images/microsoft.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default TrustedCompanies