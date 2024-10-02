import React, { useEffect, useLayoutEffect, useState } from "react";

import { getMyFollowers, sendFollowReq } from "../../../../services/api.js";
import { toast } from "react-toastify";
import Tostify from "../../../Tostify.jsx";

const Following = ({ navigate, setCurrMenu }) => {
  const [followingList, setFollowingList] = useState([]);
  const [followStatus, setFollowStatus] = useState({});

  const getAllFollowersDataFunc = async () => {
    let res = await getMyFollowers("following");
    console.log(res.data);

    if (res && res.status === 200) {
      const followings = res.data.list;
      setFollowingList(followings);
      // Initialize follow status for each follower (using 'isFollowing' from API response)
      const initialFollowStatus = {};
      followings.forEach((user) => {
        initialFollowStatus[user._id] = user.isFollowing; // 'isFollowing' is returned by backend
      });
      setFollowStatus(initialFollowStatus);
    } else {
      toast.error(`Error While feaching Your followings , refresh it . !`, {
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
    getAllFollowersDataFunc();
  }, []);
  return (
    <>
      {followingList.length > 0 ? (
        followingList.map((user) => {
          return (
            <div
              key={user._id}
              className=" flex items-center max-w-[100%] border-b border-gray-400 border-opacity-40 w-[100%] p min-h-[10%] rounded-md "
            >
              <Tostify />
              <div className="w-[] p-1 ">
                <img
                  src={user.profilePicture || "/blank.png"}
                  alt=""
                  className="min-w-[70px] border border-gray-400 border-opacity-40 max-w-[70px] h-[70px] rounded-full  "
                />
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
                  {" "}
                  {user.name}
                </p>
                <p className="text-[#959799]"> {user.city}</p>
                <p className="text-[#959799]">{user.gender}</p>
              </div>
              <div className="flex space-x-3 justify-end   p-2 lg:ml-[300px]">
                <div className="">
                  <button
                    onClick={() => handleFollowClick(user._id)}
                    className="text-[#71B7ED] p-2 border-2 w-[120px] hover:border-3 hover:border-[#AAD6FF] hover:text-[#AAD6FF] rounded-full border-[#71B7ED]"
                  >
                    {" "}
                    {followStatus[user._id] ? "Unfollow" : "following"}
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-white p-4">
          Not Found Please Explore & Connect To Get Followers
        </div>
      )}
    </>
  );
};

export default Following;
