import React, { useEffect, useState } from "react";
import { getUserDataAccSameCity } from "../../services/api.js";

const Suggest = ({ setLoginDialog, loginDialog, isLogin }) => {
  const [dataAccSameCity, setDataAccSameCity] = useState([]);
  useEffect(() => {
    const getData = async () => {
      let res = await getUserDataAccSameCity();
      console.log(res.data.dataAccCity);
      setDataAccSameCity(res.data.dataAccCity);
    };
    getData();
  }, [isLogin]);

  return (
    <div className="text-[#DBDBDC] bg-[#1B1F23] h-[60%] border border-red-300 max-h-[70%] rounded-md p-2 ">
      <p className="font-semibold">Near by Your Location</p>
      <div className="overflow-y-scroll max-h-[90%] rounded-md mt-2">
        {dataAccSameCity && dataAccSameCity[0] ? (
          dataAccSameCity.map((data) => {
            return (
              <div key={data._id} className="rounded-md bg-[#293138] m-1">
                <div className="suggested-wrapper w-[100%] flex items-center p-2 space-x-2">
                  <div className="sugg-profile-photo w-[30%]">
                    <img
                      src={data.profilePicture || "/blank.png"}
                      alt="profile pic"
                      className="w-[100%] rounded-full  h-[50px]"
                    />
                  </div>
                  <div className="commet-des  heading-post  w-[80%]   flex-row space-y-[-5px]">
                    <p className="text-[12px] hover:underline hover:text-blue-500 cursor-pointer">
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
          <div>Curruntly Data Not available please relogin</div>
        )}
      </div>
    </div>
  );
};

export default Suggest;
