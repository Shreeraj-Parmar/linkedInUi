import React, { useEffect, useState, useRef } from "react";
import { ckeckURLAvailable } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = ({
  handleFileChange,
  loginDialog,
  setLoginDialog,
  handleSubmitFile,
  isLogin,
  setImgUrl,
  imgUrl,
  setFile,
}) => {
  const chooseFileRef = useRef(null);
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
      console.log("selected file is", e.target.files[0]);
      // handleFileChange(e); // Call the passed-in handleFileChange to handle file data
      handleSubmitFile(e); // Automatically submit after selecting a file
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
    <div className="profile-wrapper w-[100%] bg-[#1B1F23] h-[48vh] rounded-lg p-2">
      {/* logic of aws */}

      <div
        className={`image-wrapper bg-[#1B1F23] flex justify-center  ${
          isLogin && "profile-upload"
        }`}
        onClick={handleProfilePicture}
      >
        <img
          src={imgUrl || "/blank.png"} // Show profile image if imgUrl exists, else show dummy image
          alt="profile or upload image"
          className="profile-img cursor-pointer rounded-full min-w-[80%] max-w-[80%] h-[80%] mt-5"
        />

        {isLogin &&
          (imgUrl ? <span>Update Photo</span> : <span>Upload Profile</span>)}
      </div>
      {isLogin && (
        <>
          <div className="mt-4">
            <p className="text-[#E2E0DD] text-center font-semibold">My name</p>
          </div>

          <div
            className="cursor-pointer mt-2 "
            onClick={(e) => handleViewProfileClick(e)}
          >
            <p className="text-[#ffedd1] text-center ">View My Profile</p>
          </div>
        </>
      )}

      <div className="flex justify-center mt-2">
        {isLogin ? (
          <button
            className="p-2 bg-[#71B7FB] rounded-md text-black"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </button>
        ) : (
          <button
            className="p-2 bg-[#71B7FB] mt-3 rounded-md text-black"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Login
          </button>
        )}
      </div>

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
