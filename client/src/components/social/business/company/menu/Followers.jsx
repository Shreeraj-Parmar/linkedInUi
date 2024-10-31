import React, { useState } from "react";
import FollowersOfCompany from "./FollowersOfCompany";
import FollowingOfCompany from "./FollowingOfCompany";

const Followers = () => {
  const [follow, setFollow] = useState("followers");
  return (
    <div className='p-2 border-2 border-gray-400 bg-white border-opacity-40 rounded-lg'>
      <div className='p-2'>
        <p className=' font-semibold text-xl'>Followers & Following</p>
      </div>
      <div className='flex space-x-2 '>
        <div
          onClick={() => setFollow("followers")}
          className={`p-2 cursor-pointer ${
            follow === "followers" && "bg-green-700 text-white"
          } rounded-full w-[100px]  border-[3px]  border-green-700 text-green-700 font-semibold flex justify-center i}tems-center`}
        >
          <button>Followers</button>
        </div>
        <div
          onClick={() => setFollow("following")}
          className={`p-2 cursor-pointer ${
            follow === "following" && "bg-green-700 text-white "
          } rounded-full w-[100px]   border-[3px]   border-green-700 text-green-700 font-semibold flex justify-center items-center`}
        >
          <button>Following</button>
        </div>
      </div>
      <div className='mt-2 min-h-[50vh] p-2'>
        {follow === "followers" ? (
          <FollowersOfCompany />
        ) : (
          <FollowingOfCompany />
        )}
      </div>
    </div>
  );
};

export default Followers;
