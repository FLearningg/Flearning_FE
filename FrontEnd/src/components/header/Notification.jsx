import React, { useEffect, useState } from "react";
import "../../assets/header/header.css";
import { NotificationCard } from "./NotificationCard";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications } from "../../services/notificationService";
const PAGE_SIZE = 10; // number of notifications to render at a time
const RENDER_STEP = 5; // number of notifications to render on each scroll
function Notification() {
  const notificationData =
    useSelector(
      (state) => state.notifications?.getNotifications?.notifications
    ) || [];
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchNotifications = async () => {
      await getNotifications(dispatch, currentUser?._id, 1, PAGE_SIZE);
    };
    fetchNotifications();
  }, [dispatch]);
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreApi, setHasMoreApi] = useState(true);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(RENDER_STEP);
  const [showInfinite, setShowInfinite] = useState(false);

  // Simulate fetching API: get each page from notificationData
  const fetchNotifications = async (pageNum) => {
    setLoading(true);
    try {
      // Get data for each page
      const start = (pageNum - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const pageData = notificationData.slice(start, end);

      if (pageData.length > 0) {
        setNotifications((prev) => [...prev, ...pageData]);
        if (end >= notificationData.length) setHasMoreApi(false);
      } else {
        setHasMoreApi(false);
      }
    } catch (e) {
      setHasMoreApi(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Khi notificationData thay đổi và có dữ liệu, reset notifications
    if (notificationData.length > 0) {
      setNotifications([]);
      setPage(1);
      setHasMoreApi(true);
      setVisibleCount(RENDER_STEP);
      setShowInfinite(false);
      fetchNotifications(1);
    }
  }, [notificationData]);

  // Function called when scrolling for infinite scroll
  const handleInfiniteScroll = () => {
    // If all fetched notifications are displayed, fetch more
    if (
      visibleCount + RENDER_STEP > notifications.length &&
      hasMoreApi &&
      !loading
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    }
    setVisibleCount((prev) => prev + RENDER_STEP);
  };

  // Function called when clicking "Show More" button
  const handleShowMore = (event) => {
    event.stopPropagation();
    setVisibleCount(RENDER_STEP * 2); // Show 10 notifications
    setShowInfinite(true); // Enable infinite scroll
  };

  function formatDateTime(isoString) {
    const dateObj = new Date(isoString);
    // Take date with format "Month Day, Year"
    const date = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    // Take time with format "hh:mm AM/PM"
    const time = dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return { date, time };
  }
  // when map notification:
  const notificationsWithDateTime = notifications.map((n) => {
    const { date, time } = formatDateTime(n.createdAt);
    return { ...n, date, time };
  });

  return (
    <>
      <div className="dropdown">
        <button
          className="btn btn-light rounded-circle icon-btn"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img src="/icons/bell.png" className="icon" alt="" />
          {notificationData?.length > 0 && (
            <span className="notification-dot"></span>
          )}
        </button>
        <ul
          className="dropdown-menu dropdown-menu-fixed-right"
          style={{ width: "350px" }}
          aria-labelledby="dropdownMenuButton1"
        >
          <div
            className="position-fixed bg-white p-2 px-3 border-3 border-bottom "
            style={{ width: "348px", zIndex: 1000 }}
          >
            <div className="d-flex align-items-center">
              <h5 className="text-start fw-bold mb-0">Notifications</h5>
            </div>
          </div>
          <div>
            <div className="dropdown-container" id="scrollableNotificationDiv">
              {
                notificationData.length === 0 ? (
                  <div className="text-muted text-center p-3">
                    <FontAwesomeIcon
                      icon={faBell}
                      style={{ fontSize: "24px" }}
                    />
                    <p className="mb-0 mt-2">No notifications yet</p>
                  </div>
                ) : (
                  <>
                    {!showInfinite ? (
                      <>
                        {notificationsWithDateTime
                          .slice(0, visibleCount)
                          .map((notification, index) => (
                            <NotificationCard
                              key={notification._id || index}
                              title={notification.message}
                              date={notification.date}
                              time={notification.time}
                              sender={notification.sender || "Admin"}
                              senderImage={
                                notification.senderImage ||
                                "/images/defaultImageUser.png"
                              }
                            />
                          ))}
                        {visibleCount < notificationsWithDateTime.length && (
                          <div className="text-center mt-2 px-2">
                            <button
                              className="btn header-btn-show-more w-100"
                              onClick={handleShowMore}
                            >
                              Show More Notifications
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <InfiniteScroll
                        dataLength={Math.min(
                          visibleCount,
                          notifications.length
                        )}
                        next={handleInfiniteScroll}
                        hasMore={
                          hasMoreApi || visibleCount < notifications.length
                        }
                        loader={
                          <div class="spinner-border" role="status">
                            <span class="sr-only">Loading...</span>
                          </div>
                        }
                        scrollableTarget={"scrollableNotificationDiv"}
                      >
                        {notificationsWithDateTime
                          .slice(0, visibleCount)
                          .map((notification, index) => (
                            <NotificationCard
                              key={notification._id || index}
                              title={notification.message}
                              date={notification.date}
                              time={notification.time}
                              sender={notification.sender || "Unknown Sender"}
                              senderImage={
                                notification.senderImage ||
                                "/images/defaultImageUser.png"
                              }
                            />
                          ))}
                      </InfiniteScroll>
                    )}
                  </>
                )
                // {!showInfinite ? (
                //     <>
                //         {notifications.slice(0, visibleCount).map((notification, index) => (
                //             <NotificationCard
                //                 key={index}
                //                 title={notification.title}
                //                 date={notification.date}
                //                 time={notification.time}
                //                 sender={notification.sender}
                //                 senderImage={notification.senderImage}
                //             />
                //         ))}
                //         <div className='text-center mt-2 px-2'>
                //             <button className='btn header-btn-show-more w-100' onClick={handleShowMore}>Show More Notifications</button>
                //         </div>
                //     </>
                // ) : (
                //     <InfiniteScroll
                //         dataLength={Math.min(visibleCount, notifications.length)}
                //         next={handleInfiniteScroll}
                //         hasMore={hasMoreApi || visibleCount < notifications.length}
                //         loader={
                //             <div class="spinner-border" role="status">
                //                 <span class="sr-only">Loading...</span>
                //             </div>
                //         }
                //         scrollableTarget={"scrollableNotificationDiv"}
                //     >
                //         {notifications.slice(0, visibleCount).map((notification, index) => (
                //             <NotificationCard
                //                 key={index}
                //                 title={notification.title}
                //                 date={notification.date}
                //                 time={notification.time}
                //                 sender={notification.sender}
                //                 senderImage={notification.senderImage}
                //             />
                //         ))}
                //     </InfiniteScroll>
                // )}
              }
            </div>
          </div>
        </ul>
      </div>
    </>
  );
}

export default Notification;
