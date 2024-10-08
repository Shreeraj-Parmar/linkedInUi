import React, { useEffect, useState } from "react";
import { getUserDataAccSameCity } from "../../services/api.js";
import { useNavigate } from "react-router-dom";

const Suggest = ({
  setLoginDialog,
  loginDialog,
  isLogin,
  lightMode,
  setCurrMenu,
}) => {
  const [dataAccSameCity, setDataAccSameCity] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getData = async () => {
      let res = await getUserDataAccSameCity();
      console.log(res.data.dataAccCity);
      setDataAccSameCity(res.data.dataAccCity);
    };
    getData();
  }, [isLogin]);

  return (
    <div
      className={`text-[#DBDBDC] bg-[#1B1F23] h-[60%]  max-h-[70%] rounded-md p-3 ${
        lightMode &&
        " bg-white border-2 border-gray-400 border-opacity-40 text-black"
      }`}
    >
      <p className="font-semibold">Near by Your Location</p>
      <div className="overflow-y-scroll max-h-[90%] rounded-md mt-2">
        {dataAccSameCity && dataAccSameCity[0] ? (
          dataAccSameCity.map((data) => {
            return (
              <div
                key={data._id}
                className={`rounded-md bg-[#293138] m-1 ${
                  lightMode &&
                  " bg-[#F4F2EE] border border-gray-50 border-opacity-40"
                }`}
              >
                <div className="suggested-wrapper w-[100%] flex items-center p-2 space-x-2">
                  <div className="sugg-profile-photo w-[30%]">
                    <img
                      src={data.profilePicture || "/blank.png"}
                      alt="profile pic"
                      className="w-[100%] rounded-full  h-[50px]"
                    />
                  </div>
                  <div className="commet-des  heading-post  w-[80%]   flex-row space-y-[-5px]">
                    <p
                      onClick={() => {
                        setCurrMenu("");
                        setTimeout(() => {
                          navigate(`/user/${data._id}`);
                        }, 500);
                      }}
                      className="text-[12px] hover:underline hover:text-blue-500 cursor-pointer"
                    >
                      {data.name}
                    </p>
                    <p className=" text-[#959799] text-sm">
                      {data.city.toLowerCase()}
                    </p>
                    <p className="text-[#959799] text-sm">{data.gender}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-2">
            <div>
              <img src={"/login.jpg"} alt="" className=" shadow-sm" />
            </div>

            <p className=" text-center">
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
