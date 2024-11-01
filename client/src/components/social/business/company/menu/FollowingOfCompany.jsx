import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AllContext } from "../../../../../context/UserContext";
import {
  getCompanyFollowers,
  sendFollowReq,
} from "../../../../../services/api.js";
const FollowingOfCompany = () => {
  const { companyId } = useParams();
  const [followingList, setFollowingList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { actAs } = useContext(AllContext);
  const navigate = useNavigate();
  console.log("ccccccc", companyId);

  const getAllFollowingDataFunc = async () => {
    if (!hasMore) return; // If no more following, exit

    let res = await getCompanyFollowers("following", page, companyId); // Pass page to the function

    if (res && res.status === 200) {
      const followings = res.data.list;
      console.log("followings", followings);
      setFollowingList((prev) => [...prev, ...followings]); // Append new followings

      // Initialize follow status for each following (using 'isFollowing' from API response)

      // Check if there are more followings to load
      if (followings.length < 7) {
        // Assuming 10 is the limit
        setHasMore(false);
      }
    } else {
      console.log("somthing error");
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
      // If user is near the bottom of the list, load more notifications
      setPage((prevPage) => prevPage + 1); // Move to the next page
    }
  };

  const handleFollowClick = async (receiver, type) => {
    let res = await sendFollowReq({
      receiverId: receiver,
      receverType: type,
      senderId: actAs && actAs.id,
      senderType: actAs && actAs.type === "company" ? "Company" : "User",
    });
    if (res.status === 200) {
      console.log(res.data.message);

      // Toggle the follow status locally
    } else {
      console.error("Error while following/unfollowing:", res.data.message);
    }
  };

  useEffect(() => {
    getAllFollowingDataFunc();
  }, [page]);

  return (
    <>
      <div
        onScroll={handleScroll}
        className='flex-row justify-center   overflow-auto max-h-[70vh]  items-center'
      >
        {followingList &&
          followingList.length > 0 &&
          followingList.map((following) => (
            <div
              key={following._id}
              className='w-[100%] flex hover:bg-[#f5f5f5] pl-4 pr-4 cursor-pointer border-b-2 p-2 border-gray-400 border-opacity-40 justify-between items-center '
            >
              <div
                className='flex items-center space-x-3'
                onClick={() => {
                  if (following.type === "Company") {
                    navigate(`/company/${following._id}`);
                  } else {
                    navigate(`/user/${following._id}`);
                  }
                }}
              >
                <div className=''>
                  <img
                    src={following.profilePicture || "/blank.png"}
                    alt=''
                    className=' rounded-full h-[70px] shadow-sm w-[70px] border border-gray-400 bor-der-opacity-40 max-h-[70px] max-w-[70px] min-h-[70px] min-w-[70px]'
                  />
                </div>
                <div>
                  <p className='font-semibold'>{following.name}</p>
                  <span className='text-gray-500'>
                    {following.type === "Company" ? "Company" : "User"}
                  </span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => {
                    handleFollowClick(following._id, following.type);
                    console.log("unfollow button clicked");
                  }}
                  className='bg-white border-[3px] border-gray-700 text-gray-700 font-semibold p-2 pl-3 pr-3 rounded-full hover:bg-gray-700 hover:text-white transition duration-300 ease-in-out'
                >
                  Unfollow
                </button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default FollowingOfCompany;
