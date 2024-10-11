import React, { createContext, useState, useEffect, useRef } from "react";

import { getUserData, verifyToken } from "./../services/api.js";
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
  const [lightMode, setLightMode] = useState(true);
  const [loginDialog, setLoginDialog] = useState(false);

  const [allOnlineUsers, setAllOnlineUsers] = useState({});

  // for loader
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    let res = await getUserData();
    console.log(res.data);
    setCurrUserData(res.data.user);
    return res.data.user;
  };
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
  useEffect(() => {
    console.log("useEffect is nunning now Socket URL:", socketLinkURL);
    let socketOn = io(socketLinkURL);
    console.log("Socket URL:", socketLinkURL);

    socketOn.on("connect", () => {
      console.log("Socket connected with ID:", socketOn.id);
    });
    setSocket(socketOn);

    verifyTokenForIslogin();
    getData();
    return () => {
      socketOn.off("receive_message");
      socketOn.off("all_online_users");
      socketOn.off("join_conversation");
      socketOn.disconnect();
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
      }}
    >
      {children}
    </AllContext.Provider>
  );
};

export default UserContext;
