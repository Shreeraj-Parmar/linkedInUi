import React, { useEffect, useLayoutEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getUserDataAccId,
  sendFollowReq,
  sendConnect,
  sendNotification,
  setConversation,
  getMsgAccConvId,
  markAsRead,
  checkConnectionEachOther,
} from "../../services/api.js";
import LoginDialog from "./LoginDialog.jsx";
import { AllContext } from "../../context/UserContext.jsx";
import Navbar from "./Navbar.jsx";
import { toast } from "react-toastify";
import Tostify from "../Tostify.jsx";

const UserProfile = () => {
  const {
    isLogin,
    setIsLogin,
    setLoginDialog,
    loginDialog,
    currUserData,
    setMessages,

    setCurrConversationId,
  } = useContext(AllContext);

  const { userId } = useParams();
  console.log(userId);
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [follow, setFollow] = useState(false);
  const [connection, setConnection] = useState(false);
  const [pendinConnection, setPendingConnection] = useState(false);

  const createNoti = async () => {
    if (currUserData && currUserData.following.includes(userId)) return;
    await sendNotification({
      recipient: userId,
      sender: currUserData._id,
      type: "profile_view",
      message: "you have new view on your Profile",
    });
  };

  const getUserDataFunc = async () => {
    console.log("use trigger");
    let res = await getUserDataAccId(userId);
    console.log("this is users info", res.data.user);
    if (res.status === 200) {
      setUserData(res.data.user);
      console.log(isLogin);
      if (isLogin && currUserData) {
        console.log(currUserData._id);

        // follow
        if (
          res.data.user &&
          res.data.user.followers.includes(currUserData._id)
        ) {
          setFollow(true);
        } else {
          setFollow(false);
        }

        // pending connection
        if (res.data.user.connectionRequests.length === 0) {
          console.log("lenght is", res.data.user.connectionRequests.length);
          setPendingConnection(false);
        }

        // connection req
        if (
          res.data.user &&
          res.data.user.connectionRequests.length !== 0 &&
          res.data.user.connectionRequests.some(
            (req) => req.user.toString() === currUserData._id.toString()
          )
        ) {
          setPendingConnection(true);
          console.log("check pending connection", pendinConnection);
        }

        // connection
        if (
          res.data.user &&
          res.data.user.connections.includes(currUserData._id)
        ) {
          setConnection(true);
          setPendingConnection(false);
        }
      }
    } else {
      console.log(res.data.message);
    }
  };

  useEffect(() => {
    console.log(
      `setFollow is ${follow}, setConnection is ${connection} & setPendingConnection is ${pendinConnection}`
    );
  }, [follow, connection, pendinConnection]);

  const sendConnectionReq = async (id) => {
    let res = await sendConnect({ receiverId: id });
    if (res.status === 200) {
      console.log("req send");
      setPendingConnection(true);
      setConnection(true);
    } else if (res.status === 201) {
      toast.error(`${res.data.message}`, {
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
    console.log(res.data);
  };

  const checkConnectionEachOtherFunction = async (data) => {
    let res = await checkConnectionEachOther(data);
    if (res.status === 200) {
      console.log("you enable to msg");
      return true;
    } else if (res.status === 201) {
      console.log("you not .. enable to msg first connect please");
      toast.error(`${res.data}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return false;
    }
  };

  const setConversationFunction = async (data) => {
    // console.log(await checkConnectionEachOtherFunction(data));
    // here logic of if connections done than msg other wise not in starting otherwise new conversation made
    if (await checkConnectionEachOtherFunction(data)) {
      let res = await setConversation(data);
      if (res.status === 200) {
        console.log(res.data);
        setCurrConversationId(res.data.id);

        let convId = res.data.id;

        let res2 = await getMsgAccConvId(res.data.id);
        if (res2.status === 200) {
          console.log("messages is", res2.data);
          setMessages(res2.data);
        }

        console.log("conversation id selected", convId);
        let res3 = await markAsRead({ convId, userId });
        if (res3.status === 200) {
          console.log("message seen by user");
        }

        console.log("connection set");

        setTimeout(() => {
          navigate("/message");
        }, 500);
      }
    }
  };

  useLayoutEffect(() => {
    getUserDataFunc();
    // if (isLogin) createNoti();
  }, [isLogin]);

  return (
    <div className='main-overview w-[100vw] bg-[#F4F2EE] h-auto'>
      <LoginDialog
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        setLoginDialog={setLoginDialog}
        loginDialog={loginDialog}
      />
      <div className='main-overview-wrapper   max-w-[100vw]  overflow-x-hidden'>
        {/* Navbar Apper in All Social Routs */}
        <Navbar />
        <Tostify />

        <div className='main-display w-[80vw]   min-h-[100vh] h-fit flex justify-center   m-auto p-2  '>
          <div className='main-down mt-[60px] w-[95%]  min-h-[70%]'>
            <div className='profile-wrapper-all bg-[#fff] border-2 shadow-sm border-gray-400 border-opacity-40 w-[65%] p-5 pl-10 rounded-md flex-row space-y-3  '>
              <div className='profil-pic'>
                <img
                  src={
                    userData && userData.profilePicture
                      ? userData.profilePicture
                      : "/blank.png"
                  }
                  className='min-w-[150px] border-2 
 border-gray-400 shadow-sm border-opacity-40 min-h-[150px]  rounded-full max-w-[150px] max-h-[150px] '
                  alt='profil pic'
                />
              </div>
              <div className='profil-details'>
                <p className='text-[#000] text-2xl font-semibold hover:bg-[#c2c2c2] w-fit cursor-pointer rounded-md'>
                  {userData ? userData.name : "Name"}
                </p>
                <p className='text-[#686868] text-sm'>
                  {`${userData ? userData.city : ""}, ${
                    userData ? userData.state : ""
                  }, ${userData ? userData.country : ""}`}
                </p>
                <p className='text-[#686868] text-sm'>
                  {userData ? userData.followers.length : ""} followers
                </p>
              </div>
              {currUserData &&
                userData &&
                currUserData._id !== userData._id && (
                  <div className='follow-s flex space-x-2'>
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
                      className='p-2 w-[100px]  rounded-full  bg-[#0A66C2] text-[#fff] hover:bg-[#004182] hover:text-[] '
                    >
                      {follow ? "UnFollow" : "Follow"}
                    </button>
                    <button
                      onClick={() => {
                        setConversationFunction({ receiverId: userData._id });
                      }}
                      className='p-2 w-[100px] rounded-full border-[2px] border-[#0A66C2] bg-[] text-[#0A66C2] hover:border-[#004182] hover:text-[#004182] '
                    >
                      Messege
                    </button>
                    {!connection && !pendinConnection && (
                      <button
                        onClick={() => {
                          sendConnectionReq(userData._id);
                          getUserDataFunc();
                        }}
                        className='p-2 w-[100px] rounded-full border-[2px] border-[#0A66C2] bg-[] text-[#0A66C2] hover:border-[#004182] hover:text-[#004182]'
                      >
                        Connect
                      </button>
                    )}

                    {pendinConnection && (
                      <button className='p-2 w-[100px] rounded-full border-2 border-[#0A66C2] bg-[] text-[#0A66C2] hover:border-[#004182] hover:text-[#004182]'>
                        pending
                      </button>
                    )}
                  </div>
                )}
            </div>
            <div
              className='profile-wrapper-all bg-[#fff] border-2 
 border-gray-400 border-opacity-40 mt-3 w-[65%] p-3 pl-10 rounded-md flex-row space-y-3  '
            >
              <p className='text-[#000] text-xl font-semibold'>Education</p>
              {userData && userData.education[0] ? (
                userData.education.map((edu) => {
                  return (
                    <div
                      key={userData._id}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
