import React, { useEffect, useState, useRef, useContext } from "react";
import { ckeckURLAvailable } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { AllContext } from "../../context/UserContext";
import { toast } from "react-toastify";
import LaunchIcon from "@mui/icons-material/Launch";
import { Skeleton } from "@mui/material";

const Profile = ({
  handleFileChange,
  loginDialog,
  setLoginDialog,
  handleSubmitFile,
  isLogin,
  setImgUrl,
  imgUrl,
  lightMode,
  currUserData,
  setProfileSkeleton,
  profileSkeleton,
}) => {
  const chooseFileRef = useRef(null);
  const { file, setFile } = useContext(AllContext);
  const [isUploadMode, setIsUploadMode] = useState(false);
  const navigate = useNavigate();

  const focusFileInput = () => {
    chooseFileRef.current.click();
  };

  const handleProfilePicture = () => {
    if (isLogin) {
      focusFileInput();
    } else {
      setLoginDialog(true);
    }
  };

  const handleViewProfileClick = (e) => {
    if (isLogin) {
      e.preventDefault();
      navigate("/profile");
    } else {
      setLoginDialog(true);
    }
  };

  const handleFileSelection = (e) => {
    if (isLogin) {
      setFile(e.target.files[0]);
      const isFile = e.target.files[0];
      console.log("selected file is", e.target.files[0]);
      // handleFileChange(e); // Call the passed-in handleFileChange to handle file data
      handleSubmitFile(e, isFile); // Automatically submit after selecting a file
    } else {
      setLoginDialog(true);
    }
  };

  useEffect(() => {
    const checkIfURLAvailable = async () => {
      let res = await ckeckURLAvailable();
      if (res.status === 200) {
        console.log(res.data.url);
        setImgUrl(res.data.url);
      }
    };
    checkIfURLAvailable();
  }, [isLogin]);

  return (
    <div
      className={`profile-wrapper w-[100%] bg-[#1B1F23] h-[48vh] ${
        lightMode &&
        "bg-[#ffffff] border-2 shadow-sm border-gray-400 border-opacity-40"
      } rounded-lg p-2`}
    >
      {isLogin && profileSkeleton ? (
        <div
          className={`image-wrapper bg-[#1B1F23] ${
            lightMode && "bg-[#ffffff] "
          } flex justify-center  ${isLogin && "profile-upload"}`}
          onClick={handleProfilePicture}
        ></div>
      ) : (
        <div
          className={`image-wrapper bg-[#1B1F23] ${
            lightMode && "bg-[#ffffff] "
          } flex justify-center  ${isLogin && "profile-upload"}`}
          onClick={handleProfilePicture}
        >
          <img
            src={imgUrl || "/blank.png"} // Show profile image if imgUrl exists, else show dummy image
            alt="profile or upload image"
            className={`profile-img cursor-pointer rounded-full lg:min-w-[170px] lg:min-h-[170px]  lg:max-w-[170px] lg:max-h-[170px] mt-5 ${
              lightMode && "border-2 border-gray-400 border-opacity-40"
            }`}
          />

          {isLogin &&
            (imgUrl ? (
              <span className={`${lightMode && " text-black"}  `}>
                <p className="text-black"> Change Photo</p>
              </span>
            ) : (
              <span className={`${lightMode && " text-black"}`}>
                <p className="text-black"> Upload Photo</p>
              </span>
            ))}
        </div>
      )}

      {isLogin && (
        <>
          <div className="mt-4">
            <p
              className={`hover:underline cursor-pointer text-center ${
                lightMode && "text-[#000]"
              } font-semibold`}
            >
              {currUserData && currUserData.name
                ? currUserData.name
                : "No Name"}
            </p>
          </div>

          <div
            className=" mt-2 hover:underline cursor-pointer  flex justify-center items-center"
            onClick={(e) => handleViewProfileClick(e)}
          >
            <p
              className={`text-[#ffedd1]  text-center ${
                lightMode && " text-black"
              }`}
            >
              View My Profile
            </p>
            <LaunchIcon fontSize="small" />
          </div>
        </>
      )}

      <div className="text-[#E2E0DD] w-[100%] flex-row items-center profile-file-form">
        <div>
          <form
            onSubmit={(e) => {
              handleSubmitFile(e);
            }}
            className="bg-[#1B1F23] mt-5 w-[100%]"
          >
            <input
              type="file"
              ref={chooseFileRef}
              onChange={handleFileSelection} // Trigger file selection and submit
              className=""
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
