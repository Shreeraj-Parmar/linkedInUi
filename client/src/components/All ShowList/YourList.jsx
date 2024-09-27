import React, { useEffect } from "react";
import { AllContext } from "../../context/UserContext";
import { useState, useContext } from "react";

const YourList = ({ count }) => {
  return (
    <div className="list-yourlist-wrapper bg-[#1B1F23] p-5 rounded-md m-2">
      <div className=" w-[100%] flex space-x-3">
        <div className="bg-[#293138] w-[30%]  rounded-md h-[150px] p-4 flex justify-center items-center">
          <p className=" text-white">{count && count.userCount} Users</p>
        </div>
        <div className="bg-[#293138] w-[30%] rounded-md h-[150px] p-4 flex justify-center items-center">
          <p className=" text-white">{count && count.postCount} Posts</p>
        </div>
      </div>
    </div>
  );
};

export default YourList;
