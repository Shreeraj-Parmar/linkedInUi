import React, { useState, useContext } from "react";
import Navbar from "../../Navbar";
import Following from "./Following";
import Followers from "./Followers";
import { AllContext } from "../../../../context/UserContext";
import { useNavigate } from "react-router-dom";

const Connections = () => {
  const [f2Click, setF3Click] = useState("following");
  const navigate = useNavigate();

  const { setCurrMenu } = useContext(AllContext);

  return (
    <div className="main-overview w-[100vw] bg-[#F4F2EE] min-h-[100vh]">
      <div className="main-overview-wrapper max-w-[100vw]  overflow-x-hidden">
        <Navbar />
        <div className="main-display w-[80vw] min-h-[100vh] h-auto   m-auto mt-[55px] p-4  ">
          <div className="main-down p-1  flex space-x-3 min-h-[100%]">
            <div className="w-[65%] min-h-[50vh] h-auto rounded-md bg-[#fff] border-2 shadow-sm p-2 border-grey-400 border-opacity-40">
              <div className="p-2">
                <p className="text-black font-semibold">My Network</p>
              </div>
              <div className="divider"></div>
              {/* btn logic */}
              <div className="">
                <div className="flex  space-x-3">
                  <div
                    onClick={() => {
                      setF3Click("following");
                    }}
                    className={`p-2 ${
                      f2Click === "following"
                        ? "text-green-600 border-b-2 border-collapse border-b-green-600"
                        : "text-black"
                    }   cursor-pointer hover:bg-[#F4F2EE]`}
                  >
                    following
                  </div>
                  <div
                    onClick={() => {
                      setF3Click("followers");
                    }}
                    className={`p-2 ${
                      f2Click === "followers"
                        ? "text-green-600 border-b-2 border-collapse border-b-green-600"
                        : "text-black"
                    }   cursor-pointer hover:bg-[#F4F2EE]`}
                  >
                    followers
                  </div>
                </div>
                <div className="divider"></div>
              </div>
              <div className="flex-row justify-center mt-2 space-y-2  items-center">
                {/* logic of follow & following swapping components */}

                {f2Click === "following" && (
                  <Following navigate={navigate} setCurrMenu={setCurrMenu} />
                )}
                {f2Click === "followers" && (
                  <Followers setCurrMenu={setCurrMenu} navigate={navigate} />
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
