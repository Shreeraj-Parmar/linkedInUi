import React, { useEffect, useLayoutEffect, useState, useContext } from "react";
import Navbar from "../../Navbar";
import { getMyFollowers } from "../../../../services/api.js";
import { AllContext } from "../../../../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

const Connections = () => {
  const [connectionList, setConnectionList] = useState([]);
  const { setCurrMenu } = useContext(AllContext);
  const navigate = useNavigate();

  const getAllConnectionsFunc = async () => {
    let res = await getMyFollowers("connections");
    console.log(res.data.list);
    setConnectionList(res.data.list);
  };

  useLayoutEffect(() => {
    getAllConnectionsFunc();
  }, []);
  return (
    <div className="main-overview w-[100vw] bg-[#F4F2EE] min-h-[100vh]">
      <div className="main-overview-wrapper max-w-[100vw]  overflow-x-hidden">
        <Navbar />
        <div className="main-display w-[80vw] min-h-[100vh] h-[90vh]   m-auto mt-[55px] p-4  ">
          <div className="main-down  p-1 flex space-x-3 min-h-[100%]">
            <div className="w-[60%] h-[50vh] rounded-md bg-white border-2 border-gray-400 border-opacity-40 shadow-sm p-2 ">
              <div>
                <p className="text-black p-2 font-semibold">My Connections</p>
              </div>
              <div className="flex-row     mt-2 ">
                {connectionList && connectionList.length > 0 ? (
                  connectionList.map((user) => {
                    return (
                      <div
                        key={user._id}
                        className="bg-[#fff] border-b-2 border-gray-400 border-opacity-40  flex items-center max-w-[100%]  w-[100%] p-1 min-h-[10%] "
                      >
                        <div className="w-[] p-1 ">
                          <img
                            src={user.profilePicture || "/blank.png"}
                            alt="profile pic"
                            className="w-[70px] lg:min-w-[70px] border border-gray-400 border-opacity-40 h-[70px] rounded-full  "
                          />
                        </div>
                        <div className=" flex-row lg:min-w-[200px] ml-2 space-y-[-3px]">
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
                        <div className="flex space-x-3 justify-end   p-2 lg:ml-[250px]">
                          <div className="">
                            <button className="text-[#71B7ED] p-2 border-2 w-[100px] hover:border-3 hover:border-[#AAD6FF] hover:text-[#AAD6FF] rounded-full border-[#71B7ED]">
                              Message
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-[#000] p-2 font-semibold">
                    No Any Connections
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connections;
