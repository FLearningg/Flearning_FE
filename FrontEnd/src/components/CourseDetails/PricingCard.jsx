import {
    Clock,
    BarChart3,
    Users,
    Book,
    Calendar,
    DollarSign,
    FileText,
    Trophy,
    Smartphone,
    Subtitles,
    Layers,
    Copy,
    Facebook,
    Twitter,
    Mail,
    MessageCircle,
} from "lucide-react"

const courseDetails = [
    {
        icon: Clock,
        label: "Course Duration",
        value: "6 Month",
    },
    {
        icon: BarChart3,
        label: "Course Levels",
        value: "Beginner",
    },
    {
        icon: Users,
        label: "Students Enrolled",
        value: "69,419,618",
    },
    {
        icon: Book,
        label: "Language",
        value: "Mandarin",
    },
    {
        icon: Calendar,
        label: "Subtitle Language",
        value: "English",
    },
]

const courseIncludes = [
    {
        icon: Clock,
        text: "Lifetime access",
    },
    {
        icon: DollarSign,
        text: "30-days money-back guarantee",
    },
    {
        icon: FileText,
        text: "Free exercises file & downloadable resources",
    },
    {
        icon: Trophy,
        text: "Shareable certificate of completion",
    },
    {
        icon: Smartphone,
        text: "Access on mobile , tablet and TV",
    },
    {
        icon: Subtitles,
        text: "English subtitles",
    },
    {
        icon: Layers,
        text: "100% online course",
    },
]

const shareButtons = [
    { icon: Copy, label: "Copy" },
    { icon: Facebook, label: "Facebook" },
    { icon: Twitter, label: "Twitter" },
    { icon: Mail, label: "Mail" },
    { icon: MessageCircle, label: "Message" },
]

function PriceSection() {
    return (
        <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-3">
                    <span className="h2 fw-bold text-dark mb-0">$14.00</span>
                    <span className="h5 text-muted text-decoration-line-through mb-0">$28.00</span>
                </div>
                <span
                    className="badge rounded-pill px-3 py-2"
                    style={{ backgroundColor: "#ffeee8", color: "#ff6636", fontSize: "0.875rem" }}
                >
                    56% OFF
                </span>
            </div>
            <div className="d-flex align-items-center gap-2" style={{ color: "#e34444" }}>
                <Clock size={16} />
                <span className="small fw-medium">2 days left at this price!</span>
            </div>
        </div>
    )
}

function CourseDetailsSection() {
    return (
        <div className="mb-4">
            {courseDetails.map(({ icon: Icon, label, value }) => (
                <div key={label} className="d-flex justify-content-between align-items-center py-2">
                    <div className="d-flex align-items-center gap-3">
                        <Icon size={20} className="text-muted" />
                        <span className="text-secondary">{label}</span>
                    </div>
                    <span className="text-muted">{value}</span>
                </div>
            ))}
        </div>
    )
}

function ActionButtons() {
    return (
        <div className="mb-4">
            <button
                className="btn w-100 fw-medium py-2 mb-3"
                style={{ backgroundColor: "#ff6636", borderColor: "#ff6636", color: "white" }}
            >
                Add To Cart
            </button>
            <button
                className="btn btn-outline w-100 fw-medium py-2 mb-3"
                style={{ borderColor: "#ff6636", color: "#ff6636" }}
            >
                Buy Now
            </button>
            <div className="row g-2">
                <div className="col-6 col-sm-7">
                    <button className="btn btn-outline-secondary w-100">Add To Wishlist</button>
                </div>
                <div className="col-6 col-sm-5">
                    <button className="btn btn-outline-secondary w-100">Gift Course</button>
                </div>
            </div>
        </div>
    )
}

// --- NEW SECTION ADDED HERE ---
function CourseIncludesSection() {
    return (
        <div className="mb-4">
            <h5 className="fw-semibold text-dark mb-3">This course includes:</h5>
            {courseIncludes.map(({ icon: Icon, text }) => (
                <div key={text} className="d-flex align-items-center gap-3 mb-2">
                    <Icon size={16} className="text-muted" />
                    <span className="text-secondary small">{text}</span>
                </div>
            ))}
        </div>
    )
}
// --- END OF NEW SECTION ---


function ShareSection() {
    return (
        <div>
            <h5 className="fw-semibold text-dark mb-3">Share this course:</h5>
            <div className="d-flex gap-3">
                {shareButtons.map(({ icon: Icon, label }) => (
                    <button
                        key={label}
                        className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center"
                        style={{ width: "40px", height: "40px" }}
                        aria-label={label}
                    >
                        <Icon size={16} />
                    </button>
                ))}
            </div>
        </div>
    )
}

export default function PricingCard() {
    return (
        <div className="container-fluid d-flex justify-content-center py-4">
            <div className="card shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
                <div className="card-body p-4">
                    <PriceSection />
                    <CourseDetailsSection />
                    <ActionButtons />
                    {/* --- NOTE ADDED HERE --- */}
                    <p className="small text-muted mb-4">Note: all course have 30-days money-back guarantee</p>
                    {/* --- NEW COMPONENT ADDED HERE --- */}
                    <CourseIncludesSection /> 
                    <ShareSection />
                </div>
            </div>
        </div>
    )
}