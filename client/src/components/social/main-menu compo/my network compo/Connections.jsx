import React, { useEffect, useLayoutEffect, useState, useContext } from "react";
import Navbar from "../../Navbar";
import { getMyFollowers } from "../../../../services/api.js";
import { AllContext } from "../../../../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { toast } from "react-toastify";
import Tostify from "../../../Tostify.jsx";

const Connections = () => {
  const [connectionList, setConnectionList] = useState([]);
  const { setCurrMenu, isLogin } = useContext(AllContext);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMoreConnections] = useState(true);
  const navigate = useNavigate();

  const getAllConnectionsFunc = async () => {
    if (!hasMore) return; // Exit if no more connections to load

    let res = await getMyFollowers("connections", page); // Pass page to the function

    if (res && res.status === 200) {
      const connections = res.data.list;
      setConnectionList((prev) => [...prev, ...connections]); // Append new connections

      // Check if there are more connections to load
      if (connections.length < 10) {
        // Assuming 10 is the limit
        setHasMoreConnections(false);
      }
    } else {
      toast.error(`Error While Fetching Your Connections, refresh it!`, {
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
  };
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
      // If user is near the bottom of the list, load more notifications
      setPage((prevPage) => prevPage + 1); // Move to the next page
    }
  };

  useLayoutEffect(() => {
    if (window.location.pathname === "/my-network/connection") {
      setCurrMenu("network");
    }
    getAllConnectionsFunc();
  }, []);
  return (
    <div className='main-overview w-[100vw] bg-[#F4F2EE] min-h-[100vh]'>
      <div className='main-overview-wrapper max-w-[100vw]  overflow-x-hidden'>
        <Navbar />
        <Tostify />
        <div className='main-display w-[80vw] min-h-[100vh] h-[90vh]   m-auto mt-[55px] p-4  '>
          <div className='main-down  p-1 flex space-x-3 min-h-[100%]'>
            <div className='w-[60%] h-[80vh] rounded-md bg-white border-2 border-gray-400 border-opacity-40 shadow-sm p-2 '>
              <div>
                <p className='text-black p-2 font-semibold'>My Connections</p>
              </div>
              <div
                onScroll={handleScroll}
                className='flex-row  overflow-y-auto max-h-[70vh]   mt-2 '
              >
                {connectionList && connectionList.length > 0 ? (
                  connectionList.map((user) => {
                    return (
                      <div
                        key={user._id}
                        className='bg-[#fff] border-b-2 border-gray-400 border-opacity-40  flex items-center max-w-[100%]  w-[100%] p-1 min-h-[10%] '
                      >
                        <div className='w-[] p-1 '>
                          <img
                            src={user.profilePicture || "/blank.png"}
                            alt='profile pic'
                            className='w-[70px] lg:min-w-[70px] border border-gray-400 border-opacity-40 h-[70px] rounded-full  '
                          />
                        </div>
                        <div className=' flex-row lg:min-w-[200px] ml-2 space-y-[-3px]'>
                          <p
                            onClick={() => {
                              setCurrMenu("");
                              setTimeout(() => {
                                navigate(`/user/${user._id}`);
                              }, 500);
                            }}
                            className='text-[#000] hover:text-blue-500 hover:underline cursor-pointer'
                          >
                            {" "}
                            {user.name}
                          </p>
                          <p className='text-[#959799]'> {user.city}</p>
                          <p className='text-[#959799]'>{user.gender}</p>
                        </div>
                        <div className='flex space-x-3 justify-end   p-2 lg:ml-[250px]'>
                          <div className=''>
                            <button className='text-[#71B7ED] p-2 border-2 w-[100px] hover:border-3 hover:border-[#AAD6FF] hover:text-[#AAD6FF] rounded-full border-[#71B7ED]'>
                              Message
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className=' p-4'>
                    <div className=' flex justify-center items-center'>
                      <img
                        src='/no-follow.jpg'
                        alt=''
                        className='w-[400px] h-[400px]'
                      />
                    </div>
                    <p className=' text-center'>Not Any Connection</p>
                  </div>
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
