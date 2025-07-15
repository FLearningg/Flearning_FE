import React, { useState, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "../../assets/AdminEarning/AdminEarning.css";

// Đăng ký các module cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- BIỂU ĐỒ DOANH THU ---
// Dữ liệu cho biểu đồ
const chartData = {
  labels: [
    "Aug 01",
    "Aug 05",
    "Aug 10",
    "Aug 15",
    "Aug 20",
    "Aug 25",
    "Aug 31",
  ],
  datasets: [
    {
      label: "Revenue",
      data: [120000, 190000, 150000, 51749, 220000, 180000, 280000],
      borderColor: "#23bd33",
      borderWidth: 3,
      pointRadius: 0, // Ẩn các điểm dữ liệu
      pointHoverRadius: 6,
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#23bd33",
      pointHoverBorderWidth: 3,
      tension: 0.4,
      fill: true,
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, "rgba(35, 189, 51, 0.1)");
        gradient.addColorStop(1, "rgba(35, 189, 51, 0)");
        return gradient;
      },
    },
  ],
};

// Tùy chọn cho biểu đồ
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      mode: "index",
      intersect: false,
      position: "nearest",
      backgroundColor: "#000",
      titleColor: "#fff",
      bodyColor: "#fff",
      bodyFont: {
        weight: "bold",
        size: 14,
      },
      padding: 12,
      cornerRadius: 4,
      displayColors: false,
      yAlign: "bottom",
      callbacks: {
        title: () => null, // Ẩn tiêu đề mặc định của tooltip
        label: (context) => `$${context.parsed.y.toLocaleString()}`,
        // Thêm footer để hiển thị ngày tháng
        afterBody: (context) => {
          // Lấy ngày từ label của điểm dữ liệu
          const dateLabel = context[0].label;
          return dateLabel.includes("Aug")
            ? dateLabel.replace("Aug ", "") + " Aug"
            : dateLabel;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#9ca3af",
      },
    },
    y: {
      grid: {
        color: "#e5e7eb",
        borderDash: [5, 5],
      },
      ticks: {
        color: "#9ca3af",
        callback: (value) => {
          if (value >= 1000000) return `${value / 1000000}m`;
          if (value >= 1000) return `${value / 1000}k`;
          return value;
        },
      },
    },
  },
};

// --- CÁC COMPONENT ICON (giữ nguyên) ---
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

// --- CÁC COMPONENT GIAO DIỆN (giữ nguyên) ---
const StatCard = ({ icon, amount, label, iconBg }) => (
  <div className="ae-stat-card">
    <div className={`ae-stat-icon ${iconBg}`}>{icon}</div>
    <div>
      <div className="ae-stat-amount">{amount}</div>
      <div className="ae-stat-label">{label}</div>
    </div>
  </div>
);

// Dữ liệu Lịch sử Rút tiền
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

// --- COMPONENT CHÍNH ---
const AdminEarning = ({ title }) => {
  const [activeCancelIndex, setActiveCancelIndex] = useState(null);
  const popupRef = useRef(null);
  // Thêm state loading/error mẫu (cần thay bằng logic thực tế nếu có API)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // UI loading/error chuẩn hóa
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading earnings...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button className="retry-button" onClick={() => setError(null)}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Content */}
      <div className="ae-content">
        <div className="ae-content-grid">
          {/* Stats Cards */}
          <div>
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
            <div className="ae-charts-grid">
              {/* Biểu đồ Thống kê */}
              <div className="ae-chart-card">
                <div className="ae-section-header">
                  <h2 className="ae-section-title">Statistic</h2>
                  <div className="ae-section-dropdown">
                    <span>Revenue</span>
                    <ChevronDownIcon />
                  </div>
                </div>
                {/* Thay thế biểu đồ cũ bằng component Line */}
                <div className="ae-chart-container">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* Phần Thẻ */}
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
          </div>
          {/* Sidebar: Withdraw/History */}
          <div>
            <div className="ae-card">
              <div className="ae-withdraw-grid">
                {/* Rút tiền */}
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
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
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
                            You will be redirected to the PayPal site after
                            reviewing your order.
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
                {/* Lịch sử rút tiền */}
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
                          <tr key={index}>
                            <td>{item.date}</td>
                            <td>{item.method}</td>
                            <td>{item.amount}</td>
                            <td>
                              <span className={getStatusClass(item.status)}>
                                {item.status}
                              </span>
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                position: "relative",
                              }}
                            >
                              <button
                                className="ae-more-btn"
                                onClick={() => {
                                  if (item.status === "Pending")
                                    setActiveCancelIndex(index);
                                  else setActiveCancelIndex(null);
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
                                      onClick={() => setActiveCancelIndex(null)}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminEarning;
