import React from 'react';
import '../../assets/header/header.css';
import SearchBar from './SearchBar';
import HeaderRight from './HeaderRight';
import LogoHeader from './LogoHeader';
import Browse from './Browse';
import MobileHeader from './MobileHeader';
import NavigationBar from './NavigationBar';


function Header() {
    const userExample = {//NOTE: This is sample data, replace API's data here
        username: 'admin',
        password: '123',
        userImage: '/images/defaultImageUser.png'
    }
    return (
        <>
            <div className='desktop-view-nav position-fixed w-100' style={{ zIndex: 2000 }}>
                {/* for desktop */}
                <NavigationBar />
                {/* when already login */}
                <nav className="navbar navbar-light bg-light pb-3 pt-3 border-bottom">
                    <div className="container-fluid mx-2">
                        <div className="d-flex w-100 align-items-center">
                            <LogoHeader />
                            <div className='ms-3'>
                                <SearchBar />
                            </div>
                            <div className='ms-auto'>
                                <HeaderRight user={userExample} />
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
            {/* for mobile */}
            <div className='position-fixed w-100' style={{ zIndex: 2000 }}>
                <MobileHeader user={userExample} />
            </div>
        </>
    )
}

export default Header
