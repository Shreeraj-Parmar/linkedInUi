import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import {
  getPresignedURL,
  verifyToken,
  uploadFileAWS,
  getUserData,
  saveProfileURL,
  refresIt,
} from "../../services/api";
import Profile from "./Profile";
import PostView from "./PostView";
import Suggest from "./Suggest";
import { AllContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import LoginDialog from "./LoginDialog";
import SnakBar from "../SnakBar";
import Navbar from "./Navbar";
//icons

const Overview = () => {
  const {
    isLogin,
    setIsLogin,
    file,
    setAllOnlineUsers,

    currMenu,
    setCurrMenu,
    currUserData,
    lightMode,
    loginDialog,
    socket,
    setCurrUserData,
    setIsSnakBar,
    setLoginDialog,
  } = useContext(AllContext);
  const navigate = useNavigate();
  const [profileSkeleton, setProfileSkeleton] = useState(false);
  const [snak, setSnak] = useState({ type: null, text: null });

  const [imgUrl, setImgUrl] = useState(null);

  const handleOnlineUsers = (onlineUsersData) => {
    setAllOnlineUsers(onlineUsersData);
    console.log("this is onlineusers Data okwwwwwwwwwwy", onlineUsersData);
  };

  useEffect(() => {
    if (socket && currUserData) {
      socket.emit("register", currUserData._id);
      socket.on("online_users", handleOnlineUsers);
    }
  }, [socket, currUserData && currUserData]);

  const verifyTokenForIslogin = async () => {
    try {
      let res = await verifyToken();
      if (res.status === 200) {
        console.log("TOken is valid");
        setIsLogin(true);
      } else if (res.status === 204) {
        console.log("TOken is invalid ! please relogin");
        setIsLogin(false);
      }
    } catch (err) {
      console.error(err);
      setIsLogin(false);
    }
  };

  useLayoutEffect(() => {
    if (window.location.pathname === "/") {
      setCurrMenu("home");
    }
    verifyTokenForIslogin();
  }, []);

  const handleSubmitFile = async (e, isFile) => {
    setIsSnakBar(true);
    if (isLogin) {
      setProfileSkeleton(true);
      console.log("in overview file is", isFile);
      if (isFile) {
        e.preventDefault();
        let generatedURlResponse = await getPresignedURL({
          fileType: isFile.type,
        }); // Get the presigned URL from backend
        console.log("generated url", generatedURlResponse.data.url);
        // setUploadURL(generatedURlResponse.data.url);
        let fileName = generatedURlResponse.data.fileName;
        console.log("file name is ", fileName);
        // console.log(uploadURL);  // return null

        let resFromAWS = await uploadFileAWS({
          uploadURL: generatedURlResponse.data.url,
          postFile: isFile,
          fileType: isFile.type,
        }); // Upload the file to S3 using presigned URL
        console.log(resFromAWS);
        if (resFromAWS.status === 200) {
          console.log("done");
          const bukket = import.meta.env.VITE_AWS_S3_BUCKET_NAME;
          const region = import.meta.env.VITE_AWS_REGION;
          const permanentUrl = `https://${bukket}.s3.${region}.amazonaws.com/ProfilePicture/${fileName}`;
          if (permanentUrl) {
            setImgUrl(permanentUrl);
            setSnak({
              type: "success",
              text: "Profile picture uploaded successfully",
            });
          }
          let res = await saveProfileURL({ url: permanentUrl });
          console.log(res.status);
        }
      } else {
        console.log("file not selected");
        setSnak({
          type: "error",
          text: "Please select a file",
        });
      }
      setProfileSkeleton(false);
    } else {
      setSnak({
        type: "error",
        text: "Login to enable Select File.",
      });
    }
  };

  return (
    <div
      className={`main-overview w-[100vw]  h-auto ${
        lightMode && "bg-[#F4F2EE]"
      }`}
    >
      <LoginDialog
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        setLoginDialog={setLoginDialog}
        loginDialog={loginDialog}
      />
      <div className='main-overview-wrapper max-w-[100vw]  overflow-x-hidden'>
        {/* Navbar Apper in All Social Routs */}
        <Navbar />

        {snak.type && <SnakBar type={snak.type} text={snak.text} />}

        <div className='main-display w-[80vw] h-[100vh] mt-10  m-auto p-2  '>
          <div className='main-down h-[100%]'>
            <div className='main-down-wrapper w-[100%] flex space-x-4 p-3'>
              {/* profile section */}
              <div className='profile w-[20%] '>
                <Profile
                  setLoginDialog={setLoginDialog}
                  loginDialog={loginDialog}
                  // handleFileChange={handleFileChange}
                  handleSubmitFile={handleSubmitFile}
                  setImgUrl={setImgUrl}
                  lightMode={lightMode}
                  imgUrl={imgUrl}
                  currUserData={currUserData}
                  isLogin={isLogin}
                  setProfileSkeleton={setProfileSkeleton}
                  profileSkeleton={profileSkeleton}
                />
              </div>
              {/* posts */}
              <div className='posts w-[60%]  '>
                <PostView
                  imgUrl={imgUrl}
                  setLoginDialog={setLoginDialog}
                  loginDialog={loginDialog}
                  isLogin={isLogin}
                />
              </div>
              {/* suggesion */}
              <div className='suggested w-[20%] max-h-[100vh]'>
                <Suggest
                  setLoginDialog={setLoginDialog}
                  loginDialog={loginDialog}
                  lightMode={lightMode}
                  isLogin={isLogin}
                  setCurrMenu={setCurrMenu}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
