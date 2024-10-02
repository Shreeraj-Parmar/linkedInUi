import React from "react";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { sendSignUpData } from "./../services/api.js";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation

// context
import { AllContext } from "./../context/UserContext";

//MUI Components:
import {
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Checkbox,
  ListItemText,
  OutlinedInput,
  FormControlLabel,
} from "@mui/material";

// Components
import Tostify from "./Tostify";
import Input from "./Reusable Components/Input";
import Button from "./Reusable Components/Button";

// loader
import Loader from "./Loader/Loader.jsx";

//utils
const HobbyArr = ["Dancing", "Raceing", "Advanture", "Reading", "Cooking"];

const SignUp = () => {
  useEffect(() => {
    // if (localStorage.getItem("token")) navigate("/lists");
  }, []);
  const { signUpData, setSignUpData, isLogin, defaultSignUpdata, setLoading } =
    useContext(AllContext);
  const [gender, setGender] = useState(null);
  const [selectedHobby, setSelectedHobby] = useState([]);
  const navigate = useNavigate();

  // formik Validaation...

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      gender: "",
      hobby: [],
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Name is required"),

      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

      mobile: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
        .required("Mobile number is required"),

      gender: Yup.string()
        .oneOf(["male", "female", "other"], "Please select a valid gender")
        .required("Gender is required"),

      hobby: Yup.array().min(1, "At least one hobby is required"),

      address: Yup.string()
        .max(100, "Must be 100 characters or less")
        .required("Address is required"),

      city: Yup.string()
        .max(30, "Must be 30 characters or less")
        .required("City is required"),

      state: Yup.string()
        .max(30, "Must be 30 characters or less")
        .required("State is required"),

      country: Yup.string()
        .max(30, "Must be 30 characters or less")
        .required("Country is required"),

      pincode: Yup.string()
        .matches(/^[0-9]{6}$/, "Pincode must be exactly 6 digits")
        .required("Pincode is required"),

      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      // Handle form submission
      console.log(values);
      let res = await sendSignUpData(values);
      console.log(res.data);

      if (res.status === 200) {
        toast.success(
          `Welcome ${signUpData.name} You will redirect on Login Page`,
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
        setTimeout(() => {
          navigate("/login");
          setLoading(false);
        }, 2000);
      } else {
        console.log(res.data);
        toast.error(`Registration Failed due to ${res.data.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setLoading(false);
      }
    },
  });

  return (
    <div className="signup-wrapper p-5 flex justify-center items-center">
      <Tostify />
      <Loader />
      <div className="border border-black p-5 mt-10 rounded-md">
        <div className="heading mb-2">
          <h2 className="font-semibold text-3xl text-center">
            Welcome, Register Here
          </h2>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="box">
            <div className="w-[30%]">
              <Input
                id={"name"}
                value={formik.values.name}
                className={"input"}
                required={true}
                name={"name"}
                type={"text"}
                lable={"Enter Name"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500">{formik.errors.name}</div>
              ) : null}
            </div>
            <div className="w-[70%]">
              <Input
                id={"email"}
                required={true}
                value={formik.values.email}
                className={"input w-[100%]"}
                name={"email"}
                type={"text"}
                lable={"Enter Email"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500">{formik.errors.email}</div>
              ) : null}
            </div>
          </div>

          <div className="box">
            {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
            <div className="w-[45%]">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Gender
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="gender"
                  value={formik.values.gender} // Formik value for gender
                  onChange={formik.handleChange}
                >
                  <div className="flex">
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio />}
                      label="Other"
                    />
                  </div>
                </RadioGroup>
              </FormControl>
              {formik.touched.gender && formik.errors.gender ? (
                <div className="text-red-500">{formik.errors.gender}</div>
              ) : null}
            </div>
            <div className="w-[80%]">
              <Input
                id={"address"}
                value={formik.values.address}
                className={"input w-[100%]"}
                name={"address"}
                type={"text"}
                lable={"Enter Address"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.address && formik.errors.address ? (
                <div className="text-red-500">{formik.errors.address}</div>
              ) : null}
            </div>
          </div>

          <div className="box">
            <div className="w-1/3">
              <Input
                id={"city"}
                required={true}
                value={formik.values.city}
                className={"input w-[100%]"}
                name={"city"}
                type={"text"}
                lable={"Enter City"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.city && formik.errors.city ? (
                <div className="text-red-500">{formik.errors.city}</div>
              ) : null}
            </div>
            <div className="w-1/3">
              <Input
                id={"state"}
                value={formik.values.state}
                className={"input w-[100%]"}
                name={"state"}
                type={"text"}
                lable={"Enter State"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.state && formik.errors.state ? (
                <div className="text-red-500">{formik.errors.state}</div>
              ) : null}
            </div>
            <div className="w-1/3">
              <Input
                id={"country"}
                value={formik.values.country}
                className={"input w-[100%]"}
                name={"country"}
                type={"text"}
                lable={"Enter Your Country"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.country && formik.errors.country ? (
                <div className="text-red-500">{formik.errors.country}</div>
              ) : null}
            </div>
          </div>

          <div className="box">
            <div className="w-[30%]">
              <Input
                id={"pincode"}
                required={true}
                value={formik.values.pincode}
                className={"input w-[100%]"}
                name={"pincode"}
                type={"number"}
                lable={"Enter PinCode"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.pincode && formik.errors.pincode ? (
                <div className="text-red-500">{formik.errors.pincode}</div>
              ) : null}
            </div>
            <div className="w-[70%]">
              <FormControl className="w-[100%]">
                <InputLabel id="demo-multiple-checkbox-label">Hobby</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  name="hobby" // Bind to Formik
                  value={formik.values.hobby} // Ensure this is an array
                  onChange={(e) => {
                    const {
                      target: { value },
                    } = e;
                    // const { value } = e.target;
                    formik.setFieldValue(
                      "hobby",
                      typeof value === "string" ? value.split(",") : value
                    );
                  }} // Handle multiple selections
                  input={<OutlinedInput label="Hobby" />}
                  renderValue={(selected) => selected.join(", ")} // Display selected hobbies
                >
                  {HobbyArr.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox
                        checked={formik.values.hobby.indexOf(name) > -1}
                      />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formik.touched.hobby && formik.errors.hobby ? (
                <div className="text-red-500">{formik.errors.hobby}</div>
              ) : null}
            </div>
          </div>

          <div className="box">
            <div className="w-[40%]">
              <Input
                id={"mobile"}
                required={true}
                value={formik.values.mobile}
                className={"input w-[100%]"}
                name={"mobile"}
                type={"number"}
                lable={"Enter Mobile"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.mobile && formik.errors.mobile ? (
                <div className="text-red-500">{formik.errors.mobile}</div>
              ) : null}
            </div>
            <div className="w-[60%]">
              <Input
                id={"password"}
                required={true}
                value={formik.values.password}
                className={"input w-[100%]"}
                name={"password"}
                type={"password"}
                lable={"Choose New Password"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500">{formik.errors.password}</div>
              ) : null}
            </div>
          </div>

          <div className="register box flex justify-center">
            <Button
              lable={"Register"}
              type="submit"
              className={"btn rounded-md w-[130px] mt-2"}
              // onClick={(e) => {
              //   handleRegister(e);
              // }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
