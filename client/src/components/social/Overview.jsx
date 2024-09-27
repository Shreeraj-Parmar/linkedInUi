import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import {
  getPresignedURL,
  verifyToken,
  uploadFileAWS,
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
  const { isLogin, setIsLogin, file, setFile, currMenu, setCurrMenu } =
    useContext(AllContext);
  const navigate = useNavigate();
  const [loginDialog, setLoginDialog] = useState(false);
  // const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);

  //file functions here
  // const handleFileChange = (e) => {
  //   setFile(e.target.files[0]);
  // };

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

  const handleSubmitFile = async (e) => {
    if (isLogin) {
      console.log("in overview file is", file);
      if (file) {
        e.preventDefault();
        let generatedURlResponse = await getPresignedURL({
          fileType: file.type,
        }); // Get the presigned URL from backend
        console.log("generated url", generatedURlResponse.data.url);
        // setUploadURL(generatedURlResponse.data.url);
        let fileName = generatedURlResponse.data.fileName;
        console.log("file name is ", fileName);
        // console.log(uploadURL);  // return null

        let resFromAWS = await uploadFileAWS({
          uploadURL: generatedURlResponse.data.url,
          postFile: file,
          fileType: file.type,
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
      }
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
    <div className="main-overview w-[100vw] bg-black h-auto">
      <Tostify />
      <LoginDialog
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        setLoginDialog={setLoginDialog}
        loginDialog={loginDialog}
      />
      <div className="main-overview-wrapper max-w-[100vw]  overflow-x-hidden">
        {/* Navbar Apper in All Social Routs */}
        <Navbar />

        <div className="main-display w-[80vw] h-[100vh] mt-10  m-auto p-2  ">
          <div className="main-down h-[100%]">
            <div className="main-down-wrapper w-[100%] flex space-x-4 p-3">
              {/* profile section */}
              <div className="profile w-[20%] ">
                <Profile
                  setLoginDialog={setLoginDialog}
                  loginDialog={loginDialog}
                  // handleFileChange={handleFileChange}
                  handleSubmitFile={handleSubmitFile}
                  setImgUrl={setImgUrl}
                  imgUrl={imgUrl}
                  file={file}
                  setFile={setFile}
                  isLogin={isLogin}
                />
              </div>
              {/* posts */}
              <div className="posts w-[60%] ">
                <PostView
                  imgUrl={imgUrl}
                  setLoginDialog={setLoginDialog}
                  loginDialog={loginDialog}
                  isLogin={isLogin}
                />
              </div>
              {/* suggesion */}
              <div className="suggested w-[20%] max-h-[100vh]">
                <Suggest
                  setLoginDialog={setLoginDialog}
                  loginDialog={loginDialog}
                  isLogin={isLogin}
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
