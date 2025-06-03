import React from 'react'
import { Link } from 'react-router-dom'

function BreadcrumbAbout() {
    return (
        <>
            <div className='p-3' style={{ backgroundColor: '#F5F7FA' }}>
                <h5 style={{ fontWeight: '600' }} className='text-center'>About</h5>
                <div className="d-flex">
                    <nav aria-label="breadcrumb" className='mx-auto mt-2'>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="#" className='text-decoration-none text-black'>Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">About</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default BreadcrumbAbout