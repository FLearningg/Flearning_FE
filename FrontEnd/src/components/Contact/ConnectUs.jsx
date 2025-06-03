import { faCheckCircle, faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'

function ConnectUs() {
    const email = "your@email.com"; // Replace with your actual email address
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className='container'>
                <div className='row my-5 align-items-center'>
                    <div className='col-md-5'>
                        <div className='connect-us-info'>
                            <p className='about-us-title'>Connect with us</p>
                            <p className='about-us-description'>Want to chat? We’d love to hear from you! Get in touch with our
                                Customer Success Team to inquire about speaking events,
                                advertising rates, or just say hello.</p>
                            {copied ? (
                                <button className='copy-email-btn p-2 px-3' disabled>
                                    <FontAwesomeIcon icon={faCheckCircle} className='me-1' /> Email Copied!
                                </button>
                            ) : (
                                <button className='copy-email-btn p-2 px-3' onClick={handleCopyEmail}>
                                    <FontAwesomeIcon icon={faEnvelope} className='me-1' /> Copy Email
                                </button>
                            )}
                        </div>
                    </div>
                    <div className='col-md-7 mt-5 mt-md-0'>
                        <div className="d-flex justify-content-end">
                            <img src="/images/connect_us.png" alt="Connect Us" className='img-fluid' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConnectUs