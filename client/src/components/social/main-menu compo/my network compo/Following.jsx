import React, { useEffect, useLayoutEffect, useState } from "react";

import { getMyFollowers, sendFollowReq } from "../../../../services/api.js";
import { toast } from "react-toastify";
import Tostify from "../../../Tostify.jsx";
import { Skeleton } from "@mui/material";

const Following = ({ navigate, setCurrMenu }) => {
  const [followingList, setFollowingList] = useState([]);
  const [followStatus, setFollowStatus] = useState({});
  const [followingSkeleton, setFollowingSkeleton] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getAllFollowingDataFunc = async () => {
    if (!hasMore) return; // If no more following, exit

    setFollowingSkeleton(true);
    let res = await getMyFollowers("following", page); // Pass page to the function

    if (res && res.status === 200) {
      const followings = res.data.list;
      setFollowingList((prev) => [...prev, ...followings]); // Append new followings

      // Initialize follow status for each following (using 'isFollowing' from API response)
      const initialFollowStatus = {};
      followings.forEach((user) => {
        initialFollowStatus[user._id] = user.isFollowing; // 'isFollowing' is returned by backend
      });
      setFollowStatus((prevStatus) => ({
        ...prevStatus,
        ...initialFollowStatus,
      }));

      // Check if there are more followings to load
      if (followings.length < 7) {
        // Assuming 10 is the limit
        setHasMore(false);
      }
    } else {
      toast.error(`Error While Fetching Your Followings, refresh it!`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setFollowingSkeleton(false);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
      // If user is near the bottom of the list, load more notifications
      setPage((prevPage) => prevPage + 1); // Move to the next page
    }
  };

  const handleFollowClick = async (receiverId) => {
    let res = await sendFollowReq({ receiverId }); // Call the follow/unfollow API

    if (res.status === 200) {
      console.log(res.data.message);

      // Toggle the follow status in the UI
      setFollowStatus((prevStatus) => ({
        ...prevStatus,
        [receiverId]: !prevStatus[receiverId],
      }));
    } else {
      toast.error(
        `Error While follow/unfollow please try again , refresh it . !`,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      console.error("Error while following/unfollowing:", res.data.message);
    }
  };

  useLayoutEffect(() => {
    getAllFollowingDataFunc();
  }, [page]);
  return (
    <>
      <div
        onScroll={handleScroll}
        className="flex-row justify-center mt-2 space-y-2 overflow-auto max-h-[70vh]  items-center"
      >
        {followingList.length > 0
          ? followingList.map((user) => {
              return (
                <div
                  key={user._id}
                  className=" flex items-center max-w-[100%] border-b border-gray-400 border-opacity-40 w-[100%] p min-h-[10%] rounded-md "
                >
                  <Tostify />
                  <div className="w-[] p-1 ">
                    {followingSkeleton ? (
                      <Skeleton
                        variant="circular"
                        style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <img
                        src={user.profilePicture || "/blank.png"}
                        alt=""
                        className="min-w-[70px] border border-gray-400 border-opacity-40 max-w-[70px] h-[70px] rounded-full  "
                      />
                    )}
                  </div>
                  <div className=" flex-row ml-3 space-y-[-5px] lg:min-w-[200px]">
                    <p
                      onClick={() => {
                        setCurrMenu("");
                        setTimeout(() => {
                          navigate(`/user/${user._id}`);
                        }, 500);
                      }}
                      className="text-[#000] hover:text-blue-500 hover:underline cursor-pointer"
                    >
                      {followingSkeleton ? (
                        <Skeleton
                          variant="text"
                          style={{
                            width: "150px",
                            height: "15px",
                            borderRadius: "10px",
                            marginBottom: "5px",
                          }}
                        />
                      ) : (
                        <span>{user.name}</span>
                      )}
                    </p>
                    {followingSkeleton ? (
                      <Skeleton
                        variant="text"
                        style={{
                          width: "70px",
                          height: "15px",
                          borderRadius: "10px",
                          marginBottom: "5px",
                        }}
                      />
                    ) : (
                      <>
                        <p className="text-[#959799]"> {user.city}</p>
                        <p className="text-[#959799]">{user.gender}</p>
                      </>
                    )}
                  </div>
                  <div className="flex space-x-3 justify-end   p-2 lg:ml-[300px]">
                    <div className="">
                      {followingSkeleton ? (
                        <Skeleton
                          variant="text"
                          style={{
                            width: "120px",
                            height: "38px",
                            borderRadius: "20px",
                            marginBottom: "5px",
                            backgroundColor: "#F4F2EE",
                            border: "1px solid #C9C7C4",
                            backgroundImage:
                              "linear-gradient(90deg, #f4f2ee 0%, #f4f2ee 50%, #e6e6e6 50%, #e6e6e6 100%)",
                            backgroundSize: "200% 100%",
                            animation:
                              "skeleton-gradient 1.5s ease-in-out infinite",
                          }}
                        />
                      ) : (
                        <button
                          onClick={() => handleFollowClick(user._id)}
                          className="text-[#71B7ED] p-2 border-2 w-[120px] hover:border-3 hover:border-[#AAD6FF] hover:text-[#AAD6FF] rounded-full border-[#71B7ED]"
                        >
                          {" "}
                          {followStatus[user._id] ? "Unfollow" : "following"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          : !followingSkeleton && (
              <div className=" p-4">
                <div className=" flex justify-center items-center">
                  <img
                    src="/no-follow.jpg"
                    alt=""
                    className="w-[400px] h-[400px]"
                  />
                </div>
                <p className=" text-center">
                  Not Found Please Explore & Connect To Get Followers
                </p>
              </div>
            )}
      </div>
    </>
  );
};

export default Following;
