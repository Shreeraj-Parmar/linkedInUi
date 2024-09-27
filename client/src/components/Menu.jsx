import React from "react";

import { AllContext } from "../context/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
// components:
import Button from "./Reusable Components/Button";

const Menu = () => {
  const { setSelectMenu } = useContext(AllContext);
  const navigate = useNavigate();
  const handleClick = (data) => {
    setSelectMenu(data);
  };

  return (
    <div className="menu bg-black rounded-tr-md rounded-br-md h-[100%]">
      <div className="wrapper p-3">
        <h2 className="font-semibold text-2xl text-white">Admin Menu</h2>
        <div className="flex-row space-y-2 mt-3 ">
          <div className="menu-btn-wrapper flex justify-center">
            <Button
              lable={"Total Data"}
              className={
                "btn border-2 rounded-md w-[70%] border-white hover:bg-white hover:text-black"
              }
              onClick={() => {
                handleClick("you");
              }}
            />
          </div>
          <div className="menu-btn-wrapper flex justify-center">
            <Button
              lable={"users"}
              className={
                "btn border-2 rounded-md w-[70%] border-white hover:bg-white hover:text-black"
              }
              onClick={() => {
                handleClick("users");
              }}
            />
          </div>

          {/* logout */}
          <div className="menu-btn-wrapper flex justify-center">
            <Button
              lable={"Logout"}
              className={
                "btn border-2 rounded-md w-[70%] border-white hover:bg-white hover:text-black"
              }
              onClick={() => {
                localStorage.removeItem("token");
                // localStorage.removeItem("refreshToken");
                navigate("/login");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
