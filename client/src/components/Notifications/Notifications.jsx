import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import Navbar from "../social/Navbar";
import { AllContext } from "../../context/UserContext";
import { fatchAllNotifications } from "../../services/api.js"; // Adjust API function
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const { isLogin } = useContext(AllContext);
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
    setLoading(false); // Stop loading
  };

  useLayoutEffect(() => {
    if (!isLogin) {
      navigate("/login");
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

  return (
    <div className="main-overview w-[100vw] bg-[#F4F2EE] min-h-[100vh]">
      <div className="main-overview-wrapper max-w-[100vw] overflow-x-hidden">
        <Navbar />
        <div
          onScroll={handleScroll}
          className="main-display border-2 border-gray-400 shadow-sm border-opacity-40 bg-white w-[50vw] max-h-[900vh] h-[90vh] m-auto mt-[55px] overflow-auto"
        >
          <div className="p-2">
            <p>All Notifications</p>
          </div>

          <div className="notifications flex-row">
            {notificationsList && notificationsList.length > 0 ? (
              notificationsList.map((noti) => (
                <div
                  key={noti._id}
                  className="notification cursor-pointer p-3 hover:bg-[#EBEBEB] flex justify-between items-center border-b-2 border-gray-400 border-collapse border-opacity-40"
                >
                  <div className="max-w-[20%]">
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
                        <p className="hover:underline hover:text-blue-700 ml-1 font-semibold">
                          {noti.sender.name}
                        </p>
                      </p>
                    )}
                    {noti.type === "like" && (
                      <p className="flex">
                        You Have like on your Post, liked by
                        <p className="hover:underline hover:text-blue-700 ml-1 font-semibold">
                          {noti.sender.name}
                        </p>
                      </p>
                    )}
                    {noti.type === "message" && (
                      <p className="flex">
                        You Have New Message send by
                        <p className="hover:underline hover:text-blue-700 ml-1 font-semibold">
                          {noti.sender.name}
                        </p>
                      </p>
                    )}
                    {noti.type === "comment" && (
                      <p className="flex">
                        You Have New Comment On your Post, Commented By
                        <p className="hover:underline hover:text-blue-700 ml-1 font-semibold">
                          {noti.sender.name}
                        </p>
                      </p>
                    )}
                    {noti.type === "connection_request" && (
                      <p className="flex">
                        You Have New Connection Req From
                        <p className="hover:underline hover:text-blue-700 ml-1 font-semibold">
                          {noti.sender.name}
                        </p>
                      </p>
                    )}
                    {noti.type === "connection_accepted" && (
                      <p className="flex">
                        Your connection req accepted by
                        <p className="hover:underline hover:text-blue-700 ml-1 font-semibold">
                          {noti.sender.name}
                        </p>
                      </p>
                    )}
                    {noti.type === "profile_view" && (
                      <p className="flex">
                        New Profile view, explore community
                      </p>
                    )}
                    <button className="mt-2 pl-3 pr-3 text-[#0A66C2] p-1 border-2 border-[#0A66C2] rounded-full hover:text-[#004182] hover:border-[#004182]">
                      {noti.type === "follow" && "Follow Back"}
                      {noti.type === "like" && "View Profile"}
                      {noti.type === "message" && "Message"}
                      {noti.type === "comment" && "View Profile"}
                      {noti.type === "connection_request" && "Show Request"}
                      {noti.type === "connection_accepted" && "Message"}
                    </button>
                  </div>
                  <div className="lg:mr-[px] flex-row">
                    <p className="text-center relative right-5">
                      {moment(noti.createdAt).fromNow()}
                    </p>
                    <DeleteIcon
                      fontSize="large"
                      className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-[#595959] hover:rounded-full hover:bg-opacity-10"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div>
                <p>No notifications found</p>
              </div>
            )}
          </div>
          {loading && <p>Loading more notifications...</p>}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
