import React from "react";

export const NotificationCard = ({
  title,
  date,
  time,
  sender, //admin / other user
  senderImage,
}) => {
  return (
    <>
      <div className="my-3 notification-card">
        <div className="d-flex align-items-center">
          <img
            src={senderImage}
            alt="Sender"
            className="rounded-circle mx-2 border border-danger"
            style={{ width: "60px", height: "60px", objectFit: "cover" }}
          />
          <div className="notification-title">
            <h6 className="mb-0">{title}</h6>
            <small className="text-muted">
              {date} at {time}
            </small>
            <p className="mb-0">
              <small className="text-muted sender-name">From: {sender}</small>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
