import React from 'react'
import { Link } from 'react-router-dom'
import '../../assets/aboutPage/about.css'
import TrustedCompanies from '../HomePage/TrustedCompanies'
import AboutInfo from './AboutInfo'
import AboutUsVision from './AboutUsVision'
import AboutUsGallery from './AboutUsGallery'
import Testimonials from './Testimonials'
import ShareKnow from './ShareKnow'
import BreadcrumbAbout from './BreadcrumbAbout'
function AboutUs() {
    return (
        <div className='about-us-container'>
            <BreadcrumbAbout/>
            <ShareKnow/>
            <hr />
            <div>
                <TrustedCompanies />
            </div>
            <div style={{ margin: '5% auto' }}>
                <AboutInfo
                    numberStudent={'67.1k'}
                    numberCertification={'26k'}
                    numberCountry={'72'}
                    successRate={'99.9%'}
                    trustedCompanies={'57'}
                />
            </div>
            <AboutUsVision/>
            <AboutUsGallery/>
            <Testimonials/>

        </div>
    )
}

export default AboutUs