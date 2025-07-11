import { Clock, BarChart3, Users, Book, Subtitles, Layers } from "lucide-react";
import { Copy } from "lucide-react";
import { useParams } from "react-router-dom";

const ICON_MAP = {
  Level: BarChart3,
  Duration: Clock,
  "Students enrolled": Users,
  Language: Book,
  "Subtitle language": Subtitles,
};

const formatDiscount = (str) => {
  if (!str) return "";
  const match = str.toLowerCase().match(/(.*?)(off)/);
  return match ? match[1].toUpperCase() + "OFF" : str.toUpperCase();
};

const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  const firstLetterIndex = str.search(/[a-zA-Z]/);
  if (firstLetterIndex > 0) {
    return (
      str.slice(0, firstLetterIndex) +
      str.charAt(firstLetterIndex).toUpperCase() +
      str.slice(firstLetterIndex + 1)
    );
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const PriceSection = ({ currentPrice, originalPrice, discount, timeLeft }) => (
  <div className="mb-4">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="d-flex align-items-center gap-3">
        <span className="h2 fw-bold text-dark mb-0">
          ${currentPrice?.toFixed(2)}
        </span>
        {originalPrice > currentPrice && (
          <span className="h5 text-muted text-decoration-line-through mb-0">
            ${originalPrice?.toFixed(2)}
          </span>
        )}
      </div>
      {discount && (
        <span
          className="badge px-3 py-2"
          style={{
            backgroundColor: "#ffeee8",
            color: "#ff6636",
            fontSize: "0.875rem",
            marginBottom: "-3.5rem",
            marginLeft: "-5%",
            borderRadius: "0",
          }}
        >
          {formatDiscount(discount)}
        </span>
      )}
    </div>
    {timeLeft && (
      <div
        className="d-flex align-items-center gap-2"
        style={{ color: "#e34444" }}
      >
        <Clock size={16} />
        <span className="small fw-medium">{timeLeft}</span>
      </div>
    )}
  </div>
);

const CourseDetailsSection = ({ details }) => (
  <div className="mb-4">
    {details?.map(({ label, value }) => {
      const Icon = ICON_MAP[label] || Layers;
      return (
        <div
          key={label}
          className="d-flex justify-content-between align-items-center py-2"
        >
          <div className="d-flex align-items-center gap-3">
            <Icon size={20} className="text-muted" />
            <span className="text-secondary">{label}</span>
          </div>
          <span className="text-muted">{value}</span>
        </div>
      );
    })}
  </div>
);

const CourseIncludesSection = ({ includes }) => (
  <div className="mb-4">
    <h5 className="fw-semibold text-dark mb-3">This course includes:</h5>
    {includes?.map((text, idx) => (
      <div key={idx} className="d-flex align-items-center gap-3 mb-2">
        <Layers size={16} className="text-muted" />
        <span className="text-secondary small">{text}</span>
      </div>
    ))}
  </div>
);

const ShareSection = ({ buttons }) => {
  const shareButtons = [...(buttons || []), { icon: Copy, label: "Copy" }];
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
  );
};

const ActionButtons = () => (
  <div className="mb-4">
    <button
      className="btn w-100 fw-medium py-2 mb-3"
      style={{
        backgroundColor: "#ff6636",
        borderColor: "#ff6636",
        color: "white",
      }}
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
        <button className="btn btn-outline-secondary w-100 wishlist-btn">
          Add To Wishlist
        </button>
      </div>
      <div className="col-6 col-sm-5">
        <button className="btn btn-outline-secondary w-100 gift-btn">
          Gift Course
        </button>
      </div>
    </div>
  </div>
);

export default function PricingCard({
  currentPrice,
  originalPrice,
  discount,
  timeLeft,
  details,
  includes,
  shareButtons,
}) {
  return (
    <div className="container-fluid d-flex justify-content-center py-3 course-price">
      <div
        className="card shadow-sm"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="card-body p-4">
          <PriceSection
            currentPrice={currentPrice}
            originalPrice={originalPrice}
            discount={capitalizeFirstLetter(discount)}
            timeLeft={capitalizeFirstLetter(timeLeft)}
          />
          <CourseDetailsSection
            details={details?.map(({ label, value }) => ({
              label: capitalizeFirstLetter(label),
              value: capitalizeFirstLetter(value),
            }))}
          />
          <ActionButtons />
          <p className="small text-muted mb-4">
            Note: all courses have 30-days money-back guarantee
          </p>
          <CourseIncludesSection
            includes={includes?.map(capitalizeFirstLetter)}
          />
          <ShareSection
            buttons={shareButtons?.map((btn) => ({
              ...btn,
              label: capitalizeFirstLetter(btn.label),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
