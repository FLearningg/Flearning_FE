export default function AboutInfo({ numberStudent, numberCertification, numberCountry, successRate, trustedCompanies }) {
    return (
        <>
            <div className="container">
                <div className="row row-cols-2 row-cols-md-5 g-3">
                    <div className="col">
                        <div className="d-flex">
                            <img src="/icons/Users.png" alt="About Us" className="about--icon" />
                            <div className="ms-2">
                                <h2>{numberStudent}</h2>
                                <p className='mb-0'>Students</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="d-flex ">
                            <img src="/icons/Notebook.png" alt="About Us" className='about--icon' />
                            <div className="ms-2">
                                <h2>{numberCertification}</h2>
                                <p className='mb-0'>Certifications</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="d-flex">
                            <img src="/icons/Globe.png" alt="About Us" className='about--icon' />
                            <div className="ms-2">
                                <h2>{numberCountry}</h2>
                                <p className='mb-0'>Countries</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="d-flex">
                            <img src="/icons/CircleCheck.png" alt="About Us" className='about--icon' />
                            <div className="ms-2">
                                <h2>{successRate}</h2>
                                <p className='mb-0'>Success Rate</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="d-flex">
                            <img src="/icons/Stack.png" alt="About Us" className='about--icon' />
                            <div className="ms-2">
                                <h2>{trustedCompanies}</h2>
                                <p className='mb-0'>Trusted Companies</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}