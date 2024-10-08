import React, { useEffect, useState, useContext } from "react";

import { AllContext } from "../../context/UserContext";
import { getUserData } from "../../services/api.js";
import AddEducationDialog from "../Profile/AddEducationDialog.jsx";
import Navbar from "./Navbar.jsx";
import { useNavigate } from "react-router-dom";

const ViewProfile = () => {
  const { currUserData, setCurrUserData, isLogin, setCurrMenu } =
    useContext(AllContext);
  const [addEduDialog, setAddEduDialog] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.pathname === "/profile") {
      setCurrMenu("profile");
    }
    const getData = async () => {
      let res = await getUserData();
      console.log(res.data);
      setCurrUserData(res.data.user);
    };
    getData();
  }, [addEduDialog]);

  return (
    <div className="main-overview w-[100vw] bg-[#F4F2EE] h-auto">
      <div className="main-overview-wrapper   max-w-[100vw]  overflow-x-hidden">
        <AddEducationDialog
          addEduDialog={addEduDialog}
          setAddEduDialog={setAddEduDialog}
        />
        {/* Navbar Apper in All Social Routs */}
        <Navbar />

        <div className="main-display w-[80vw]   min-h-[100vh] h-fit flex justify-center   m-auto p-2  ">
          <div className="main-down mt-[60px] w-[95%]  min-h-[70%]">
            <div className="profile-wrapper-all bg-[#fff] border-2 shadow-sm border-gray-400 border-opacity-40 w-[65%] p-5 pl-10 rounded-md flex-row space-y-3  ">
              <div className="profil-pic">
                <img
                  src={
                    currUserData ? currUserData.profilePicture : "/upload.png"
                  }
                  className="min-w-[150px] border-2 
 border-gray-400 shadow-sm border-opacity-40 min-h-[150px]  rounded-full max-w-[150px] max-h-[150px] "
                  alt="profil pic"
                />
              </div>
              <div className="profil-details">
                <p className="text-[#000] text-2xl font-semibold hover:bg-[#c2c2c2] w-fit cursor-pointer rounded-md">
                  {currUserData ? currUserData.name : "Your Name"}
                </p>
                <p className="text-[#686868] text-sm">
                  {`${currUserData ? currUserData.city : ""}, ${
                    currUserData ? currUserData.state : ""
                  }, ${currUserData ? currUserData.country : ""}`}
                </p>
                <p className="text-[#686868] text-sm">
                  {currUserData ? currUserData.followers.length : ""} followers
                </p>
              </div>
            </div>
            {/* ADD EDU */}
            <div className=" bg-white w-[65%] mt-2 p-4 rounded-md border-2 border-gray-400 border-opacity-40">
              <div className=" ">
                <p className=" text-2xl text-[#56687A] font-semibold">
                  Education
                </p>
                <p>
                  Show your qualifications and be up to 2X more likely to
                  receive a recruiter InMail
                </p>
              </div>
              <div className=" mt-1 ">
                <button
                  onClick={() => {
                    setAddEduDialog(true);
                  }}
                  className=" p-2 pl-4 pr-4 font-semibold border-2 rounded-full border-[#0A66C4] text-[#0A66C4]  hover:border-[#004182] hover:text-[#004182]"
                >
                  Add education
                </button>
              </div>
            </div>
            <div
              className="profile-wrapper-all bg-[#fff] border-2 
 border-gray-400 border-opacity-40 mt-3 w-[65%] p-3 pl-10 rounded-md flex-row space-y-3  "
            >
              <p className="text-[#000] text-xl font-semibold">Education</p>
              {currUserData && currUserData.education[0] ? (
                currUserData.education.map((edu) => {
                  return (
                    <div
                      key={currUserData._id}
                      className="profile-edu bg-[#F4F2EE] p-2 pl-3 rounded-md w-[80%] flex  items-center"
                    >
                      <div>
                        <p className="text-[#000]">{edu.degree}</p>

                        <p className="text-[#686868] -mb-1 text-sm">
                          {edu.university}
                        </p>
                        <p className="text-[#686868] -mb-1 text-sm">{`${edu.startDate.year} - ${edu.endDate.year}`}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-[#000]">No Any Education Here</p>
              )}
            </div>
            <div>
              <div className="flex mt-2">
                <button
                  className="p-2 bg-[#71B7FB] hover:bg-[#369bff] border rounded-md text-black"
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
