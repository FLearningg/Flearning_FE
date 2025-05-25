import React from 'react'
import '../../assets/header/header.css';
import { NotificationCard } from './NotificationCard';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
function Notification() {
    const notificationData = [
        // Sample data, replace with actual notification data
        {
            title: "New Course Added",
            date: "March 15, 2023",
            time: "10:30 AM",
            sender: "Admin",
            senderImage: "/images/defaultImageUser.png"
        },
        {
            title: "Course Update Available",
            date: "March 16, 2023",
            time: "11:00 AM",
            sender: "Admin",
            senderImage: "/images/defaultImageUser.png"
        }
    ];
    return (
        <>
            <div className="dropdown">
                <button className='btn btn-light rounded-circle icon-btn' type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="/icons/bell.png" className='icon' alt="" />
                    {notificationData?.length > 0 && (
                        <span className="notification-dot"></span>
                    )}
                </button>
                <ul className="dropdown-menu dropdown-menu-fixed-right" style={{ width: '350px' }} aria-labelledby="dropdownMenuButton1">
                    <div className='position-fixed bg-white p-2 px-3 border-3 border-bottom ' style={{ width:'348px', zIndex: 1000 }}>
                        <div className="d-flex align-items-center">
                            <h5 className='text-start fw-bold mb-0'>Notifications</h5>
                            <Link to={'/'} className='ms-auto see-all-link'>
                                <small>See all</small>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <div className='dropdown-container'>
                            {notificationData?.length > 0 ? (
                                notificationData.map((notification, index) => (
                                    <NotificationCard
                                        key={index}
                                        title={notification.title}
                                        date={notification.date}
                                        time={notification.time}
                                        sender={notification.sender}
                                        senderImage={notification.senderImage}
                                    />
                                ))
                            ) : (
                                <div className='text-muted text-center p-3'>
                                    <FontAwesomeIcon icon={faBell} style={{ fontSize: '24px' }} />
                                    <p className='mb-0 mt-2'>No notifications yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </ul>
            </div>
        </>
    )
}

export default Notification



