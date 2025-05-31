import "../../assets/AdminEarning/AdminEarning.css";
import React, { useState, useRef, useEffect } from "react";

// Icon components (you can replace these with your preferred icon library)
const DashboardIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="7" height="9"></rect>
    <rect x="14" y="3" width="7" height="5"></rect>
    <rect x="14" y="12" width="7" height="9"></rect>
    <rect x="3" y="16" width="7" height="5"></rect>
  </svg>
);

const PlusCircleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const BookOpenIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const DollarSignIcon = ({ color = "currentColor" }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const MessageCircleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const LogOutIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16,17 21,12 16,7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <path d="M21 21l-4.35-4.35"></path>
  </svg>
);

const BellIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const MessageSquareIcon = ({ color = "currentColor" }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const CreditCardIcon = ({ color = "currentColor" }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const ShoppingBagIcon = ({ color = "currentColor" }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const MoreHorizontalIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="6,9 12,15 18,9"></polyline>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12,19 5,12 12,5"></polyline>
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12,5 19,12 12,19"></polyline>
  </svg>
);

const PlusIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const CopyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

// Navigation Item Component
const NavItem = ({ icon, label, active = false, badge = null }) => (
  <a href="#" className={`ae-nav-item ${active ? "active" : ""}`}>
    <span className="ae-nav-item-icon">{icon}</span>
    <span>{label}</span>
    {badge && <span className="ae-nav-item-badge">{badge}</span>}
  </a>
);

// Stat Card Component
const StatCard = ({ icon, amount, label, iconBg }) => (
  <div className="ae-stat-card">
    <div className={`ae-stat-icon ${iconBg}`}>{icon}</div>
    <div>
      <div className="ae-stat-amount">{amount}</div>
      <div className="ae-stat-label">{label}</div>
    </div>
  </div>
);

// Revenue Chart Component
const RevenueChart = () => (
  <div className="ae-chart-container">
    <div className="ae-chart-y-axis">
      <div>1m</div>
      <div>500k</div>
      <div>100k</div>
      <div>50k</div>
      <div>10k</div>
      <div>1k</div>
      <div>0</div>
    </div>

    <div className="ae-chart-area">
      <div className="ae-chart-line"></div>
      <svg
        className="ae-chart-svg"
        viewBox="0 0 300 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,100 C20,80 40,90 60,50 C80,20 100,60 120,70 C140,80 160,60 180,80 C200,100 220,70 240,50 C260,40 280,60 300,40"
          fill="none"
          stroke="#23bd33"
          strokeWidth="3"
        />
      </svg>

      <div className="ae-chart-data-point">
        <div className="ae-chart-tooltip">
          $51,749.00
          <div className="ae-chart-tooltip-date">7th Aug</div>
        </div>
        <div className="ae-chart-point"></div>
      </div>
    </div>

    <div className="ae-chart-x-axis">
      <div>Aug 01</div>
      <div>Aug 10</div>
      <div>Aug 20</div>
      <div>Aug 31</div>
    </div>
  </div>
);

// Withdraw History Data
const withdrawHistory = [
  {
    date: "21 Sep, 2021 at 2:14 AM",
    method: "Mastercards",
    amount: "American Express",
    status: "Pending",
  },
  {
    date: "21 Sep, 2021 at 2:14 AM",
    method: "Visa",
    amount: "American Express",
    status: "Pending",
  },
  {
    date: "21 Sep, 2021 at 2:14 AM",
    method: "Visa",
    amount: "American Express",
    status: "Pending",
  },
  {
    date: "21 Sep, 2021 at 2:14 AM",
    method: "Mastercards",
    amount: "American Express",
    status: "Completed",
  },
  {
    date: "21 Sep, 2021 at 2:14 AM",
    method: "Visa",
    amount: "American Express",
    status: "Cancelled",
  },
  {
    date: "21 Sep, 2021 at 2:14 AM",
    method: "Mastercards",
    amount: "American Express",
    status: "Completed",
  },
  {
    date: "21 Sep, 2021 at 2:14 AM",
    method: "Mastercards",
    amount: "American Express",
    status: "Completed",
  },
];

const getStatusClass = (status) => {
  switch (status) {
    case "Pending":
      return "ae-status-pending";
    case "Completed":
      return "ae-status-completed";
    case "Cancelled":
      return "ae-status-cancelled";
    default:
      return "ae-status-badge";
  }
};

// Main Dashboard Component
const AdminEarning = () => {
  const [activeCancelIndex, setActiveCancelIndex] = useState(null);
  const popupRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setActiveCancelIndex(null);
      }
    }
    if (activeCancelIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeCancelIndex]);

  return (
    <div className="ae-dashboard">
      {/* Main Content */}
      <div className="ae-main-content">
        {/* Stats Cards */}
        <div className="ae-stats-grid">
          <StatCard
            icon={<DollarSignIcon color="#ff6636" />}
            amount="$13,804.00"
            label="Total Revenue"
            iconBg="orange"
          />
          <StatCard
            icon={<MessageSquareIcon color="#564ffd" />}
            amount="$16,593.00"
            label="Current Balance"
            iconBg="purple"
          />
          <StatCard
            icon={<CreditCardIcon color="#e34444" />}
            amount="$13,184.00"
            label="Total Withdrawals"
            iconBg="red"
          />
          <StatCard
            icon={<ShoppingBagIcon color="#23bd33" />}
            amount="$162.00"
            label="Today Revenue"
            iconBg="green"
          />
        </div>

        {/* Charts and Cards Section */}
        <div className="ae-charts-grid">
          {/* Statistics Chart */}
          <div className="ae-chart-card">
            <div className="ae-section-header">
              <h2 className="ae-section-title">Statistic</h2>
              <div className="ae-section-dropdown">
                <span>Revenue</span>
                <ChevronDownIcon />
              </div>
            </div>
            <RevenueChart />
          </div>

          {/* Cards Section */}
          <div className="ae-cards-section">
            <div className="ae-section-header">
              <h2 className="ae-section-title">Cards</h2>
              <div className="ae-section-dropdown">
                <span>Revenue</span>
                <ChevronDownIcon />
              </div>
            </div>
            <div className="ae-cards-content">
              <div className="ae-credit-card">
                <div className="ae-card-header">
                  <div className="ae-visa-logo">VISA</div>
                  <MoreHorizontalIcon />
                </div>
                <div className="ae-card-number">4855 **** **** ****</div>
                <CopyIcon className="ae-copy-icon" />
                <div className="ae-card-details">
                  <div>
                    <div className="ae-card-detail-label">VALID THRU</div>
                    <div>04/24</div>
                  </div>
                  <div>
                    <div className="ae-card-detail-label">CARD HOLDER</div>
                    <div>Vako Shvili</div>
                  </div>
                </div>
              </div>

              <div className="ae-card-indicators">
                <span className="ae-indicator active"></span>
                <span className="ae-indicator inactive"></span>
              </div>

              <div className="ae-card-navigation">
                <button className="ae-nav-arrow">
                  <ArrowLeftIcon />
                </button>
                <button className="ae-nav-arrow">
                  <ArrowRightIcon />
                </button>
              </div>

              <button className="ae-add-card-btn">
                <PlusIcon />
                <span>Add new card</span>
              </button>
            </div>
          </div>
        </div>

        {/* Withdraw Section */}
        <div className="ae-withdraw-grid">
          {/* Withdraw your money */}
          <div className="ae-withdraw-card">
            <h2 className="ae-withdraw-title">Withdraw your money</h2>
            <div>
              <p className="ae-payment-method-label">Payment method:</p>

              <div className="ae-payment-option selected">
                <div className="ae-payment-info">
                  <div className="ae-payment-logo ae-visa">VISA</div>
                  <div className="ae-payment-details">
                    <span>4855 **** **** ****</span>
                    <span className="ae-expiry">04/24</span>
                  </div>
                </div>
                <div className="ae-payment-info">
                  <span style={{ marginRight: "12px" }}>Vako Shvili</span>
                  <div className="ae-payment-check">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="#23bd33"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="ae-payment-option">
                <div className="ae-payment-info">
                  <div className="ae-payment-logo ae-mastercard">
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#e6a540",
                        border: "2px solid #e34444",
                        opacity: 0.8,
                      }}
                    ></div>
                  </div>
                  <div className="ae-payment-details">
                    <span>2855 **** **** ****</span>
                    <span className="ae-expiry">04/24</span>
                  </div>
                </div>
                <div>
                  <span>Vako Shvili</span>
                </div>
              </div>

              <div className="ae-payment-option">
                <div className="ae-payment-info">
                  <div className="ae-payment-logo ae-paypal">PP</div>
                  <div>
                    <span className="ae-paypal-text">
                      You will be redirected to the PayPal site after reviewing
                      your order.
                    </span>
                  </div>
                </div>
              </div>

              <div className="ae-current-balance">
                <div className="ae-balance-amount">$16,593.00</div>
                <div className="ae-balance-label">Current Balance</div>
              </div>

              <button className="ae-withdraw-btn">Withdraw Money</button>
            </div>
          </div>

          {/* Withdraw History */}
          <div className="ae-history-card">
            <h2 className="ae-history-title">Withdraw History</h2>
            <div style={{ overflowX: "auto" }}>
              <table className="ae-history-table">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>METHOD</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawHistory.map((item, index) => (
                    <tr key={index} style={{ position: "relative" }}>
                      <td>{item.date}</td>
                      <td>{item.method}</td>
                      <td>{item.amount}</td>
                      <td>
                        <span
                          className={getStatusClass(item.status)
                            .replace("status-badge", "ae-status-badge")
                            .replace("status-pending", "ae-status-pending")
                            .replace("status-completed", "ae-status-completed")
                            .replace("status-cancelled", "ae-status-cancelled")}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td style={{ textAlign: "right", position: "relative" }}>
                        <button
                          className="ae-more-btn"
                          onClick={() => {
                            if (item.status === "Pending") {
                              setActiveCancelIndex(index);
                            } else {
                              setActiveCancelIndex(null);
                            }
                          }}
                        >
                          <MoreHorizontalIcon />
                        </button>
                        {activeCancelIndex === index &&
                          item.status === "Pending" && (
                            <div
                              className="ae-cancel-popup"
                              ref={popupRef}
                              style={{
                                right: 0,
                                top: 30,
                                position: "absolute",
                              }}
                            >
                              <button
                                className="ae-cancel-btn"
                                onClick={() => {
                                  // Add your cancel logic here
                                  setActiveCancelIndex(null);
                                }}
                              >
                                Cancel Withdraw
                              </button>
                            </div>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="ae-footer">
          <div>
            © 2021 - Eduguard. Designed by Templatecookie. All rights reserved
          </div>
          <div className="ae-footer-links">
            <a href="#">FAQs</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Condition</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminEarning;
