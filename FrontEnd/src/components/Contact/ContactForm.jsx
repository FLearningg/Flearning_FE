import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'

function ContactForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  return (
    <>
      <div className='contact-form-container p-4'>
        <p className='contact-form-title mb-1'>Get In touch</p>
        <p className='text-secondary mb-4'>Feel free contact with us, we love to make new partners & friends</p>
        <form>
          <div className='row align-items-center'>
            <div className="col-md-6">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                className='form-control my-2 rounded-0 p-2'
                id="firstName"
                value={firstName}
                placeholder='First name'
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                className='form-control my-2 rounded-0 p-2'
                id="lastName"
                value={lastName}
                placeholder='Last name'
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='form-control my-2 rounded-0 p-2'
            placeholder='Email address'
          />
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            className='form-control my-2 rounded-0 p-2'
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder='Subject'
          />
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            className='form-control my-2 rounded-0 p-2'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Message'
            rows="4"
          />
          <button type="submit" className='copy-email-btn p-2 px-3 mt-3'>
            Send Message <FontAwesomeIcon icon={faPaperPlane} className='ms-1' />
          </button>
        </form>
      </div>
    </>
  )
}

export default ContactForm