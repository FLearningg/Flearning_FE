import { useState } from "react";
import { Check } from "lucide-react";

// Helper component for Payment Card
const PaymentCard = ({ brand, lastDigits, expiry, owner, style }) => (
  <div className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center" style={style}>
    <div className="d-flex align-items-center">
      <div className="d-flex align-items-center justify-content-center me-3 text-white fw-bold" style={brand.style}>
        {brand.label}
      </div>
      <div>
        <div className="fw-medium" style={{ color: "#1d2026" }}>{lastDigits}</div>
        <small style={{ color: "#8c94a3" }}>{expiry}</small>
      </div>
    </div>
    <small style={{ color: "#8c94a3" }}>{owner}</small>
  </div>
);

// Helper component for Course Summary
const CourseItem = ({ instructor, title, price, originalPrice }) => (
  <div className="d-flex mb-3">
    <img
      src="/placeholder.svg?height=60&width=80"
      alt="Course"
      className="rounded me-3"
      style={{ width: 80, height: 60, objectFit: "cover" }}
    />
    <div className="flex-grow-1">
      <small className="text-muted">Course by: {instructor}</small>
      <div className="fw-medium mb-2" style={{ color: "#1d2026", fontSize: 14 }}>{title}</div>
      <div className="fw-bold" style={{ color: "#ff6636" }}>
        {price}
        {originalPrice && (
          <small className="text-decoration-line-through text-muted ms-2">{originalPrice}</small>
        )}
      </div>
    </div>
  </div>
);

