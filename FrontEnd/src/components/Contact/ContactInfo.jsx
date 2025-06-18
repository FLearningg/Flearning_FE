import React from 'react'

function ContactInfo() {
    const contactInfo = {
        address: '1702 Olympic Boulevard Santa Monica, CA 90404',
        phone: [
            '(123) 456-7890',
            '(987) 654-3210',
        ],
        email: [
            'info@example.com',
            'support@example.com'
        ]
    }
    return (
        <>
            <div className='contact-info-container'>
                <p className='contact-intro-text'>Will you be in Los Angeles or any other branches any time soon? Stop by the office! We'd love to meet.</p>
                <div className='contact-info-item'>
                    <div className='row'>
                        <div className='col-md-6'>
                            <p className='contact-info-title'>Address</p>
                        </div>
                        <div className="col-md-6">
                            <p className='contact-info-text'>{contactInfo.address}</p>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-6'>
                            <p className='contact-info-title'>Phone Number</p>
                        </div>
                        <div className="col-md-6">
                            <p className='contact-info-text'>{contactInfo.phone.map((number, index) => (
                                <span key={index}>{number}<br /></span>
                            ))}</p>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-6'>
                            <p className='contact-info-title'>Email address</p>
                        </div>
                        <div className="col-md-6">
                            <p className='contact-info-text'>{contactInfo.email.map((email, index) => (
                                <span key={index}>{email}<br /></span>
                            ))}</p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default ContactInfo