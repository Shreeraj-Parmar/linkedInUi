import React, { useContext, useState, useEffect } from "react";

import { AllContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  getAllUnreadMsg,
  getAllUnreadNotiCount,
  getConnectionReqCount,
} from "../../services/api.js";
//icons
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Badge from "@mui/material/Badge";
import LoginDialog from "./LoginDialog.jsx";

const Navbar = () => {
  const {
    isLogin,
    setIsLogin,
    socket,
    setLoginDialog,
    loginDialog,
    currMenu,
    setCurrMenu,
    currUserData,
    messages,
    lightMode,
  } = useContext(AllContext);
  const navigate = useNavigate();
  const [unreadMSGCount, setMSGUnreadCount] = useState(0);
  const [unreadNotiCount, setUnreadNotiCount] = useState(0);
  const [connectionReqCount, setConnectionReqCount] = useState(0);
  const getAllUnreadMessagesFunc = async () => {
    let res = await getAllUnreadMsg();
    res.status === 200 && console.log(res.data);
    res.status === 200 && setMSGUnreadCount(res.data);
  };

  const getAllUnreadNotifications = async () => {
    let res = await getAllUnreadNotiCount();
    res.status === 200 && setUnreadNotiCount(res.data);
  };

  const getAllUnreadConnectionReqCount = async () => {
    let res = await getConnectionReqCount();
    console.log("totlal unread noti connreq", res.data);
    res.status === 200 && setConnectionReqCount(res.data.count);
  };

  useEffect(() => {
    getAllUnreadMessagesFunc();
    getAllUnreadNotifications();
    getAllUnreadConnectionReqCount();
  }, [messages]);

  useEffect(() => {
    socket &&
      currUserData &&
      socket.on(
        `unread_messages_nav_${currUserData && currUserData._id}`,
        () => {
          setMSGUnreadCount((prev) => prev + 1);
        }
      );

    socket &&
      currUserData &&
      socket.on(`new_notification_${currUserData && currUserData._id}`, () => {
        setUnreadNotiCount((prev) => prev + 1);
      });

    socket &&
      currUserData &&
      socket.on(
        `new_connection_request_${currUserData && currUserData._id}`,
        () => {
          setConnectionReqCount((prev) => prev + 1);
        }
      );
    return () => {
      if (socket) {
        socket.off(`new_notification_${currUserData && currUserData._id}`);
        socket.off(`unread_messages_nav_${currUserData && currUserData._id}`);
        socket.off(
          `new_connection_request_${currUserData && currUserData._id}`
        );
      }
    };
  }, [socket, currUserData && currUserData._id]);

  return (
    <div
      className={`flex justify-center z-20 bg-[#1B1F23] fixed  w-[100%] ${
        lightMode && " bg-white"
      }`}
    >
      <LoginDialog isLogin={isLogin} setIsLogin={setIsLogin} />
      <div
        className={` main-up h-[7vh]  text-white flex justify-center items-center  border-b-[1px] border-b-[rgb(186,186,186)]  w-[100%] ${
          lightMode && " text-black"
        }`}
      >
        <div className='up-header-wrapper flex justify-between w-[80%]'>
          <div className='logo-side flex justify-center ml-5 items-center'>
            <div className='flex justify-center items-center'>
              <LinkedInIcon
                className={` cursor-pointer ${lightMode && " text-blue-600"}`}
                fontSize='large'
              />
            </div>
            {/* <h2 className="text-3xl text-center "></h2> */}
          </div>
          <div className='menu-side flex space-x-1 mr-[170px]'>
            <div
              onClick={() => {
                setCurrMenu("home");
                setTimeout(() => {
                  navigate("/");
                }, 500);
              }}
              className={` ${
                currMenu === "home" ? "curr-menu-active" : ""
              } cursor-pointer main-menu-div  w-[100px]`}
            >
              <div className=' flex justify-center items-center'>
                <button>
                  {currMenu === "home" ? (
                    <HomeIcon
                      fontSize='medium'
                      className='text-[#6c6c6c] hover:text-[#e9e9e9]'
                    />
                  ) : (
                    <HomeIcon
                      fontSize='small'
                      className='text-[#6c6c6c] hover:text-[#e9e9e9]'
                    />
                  )}
                </button>
              </div>
              <div className=' flex justify-center mt-[-5px] items-center'>
                <p className=' text-[12px] text-[#abacad] hover:text-[#e9e9e9]'>
                  Home
                </p>
              </div>
            </div>
            <div
              onClick={() => {
                if (!isLogin) {
                  setLoginDialog(true);
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
              <div className=' flex justify-center items-center'>
                <button>
                  {currMenu !== "network" ? (
                    <Badge
                      badgeContent={connectionReqCount}
                      className={`${
                        connectionReqCount > 0 && " w-[25px] h-[15px]"
                      }`}
                      // style={{ width: "25px", height: "15px" }}
                      color='primary'
                    >
                      <PeopleIcon
                        fontSize='small'
                        className='text-[#6c6c6c] hover:text-[#000]'
                      />
                    </Badge>
                  ) : (
                    <PeopleIcon
                      fontSize='medium'
                      className='text-[#6c6c6c] hover:text-[#000]'
                    />
                  )}
                </button>
              </div>
              <div className=' flex justify-center mt-[-5px] items-center'>
                <p className=' text-[12px] text-[#6c6c6c] hover:text-[#000]'>
                  My Network
                </p>
              </div>
            </div>
            <div
              onClick={() => {
                if (!isLogin) {
                  setLoginDialog(true);
                  return;
                } else {
                  setCurrMenu("message");
                  setTimeout(() => {
                    navigate("/message");
                  }, 500);
                }
              }}
              className={` ${
                currMenu === "message" ? "curr-menu-active" : ""
              } cursor-pointer main-menu-div  w-[100px]`}
            >
              <div className=' flex justify-center items-center'>
                <button>
                  {currMenu !== "message" ? (
                    <Badge
                      badgeContent={unreadMSGCount}
                      className={`${
                        unreadMSGCount > 0 && " w-[25px] h-[15px]"
                      }`}
                      // style={{ width: "25px", height: "15px" }}
                      color='primary'
                    >
                      <ChatIcon
                        fontSize='small'
                        className='text-[#6c6c6c] hover:text-[#000]'
                      />
                    </Badge>
                  ) : (
                    <ChatIcon
                      fontSize='medium'
                      className='text-[#6c6c6c] hover:text-[#000]'
                    />
                  )}
                </button>
              </div>
              <div className=' flex justify-center mt-[-5px] items-center'>
                <p className=' text-[12px] text-[#6c6c6c] hover:text-[#000]'>
                  Messaging
                </p>
              </div>
            </div>
            <div
              onClick={() => {
                if (!isLogin) {
                  setLoginDialog(true);
                  return;
                } else {
                  setCurrMenu("notification");
                  setTimeout(() => {
                    navigate("/notification");
                  }, 500);
                }
              }}
              className={` ${
                currMenu === "notification" ? "curr-menu-active" : ""
              } cursor-pointer main-menu-div  w-[100px]`}
            >
              <div className=' flex justify-center items-center'>
                <button>
                  {currMenu !== "notification" ? (
                    <Badge
                      badgeContent={unreadNotiCount}
                      className={`${
                        unreadNotiCount > 0 && " w-[25px] h-[15px]"
                      }`}
                      // style={{ width: "25px", height: "15px" }}
                      color='primary'
                    >
                      <NotificationsActiveIcon
                        fontSize='small'
                        className='text-[#6c6c6c] hover:text-[#000]'
                      />
                    </Badge>
                  ) : (
                    <NotificationsActiveIcon
                      fontSize='medium'
                      className='text-[#6c6c6c] hover:text-[#000]'
                    />
                  )}
                </button>
              </div>
              <div className=' flex justify-center mt-[-5px] items-center'>
                <p className=' text-[12px] text-[#6c6c6c] hover:text-[#000]'>
                  Notifications
                </p>
              </div>
            </div>
            {isLogin && (
              <div
                onClick={() => {
                  if (!isLogin) {
                    setLoginDialog(true);
                    return;
                  } else {
                    setCurrMenu("profile");
                    setTimeout(() => {
                      navigate("/profile");
                    }, 500);
                  }
                }}
                className={` ${
                  currMenu === "profile" ? "curr-menu-active" : ""
                } cursor-pointer main-menu-div  w-[100px]`}
              >
                <div className=' flex justify-center items-center'>
                  <button>
                    {currMenu !== "profile" ? (
                      <AccountCircleIcon
                        fontSize='small'
                        className='text-[#6c6c6c] hover:text-[#000]'
                      />
                    ) : (
                      <AccountCircleIcon
                        fontSize='medium'
                        className='text-[#6c6c6c] hover:text-[#000]'
                      />
                    )}
                  </button>
                </div>
                <div className=' flex justify-center mt-[-5px] items-center'>
                  <p className=' text-[12px] text-[#6c6c6c] hover:text-[#000]'>
                    Me
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
