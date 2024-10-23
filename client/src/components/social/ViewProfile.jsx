import React, { useEffect, useState, useContext } from "react";

import { AllContext } from "../../context/UserContext";
import { getUserData } from "../../services/api.js";
import AddEducationDialog from "../Profile/AddEducationDialog.jsx";
import Navbar from "./Navbar.jsx";
import { useNavigate } from "react-router-dom";
import UserPosts from "./UserPosts.jsx";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EditProfile from "./EditProfile.jsx";
import linkifyContent from "../../utils/linkify.js";

const ViewProfile = () => {
  const { currUserData, isLogin, socket } = useContext(AllContext);
  const [addEduDialog, setAddEduDialog] = useState(false);
  const [allEducation, setAllEducation] = useState(
    (currUserData && currUserData.education) || []
  );
  const navigate = useNavigate();
  const [editProfildialog, setEditProfildialog] = useState(false);
  const [profileData, setProfileData] = useState();
  const [showMore, setShowMore] = useState(false);
  const maxLength = 250;

  useEffect(() => {
    setProfileData({
      name: currUserData && currUserData.name,
      state: currUserData && currUserData.state,
      city: currUserData && currUserData.city,
      country: currUserData && currUserData.country && currUserData.country,
      heading: currUserData && currUserData.heading && currUserData.heading,
      link:
        currUserData &&
        currUserData.website &&
        currUserData.website.link &&
        currUserData.website.link,
      linkText:
        currUserData &&
        currUserData.website &&
        currUserData.website.linkText &&
        currUserData.website.linkText,
      about: currUserData && currUserData.about && currUserData.about,
      skills:
        currUserData &&
        currUserData.skills &&
        currUserData.skills[0] &&
        currUserData.skills,
      role: currUserData && currUserData.role && currUserData.role,
    });
  }, [currUserData]);

  useEffect(() => {
    console.log("PROFILEDATA ID", profileData);
  }, [profileData]);

  return (
    <div className='main-overview w-[100vw] bg-[#F4F2EE] h-auto'>
      <div className='main-overview-wrapper   max-w-[100vw]  overflow-x-hidden'>
        <AddEducationDialog
          addEduDialog={addEduDialog}
          setAddEduDialog={setAddEduDialog}
          setAllEducation={setAllEducation}
        />
        {/* Navbar Apper in All Social Routs */}
        <Navbar />
        <EditProfile
          editProfildialog={editProfildialog}
          setEditProfildialog={setEditProfildialog}
          currUserData={currUserData}
          setAddEduDialog={setAddEduDialog}
          setProfileData={setProfileData}
        />

        <div className='main-display w-[80vw]   min-h-[100vh] h-fit flex justify-center   m-auto p-2  '>
          <div className='main-down mt-[60px] w-[95%]  min-h-[70%]'>
            <div className='profile-wrapper-all bg-[#fff] border-2 relative shadow-sm border-gray-400 border-opacity-40 w-[65%] p-5 pl-10 rounded-md flex-row space-y-3  '>
              <IconButton
                onClick={() => setEditProfildialog(true)}
                color='primary'
                className='text-[#000] cursor-pointer absolute top-[210px] left-[630px]'
              >
                <EditIcon fontSize='medium' />
              </IconButton>
              <div className='profil-pic'>
                <img
                  src={
                    currUserData ? currUserData.profilePicture : "/upload.png"
                  }
                  className='min-w-[150px] border-2 
 border-gray-400 shadow-sm border-opacity-40 min-h-[150px]  rounded-full max-w-[150px] max-h-[150px] '
                  alt='profil pic'
                />
              </div>
              <div className='profil-details'>
                <p className='text-[#000] text-[24px] font-semibold hover:bg-[#c2c2c2] w-fit cursor-pointer rounded-md'>
                  {currUserData ? profileData && profileData.name : "Your Name"}
                  &nbsp;&nbsp;&nbsp; &nbsp;
                  <span className='text-[#9b9b9b] text-[15px]'>
                    {currUserData
                      ? profileData && profileData.role
                      : "Your Role"}
                  </span>
                </p>
                <p className='text-[#252525] heading-para text-xl font-semibold  w-fit cursor-pointer rounded-md'>
                  {currUserData && profileData && profileData.heading
                    ? profileData.heading
                    : "<----Add Heading---->"}
                </p>
                <p className='text-[#686868] mt-2 text-sm'>
                  {`${currUserData ? profileData && profileData.city : ""}, ${
                    currUserData ? profileData && profileData.state : ""
                  }, ${currUserData ? profileData && profileData.country : ""}`}
                </p>
                {currUserData &&
                profileData &&
                profileData.linkText &&
                profileData.linkText ? (
                  <div className='flex space-x-1 mt-2 cursor-pointer'>
                    <a href={profileData.link} target='_blank' rel='noreferrer'>
                      <p className='text-[#352eff] text-sm hover:underline'>
                        {profileData.linkText}
                      </p>
                    </a>
                    <OpenInNewIcon
                      fontSize='small'
                      className='text-[#352eff]'
                      onClick={() => window.open(profileData.link)}
                    />
                  </div>
                ) : (
                  profileData &&
                  profileData.link &&
                  profileData.link && (
                    <div className='flex space-x-1 cursor-pointer'>
                      <a
                        href={
                          currUserData &&
                          profileData &&
                          profileData.link &&
                          profileData.link
                        }
                      >
                        {currUserData &&
                          profileData &&
                          profileData.link &&
                          profileData.link}
                      </a>
                      <OpenInNewIcon
                        fontSize='small'
                        className='text-[#352eff]'
                        onClick={() => window.open(profileData.link)}
                      />
                    </div>
                  )
                )}
                <p className='text-[#686868] text-sm mt-2'>
                  {currUserData ? currUserData.followers.length : ""} followers
                </p>
              </div>
            </div>

            <div className='bg-white w-[65%] mt-2 p-4 rounded-md border-2 border-gray-400 border-opacity-40'>
              <p className='text-[#000] text-xl font-semibold'>About Me</p>
              <div className='p-2'>
                {currUserData && profileData && profileData.about ? (
                  <div>
                    <pre
                      className=' text-wrap'
                      dangerouslySetInnerHTML={{
                        __html: !showMore
                          ? linkifyContent(
                              currUserData &&
                                profileData &&
                                profileData.about &&
                                profileData.about.substring(0, maxLength)
                            )
                          : linkifyContent(
                              currUserData &&
                                profileData &&
                                profileData.about &&
                                profileData.about
                            ),
                      }}
                    ></pre>
                    {profileData.about.length > maxLength && (
                      <p
                        className='text-blue-600 inline cursor-pointer mt-2'
                        onClick={() => setShowMore(true)}
                      >
                        {" "}
                        {!showMore && "more..."}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className='p-2 space-y-1'>
                    <div>Add About Me to search jobs</div>
                    <button
                      className='p-2 pl-4 pr-4 font-semibold border-2 rounded-full border-[#0A66C4] text-[#0A66C4]  hover:border-[#004182] hover:text-[#004182]'
                      onClick={() => {
                        setEditProfildialog(true);
                      }}
                    >
                      Add About Me
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className=' bg-white w-[65%] mt-2 p-4 rounded-md border-2 border-gray-400 border-opacity-40'>
              <p className='text-[#000] text-xl font-semibold'>My Skills</p>
              <div className='p-2 relative'>
                <div className='p-2 flex justify-end items-center absolute top-[-30px] right-0'>
                  <button
                    className='p-2 pl-4 pr-4 font-semibold border-2 rounded-full border-[#0A66C4] text-[#0A66C4]  hover:border-[#004182] hover:text-[#004182]'
                    onClick={() => {
                      setEditProfildialog(true);
                    }}
                  >
                    Add Skills
                  </button>
                </div>
                {currUserData &&
                profileData &&
                profileData.skills &&
                profileData.skills.length > 0 ? (
                  profileData.skills.map((skill, index) => {
                    return (
                      <div
                        className='flex p-2 items-center space-x-2 border-b-2 border-gray-400 border-opacity-40'
                        key={index}
                      >
                        <p className='text-[#686868] hover:underline cursor-pointer text-sm'>
                          {skill}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className='p-2 space-y-1 '>
                    <div>no skills here, please Add Skill to search jobs</div>
                  </div>
                )}
              </div>
            </div>

            {/* ADD EDU */}

            <div
              className='profile-wrapper-all bg-[#fff] border-2 
 border-gray-400 border-opacity-40 mt-3 w-[65%] p-3  rounded-md flex-row space-y-3  '
            >
              <p className='text-[#000] text-xl font-semibold'>Education</p>
              {currUserData && currUserData.education[0] ? (
                allEducation.map((edu) => {
                  return (
                    <div
                      key={currUserData._id}
                      className='profile-edu bg-[#F4F2EE] p-2 pl-3 rounded-md w-[80%] flex  items-center'
                    >
                      <div>
                        <p className='text-[#000]'>{edu.degree}</p>

                        <p className='text-[#686868] -mb-1 text-sm'>
                          {edu.university}
                        </p>
                        <p className='text-[#686868] -mb-1 text-sm'>{`${edu.startDate.year} - ${edu.endDate.year}`}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className='text-[#000]'>No Any Education Here</p>
              )}
            </div>
            <div
              className='profile-wrapper-all bg-[#fff] border-2 
 border-gray-400 border-opacity-40 mt-3 w-[65%] p-3   rounded-md flex  items-center space-y-3  '
            >
              <div className=' w-[100%]'>
                <p className='text-[#000] text-xl font-semibold'>Posts</p>
                <UserPosts userData={currUserData} what={"me"} />
              </div>
            </div>
            <div>
              <div className='flex mt-2'>
                <button
                  className='p-2 border-2 border-[#0A66C4] hover:bg-[#0A66C4] hover:text-white text-[#0A66C4]  rounded-md '
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                    if (currUserData)
                      socket && socket.emit("remove_user", currUserData._id);
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
