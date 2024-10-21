import React, { useEffect, useContext, useState } from "react";
import { Dialog, styled } from "@mui/material";
import { sendLoginData } from "../../services/api.js";
import Tostify from "../Tostify.jsx";
import Button from "../Reusable Components/Button.jsx";
import { AllContext } from "../../context/UserContext.jsx";

import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import { useNavigate } from "react-router-dom";

// dialog style
const dialogStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  margin: "auto",
  width: "35vw",
  color: "#000",

  maxHeight: "50vh",

  //   overflow: "hidden",
  borderRadius: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#F4F2EE",
};

const LoginDialog = ({ isLogin, setIsLogin }) => {
  const { loginData, setLoginData, loginDialog, setLoginDialog } =
    useContext(AllContext);
  const navigate = useNavigate();
  // form logic
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      // This will be executed when the form is submitted
      console.log(values); // Log the values here

      // Your login logic can be handled here instead of handleLoginClick
      let res = await sendLoginData(values); // Pass formik values to sendLoginData API
      console.log("before access", res.data);

      if (res.status === 200) {
        setIsLogin(true);
        console.log(res.data);
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        // console.log("saved token", localStorage.getItem("token"));
        toast.success(`Welcome ${values.email}`, {
          position: "top-right",
          autoClose: 100,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setLoginData(values);
        setTimeout(() => {
          setLoginDialog(false);
          navigate("/");
        }, 1000);
      } else if (res.status === 201) {
        toast.error("Invalid Email or Password", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else if (res.status === 202) {
        console.log(res);
        setIsLogin(true);
        // console.log("res data for login", res.data);
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        // console.log("set token for admin : ", localStorage.getItem("token"));
        // console.log(
        //   "set refreshToken for admin : ",
        //   localStorage.getItem("refreshToken")
        // );
        // toast success for admin login
        toast.success("Welcome Back Admin", {
          position: "top-right",
          autoClose: 100,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          setLoginDialog(false);
          navigate("/lists");
        }, 2000);
      } else {
        toast.error("Something went wrong... please try later", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    },
  });
  return (
    <Dialog
      open={loginDialog}
      PaperProps={{
        sx: {
          ...dialogStyle,
        },
      }}
    >
      <div className='login  flex flex-col items-center gap-4 p-2  rounded-md w-[70%]'>
        <Tostify />
        <h2 className='font-semibold text-2xl  text-center w-[100%]'>
          Login Here
        </h2>
        <form
          onSubmit={formik.handleSubmit}
          className='flex-row space-y-2  w-[100%]'
        >
          <div className='w-full flex justify-center'>
            <div className='w-[90%] '>
              <input
                type={"email"}
                placeholder={"Enter Email"}
                className={
                  "w-[100%] border border-gray-400 border-opacity-40 placeholder:text-black p-2 rounded-md bg-[#fff]"
                }
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={"email"}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className='text-red-500'>{formik.errors.email}</div>
              ) : null}
            </div>
          </div>
          <div className='w-full flex justify-center'>
            <div className='w-[90%]'>
              <input
                type={"password"}
                placeholder={"Enter Password"}
                className={
                  "w-[100%] border border-gray-400 border-opacity-40 placeholder:text-black p-2 rounded-md  bg-[#fff]"
                }
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={"password"}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className='text-red-500'>{formik.errors.password}</div>
              ) : null}
            </div>
          </div>
          <div className='w-full flex justify-center'>
            <div className='w-[100px]'>
              <Button
                type={"submit"}
                lable={"Login"}
                className={
                  " bg-[#000] hover:bg-white hover:text-black p-3 text-white rounded-md w-[100px]"
                }
              />
            </div>
          </div>
        </form>
        <p>
          Are You New User?
          <span
            className='text-blue-500 hover:text-blue-600 cursor-pointer'
            onClick={() => {
              navigate("/signup");
            }}
          >
            {""} Register
          </span>
        </p>
      </div>
      <div
        className='absolute top-[20px] right-[30px] text-2xl cursor-pointer'
        onClick={() => {
          setLoginDialog(false);
        }}
      >
        <CloseIcon />
      </div>
    </Dialog>
  );
};

export default LoginDialog;
