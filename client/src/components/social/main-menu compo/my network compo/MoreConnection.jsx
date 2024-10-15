import React, { useState, useEffect } from "react";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { fatchAllUsersWhichNotConnected } from "../../../../services/api.js";
import ConnectionWithdrawDialog from "./ConnectionWithdrawDialog";
import { useNavigate } from "react-router-dom";

const MoreConnection = ({ connectionReqLength }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [userConnectBtns, setUserConnectBtns] = useState({});
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const limit = 12;

  useEffect(() => {
    fatchAllUsers(page, limit);
  }, [page]);

  const fatchAllUsers = async (page, limit) => {
    let res = await fatchAllUsersWhichNotConnected(page, limit);
    if (res.status === 200) {
      setAllUsers((prevUsers) => [...prevUsers, ...res.data.allUsers]);
      console.log(res.data.allUsers);

      let newbtns = res.data.allUsers.map((user) => {
        return { [user._id]: false };
      });
      console.log("new bts of connect and pending is", newbtns);
      setUserConnectBtns((prevUserConnectBtns) => ({
        ...prevUserConnectBtns,
        ...newbtns,
      }));
      if (res.data.length < limit) {
        setHasMore(false);
      }
    }
  };

  const handleBtnClick = async (data) => {
    setUserConnectBtns((prevUserConnectBtns) => ({
      ...prevUserConnectBtns,
      [data]: true,
    }));
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
      setPage((prevPage) => prevPage + 1); // Move to the next page
    }
  };

  return (
    <div
      className={` flex justify-end   relative ${
        connectionReqLength > 0 ? "" : "top-[-200px]"
      } right-[50px] mt-2`}
    >
      <ConnectionWithdrawDialog
        setIsWithdrawDialogOpen={setIsWithdrawDialogOpen}
        isWithdrawDialogOpen={isWithdrawDialogOpen}
      />
      <div
        onScroll={handleScroll}
        className='border-2 border-opacity-40 border-gray-400 overflow-auto bg-[#fff] rounded-md  min-h-[80vh] max-h-[80vh]  max-w-[64.5%]'
      >
        <p className=' text-md p-2 pl-4'>Connect more people</p>
        <div className='  pl-3 pr-3 pb-3 flex flex-wrap relative left-3 items-center gap-3'>
          {allUsers &&
            allUsers.map((user, index) => (
              <div
                key={index}
                className='flex justify-center min-h-[250px] border border-gray-400 border-opacity-40 rounded-md shadow-sm items-center w-[23%]'
              >
                <div className='w-[100%]'>
                  <div className=' flex justify-center'>
                    <img
                      src={
                        (user && user.profilePicture && user.profilePicture) ||
                        "/blank.png"
                      }
                      alt='image'
                      className=' min-h-[120px] shadow-sm  h-[120px] max-w-[120px] border border-gray-400 
                               border-opacity-20 rounded-full min-w-[100px]'
                    />
                  </div>
                  <p
                    onClick={() =>
                      setTimeout(() => {
                        navigate(`/user/${user._id}`);
                      }, 500)
                    }
                    className=' text-center text-md hover:underline cursor-pointer font-semibold'
                  >
                    {user.name}
                  </p>
                  <p className=' text-center text-sm text-[#959799]'>
                    {user.city}
                  </p>
                  <div className=' w-[100%] relative top-4 flex justify-center'>
                    {userConnectBtns[user._id] ? (
                      <button
                        onClick={() => {
                          setIsWithdrawDialogOpen(true);
                        }}
                        className='p-1 border-2 border-[#444444] text-[#444444] hover:border-[#1a1a1a] hover:text-[#1a1a1a] rounded-full min-w-[85%] hover:bg-[#F3F3F3] flex justify-center items-center space-x-1'
                      >
                        <AccessTimeIcon fontSize='medium' />
                        <p className='text-md'>Pending</p>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleBtnClick(user._id);
                        }}
                        className='p-1 border-2 border-[#0A66C2] text-[#0A66C2] hover:border-[#004182] hover:text-[#004182] rounded-full min-w-[85%] hover:bg-[#EBF4FD] flex justify-center items-center space-x-1'
                      >
                        <PersonAddAltIcon fontSize='medium' />
                        <p className='text-md'>Connect</p>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MoreConnection;
