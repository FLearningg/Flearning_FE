import React from 'react'
import BreadcrumbContact from './BreadcrumbContact'
import ConnectUs from './ConnectUs'
import '../../assets/contactPage/contact.css'
import ContactInfo from './ContactInfo'
import ContactForm from './ContactForm'
import Location from './Location'
function ContactUs() {
    return (
        <div className='pt-4 pt-md-0' >
            <BreadcrumbContact />
            <ConnectUs />
            <div style={{backgroundColor:'#F5F7FA', padding: '10px'}}>
                <div className='container' style={{ margin: '5% auto' }} >
                    <h3 className='text-center'>Contact Us</h3>
                    <div className="row pt-4">
                        <div className="col-md-6">
                            <ContactInfo />
                        </div>
                        <div className="col-md-6">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
            <Location/>
        </div>
    )
}

export default ContactUs