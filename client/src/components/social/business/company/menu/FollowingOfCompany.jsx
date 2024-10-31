import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AllContext } from "../../../../../context/UserContext";
import { getCompanyFollowers } from "../../../../../services/api.js";

const FollowingOfCompany = () => {
  const { companyId } = useParams();
  const [followingList, setFollowingList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { actAs } = useContext(AllContext);

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

  useEffect(() => {
    getAllFollowingDataFunc();
  }, [page]);

  return (
    <>
      <div
        onScroll={handleScroll}
        className='flex-row justify-center mt-2 space-y-2 overflow-auto max-h-[70vh]  items-center'
      >
        {followingList &&
          followingList.map((following) => (
            <div
              key={following._id}
              className='w-[100%] flex justify-start items-center space-x-2'
            >
              <img
                src={following.profilePic}
                alt=''
                className='w-10 h-10 rounded-full'
              />
              <p>{following.name}</p>
            </div>
          ))}
      </div>
    </>
  );
};

export default FollowingOfCompany;
