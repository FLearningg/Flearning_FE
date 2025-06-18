import React from 'react'
import { NavLink } from 'react-router-dom';

function NavigationBar() {
    return (
        <>
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark pt-0">
                <div className="container-fluid">
                    <div className="d-flex">
                        <ul className="navbar-nav me-auto mb-lg-0">
                            <li className="nav-item mb-0 p-0">
                                <NavLink to="/" className="nav-link nav--link">
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item mb-0 p-0">
                                <NavLink to="/courses" className="nav-link nav--link">
                                    Courses
                                </NavLink>
                            </li>
                            <li className="nav-item mb-0 p-0">
                                <NavLink to="/about" className="nav-link nav--link">
                                    About
                                </NavLink>
                            </li>
                            <li className="nav-item mb-0 p-0">
                                <NavLink to="/contact" className="nav-link nav--link">
                                    Contact
                                </NavLink>
                            </li>
                            <li className="nav-item mb-0 p-0">
                                <NavLink to="/faqs" className="nav-link nav--link">
                                    FAQs
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavigationBar