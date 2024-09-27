import React, { useEffect, useState, useContext, useLayoutEffect } from "react";
import { AllContext } from "../context/UserContext";
import { getAllUserData, getUserPostCount } from "./../services/api.js";
import {
  verifyTokenFunc,
  checkAdminFunc,
} from "../utils/token-verification-func.js";
// import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// components:
import Menu from "./Menu.jsx";
import ListsTable from "./All ShowList/ListsTable.jsx";
import YourList from "./All ShowList/YourList.jsx";

const Lists = () => {
  const {
    isLogin,
    allUserData = [],
    setAllUserData,
    selectMenu,
  } = useContext(AllContext);
  const navigate = useNavigate();
  const [count, setCount] = useState(null);

  useLayoutEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      verifyTokenFunc();
      checkAdminFunc();
      getNum();
    }
  }, []);

  useEffect(() => {
    const getAllData = async () => {
      let res = await getAllUserData();
      if (res.status === 200) {
        console.log(res.data);
        setAllUserData(res.data.message);
      }
    };
    getAllData();
  }, []);

  const getNum = async () => {
    let res = await getUserPostCount();
    if (res.status === 200) {
      setCount(res.data);
      console.log(res.data);
    } else if (res.status === 204) {
      navigate(res.data.route);
    }
  };

  return (
    <div className="list-wrapper flex h-[100vh]">
      <div className="list-left-wrapper w-[20%] h-[100%]">
        <Menu />
      </div>
      <div className="list-right-wrapper w-[80%]">
        <div className="flex justify-center">
          <div className="w-[99%] h-[5vh] rounded-md mt-2 p-2 text-xl flex justify-center items-center  text-center text-white bg-[#1B1F23]">
            <p>DashBoard </p>
          </div>
        </div>
        {/* choose acc button click */}
        {selectMenu === "you" && <YourList count={count} />}
        {selectMenu === "users" && <ListsTable allData={allUserData} />}
      </div>
    </div>
  );
};

export default Lists;
