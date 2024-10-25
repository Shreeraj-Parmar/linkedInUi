import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { sendLoginData } from "./../services/api.js";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import { useNavigate } from "react-router-dom";
import Loader from "./Loader/Loader.jsx";
import {
  verifyTokenFunc,
  checkAdminFunc,
  loginRedirect,
} from "../utils/token-verification-func.js";
// components
import Input from "./Reusable Components/Input";
import Button from "./Reusable Components/Button";

//context
import { AllContext } from "../context/UserContext";
import SnakBar from "./SnakBar.jsx";

const Login = () => {
  const {
    loginData,
    setIsLogin,
    setLoginData,
    isLogin,
    setLoading,
    setIsSnakBar,
  } = useContext(AllContext);
  const navigate = useNavigate();
  const [snak, setSnak] = useState({ type: null, text: null });

  useEffect(() => {
    setLoading(true);
    if (localStorage.getItem("token")) {
      if (!loginRedirect()) {
        console.log("continue please");
      }
    }
    setLoading(false);
  }, []);

  // formik validation
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
      setLoading(true);
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
        setSnak({
          type: "success",
          text: `Welcome ${values.email}`,
        });
        setLoginData(values);
        setTimeout(() => {
          setLoading(false);
          navigate("/");
        }, 2000);
      } else if (res.status === 201) {
        setSnak({
          type: "error",
          text: "Invalid email or password",
        });
        setLoading(false);
      } else if (res.status === 202) {
        console.log(res);
        setIsLogin(true);
        console.log("res data for login", res.data);
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        console.log("set token for admin : ", localStorage.getItem("token"));
        console.log(
          "set refreshToken for admin : ",
          localStorage.getItem("refreshToken")
        );
        // toast success for admin login
        setSnak({
          type: "success",
          text: "Welcome back Admin",
        });
        setTimeout(() => {
          setLoading(false);
          navigate("/lists");
        }, 2000);
      } else {
        setSnak({
          type: "success",
          text: "Somthing Error.. please tye again",
        });
        setLoading(false);
      }
      setIsSnakBar(true);
    },
  });

  return (
    <div className='login-wrapper login-bg-img  min-h-[100vh]  p-5 flex w-[100%] justify-center items-center'>
      <Loader />
      {snak.type && <SnakBar type={snak.type} text={snak.text} />}
      <div className='login mt-[100px] relative right-[-300px] top-[50px] flex flex-col h-[300px] items-center    gap-4 p-5 rounded-lg w-[25%]'>
        <h2 className='font-semibold text-2xl  text-center w-[100%]'>
          Login Here
        </h2>
        <form
          onSubmit={formik.handleSubmit}
          className='flex-row space-y-2  w-[100%]'
        >
          <div className='w-full flex justify-center'>
            <div className='w-[90%] '>
              <Input
                type={"email"}
                lable={"Enter Email"}
                className={"w-[100%]"}
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
              <Input
                type={"password"}
                lable={"Enter Password"}
                className={"w-[100%]"}
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
            <div className='w-[90%]'>
              <Button
                type={"submit"}
                lable={"Login"}
                className={"btn rounded-md w-full font-semibold"}
              />
            </div>
          </div>
        </form>
        <p>
          Are You New User?
          <span
            className='text-blue-600 cursor-pointer'
            onClick={() => {
              navigate("/signup");
            }}
          >
            {" "}
            &nbsp; Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
