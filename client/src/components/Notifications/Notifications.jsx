import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import Navbar from "../social/Navbar";
import { AllContext } from "../../context/UserContext";
import {
  fatchAllNotifications,
  updateNotiClick,
  deleteNoti,
} from "../../services/api.js"; // Adjust API function
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";

const Notifications = () => {
  const { isLogin, setCurrMenu } = useContext(AllContext);
  const [notificationsList, setNotificationLists] = useState([]);
  const [page, setPage] = useState(1); // For pagination
  const [loading, setLoading] = useState(false); // For loading state
  const [hasMore, setHasMore] = useState(true); // For checking if there are more notifications to load
  const navigate = useNavigate();
  const limit = 8; // Number of notifications to load at a time

  const fatchAllNotificationsFunction = async (page, limit) => {
    setLoading(true); // Start loading
    let res = await fatchAllNotifications(page, limit); // API to fetch notifications
    if (res.status === 200) {
      // Update notification list with newly fetched data
      setNotificationLists((prevNotifications) => [
        ...prevNotifications,
        ...res.data,
      ]);
      console.log(res.data);
      // Check if there are more notifications to load
      if (res.data.length < limit) {
        setHasMore(false); // If no more notifications are found, stop loading more
      }
    }
    setTimeout(() => {
      setLoading(false); // Stop loading
    }, 2000);
  };

  useLayoutEffect(() => {
    if (!isLogin) {
      navigate("/login");
    } else {
      if (window.location.pathname === "/notification") {
        setCurrMenu("notification");
      }
    }
  }, []);

  // Initial data load (on component mount)
  useEffect(() => {
    fatchAllNotificationsFunction(page, limit);
  }, [page]);

  // Infinite scrolling logic
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
      // If user is near the bottom of the list, load more notifications
      setPage((prevPage) => prevPage + 1); // Move to the next page
    }
  };

  const updateClickNotificationFunction = async (notiId) => {
    let res = await updateNotiClick({ notiId });
    if (res.status === 200) {
      console.log("asdsadasd");
    }
  };

  const handleNotiBtnClick = async (type, senderId) => {
    if (type === "follow") {
      setTimeout(() => {
        navigate(`/user/${senderId}`);
      }, 300);
    } else if (type === "like") {
      setTimeout(() => {
        navigate(`/user/${senderId}`);
      }, 300);
    } else if (type === "profile_view") {
      setTimeout(() => {
        navigate(`/user/${senderId}`);
      }, 300);
    }
  };

  const handleDeleteNoti = async (notiId) => {
    console.log("dleerter triffffffffer");
    let res = await deleteNoti({ notiId });
    if (res.status === 200) {
      console.log("noti deleted");
      let newNotiList = notificationsList.filter((noti) => noti._id !== notiId);
      console.log(newNotiList);
      setNotificationLists(newNotiList);
    } else {
      toast.error(`somthing error while delete notification`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleClickNotification = async (notiId, senderId, type) => {
    updateClickNotificationFunction(notiId);
    // handleNotiBtnClick(type, senderId);
  };

  return (
    <div className="main-overview w-[100vw] bg-[#F4F2EE] min-h-[100vh]">
      <div className="main-overview-wrapper max-w-[100vw] overflow-x-hidden">
        <Navbar />
        <div
          onScroll={handleScroll}
          className="main-display border-2 border-gray-400 shadow-sm border-opacity-40 bg-white w-[50vw] max-h-[900vh] h-[90vh] m-auto mt-[55px] overflow-auto"
        >
          <div className="p-2 border-b-2 border-gray-400 border-opacity-40 border-collapse">
            <p className=" text-xl p-1">All Notifications</p>
          </div>
          {loading && (
            <div className="notifications flex-row">
              {[1, 2, 3, 4, 5, 6].map((noti, index) => (
                <div
                  key={index}
                  className="notification cursor-pointer p-3 hover:bg-[#EBEBEB] flex justify-between items-center border-b-2 border-gray-400 border-collapse border-opacity-40"
                >
                  <Skeleton
                    variant="rectangular"
                    width={80}
                    height={80}
                    style={{
                      borderRadius: "50%",
                      border: "1px solid rgba(107, 114, 128, 0.4)",
                    }}
                  />
                  <div className=" lg:mr-[300px]">
                    <Skeleton
                      variant="text"
                      style={{
                        width: "200px",
                        // lineHeight: "1.5",
                        borderRadius: "8px",
                        margin: "",
                      }}
                    />
                    <Skeleton
                      variant="text"
                      style={{
                        width: "100px",
                        // lineHeight: "1.5",
                        borderRadius: "8px",
                        margin: "",
                      }}
                    />
                  </div>

                  <div className="noti-btns flex-row">
                    <Skeleton variant="rectangular" width={100} height={40} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="notifications flex-row">
            {notificationsList && !loading && notificationsList.length > 0
              ? notificationsList.map((noti) => (
                  <div
                    onClick={() => {
                      handleClickNotification(
                        noti._id,
                        noti.sender && noti.sender._id,
                        noti.type
                      );
                    }}
                    key={noti._id}
                    className={`notification cursor-pointer p-3 hover:bg-[#EBEBEB] flex justify-between items-center border-b-2 border-gray-400 border-collapse border-opacity-40 ${
                      !noti.isClicked && "bg-[#D7E9FB]"
                    }`}
                  >
                    <div
                      onClick={() => {
                        handleNotiBtnClick(noti.type, noti.sender._id);
                      }}
                      className="max-w-[20%]"
                    >
                      {!noti.isClicked && (
                        <div className=" min-h-[8px] min-w-[8px] max-h-[8px] max-w-[8px] rounded-full bg-blue-500"></div>
                      )}
                      <img
                        src={
                          (noti.sender &&
                            noti.sender.profilePicture &&
                            noti.sender.profilePicture) ||
                          "/blank.png"
                        }
                        alt="user profile picture"
                        className="max-w-[80px] w-[80px] max-h-[80px] h-[80px] border border-gray-400 border-opacity-40 rounded-full"
                      />
                    </div>
                    <div className="lg:mr-[255px]">
                      {noti.type === "follow" && (
                        <p className="flex">
                          You Have New Follower
                          <p
                            onClick={() => {
                              setTimeout(() => {
                                navigate(`/user/${noti.sender._id}`);
                              }, 300);
                            }}
                            className="hover:underline hover:text-blue-700 ml-1 font-semibold"
                          >
                            {noti.sender.name}
                          </p>
                        </p>
                      )}
                      {noti.type === "like" && (
                        <p className="flex">
                          You Have like on your Post, liked by
                          <p
                            onClick={() => {
                              console.log("usr trigerdx");
                              setTimeout(() => {
                                navigate(`/user/${noti.sender._id}`);
                              }, 300);
                            }}
                            className="hover:underline hover:text-blue-700 ml-1 font-semibold"
                          >
                            {noti.sender.name}
                          </p>
                        </p>
                      )}
                      {noti.type === "message" && (
                        <p className="flex">
                          You Have New Message send by
                          <p
                            onClick={() => {
                              setTimeout(() => {
                                navigate(`/user/${noti.sender._id}`);
                              }, 300);
                            }}
                            className="hover:underline hover:text-blue-700 ml-1 font-semibold"
                          >
                            {noti.sender.name}
                          </p>
                        </p>
                      )}
                      {noti.type === "comment" && (
                        <p className="flex">
                          You Have New Comment On your Post, Commented By
                          <p
                            onClick={() => {
                              setTimeout(() => {
                                navigate(`/user/${noti.sender._id}`);
                              }, 300);
                            }}
                            className="hover:underline hover:text-blue-700 ml-1 font-semibold"
                          >
                            {noti.sender.name}
                          </p>
                        </p>
                      )}
                      {noti.type === "connection_request" && (
                        <p className="flex">
                          You Have New Connection Req From
                          <p
                            onClick={() => {
                              setTimeout(() => {
                                navigate(`/user/${noti.sender._id}`);
                              }, 300);
                            }}
                            className="hover:underline hover:text-blue-700 ml-1 font-semibold"
                          >
                            {noti.sender.name}
                          </p>
                        </p>
                      )}
                      {noti.type === "connection_accepted" && (
                        <p className="flex">
                          Your connection req accepted by
                          <p
                            onClick={() => {
                              setTimeout(() => {
                                navigate(`/user/${noti.sender._id}`);
                              }, 300);
                            }}
                            className="hover:underline hover:text-blue-700 ml-1 font-semibold"
                          >
                            {noti.sender.name}
                          </p>
                        </p>
                      )}
                      {noti.type === "profile_view" && (
                        <p className="flex">
                          Your Profile Viewed By
                          <p
                            onClick={() => {
                              setTimeout(() => {
                                navigate(`/user/${noti.sender._id}`);
                              }, 300);
                            }}
                            className="hover:underline hover:text-blue-700 ml-1 font-semibold"
                          >
                            {noti.sender.name}
                          </p>
                        </p>
                      )}
                      <button
                        onClick={() => {
                          handleNotiBtnClick(noti.type, noti.sender._id);
                        }}
                        className="mt-2 pl-3 pr-3 text-[#0A66C2] p-1 border-2 border-[#0A66C2] rounded-full hover:text-[#004182] hover:border-[#004182]"
                      >
                        {noti.type === "follow" && "Follow Back"}
                        {noti.type === "like" && "View Profile"}
                        {noti.type === "message" && "Message"}
                        {noti.type === "comment" && "View Profile"}
                        {noti.type === "connection_request" && "Show Request"}
                        {noti.type === "connection_accepted" && "Message"}
                        {noti.type === "profile_view" && "View Profile"}
                      </button>
                    </div>
                    <div className="lg:mr-[px] flex-row">
                      <p className="text-center relative right-5 text-[#8f8f8f]">
                        {moment(noti.createdAt).fromNow()}
                      </p>
                      <DeleteIcon
                        fontSize="large"
                        className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-[#595959] hover:rounded-full hover:bg-opacity-10"
                        onClick={() => {
                          handleDeleteNoti(noti._id);
                        }}
                      />
                    </div>
                  </div>
                ))
              : !loading && (
                  <div>
                    <div className="p-2 flex justify-center items-center">
                      <img
                        src="/no-noti.jpg"
                        className=" lg:min-w-[500px] lg:min-h-[500px] lg:max-w-[500px]
lg:max-h-[500px]"
                        alt=""
                      />
                    </div>
                    <p className=" text-center">No notifications found</p>
                  </div>
                )}
          </div>
          {/* Loader here */}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
