import React, { useEffect } from "react";
import { useContext } from "react";
import { sendLoginData } from "./../services/api.js";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import { useNavigate } from "react-router-dom";
import {
  verifyTokenFunc,
  checkAdminFunc,
  loginRedirect,
} from "../utils/token-verification-func.js";
// components
import Input from "./Reusable Components/Input";
import Button from "./Reusable Components/Button";
import Tostify from "./Tostify";

//context
import { AllContext } from "../context/UserContext";

const Login = () => {
  const { loginData, setIsLogin, setLoginData, isLogin } =
    useContext(AllContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (!loginRedirect()) {
        console.log("continue please");
      }
    }
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
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setLoginData(values);
        setTimeout(() => {
          navigate("/social");
        }, 2000);
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
        console.log("res data for login", res.data);
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        console.log("set token for admin : ", localStorage.getItem("token"));
        console.log(
          "set refreshToken for admin : ",
          localStorage.getItem("refreshToken")
        );
        // toast success for admin login
        toast.success("Welcome Back Admin", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
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
    <div className="login-wrapper p-5 flex w-[100%] justify-center">
      <Tostify />
      <div className="login mt-16 flex flex-col items-center gap-4 p-5 border border-black rounded-md w-[25%]">
        <h2 className="font-semibold text-2xl  text-center w-[100%]">
          Login Here
        </h2>
        <form
          onSubmit={formik.handleSubmit}
          className="flex-row space-y-2  w-[100%]"
        >
          <div className="w-full flex justify-center">
            <div className="w-[90%] ">
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
                <div className="text-red-500">{formik.errors.email}</div>
              ) : null}
            </div>
          </div>
          <div className="w-full flex justify-center">
            <div className="w-[90%]">
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
                <div className="text-red-500">{formik.errors.password}</div>
              ) : null}
            </div>
          </div>
          <div className="w-full flex justify-center">
            <div className="w-[100px]">
              <Button
                type={"submit"}
                lable={"Login"}
                className={"btn rounded-md w-[100px]"}
              />
            </div>
          </div>
        </form>
        <p>
          Are You New User?
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
