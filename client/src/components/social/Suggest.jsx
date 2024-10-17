import React, { useEffect, useState } from "react";
import { getUserDataAccSameCity } from "../../services/api.js";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";

const Suggest = ({
  setLoginDialog,
  loginDialog,
  isLogin,
  lightMode,
  setCurrMenu,
}) => {
  const [dataAccSameCity, setDataAccSameCity] = useState([]);
  const [suggSkeleton, setSuggSkeleton] = useState(true);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 7;

  const getData = async (page, limit) => {
    let res = await getUserDataAccSameCity(page, limit);
    console.log("data acc city", res.data.dataAccCity);
    if (res.data.dataAccCity.length < limit) {
      setHasMore(false); // No more data if the number of items fetched is less than the limit
    }
    setDataAccSameCity((prevData) => [...prevData, ...res.data.dataAccCity]); // Append new data
  };

  useEffect(() => {
    setTimeout(() => {
      // Hide skeleton after fetching data
      setSuggSkeleton(false);
    }, 2000);
    if (isLogin) {
      getData(page, limit); // Fetch initial data when the component mounts
    }
  }, [isLogin]);

  useEffect(() => {
    if (page > 1) {
      getData(page, limit);
    }
  }, [page]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
      // If user is near the bottom of the list, load more notifications
      setPage((prevPage) => prevPage + 1); // Move to the next page
    }
  };

  return (
    <div
      className={`text-[#DBDBDC] bg-[#1B1F23] h-[60%]  max-h-[70%] rounded-md p-3 ${
        lightMode &&
        " bg-white border-2 border-gray-400 border-opacity-40 text-black"
      }`}
    >
      <p className='font-semibold'>Near by Your Location</p>
      <div
        onScroll={handleScroll}
        className='overflow-auto max-h-[90%] rounded-md mt-2'
      >
        {suggSkeleton &&
          Array(7)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className='suggested-wrapper w-[100%] flex items-center p-2 space-x-2'
              >
                <div className='sugg-profile-photo w-[30%]'>
                  <Skeleton
                    variant='rectangular'
                    width='50px'
                    height='50px'
                    className='rounded-full'
                  />
                </div>
                <div className='commet-des  heading-post  w-[80%]   flex-row '>
                  <Skeleton
                    variant='rectangular'
                    width='80%'
                    height='10px'
                    className='rounded-md mb-1'
                  />
                  <Skeleton
                    variant='rectangular'
                    width='30%'
                    height='10px'
                    className='rounded-md mb-1'
                  />
                </div>
              </div>
            ))}

        {dataAccSameCity && !suggSkeleton && dataAccSameCity[0]
          ? dataAccSameCity.map((data, index) => {
              return (
                <div
                  key={data._id ? data._id : `${data._id}_${index}`}
                  className={`rounded-md bg-[#293138] m-1 mr-2 ${
                    lightMode &&
                    " bg-[#F4F2EE] border border-gray-50 border-opacity-40"
                  }`}
                >
                  <div className='suggested-wrapper w-[100%] flex items-center p-1 space-x-3'>
                    <div className='sugg-profile-photo w-[30%]'>
                      <img
                        src={data.profilePicture || "/blank.png"}
                        alt='profile pic'
                        className='rounded-full border border-gray-400 border-opacity-40 min-w-[55px] max-w-[55px] min-h-[55px] max-h-[55px]'
                      />
                    </div>
                    <div className='commet-des  heading-post  w-[80%]   flex-row space-y-[-5px]'>
                      <p
                        onClick={() => {
                          setCurrMenu("");
                          setTimeout(() => {
                            navigate(`/user/${data._id}`);
                          }, 500);
                        }}
                        className='text-[12px] hover:underline hover:text-blue-500 cursor-pointer'
                      >
                        {data.name}
                      </p>
                      <p className=' text-[#959799] text-sm'>
                        {data.city.toLowerCase()}
                      </p>
                      <p className='text-[#959799] text-sm'>{data.gender}</p>
                    </div>
                  </div>
                </div>
              );
            })
          : !suggSkeleton && (
              <div className='p-2'>
                <div>
                  <img src={"/login.jpg"} alt='' className=' shadow-sm' />
                </div>

                <p className=' text-center'>
                  {isLogin
                    ? "No Any Users Near Your Loacation Please Follow More To Connect Together"
                    : "Please Login To See Users Whose Around You"}
                </p>
              </div>
            )}
      </div>
    </div>
  );
};

export default Suggest;