export default function CheckoutPage() {
  const [selectedPayment, setSelectedPayment] = useState("new-card");

  const isSelected = (key) => selectedPayment === key;

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#ffffff" }}>
      {/* Breadcrumb */}
      <div className="px-4 py-5" style={{ backgroundColor: "#f5f7fa" }}>
        <div className="container-fluid text-center">
          <h1 className="display-5 fw-bold mb-3" style={{ color: "#1d2026" }}>Checkout</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center">
              {["Home", "Shopping Cart", "Checkout"].map((label, idx) => (
                <li key={label} className={`breadcrumb-item${idx === 2 ? " active" : ""}`}>
                  {idx < 2 ? (
                    <a href="/" style={{ color: "#8c94a3", textDecoration: "none" }}>{label}</a>
                  ) : (
                    <span style={{ color: "#1d2026" }}>{label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid px-4 py-5">
        <div className="row g-5">
          {/* Payment Method */}
          <div className="col-lg-8">
            <h2 className="h3 fw-bold mb-4" style={{ color: "#1d2026" }}>Payment Method</h2>

            <PaymentCard
              brand={{ label: "VISA", style: { width: 48, height: 32, backgroundColor: "#2566af", borderRadius: 4, fontSize: 12 } }}
              lastDigits="4855 **** **** ****"
              expiry="04/24"
              owner="Valko Shvili"
              style={{ borderColor: "#e9eaf0" }}
            />

            <PaymentCard
              brand={{
                label: (
                  <div className="d-flex">
                    <div style={{ width: 8, height: 8, backgroundColor: "#eb001b", borderRadius: "50%", marginRight: 2 }}></div>
                    <div style={{ width: 8, height: 8, backgroundColor: "#f79e1b", borderRadius: "50%" }}></div>
                  </div>
                ),
                style: { width: 48, height: 32, background: "linear-gradient(to right, #eb001b, #f79e1b)", borderRadius: 4 }
              }}
              lastDigits="5795 **** **** ****"
              expiry="04/24"
              owner="Valko Shvili"
              style={{ borderColor: "#e9eaf0" }}
            />

            {/* PayPal */}
            <div className="border rounded p-3 mb-3 d-flex align-items-center" style={{ borderColor: "#e9eaf0" }}>
              <div className="d-flex align-items-center justify-content-center me-3 text-white fw-bold" style={{ width: 48, height: 32, backgroundColor: "#253b80", borderRadius: 4, fontSize: 12 }}>PP</div>
              <small style={{ color: "#8c94a3" }}>You will be redirected to the PayPal site after reviewing your order.</small>
            </div>

            {/* New Payment Card Selection */}
            <div
              className={`border rounded p-3 cursor-pointer ${isSelected("new-card") ? "border-success" : ""}`}
              style={{
                borderColor: isSelected("new-card") ? "#23bd33" : "#e9eaf0",
                borderWidth: isSelected("new-card") ? 2 : 1,
                backgroundColor: isSelected("new-card") ? "rgba(35, 189, 51, 0.05)" : "transparent"
              }}
              onClick={() => setSelectedPayment("new-card")}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center justify-content-center me-3" style={{ width: 32, height: 32, backgroundColor: "#ff6636", borderRadius: 4 }}>
                    <div style={{ width: 16, height: 12, border: "1px solid white", borderRadius: 2 }}></div>
                  </div>
                  <span className="fw-medium" style={{ color: "#1d2026" }}>New Payment Cards</span>
                </div>
                {isSelected("new-card") && (
                  <div className="d-flex align-items-center justify-content-center" style={{ width: 24, height: 24, backgroundColor: "#23bd33", borderRadius: "50%" }}>
                    <Check size={16} className="text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Card Form */}
            {isSelected("new-card") && (
              <div className="mt-3">
                {[
                  { label: "Name", id: "name", placeholder: "Name on card" },
                  { label: "Card Number", id: "card-number", placeholder: "Label", prependIcon: true },
                ].map(({ label, id, placeholder, prependIcon }) => (
                  <div className="mb-3" key={id}>
                    <label htmlFor={id} className="form-label fw-medium" style={{ color: "#1d2026" }}>{label}</label>
                    <div className={prependIcon ? "position-relative" : ""}>
                      <input type="text" className={`form-control${prependIcon ? " ps-5" : ""}`} id={id} placeholder={placeholder} style={{ borderColor: "#e9eaf0" }} />
                      {prependIcon && (
                        <div className="position-absolute top-50 translate-middle-y ms-3" style={{ left: 0, width: 24, height: 16, backgroundColor: "#ff6636", borderRadius: 2 }}></div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="row g-3 mb-3">
                  {[
                    { id: "expiry", label: "MM / YY", placeholder: "MM / YY" },
                    { id: "cvc", label: "CVC", placeholder: "Security Code" },
                  ].map(({ id, label, placeholder }) => (
                    <div className="col-6" key={id}>
                      <label htmlFor={id} className="form-label fw-medium" style={{ color: "#1d2026" }}>{label}</label>
                      <input type="text" className="form-control" id={id} placeholder={placeholder} style={{ borderColor: "#e9eaf0" }} />
                    </div>
                  ))}
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="remember" style={{ accentColor: "#ff6636" }} />
                  <label className="form-check-label" htmlFor="remember" style={{ color: "#1d2026" }}>
                    Remember this card, save it on my card list
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card border" style={{ borderColor: "#e9eaf0" }}>
              <div className="card-body p-4">
                <h3 className="h5 fw-bold mb-4" style={{ color: "#1d2026" }}>Courses 03</h3>

                <div className="mb-4">
                  <CourseItem instructor="Courtney Henry" title="Graphic Design Masterclass - Learn GREAT Design" price="$13.00" />
                  <CourseItem instructor="Marvin McKinney" title="Learn Python Programming Masterclass" price="$89.00" />
                  <CourseItem instructor="Jacob Jones" title="Instagram Marketing 2021: Complete Guide To Instagram" price="$32.00" originalPrice="$89.00" />
                </div>

                <div className="border-top pt-3" style={{ borderColor: "#e9eaf0" }}>
                  <h4 className="fw-bold mb-3" style={{ color: "#1d2026" }}>Order Summary</h4>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <small className="text-muted">Subtotal</small>
                      <small style={{ color: "#1d2026" }}>$61.97 USD</small>
                    </div>
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">Coupon Discount</small>
                      <small style={{ color: "#1d2026" }}>8%</small>
                    </div>
                  </div>
                  <div className="border-top pt-3 mb-4" style={{ borderColor: "#e9eaf0" }}>
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold" style={{ color: "#1d2026" }}>Total:</span>
                      <span className="fw-bold fs-5" style={{ color: "#1d2026" }}>$75.00 USD</span>
                    </div>
                  </div>
                  <button className="btn w-100 text-white fw-medium py-2" style={{ backgroundColor: "#ff6636", borderColor: "#ff6636" }}>
                    Complete Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
