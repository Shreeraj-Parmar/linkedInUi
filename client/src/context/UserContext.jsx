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
        file,
        setFile,
        currMenu,
        setCurrMenu,
      }}
    >
      {children}
    </AllContext.Provider>
  );
};

export default UserContext;
