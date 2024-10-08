import React, { useLayoutEffect, useState, useContext } from "react";
import { AllContext } from "../../../context/UserContext.jsx";
import Navbar from "../Navbar";
import {
  getCountOfConnections,
  getAllConnectionReq,
  updateConnectionReq,
} from "../../../services/api.js";

//icons
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { toast } from "react-toastify";

import BoyIcon from "@mui/icons-material/Boy";
import PageviewIcon from "@mui/icons-material/Pageview";
import { useNavigate } from "react-router-dom";
import Tostify from "../../Tostify.jsx";

const MyNetwork = () => {
  const navigate = useNavigate();
  const { setCurrMenu } = useContext(AllContext);
  const [connectionCount, setConnectionCount] = useState(null);
  const [connectionReq, setConnectionReq] = useState([]);

  const getConnectionReqFromBackend = async () => {
    let res = await getAllConnectionReq();
    // console.log(res.data);
    console.log("all connection re  q is", res.data);
    if (res.status === 200) {
      setConnectionReq(res.data.connectionRequests);
    }
  };
  const handleConnectionReq = async (data) => {
    let res = await updateConnectionReq(data);
    // console.log(res.data);
    if (res.status === 200) {
      console.log(res.data.message);
    } else {
      toast.error(`Error While send Connnection Req please try again !`, {
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

  useLayoutEffect(() => {
    if (window.location.pathname === "/my-network") {
      setCurrMenu("network");
    }
    getConnectionReqFromBackend();
    connectionCountFunction();
  }, []);
  return (
    <div className="main-overview w-[100vw] bg-[#F4F2EE] min-h-[100vh]">
      <div className="main-overview-wrapper max-w-[100vw]  overflow-x-hidden">
        <Navbar />
        <Tostify />
        <div className="main-display w-[80vw] min-h-[100vh] h-[90vh] m-auto mt-[55px] p-4  ">
          <div className="main-down p-1 flex space-x-6 min-h-[100%]">
            <div className="w-1/4 h-[35vh]  rounded-md bg-white border-2 shadow-sm border-gray-400 border-opacity-40">
              <div>
                <div className="p-3">
                  <p className="text-black font-semibold">Manage My Network</p>
                </div>
                <div className="divider"></div>
                <div>
                  <div
                    onClick={() => {
                      setTimeout(() => {
                        navigate("/my-network/connection");
                      }, 500);
                    }}
                    className="network-btn flex justify-between cursor-pointer w-[100%] p-3 hover:bg-[#F3F3F3]"
                  >
                    <div className="flex space-x-5">
                      <PeopleAltIcon
                        fontSize="medium"
                        className="text-[#444444] ml-2"
                      />
                      <p className="text-[#444444]">Connections</p>
                    </div>
                    <div className="text-[#444444]">{connectionCount}</div>
                  </div>
                  <div
                    onClick={() => {
                      setTimeout(() => {
                        navigate("/my-network/follow");
                      }, 500);
                    }}
                    className="network-btn flex justify-between cursor-pointer w-[100%] p-3 hover:bg-[#F3F3F3]"
                  >
                    <div className="flex space-x-5">
                      <BoyIcon
                        fontSize="medium"
                        className="text-[#444444] ml-2"
                      />
                      <p className="text-[#444444]">Following & Followers</p>
                    </div>
                    <div className="text-[#444444]"></div>
                  </div>
                  <div className="network-btn flex justify-between cursor-pointer w-[100%] p-3 hover:bg-[#F3F3F3]">
                    <div className="flex space-x-5">
                      <PeopleAltIcon
                        fontSize="medium"
                        className="text-[#444444] ml-2"
                      />
                      <p className="text-[#444444]">Groups</p>
                    </div>
                    <div className="text-[#444444]">2</div>
                  </div>
                  <div className="network-btn flex justify-between cursor-pointer w-[100%] p-3 hover:bg-[#F3F3F3]">
                    <div className="flex space-x-5">
                      <PageviewIcon
                        fontSize="medium"
                        className="text-[#444444] ml-2"
                      />
                      <p className="text-[#444444]">Pages</p>
                    </div>
                    <div className="text-[#444444]">7</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[70%] h-[50vh] rounded-md bg-white border-2 shadow-sm border-gray-400 border-opacity-40 p-2 ">
              <div>
                <p className="text-black font-semibold ml-2">
                  {connectionReq[0]
                    ? "Pending Invitations"
                    : " No Pending Invitations"}
                </p>
              </div>
              {connectionReq[0]
                ? connectionReq.map((user) => {
                    return (
                      <div
                        key={user._id}
                        className="flex justify-center mt-2 items-center"
                      >
                        <div className="bg-[#F4F2EE] border-2 border-gray-400 border-opacity-40  flex items-center max-w-[100%]  w-[90%] p-2 min-h-[10%] rounded-md ">
                          <div className="w-[] p-1 ">
                            <img
                              src={user.profilePicture || "/blank.png"}
                              alt=""
                              className="min-w-[70px] border border-grey-400 border-opacity-40 h-[70px] rounded-full  "
                            />
                          </div>
                          <div className=" flex-row ml-3 lg:min-w-[200px]  space-y-[-3px]">
                            <p
                              onClick={() => {
                                setCurrMenu("");
                                setTimeout(() => {
                                  navigate(`/user/${user._id}`);
                                }, 500);
                              }}
                              className="text-[#000] hover:text-blue-500 hover:underline cursor-pointer"
                            >
                              {" "}
                              {user.name}
                            </p>
                            <p className="text-[#959799]"> {user.city}</p>
                            <p className="text-[#959799]">{user.gender}</p>
                          </div>
                          <div className="flex space-x-3 justify-end   p-2 lg:ml-[200px]">
                            <div className="">
                              <button
                                onClick={() => {
                                  handleConnectionReq({
                                    receiverId: user._id,
                                    reqStatus: true,
                                  });
                                }}
                                className="text-[#45c73c] p-2 border-2 w-[100px] hover:border-3 hover:border-[#4fff23] hover:text-[#72ff4f] rounded-full border-[#45c73c]"
                              >
                                Accept
                              </button>
                            </div>
                            <div className="">
                              <button
                                onClick={() => {
                                  handleConnectionReq({
                                    receiverId: user._id,
                                    reqStatus: false,
                                  });
                                }}
                                className="text-[#ff573d] p-2 border-2 w-[100px] hover:border-3 hover:border-[#ff8d8d] hover:text-[#ff8d8d] rounded-full border-[#ff573d]"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyNetwork;
