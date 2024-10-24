import React from "react";
import { useNavigate } from "react-router-dom";

// components:
import Navbar from "../Navbar";
import Tostify from "../../Tostify";

// icons:
import BusinessIcon from "@mui/icons-material/Business";
const Business = () => {
  const navigate = useNavigate();
  return (
    <div className='main-overview w-[100vw] bg-[#F4F2EE] min-h-[100vh]'>
      <div className='main-overview-wrapper max-w-[100vw] overflow-x-hidden'>
        <Navbar />
        <Tostify />
        <div className='main-display w-[80vw]  min-h-[100vh] h-fit m-auto mt-[55px] p-4'>
          <div className=' flex mt-10 flex-col justify-center items-center '>
            <p className='text-[32px] text-[#444444] '>Create a Company Page</p>
            <p className=' mt-2 opacity-75'>
              Connect with clients, employees, and the LinkedIn community. To
              get started, choose a page type.
            </p>
          </div>
          <div className=' flex mt-12  justify-center items-center'>
            <div
              onClick={() => {
                setTimeout(() => {
                  navigate("/company/new");
                }, 500);
              }}
              className='  flex cursor-pointer  flex-col justify-center items-center border-[3px] hover:border-opacity-100 border-gray-400 border-opacity-40 w-fit p-3 rounded-md'
            >
              <BusinessIcon sx={{ fontSize: "100px", color: "#444444" }} />
              <p>Company</p>
              <p>small, medium & large businesses</p>
            </div>
          </div>
          <div className=' mt-10 flex justify-center items-center'>
            <img
              src='/business.png'
              alt='business image'
              className='w-[1500px] h-[800px] '
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Business;
