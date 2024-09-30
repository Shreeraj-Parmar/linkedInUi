import React, { useEffect, useLayoutEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getUserDataAccId,
  sendFollowReq,
  sendConnect,
  setConversation,
} from "../../services/api.js";
import LoginDialog from "./LoginDialog.jsx";
import { AllContext } from "../../context/UserContext.jsx";
import Navbar from "./Navbar.jsx";

const UserProfile = () => {
  const {
    isLogin,
    setIsLogin,
    setLoginDialog,
    loginDialog,
    currUserData,

    setCurrConversationId,
  } = useContext(AllContext);

  const { userId } = useParams();
  console.log(userId);
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [follow, setFollow] = useState(false);
  const [connection, setConnection] = useState(false);
  const [pendinConnection, setPendingConnection] = useState(false);

  const getUserDataFunc = async () => {
    console.log("use trigger");
    let res = await getUserDataAccId(userId);
    console.log(res.data.user);
    if (res.status === 200) {
      setUserData(res.data.user);
      console.log(isLogin);
      if (isLogin) {
        console.log(currUserData._id);
        if (
          res.data.user &&
          res.data.user.followers.includes(currUserData._id)
        ) {
          setFollow(true);
        } else {
          setFollow(false);
        }

        // connection req
        if (
          res.data.user &&
          res.data.user.connectionRequests.includes(currUserData._id)
        ) {
          setPendingConnection(true);
        } else {
          // setConnection(true);

          // connection
          if (
            res.data.user &&
            res.data.user.connections.includes(currUserData._id)
          ) {
            setConnection(true);
          }
        }
      }
    } else {
      console.log(res.data.message);
    }
  };

  const sendConnectionReq = async (id) => {
    let res = await sendConnect({ receiverId: id });
    if (res.status === 200) {
      setPendingConnection(true);
      setConnection(true);
    }
    console.log(res.data);
  };

  const setConversationFunction = async (data) => {
    let res = await setConversation(data);
    if (res.status === 200) {
      console.log(res.data);
      setCurrConversationId(res.data.id);
      console.log("connection set");
      setTimeout(() => {
        navigate("/message");
      }, 500);
    }
  };

  useEffect(() => {
    console.log("sadasdasd");
    getUserDataFunc();
  }, []);

  // check if login or not ,

  //   useEffect(() => {
  //     if (!localStorage.getItem("token")) navigate("/login");
  //   }, []);

  return (
    <div className="main-overview w-[100vw] bg-black h-auto">
      <LoginDialog
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        setLoginDialog={setLoginDialog}
        loginDialog={loginDialog}
      />
      <div className="main-overview-wrapper   max-w-[100vw]  overflow-x-hidden">
        {/* Navbar Apper in All Social Routs */}
        <Navbar />

        <div className="main-display w-[80vw]   min-h-[100vh] h-fit flex justify-center   m-auto p-2  ">
          <div className="main-down mt-[60px] w-[95%]  min-h-[70%]">
            <div className="profile-wrapper-all bg-[#1B1F23]  w-[65%] p-5 pl-10 rounded-md flex-row space-y-3  ">
              <div className="profil-pic">
                <img
                  src={userData ? userData.profilePicture : "/blank.png"}
                  className="min-w-[150px] min-h-[150px] cursor-pointer rounded-full max-w-[150px] max-h-[150px] border border-red-500"
                  alt="profil pic"
                />
              </div>
              <div className="profil-details">
                <p className="text-[#EDEDED] text-2xl font-semibold hover:bg-[#44474B] w-fit cursor-pointer rounded-md">
                  {userData ? userData.name : "Name"}
                </p>
                <p className="text-[#A4A59F] text-sm">
                  {`${userData ? userData.city : ""}, ${
                    userData ? userData.state : ""
                  }, ${userData ? userData.country : ""}`}
                </p>
                <p className="text-[#A4A59F] text-sm">
                  {userData ? userData.followers.length : ""} followers
                </p>
              </div>
              <div className="follow-btns flex space-x-2">
                <button
                  onClick={async () => {
                    if (isLogin) {
                      await sendFollowReq({ receiverId: userData._id });
                      console.group("sdfsdfsfd");
                      getUserDataFunc();
                    } else {
                      // setLoginDialog(true);
                    }
                  }}
                  className="p-2 w-[100px]  rounded-full  bg-[#71B7FB] text-[#000] hover:bg-[#AAD6FF] hover:text-[] "
                >
                  {follow ? "UnFollow" : "Follow"}
                </button>
                <button
                  onClick={() => {
                    setConversationFunction({ receiverId: userData._id });
                  }}
                  className="p-2 w-[100px] rounded-full border-[2px] border-[#71B7FB] bg-[] text-[#71B7FB] hover:bg-[#1F2F41] hover:text-[] "
                >
                  Messege
                </button>
                {!connection && !pendinConnection && (
                  <button
                    onClick={() => {
                      sendConnectionReq(userData._id);
                      getUserDataFunc();
                    }}
                    className="p-2 w-[100px] rounded-full border-2 border-white bg-[] text-[#fff] hover:bg-[#2C2F33] hover:text-[]"
                  >
                    Connect
                  </button>
                )}

                {pendinConnection && (
                  <button className="p-2 w-[100px] rounded-full border-2 border-white bg-[] text-[#fff] hover:bg-[#2C2F33] hover:text-[]">
                    pending
                  </button>
                )}
              </div>
            </div>
            <div className="profile-wrapper-all bg-[#1B1F23] mt-3 w-[65%] p-3 pl-10 rounded-md flex-row space-y-3  ">
              <p className="text-[#EDEDED] text-xl font-semibold">Education</p>
              {userData && userData.education[0] ? (
                userData.education.map((edu) => {
                  return (
                    <div
                      key={userData._id}
                      className="profile-edu bg-[#293138] p-2 pl-3 rounded-md w-[80%] flex  items-center"
                    >
                      <div>
                        <p className="text-[#EDEDED]">{edu.degree}</p>

                        <p className="text-[#A4A59F] -mb-1 text-sm">
                          {edu.university}
                        </p>
                        <p className="text-[#A4A59F] -mb-1 text-sm">{`${edu.startDate.year} - ${edu.endDate.year}`}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-[#ededed]">No Any Education Here</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
