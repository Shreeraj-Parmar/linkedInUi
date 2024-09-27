import React, { useEffect, useLayoutEffect, useState } from "react";
import Navbar from "../../Navbar";
import { getMyFollowers } from "../../../../services/api.js";

const Connections = () => {
  const [connectionList, setConnectionList] = useState([]);

  const getAllConnectionsFunc = async () => {
    let res = await getMyFollowers("connections");
    console.log(res.data.list);
    setConnectionList(res.data.list);
  };

  useLayoutEffect(() => {
    getAllConnectionsFunc();
  }, []);
  return (
    <div className="main-overview w-[100vw] bg-black min-h-[100vh]">
      <div className="main-overview-wrapper max-w-[100vw]  overflow-x-hidden">
        <Navbar />
        <div className="main-display w-[80vw] min-h-[100vh] h-[90vh] border border-red-500  m-auto mt-[55px] p-4  ">
          <div className="main-down border p-1 border-blue-400 flex space-x-3 min-h-[100%]">
            <div className="w-[75%] h-[50vh] rounded-md bg-[#1B1F23] border p-2 border-green-300">
              <div>
                <p className="text-[#E9E9E9] p-2 font-semibold">
                  My Connections
                </p>
              </div>
              <div className="flex-row space-y-3 justify-center mt-2 items-center">
                {connectionList.length > 0 ? (
                  connectionList.map((user) => {
                    return (
                      <div
                        key={user._id}
                        className="bg-[#293138] m-auto flex items-center max-w-[100%]  w-[90%] p-2 min-h-[10%] rounded-md "
                      >
                        <div className="w-[] p-1 ">
                          <img
                            src={user.profilePicture || "/blank.png"}
                            alt="profile pic"
                            className="w-[70px] lg:min-w-[70px] border border-red-400 h-[70px] rounded-full  "
                          />
                        </div>
                        <div className=" flex-row lg:min-w-[200px] ml-2 space-y-[-3px]">
                          <p className="text-[#e8e8e8] hover:text-blue-500 hover:underline cursor-pointer">
                            {" "}
                            {user.name}
                          </p>
                          <p className="text-[#959799]"> {user.city}</p>
                          <p className="text-[#959799]">{user.gender}</p>
                        </div>
                        <div className="flex space-x-3 justify-end   p-2 lg:ml-[350px]">
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
                  <p className="text-[#bababa] p-2 font-semibold">
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
