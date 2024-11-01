import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import FollowersOfCompany from "./FollowersOfCompany";
import { AllContext } from "../../../../../context/UserContext";
import FollowingOfCompany from "./FollowingOfCompany";

const Followers = () => {
  const { companyId } = useParams();
  const { setActAs } = useContext(AllContext);
  const [follow, setFollow] = useState("followers");

  useEffect(() => {
    setActAs({ type: "company", id: companyId });
  }, []);

  return (
    <div className=' border-2 border-gray-400 bg-white w-[70%] border-opacity-40 rounded-lg'>
      <div className='flex space-x-2 p-4 border-b-2 border-gray-400 border-opacity-40  '>
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
      <div className=' min-h-[50vh] '>
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
