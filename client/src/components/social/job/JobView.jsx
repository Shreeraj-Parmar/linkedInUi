import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { useParams, useNavigate } from "react-router-dom";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ChecklistIcon from "@mui/icons-material/Checklist";
const JobView = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  return (
    <div className='main-overview w-[100vw] bg-[#F4F2EE] min-h-[100vh]'>
      <div className='main-overview-wrapper max-w-[100vw] overflow-x-hidden'>
        <Navbar />
        <div className='main-display w-[80vw] min-h-[100vh] h-[90vh] m-auto mt-[55px] p-4'>
          <div className='w-[70%] border-2 border-gray-400 bg-white  border-opacity-40 rounded-md'>
            <div className='p-4 pb-0'>
              <div className='flex space-x-4 cursor-pointer items-center'>
                <img
                  src='/blank.png'
                  className='max-w-[30px] max-h-[30px] min-w-[50px] min-h-[50px]'
                  alt=''
                />
                <p className='font-semibold text-sm hover:underline'>
                  Company Name
                </p>
              </div>
            </div>
            <div className='p-4 pb-0'>
              <p className='text-2xl font-semibold'>React + Node + MongoDB</p>
              <p className='text-sm mt-2 text-gray-500'>
                India,{" "}
                <span className='text-green-700 font-semibold'>1 hour ago</span>{" "}
                , 19 applicatns
              </p>
              <div className='text-sm mt-2 flex space-x-4 items-center'>
                <BusinessCenterIcon fontSize='large' />
                <div className='pl-1 pr-1 bg-green-200 text-sm rounded-md flex items-center justify-center w-[100px] text-center'>
                  <p>Remote</p>
                </div>
                <div className='pl-1 pr-1 bg-green-200 text-sm rounded-md flex items-center justify-center w-[100px] text-center'>
                  <p>Full Time</p>
                </div>
                <p>Entry Level </p>
              </div>
            </div>
            <div className='p-4 pb-0 flex relative top-[-10px] items-center gap-4'>
              <ChecklistIcon fontSize='large' />
              <p className='hover:underline cursor-pointer'>
                8 of 10 skills match your profile - you may be a good fit
              </p>
            </div>
            <div className='p-4 gap-4 pb-0 flex mb-4 items-center'>
              <button className='bg-blue-700 text-white font-semibold py-2 border-[3px] border-blue-700 hover:border-blue-800 px-4 rounded-full hover:bg-blue-800'>
                Easy Apply
              </button>
              <button className='bg-transparent text-blue-700 border-[3px] border-blue-700 font-semibold py-2 px-4 rounded-full hover:bg-blue-100'>
                Save
              </button>
            </div>
          </div>
          <div className='w-[70%] mt-4 border-2 border-gray-400 bg-white  border-opacity-40 rounded-md'>
            <div className='p-4'>
              <p className='text-xl font-semibold'>Posted By</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobView;
