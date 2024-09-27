import React, { useLayoutEffect, useState } from "react";
import Navbar from "../Navbar";
import {
  getCountOfConnections,
  getAllConnectionReq,
  updateConnectionReq,
} from "../../../services/api.js";

//icons
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BoyIcon from "@mui/icons-material/Boy";
import PageviewIcon from "@mui/icons-material/Pageview";
import { useNavigate } from "react-router-dom";

const MyNetwork = () => {
  const navigate = useNavigate();
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
    getConnectionReqFromBackend();
    connectionCountFunction();
  }, []);
  return (
    <div className="main-overview w-[100vw] bg-black min-h-[100vh]">
      <div className="main-overview-wrapper max-w-[100vw]  overflow-x-hidden">
        <Navbar />
        <div className="main-display w-[80vw] min-h-[100vh] h-[90vh] m-auto mt-[55px] p-4  ">
          <div className="main-down p-1 flex space-x-6 min-h-[100%]">
            <div className="w-1/4 h-[35vh]  rounded-md bg-[#1B1F23]">
              <div>
                <div className="p-3">
                  <p className="text-[#E9E9E9] font-semibold">
                    Manage My Network
                  </p>
                </div>
                <div className="divider"></div>
                <div>
                  <div
                    onClick={() => {
                      navigate("/my-network/connection");
                    }}
                    className="network-btn flex justify-between cursor-pointer w-[100%] p-3 hover:bg-[#2C2F33]"
                  >
                    <div className="flex space-x-5">
                      <PeopleAltIcon
                        fontSize="medium"
                        className="text-[#abacad] ml-2"
                      />
                      <p className="text-[#abacad]">Connections</p>
                    </div>
                    <div className="text-[#abacad]">{connectionCount}</div>
                  </div>
                  <div
                    onClick={() => {
                      navigate("/my-network/follow");
                    }}
                    className="network-btn flex justify-between cursor-pointer w-[100%] p-3 hover:bg-[#2C2F33]"
                  >
                    <div className="flex space-x-5">
                      <BoyIcon
                        fontSize="medium"
                        className="text-[#abacad] ml-2"
                      />
                      <p className="text-[#abacad]">Following & Followers</p>
                    </div>
                    <div className="text-[#abacad]"></div>
                  </div>
                  <div className="network-btn flex justify-between cursor-pointer w-[100%] p-3 hover:bg-[#2C2F33]">
                    <div className="flex space-x-5">
                      <PeopleAltIcon
                        fontSize="medium"
                        className="text-[#abacad] ml-2"
                      />
                      <p className="text-[#abacad]">Groups</p>
                    </div>
                    <div className="text-[#abacad]">2</div>
                  </div>
                  <div className="network-btn flex justify-between cursor-pointer w-[100%] p-3 hover:bg-[#2C2F33]">
                    <div className="flex space-x-5">
                      <PageviewIcon
                        fontSize="medium"
                        className="text-[#abacad] ml-2"
                      />
                      <p className="text-[#abacad]">Pages</p>
                    </div>
                    <div className="text-[#abacad]">7</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[70%] h-[50vh] rounded-md bg-[#1B1F23] p-2 ">
              <div>
                <p className="text-[#E9E9E9] font-semibold">
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
                        <div className="bg-[#293138] flex items-center max-w-[100%]  w-[90%] p-2 min-h-[10%] rounded-md ">
                          <div className="w-[] p-1 ">
                            <img
                              src={user.profilePicture || "/blank.png"}
                              alt=""
                              className="min-w-[70px] border border-red-400 h-[70px] rounded-full  "
                            />
                          </div>
                          <div className=" flex-row ml-3 lg:min-w-[200px]  space-y-[-3px]">
                            <p className="text-[#e8e8e8]"> {user.name}</p>
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
                                className="text-[#45c73c] p-2 border-2 w-[100px] hover:border-3 hover:border-[#72ff4f] hover:text-[#72ff4f] rounded-full border-[#45c73c]"
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
