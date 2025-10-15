import React, { useState, useMemo } from "react";
import CustomButton from "../common/CustomButton/CustomButton";
import "../../assets/AdminManageUser/CensorInstructor.css";

const MOCK_APPLICATIONS = [
  {
    _id: "app1",
    user: {
      firstName: "Nguyen Van",
      lastName: "A",
      userName: "nguyenvana",
      email: "vana@example.com",
      userImage: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    education: "Master of Computer Science, FPT University",
    certificateImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    _id: "app2",
    user: {
      firstName: "Tran Thi",
      lastName: "B",
      userName: "tranthib",
      email: "thib@example.com",
      userImage: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    education: "PhD in Mathematics, Hanoi University",
    certificateImage:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  },
  {
    _id: "app3",
    user: {
      firstName: "Le Quang",
      lastName: "C",
      userName: "lequangc",
      email: "quangc@example.com",
      userImage: "https://randomuser.me/api/portraits/men/65.jpg",
    },
    education: "Bachelor of Physics, HCMUS",
    certificateImage:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
];

export default function CensorInstructor() {
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [actionLoading, setActionLoading] = useState({});
  const [previewImg, setPreviewImg] = useState(null);
  const [confirming, setConfirming] = useState({});
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null); // for details modal
  const [hasCertFilter, setHasCertFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const handleAction = (appId, action) => {
    // small confirm step: toggle confirming state on first click for destructive actions
    if (!confirming[appId]) {
      setConfirming((s) => ({ ...s, [appId]: action }));
      // Reset the confirmation after 3s
      setTimeout(() => {
        setConfirming((s) => {
          const n = { ...s };
          delete n[appId];
          return n;
        });
      }, 3000);
      return;
    }

    setActionLoading((s) => ({ ...s, [appId]: true }));
    setTimeout(() => {
      setApplications((prev) => prev.filter((a) => a._id !== appId));
      setActionLoading((s) => {
        const n = { ...s };
        delete n[appId];
        return n;
      });
      setConfirming((s) => {
        const n = { ...s };
        delete n[appId];
        return n;
      });
    }, 600);
  };

  const openPreview = (src) => setPreviewImg(src);
  const closePreview = () => setPreviewImg(null);

  const openDetails = (app) => setSelectedApp(app);
  const closeDetails = () => setSelectedApp(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = applications.filter((a) => {
      if (statusFilter !== "all") return false; // placeholder
      if (q) {
        const match =
          a.user.firstName.toLowerCase().includes(q) ||
          a.user.lastName.toLowerCase().includes(q) ||
          a.user.userName.toLowerCase().includes(q) ||
          a.user.email.toLowerCase().includes(q) ||
          (a.education || "").toLowerCase().includes(q);
        if (!match) return false;
      }
      if (hasCertFilter === "yes" && !a.certificateImage) return false;
      if (hasCertFilter === "no" && a.certificateImage) return false;
      return true;
    });

    // sort
    if (sortBy === "name") {
      items.sort((x, y) =>
        (x.user.firstName + x.user.lastName).localeCompare(
          y.user.firstName + y.user.lastName
        )
      );
    }
    // newest/oldest are no-ops because mock data has no date; leave as is
    return items;
  }, [applications, query, statusFilter, hasCertFilter, sortBy]);

  return (
    <div className="ci-container">
      <h2>Censor Instructor Applications</h2>
      {applications.length === 0 && <p>No pending applications.</p>}
      <div className="ci-toolbar">
        <input
          className="ci-search"
          placeholder="Search name, username, email, education..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="ci-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
        </select>
        <select
          className="ci-filter"
          value={hasCertFilter}
          onChange={(e) => setHasCertFilter(e.target.value)}
        >
          <option value="all">Has certificate</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <select
          className="ci-filter"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Sort: Newest</option>
          <option value="oldest">Sort: Oldest</option>
          <option value="name">Sort: Name</option>
        </select>
        <button
          className="ci-clear"
          onClick={() => {
            setQuery("");
            setStatusFilter("all");
            // education filter removed
            setHasCertFilter("all");
            setSortBy("newest");
          }}
        >
          Clear
        </button>
      </div>

      <div className="ci-list">
        {filtered.map((app) => (
          <div key={app._id} className="ci-card">
            <div className="ci-left">
              <img
                src={app.user?.userImage || "/images/defaultImageUser.png"}
                alt="avatar"
              />
            </div>
            <div className="ci-body">
              <div className="ci-top-row">
                <div className="ci-user">
                  {app.user?.firstName} {app.user?.lastName}
                </div>
                <div className="ci-username">{app.user?.userName}</div>
              </div>
              <div className="ci-email">{app.user?.email}</div>
              <div className="ci-education">
                Education: {app.education || "N/A"}
              </div>
              {app.certificateImage && (
                <div className="ci-cert">
                  <img
                    src={app.certificateImage}
                    alt="cert"
                    onClick={() => openPreview(app.certificateImage)}
                  />
                </div>
              )}
            </div>
            <div className="ci-actions">
              <CustomButton
                size="small"
                color={
                  confirming[app._id] === "approve" ? "secondary" : "primary"
                }
                onClick={() => handleAction(app._id, "approve")}
                disabled={!!actionLoading[app._id]}
              >
                {actionLoading[app._id]
                  ? "Approving..."
                  : confirming[app._id] === "approve"
                  ? "Confirm Approve"
                  : "Approve"}
              </CustomButton>
              <CustomButton
                size="small"
                color={
                  confirming[app._id] === "reject" ? "error" : "transparent"
                }
                onClick={() => handleAction(app._id, "reject")}
                disabled={!!actionLoading[app._id]}
              >
                {actionLoading[app._id]
                  ? "Rejecting..."
                  : confirming[app._id] === "reject"
                  ? "Confirm Reject"
                  : "Reject"}
              </CustomButton>
              <CustomButton
                size="small"
                color="transparent"
                onClick={() => openDetails(app)}
              >
                Details
              </CustomButton>
            </div>
          </div>
        ))}
      </div>

      {/* Preview modal */}
      {previewImg && (
        <div className="ci-modal" onClick={closePreview}>
          <div
            className="ci-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={previewImg} alt="preview" />
            <div className="ci-modal-actions">
              <CustomButton
                size="small"
                color="transparent"
                onClick={closePreview}
              >
                Close
              </CustomButton>
            </div>
          </div>
        </div>
      )}

      {/* Details modal */}
      {selectedApp && (
        <div className="ci-modal" onClick={closeDetails}>
          <div
            className="ci-modal-content ci-details"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Application details</h3>
            <div className="ci-detail-row">
              <strong>Name:</strong> {selectedApp.user.firstName}{" "}
              {selectedApp.user.lastName}
            </div>
            <div className="ci-detail-row">
              <strong>Username:</strong> {selectedApp.user.userName}
            </div>
            <div className="ci-detail-row">
              <strong>Email:</strong> {selectedApp.user.email}
            </div>
            <div className="ci-detail-row">
              <strong>Education:</strong> {selectedApp.education}
            </div>
            {selectedApp.certificateImage && (
              <div className="ci-detail-row">
                <strong>Certificate:</strong>
                <br />
                <img
                  src={selectedApp.certificateImage}
                  alt="cert"
                  style={{ maxWidth: 400, marginTop: 8 }}
                />
              </div>
            )}
            <div className="ci-details-actions">
              <CustomButton
                size="normal"
                color="primary"
                onClick={() => {
                  handleAction(selectedApp._id, "approve");
                  closeDetails();
                }}
              >
                Approve
              </CustomButton>
              <CustomButton
                size="normal"
                color="error"
                onClick={() => {
                  handleAction(selectedApp._id, "reject");
                  closeDetails();
                }}
              >
                Reject
              </CustomButton>
              <CustomButton
                size="normal"
                color="transparent"
                onClick={closeDetails}
              >
                Close
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
