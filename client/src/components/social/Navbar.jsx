import React, { useContext, useState, useEffect } from "react";

import { AllContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
//icons
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = () => {
  const { isLogin, setIsLogin, file, setFile, currMenu, setCurrMenu } =
    useContext(AllContext);
  const navigate = useNavigate();
  return (
    <div className="flex justify-center z-20 bg-[#1B1F23] fixed  w-[100%] ">
      <div className="main-up h-[7vh]  text-white flex justify-center items-center  border-b-[1px] border-b-[rgb(186,186,186)]  w-[100%]">
        <div className="up-header-wrapper flex justify-between w-[80%]">
          <div className="logo-side flex justify-center ml-5 items-center">
            <div className="flex justify-center items-center">
              <LinkedInIcon
                className="text-white cursor-pointer"
                fontSize="large"
              />
            </div>
            <h2 className="text-3xl text-center "></h2>
          </div>
          <div className="menu-side flex space-x-1 mr-[170px]">
            <div
              onClick={() => {
                setCurrMenu("home");
                setTimeout(() => {
                  navigate("/social");
                }, 500);
              }}
              className={` ${
                currMenu === "home" ? "curr-menu-active" : ""
              } cursor-pointer main-menu-div  w-[100px]`}
            >
              <div className=" flex justify-center items-center">
                <button>
                  <HomeIcon
                    fontSize="medium"
                    className="text-[#abacad] hover:text-[#e9e9e9]"
                  />
                </button>
              </div>
              <div className=" flex justify-center mt-[-5px] items-center">
                <p className=" text-[12px] text-[#abacad] hover:text-[#e9e9e9]">
                  Home
                </p>
              </div>
            </div>
            <div
              onClick={() => {
                if (!isLogin) {
                  navigate("/login");
                  return;
                } else {
                  setCurrMenu("network");
                  setTimeout(() => {
                    navigate("/my-network");
                  }, 500);
                }
              }}
              className={` ${
                currMenu === "network" ? "curr-menu-active" : ""
              } cursor-pointer main-menu-div  w-[100px]`}
            >
              <div className=" flex justify-center items-center">
                <button>
                  <PeopleIcon
                    fontSize="medium"
                    className="text-[#abacad] hover:text-[#e9e9e9]"
                  />
                </button>
              </div>
              <div className=" flex justify-center mt-[-5px] items-center">
                <p className=" text-[12px] text-[#abacad] hover:text-[#e9e9e9]">
                  My Network
                </p>
              </div>
            </div>
            <div
              onClick={() => {
                if (!isLogin) {
                  navigate("/login");
                  return;
                } else {
                  setCurrMenu("message");
                  // navigate("/message");
                }
              }}
              className={` ${
                currMenu === "message" ? "curr-menu-active" : ""
              } cursor-pointer main-menu-div  w-[100px]`}
            >
              <div className=" flex justify-center items-center">
                <button>
                  <ChatIcon
                    fontSize="medium"
                    className="text-[#abacad] hover:text-[#e9e9e9]"
                  />
                </button>
              </div>
              <div className=" flex justify-center mt-[-5px] items-center">
                <p className=" text-[12px] text-[#abacad] hover:text-[#e9e9e9]">
                  Messaging
                </p>
              </div>
            </div>
            <div
              onClick={() => {
                if (!isLogin) {
                  navigate("/login");
                  return;
                } else {
                  setCurrMenu("notification");
                  // navigate("/notification");
                }
              }}
              className={` ${
                currMenu === "notification" ? "curr-menu-active" : ""
              } cursor-pointer main-menu-div  w-[100px]`}
            >
              <div className=" flex justify-center items-center">
                <button>
                  <NotificationsActiveIcon
                    fontSize="medium"
                    className="text-[#abacad] hover:text-[#e9e9e9]"
                  />
                </button>
              </div>
              <div className=" flex justify-center mt-[-5px] items-center">
                <p className=" text-[12px] text-[#abacad] hover:text-[#e9e9e9]">
                  Notifications
                </p>
              </div>
            </div>
            <div
              onClick={() => {
                if (!isLogin) {
                  navigate("/login");
                  return;
                } else {
                  setCurrMenu("profile");
                  // navigate("/profile");
                }
              }}
              className={` ${
                currMenu === "profile" ? "curr-menu-active" : ""
              } cursor-pointer main-menu-div  w-[100px]`}
            >
              <div className=" flex justify-center items-center">
                <button>
                  <AccountCircleIcon
                    fontSize="medium"
                    className="text-[#abacad] hover:text-[#e9e9e9]"
                  />
                </button>
              </div>
              <div className=" flex justify-center mt-[-5px] items-center">
                <p className=" text-[12px] text-[#abacad] hover:text-[#e9e9e9]">
                  Me
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
