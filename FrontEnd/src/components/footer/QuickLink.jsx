import React from 'react'
import { Link } from 'react-router-dom'

function QuickLink() {
    return (
        <>
            <div className="col-md-2 mb-4 desktop-view">
                <h6 className="mb-3">SOME CATEGORY</h6>
                <ul className="list-unstyled list-links">
                    <li><Link to="/category?category=Web%20Development" className="footer-link text-secondary">Web Development</Link></li>
                    <li><Link to="/category?category=Programming" className="footer-link text-secondary">Programming</Link></li>
                    <li><Link to="/category?category=Design" className="footer-link text-secondary">Design</Link></li>
                    <li><Link to="/category?category=Mobile%20Development" className="footer-link text-secondary">Mobile Development</Link></li>
                </ul>
            </div>
            {/* Quick Links */}
            <div className="col-md-2 mb-4 desktop-view">
                <h6 className="mb-3">QUICK LINKS</h6>
                <ul className="list-unstyled list-links">
                    <li><Link to="/about" className="footer-link text-secondary">About</Link></li>
                    <li><Link to="/signup" className="footer-link text-secondary">Join with us</Link></li>
                    <li><Link to="/contact" className="footer-link text-secondary">Contact</Link></li>
                    {/* <li><Link to="/career" className="footer-link text-secondary">Career</Link></li> */}
                </ul>
            </div>
            {/* Support */}
            <div className="col-md-2 mb-4 desktop-view">
                <h6 className="mb-3">SUPPORT</h6>
                <ul className="list-unstyled list-links">
                    {/* <li><Link to="#" className="footer-link text-secondary">Help Center</Link></li> */}
                    <li><Link to="/faqs" className="footer-link text-secondary">FAQs</Link></li>
                    <li><Link to="#" className="footer-link text-secondary">Terms & Condition</Link></li>
                    <li><Link to="#" className="footer-link text-secondary">Privacy Policy</Link></li>
                </ul>
            </div>
        </>
    )
}

export default QuickLink