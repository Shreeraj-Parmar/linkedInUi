import React, { createContext, useState, useEffect, useRef } from "react";

import { getUserData, verifyToken, refresIt } from "./../services/api.js";
import { io } from "socket.io-client";
const socketLinkURL = import.meta.env.VITE_SOCKET_LINK_URL;

export const AllContext = createContext(null);

const defaultLoginData = {
  email: "",
  password: "",
};

const defaultSignUpdata = {
  name: "",
  email: "",
  mobile: "",
  gender: "",
  hobby: "",
  address: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  password: "",
};

const UserContext = ({ children }) => {
  const [loginData, setLoginData] = useState(defaultLoginData);
  const [allUserData, setAllUserData] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [selectMenu, setSelectMenu] = useState("you");
  const [signUpData, setSignUpData] = useState(defaultSignUpdata);
  const [currUserData, setCurrUserData] = useState(null);
  const [file, setFile] = useState(null);
  const [currMenu, setCurrMenu] = useState("home");
  const [currConversationId, setCurrConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [unreadMSG, setUnreadMSG] = useState({});
  const [IsSnakBar, setIsSnakBar] = useState(false);
  const [lightMode, setLightMode] = useState(true);

  const [loginDialog, setLoginDialog] = useState(false);

  const [allOnlineUsers, setAllOnlineUsers] = useState({});

  // for loader
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    let res = await getUserData();
    console.log(res.data);
    setCurrUserData(res.data.user);
  };
  const verifyTokenForIslogin = async () => {
    let res = await verifyToken();
    if (res.status === 200) {
      console.log("TOken is valid");
      getData();
      setIsLogin(true);
    } else if (res.status === 204) {
      console.log("TOken is invalid ! please relogin");
      // window.location.href = "/login";
      setIsLogin(false);
    }
  };

  const refreshMyToken = async () => {
    // TODO: add a try catch block in case the refresh token is invalid
    try {
      let res = await refresIt({
        refreshToken: localStorage.getItem("refreshToken"),
      });
      // console.log(res);
      localStorage.removeItem("token");
      localStorage.setItem("token", res.data.accessToken);
    } catch (err) {
      console.error(err);
      // If the refresh token is invalid, log the user out
      setIsLogin(false);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
  };

  useEffect(() => {
    verifyTokenForIslogin();
    console.log("useEffect is nunning now Socket URL:", socketLinkURL);
    let socketOn = io(socketLinkURL);
    console.log("Socket URL:", socketLinkURL);

    socketOn.on("connect", () => {
      console.log("Socket connected with ID:", socketOn.id);
    });
    setSocket(socketOn);
    const refreshInterval = setInterval(() => {
      refreshMyToken();
    }, 6 * 60 * 1000); // 6 minutes

    return () => {
      socketOn.off("receive_message");
      socketOn.off("online_users");
      socketOn.off("join_conversation");
      socketOn.disconnect();
      clearInterval(refreshInterval);
    };
  }, []);

  return (
    <AllContext.Provider
      value={{
        loginData,
        setLoginData,
        signUpData,
        setSignUpData,
        defaultLoginData,
        defaultSignUpdata,
        allUserData,
        setAllUserData,
        allOnlineUsers,
        setAllOnlineUsers,
        currUserData,
        setCurrUserData,
        IsSnakBar,
        setIsSnakBar,
        selectMenu,
        setSelectMenu,

        isLogin,
        setIsLogin,
        loginDialog,
        setLoginDialog,
        file,
        setFile,
        currMenu,
        setCurrMenu,
        currConversationId,
        setCurrConversationId,
        messages,
        setMessages,
        loading,

        socket,

        setLoading,
        lightMode,
        setLightMode,
        unreadMSG,
        setUnreadMSG,
      }}
    >
      {children}
    </AllContext.Provider>
  );
};

export default UserContext;
