import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AllContext } from "../../../../context/UserContext.jsx";
import Navbar from "../../Navbar";
import {
  getCompanyDataWithoutAuth,
  sendFollowReq,
} from "../../../../services/api.js";
import About from "./menu/view-company/About";
import Jobs from "./menu/view-company/Jobs";
import Posts from "./menu/view-company/Posts";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EditCompany from "./Edit/EditCompany.jsx";

const ViewCompany = () => {
  const companyId = useParams();
  const { currUserData, actAs, setActAs } = useContext(AllContext);
  console.log("companyId Inside ViewCompany", companyId);
  const navigate = useNavigate();
  const [companyDetails, setCompanyDetails] = useState({});
  const [allPost, setAllPost] = useState([]);
  const [followStatus, setFollowStatus] = useState({});
  const [menu, setMenu] = useState("posts");
  const [editCompanyDialog, setEditCompanyDialog] = useState(false);

  const getCompanyDataFunc = async () => {
    let res = await getCompanyDataWithoutAuth(companyId && companyId.companyId);
    if (res.status === 200) {
      console.log("this company data is", res.data);
      setCompanyDetails(res.data.allData);

      let follow = {};
      res.data.allData.followers.map((follower) => {
        follow[follower._id] = true;
      });
      setFollowStatus(follow);
    } else if (res.status === 204) {
      console.log("you are not admin of that company");
      navigate("/profile");
      return;
    } else {
      console.log("somthing error");
    }
  };

  // useEffect(() => {
  //   console.log("user arr", companyDetails);
  // }, [companyDetails]);

  useEffect(() => {
    setActAs({ type: "user", id: currUserData?._id });

    console.log("companyId;:", companyId);
    getCompanyDataFunc();
  }, []);

  return (
    <div className='main-overview w-[100vw] bg-[#F4F2EE] min-h-[100vh]'>
      <div className='main-overview-wrapper max-w-[100vw] overflow-x-hidden'>
        <Navbar />
        <div className='main-display w-[80vw]  min-h-[100vh] h-[90vh] m-auto mt-[55px] p-4'>
          <div className='border-2 w-[60%] relative bg-www min-h-[400px]  rounded-md border-gray-400 border-opacity-40'>
            {currUserData &&
              currUserData.company &&
              currUserData.company.length > 0 &&
              currUserData.company.some(
                (company) => company._id === companyId.companyId
              ) && (
                <div className='absolute top-3 right-[10px]'>
                  <IconButton
                    onClick={() => {
                      setEditCompanyDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <EditCompany
                    setEditCompanyDialog={setEditCompanyDialog}
                    setCompanyDetails={setCompanyDetails}
                    companyDetails={companyDetails}
                    editCompanyDialog={editCompanyDialog}
                  />
                </div>
              )}
            <div className='pl-4 pt-4'>
              <img
                src={
                  (companyDetails &&
                    companyDetails.profilePicture &&
                    companyDetails.profilePicture) ||
                  "/blank.png"
                }
                className='min-w-[140px] max-w-[140px] min-h-[140px] max-h-[140px] rounded-md shadow-sm border-2 border-gray-400 border-opacity-40'
                alt=''
              />
            </div>
            <div className='mt-2 pl-4'>
              <p className='text-2xl font-semibold'>
                {companyDetails && companyDetails.name}
              </p>
              <p className='text-xl '>
                {(companyDetails &&
                  companyDetails.heading &&
                  companyDetails.heading) ||
                  ""}
              </p>
              <p className='text- text-[#8e8e8e] '>
                {companyDetails && companyDetails.industry}
                {",  "}
                {companyDetails && companyDetails.city},
                {companyDetails && companyDetails.State}{" "}
                {companyDetails && companyDetails.followers?.length}
                {" Followers, "}
                {companyDetails && companyDetails.companySize}
              </p>
            </div>
            <div className='mt-4 pl-4 flex items-center space-x-4'>
              <button className='bg-[#0a66c2] text-white font-semibold py-2 px-4 rounded-full hover:bg-[#0e5485] active:bg-[#0a66c2] active:transform active:translate-y-px'>
                Message
              </button>
              <button
                onClick={async () => {
                  let res = await sendFollowReq({
                    receiverId: companyId && companyId.companyId,
                    receverType: "Company",
                    senderId: actAs && actAs.id,
                    senderType:
                      actAs && actAs.type === "company" ? "Company" : "User",
                  });
                  if (res.status === 200) {
                    setFollowStatus({
                      ...followStatus,
                      [actAs && actAs.id]: followStatus[actAs && actAs.id]
                        ? !followStatus[actAs && actAs.id]
                        : true,
                    });
                  }
                }}
                className='bg-[#0a66c2] text-white font-semibold py-2 px-4 rounded-full hover:bg-[#0e5485] active:bg-[#0a66c2] active:transform active:translate-y-px'
              >
                {followStatus[actAs && actAs.id] ? "Following" : "Follow"}
              </button>
            </div>
            <div className='border border-gray-400 border-opacity-40 mt-10'></div>
            <div className='flex items-center pl-4'>
              <div
                onClick={() => setMenu("about")}
                className={` ${
                  menu === "about" &&
                  "border-b-4 border-green-700 text-green-700"
                }  font-semibold text-[17px] cursor-pointer p-4`}
              >
                About
              </div>
              <div
                onClick={() => setMenu("posts")}
                className={` ${
                  menu === "posts" &&
                  "border-b-4 border-green-700 text-green-700"
                }  font-semibold text-[17px] cursor-pointer p-4`}
              >
                Posts
              </div>
              <div
                onClick={() => setMenu("jobs")}
                className={` ${
                  menu === "jobs" &&
                  "border-b-4 border-green-700 text-green-700"
                }  font-semibold text-[17px] cursor-pointer p-4`}
              >
                Jobs
              </div>
            </div>
          </div>
          <div className='mt-4'>
            {menu === "about" && <About companyDetails={companyDetails} />}
            {menu === "posts" && (
              <div className='w-[60%]'>
                <Posts
                  companyDetails={companyDetails}
                  setAllPost={setAllPost}
                  allPost={allPost}
                />
              </div>
            )}
            {menu === "jobs" && (
              <Jobs
                companyDetails={companyDetails}
                currUserData={currUserData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCompany;
