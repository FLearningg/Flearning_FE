import { Star } from "lucide-react";
import { useState } from "react";
function Breadcrumb({ breadcrumb }) {
    return (
        <nav className="mb-4">
            <div className="d-flex align-items-center text-muted small">
                {breadcrumb.map((item, idx) => (
                    <span key={item}>
                        {idx > 0 && <span className="mx-2">{">"}</span>}
                        {item}
                    </span>
                ))}
            </div>
        </nav>
    );
}

function Instructors({ instructors }) {
    return (
        <div className="d-flex align-items-center">
            <div className="d-flex me-3" style={{ marginLeft: "-8px" }}>
                {instructors.map((inst, idx) => (
                    <div
                        key={inst.name}
                        className="rounded-circle border border-white bg-light overflow-hidden"
                        style={{
                            width: "48px",
                            height: "48px",
                            marginRight: idx === 0 ? "-8px" : undefined,
                            zIndex: instructors.length - idx,
                        }}
                    >
                        <img
                            src={inst.img || "/placeholder.svg"}
                            alt={`${inst.name}'s avatar`}
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                        />
                    </div>
                ))}
            </div>
            <div>
                <p className="small text-muted mb-1">Created by:</p>
                <p className="fs-5 fw-medium text-dark mb-0">
                    {instructors.map((inst) => inst.name).join(" • ")}
                </p>
            </div>
        </div>
    );
}

function RatingStars({ rating, totalRatings }) {
    return (
        <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        size={24}
                        fill={i < Math.round(rating) ? "#fd8e1f" : "none"}
                        color="#fd8e1f"
                    />
                ))}
            </div>
            <div className="text-dark">
                <span className="fs-4 fw-bold">{rating}</span>
                <span className="text-muted ms-2">
                    ({totalRatings.toLocaleString()} Ratings)
                </span>
            </div>
        </div>
    );
}

function HeroImage({ heroImage }) {
    return (
        <div className="position-relative">
            <img
                src={heroImage}
                alt="Course preview"
                className="w-100 rounded"
                style={{ height: "400px", objectFit: "cover" }}
            />
            <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: 10 }}>
                <button
                    className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "80px", height: "80px" }}
                    aria-label="Play course preview"
                >
                    <div
                        className="triangle-right"
                        style={{
                            width: 0,
                            height: 0,
                            borderLeft: "20px solid #333",
                            borderTop: "12px solid transparent",
                            borderBottom: "12px solid transparent",
                            marginLeft: "4px",
                        }}
                    ></div>
                </button>
            </div>
        </div>
    );
}

function CourseTabs({ activeTab, setActiveTab }) {
    const tabs = ["overview", "curriculum", "review"];
    
    return (
        <nav>
            <ul className="nav nav-tabs border-0 d-flex" style={{ borderBottom: "none" }}>
                {tabs.map((tab) => (
                    <li 
                        className="nav-item flex-grow-1 text-center" 
                        key={tab}
                        style={{ 
                            borderBottom: `2px solid ${activeTab === tab ? '#fd8e1f' : '#000'}`,
                            display: 'flex', // Add flexbox to li
                            alignItems: 'center', // Center vertically
                            justifyContent: 'center' // Center horizontally
                        }}
                    >
                        <button
                            className={`nav-link w-100 border-0 fw-medium ${
                                activeTab === tab ? "active text-dark" : "text-muted"
                            }`}
                            style={{
                                padding: "12px 0",
                                background: "none",
                                transition: "border-color 0.3s ease",
                            }}
                            onClick={() => setActiveTab(tab)}
                            onMouseEnter={(e) => {
                                e.target.parentElement.style.borderBottom = "2px solid #fd8e1f";
                            }}
                            onMouseLeave={(e) => {
                                e.target.parentElement.style.borderBottom = `2px solid ${
                                    activeTab === tab ? '#fd8e1f' : '#000'
                                }`;
                            }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default function CourseHeader({
    breadcrumb,
    title,
    subtitle,
    instructors,
    rating,
    totalRatings,
    heroImage,
    activeTab,
    setActiveTab,
}) {
    return (
        <div className="py-4">
            <div className="container">
                <Breadcrumb breadcrumb={breadcrumb} />
                <div className="row">
                    <div className="col-12">
                        <h1
                            className="display-2 fw-bold text-dark mb-4"
                            style={{ lineHeight: "1.2", fontSize: "2rem" }}
                        >
                            {title}
                        </h1>
                        <p
                            className="fs-4 text-secondary mb-5"
                            style={{ color: "#4e5566", fontSize: "1.5rem" }}
                        >
                            {subtitle}
                        </p>
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-4 pt-4">
                            <Instructors instructors={instructors} />
                            <RatingStars rating={rating} totalRatings={totalRatings} />
                        </div>
                        <div className="row mt-5">
                            <div className="col-12">
                                <HeroImage heroImage={heroImage} />
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-12">
                                <CourseTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}