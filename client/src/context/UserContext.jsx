import React, { createContext, useState } from "react";

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
  const [lightMode, setLightMode] = useState(true);
  const [loginDialog, setLoginDialog] = useState(false);

  // for loader
  const [loading, setLoading] = useState(false);

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
