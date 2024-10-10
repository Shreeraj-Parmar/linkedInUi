import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import {
  getPresignedURL,
  verifyToken,
  uploadFileAWS,
  getUserData,
  saveProfileURL,
} from "../../services/api";
import { toast } from "react-toastify";
import Profile from "./Profile";
import PostView from "./PostView";
import Suggest from "./Suggest";
import { AllContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import Tostify from "./../Tostify";
import LoginDialog from "./LoginDialog";
import Navbar from "./Navbar";
//icons

const Overview = () => {
  const {
    isLogin,
    setIsLogin,
    file,

    currMenu,
    setCurrMenu,
    currUserData,
    lightMode,
    loginDialog,

    setCurrUserData,
    setLoginDialog,
  } = useContext(AllContext);
  const navigate = useNavigate();
  const [profileSkeleton, setProfileSkeleton] = useState(false);
  const socket = window.socketClient;

  const [imgUrl, setImgUrl] = useState(null);

  //file functions here
  // const handleFileChange = (e) => {
  //   setFile(e.target.files[0]);
  // };

  /**
   * This useEffect is used to send the user's ID to the server
   * when the user data is available. This is used to keep track of
   * the online users in the server.
   */

  // const getData = async () => {
  //   let res = await getUserData();
  //   console.log(res.data);
  //   setCurrUserData(res.data.user);
  //   return res.data.user;
  // };

  // useEffect(() => {
  //   if (!currUserData) {
  //     let data = getData();
  //     console.log(
  //       "before useeffect currData",
  //       data || (currUserData && currUserData)
  //     );
  //     if (socket) {
  //       socket.emit("register", data._id);
  //     }
  //   }

  //   if (socket && currUserData) {
  //     socket.emit("register", currUserData._id);
  //   }

  //   // return () => {
  //   //   socket.off("all_online_users", handleOnlineUsers);
  //   // };
  // }, [socket && socket]);

  // useEffect(() => {
  //   if (!isLogin) {
  //     setTimeout(() => {
  //       if (!isLogin && !currUserData) {
  //         setLoginDialog(true);
  //       }
  //     }, 10000);
  //   }
  // }, []);

  const verifyTokenForIslogin = async () => {
    let res = await verifyToken();
    if (res.status === 200) {
      console.log("TOken is valid");
      setIsLogin(true);
    } else if (res.status === 204) {
      console.log("TOken is invalid ! please relogin");
      // window.location.href = "/login";
      setIsLogin(false);
    }
  };
  useLayoutEffect(() => {
    verifyTokenForIslogin();
  }, []);

  const handleSubmitFile = async (e, isFile) => {
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
          }
          let res = await saveProfileURL({ url: permanentUrl });
          console.log(res.status);
        }
      } else {
        console.log("file not selected");
        toast.error(`File Not Selectedd Please Try Again !`, {
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
      setProfileSkeleton(false);
    } else {
      toast.error(`Login to enable Select File.`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div
      className={`main-overview w-[100vw]  h-auto ${
        lightMode && "bg-[#F4F2EE]"
      }`}
    >
      <Tostify />
      <LoginDialog
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        setLoginDialog={setLoginDialog}
        loginDialog={loginDialog}
      />
      <div className='main-overview-wrapper max-w-[100vw]  overflow-x-hidden'>
        {/* Navbar Apper in All Social Routs */}
        <Navbar />

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
