import React, { useLayoutEffect, useState, useContext } from "react";
import { AllContext } from "../../../context/UserContext.jsx";
import Navbar from "../Navbar";
import {
  getCountOfConnections,
  getAllConnectionReq,
  updateConnectionReq,
  markAsReadConn,
  sendNotification,
} from "../../../services/api.js";

// icons
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import { toast } from "react-toastify";
import BoyIcon from "@mui/icons-material/Boy";
import PageviewIcon from "@mui/icons-material/Pageview";
import { useNavigate } from "react-router-dom";
import Tostify from "../../Tostify.jsx";
import MoreConnection from "./my network compo/MoreConnection.jsx";

const MyNetwork = () => {
  const navigate = useNavigate();
  const { setCurrMenu, currUserData } = useContext(AllContext);
  const [connectionCount, setConnectionCount] = useState(null);
  const [connectionReq, setConnectionReq] = useState([]);

  const getConnectionReqFromBackend = async () => {
    let res = await getAllConnectionReq();
    console.log("All connection requests:", res.data);
    if (res.status === 200) {
      setConnectionReq(res.data.connectionRequests);
    }
  };

  const handleConnectionReq = async (data) => {
    let res = await updateConnectionReq(data);
    if (res.status === 200) {
      console.log(res.data.message);
      let newConnectionReq = connectionReq.filter(
        (item) => item.user._id !== data.receiverId
      );
      setConnectionReq(newConnectionReq);
      console.log("new connection req", newConnectionReq);

      currUserData &&
        (await sendNotification({
          recipient: data.receiverId,
          sender: currUserData._id,
          type: "connection_accepted",
          message: "your connection request has been accepted",
        }));
    } else if (res.status === 201) {
      let newConnectionReq = connectionReq.filter(
        (item) => item.user._id !== data.receiverId
      );
      setConnectionReq(newConnectionReq);
      console.log("new connection req", newConnectionReq);

      currUserData &&
        (await sendNotification({
          recipient: data.receiverId,

          sender: currUserData._id,
          type: "connection_rejected",
          message: "your connection request has been rejected",
        }));
    } else {
      toast.error("Error while sending connection request. Please try again!", {
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
    getConnectionReqFromBackend();
    connectionCountFunction();
  };

  const connectionCountFunction = async () => {
    let res = await getCountOfConnections();
    console.log(res.data);
    setConnectionCount(res.data);
  };

  const markAsReadConnectionReqFunction = async () => {
    let res = await markAsReadConn();
    if (res.status === 200) {
      console.log(res.data.message);
    }
  };

  useLayoutEffect(() => {
    markAsReadConnectionReqFunction();
    if (window.location.pathname === "/my-network") {
      setCurrMenu("network");
    }
    getConnectionReqFromBackend();
    connectionCountFunction();
  }, []);

  return (
    <div className='main-overview w-[100vw] bg-[#F4F2EE] min-h-[100vh]'>
      <div className='main-overview-wrapper max-w-[100vw] overflow-x-hidden'>
        <Navbar />
        <Tostify />
        <div className='main-display w-[80vw] min-h-[100vh] h-[90vh] m-auto mt-[55px] p-4'>
          <div className='main-down p-1 flex justify-center space-x-3 min-h-fit'>
            <div className='w-1/4 h-[35vh] rounded-md bg-white border-2 shadow-sm border-gray-400 border-opacity-40'>
              <div className='z-30 '>
                <div className='p-3 border-b-2 border-gray-400 border-opacity-40 '>
                  <p className='text-black font-semibold '>Manage my network</p>
                </div>

                <div className='min-h-[100%] min-w-2'>
                  <div
                    onClick={() => {
                      setTimeout(() => {
                        navigate("/my-network/connection");
                      }, 500);
                    }}
                    className='network-btn flex justify-between cursor-pointer w-[100%] p-3 hover:bg-[#F3F3F3]'
                  >
                    <div className='flex space-x-5'>
                      <PeopleAltIcon
                        fontSize='medium'
                        className='text-[#444444] ml-2'
                      />
                      <p className='text-[#444444]'>Connections</p>
                    </div>
                    <div className='text-[#444444]'>{connectionCount}</div>
                  </div>
                  <div
                    onClick={() => {
                      setTimeout(() => {
                        navigate("/my-network/follow");
                      }, 500);
                    }}
                    className='network-btn flex justify-between cursor-pointer w-[100%] p-3 hover:bg-[#F3F3F3]'
                  >
                    <div className='flex space-x-5'>
                      <BoyIcon
                        fontSize='medium'
                        className='text-[#444444] ml-2'
                      />
                      <p className='text-[#444444]'>Following & Followers</p>
                    </div>
                    <div className='text-[#444444]'></div>
                  </div>
                  <div className='network-btn flex justify-between cursor-pointer w-[100%] p-3 hover:bg-[#F3F3F3]'>
                    <div className='flex space-x-5'>
                      <PeopleAltIcon
                        fontSize='medium'
                        className='text-[#444444] ml-2'
                      />
                      <p className='text-[#444444]'>Groups</p>
                    </div>
                    <div className='text-[#444444]'>2</div>
                  </div>
                  <div className='network-btn flex justify-between cursor-pointer w-[100%] p-3 hover:bg-[#F3F3F3]'>
                    <div className='flex space-x-5'>
                      <PageviewIcon
                        fontSize='medium'
                        className='text-[#444444] ml-2'
                      />
                      <p className='text-[#444444]'>Pages</p>
                    </div>
                    <div className='text-[#444444]'>7</div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`w-[65%] h-[35vh] min-h-[35vh] rounded-md bg-white border-2 ${
                connectionReq.length > 2 ? "border-b-0" : ""
              }  border-collapse border-gray-400 border-opacity-40 `}
            >
              <div
                className={`  p-3   ${
                  connectionReq.length > 0
                    ? "border-b-2 border-gray-400 border-opacity-40"
                    : ""
                } `}
              >
                <p className='text-black text-md ml-2'>
                  {connectionReq.length > 0
                    ? "Pending Invitations"
                    : "No pending invitations"}
                </p>
              </div>
              {connectionReq.length === 0 && (
                <>
                  <div className='flex justify-center items-center'>
                    <img
                      src='/no-data.jpg'
                      alt=''
                      className='h-[150px] w-[150px]'
                    />
                  </div>
                  <p className='text-[#444444] text-center'>
                    No Pending Invitations
                  </p>
                </>
              )}

              {connectionReq.map((request) => {
                const user = request.user; // Access the user object from the request
                return (
                  <div
                    key={user && user._id && user._id}
                    className='flex justify-center w-[100%]  items-center'
                  >
                    <div className='bg-[#fff] hover:bg-[#F3F3F3] border-b-2 border-gray-400 border-opacity-40 flex items-center max-w-[100%] w-[100%] pl-2 '>
                      <div className='p-1'>
                        <img
                          src={
                            user && user.profilePicture
                              ? user.profilePicture
                              : "/blank.png"
                          }
                          alt=''
                          className='min-w-[70px] border border-grey-400 border-opacity-40 h-[70px] rounded-full'
                        />
                      </div>
                      <div className='flex-row ml-3 lg:min-w-[200px] space-y-[-3px]'>
                        <p
                          onClick={() => {
                            setCurrMenu("");
                            setTimeout(() => {
                              navigate(`/user/${user && user._id && user._id}`);
                            }, 500);
                          }}
                          className='text-[#000] hover:text-blue-500 hover:underline cursor-pointer'
                        >
                          {user && user.name ? user.name : "Anonymous"}
                        </p>
                        <p className='text-[#959799]'>
                          {user && user.city ? user.city : "Unknown"}
                        </p>
                        <p className='text-[#959799]'>
                          {user && user.gender ? user.gender : "Unknown"}
                        </p>
                      </div>
                      <div className='flex space-x-3 justify-end p-2 lg:ml-[200px]'>
                        <button
                          onClick={() => {
                            handleConnectionReq({
                              receiverId: user && user._id && user._id,
                              reqStatus: true,
                            });
                          }}
                          className='text-[#45c73c] p-2 border-2 w-[100px] hover:border-3 hover:border-[#4fff23] hover:text-[#72ff4f] rounded-full border-[#45c73c]'
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            handleConnectionReq({
                              receiverId: user && user._id && user._id,
                              reqStatus: false,
                            });
                          }}
                          className='text-[#ff573d] p-2 border-2 w-[100px] hover:border-3 hover:border-[#ff8d8d] hover:text-[#ff8d8d] rounded-full border-[#ff573d]'
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* here more user connection */}
          </div>
          {currUserData && (
            <MoreConnection
              connectionReqLength={connectionReq.length}
              user_id={currUserData._id}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyNetwork;
