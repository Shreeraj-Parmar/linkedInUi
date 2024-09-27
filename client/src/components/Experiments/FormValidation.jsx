import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import Tostify from "../Tostify";
// import { toast } from "react-toastify";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material"; // Import MUI components
const HobbyArr = ["Dancing", "Raceing", "Advanture", "Reading", "Cooking"];
const FormValidation = () => {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      mobile: "",
      email: "",
      hobby: [],
      pincode: "",
      gender: "", // Add gender to initial values
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("First Name is required"),

      mobile: Yup.string()
        // .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
        .required("Mobile number is required"),

      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      hobby: Yup.array().min(1, "At least one hobby is required"),

      pincode: Yup.string()
        // .matches(/^[0-9]{6}$/, "Pincode must be exactly 6 digits")
        .required("Pincode is required"),

      gender: Yup.string().required("Gender is required"), // Add gender validation
    }),
    onSubmit: (values) => {
      // Handle form submission
      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Tostify />

      {/* First Name */}
      <input
        id="firstName"
        placeholder="Enter first name"
        name="firstName"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.firstName}
      />
      {formik.touched.firstName && formik.errors.firstName ? (
        <div>{formik.errors.firstName}</div>
      ) : null}

      {/* Mobile */}
      <input
        id="mobile"
        placeholder="Enter mobile number"
        name="mobile"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.mobile}
      />
      {formik.touched.mobile && formik.errors.mobile ? (
        <div className="text-red-500">{formik.errors.mobile}</div>
      ) : null}

      {/* Email */}
      <input
        id="email"
        placeholder="Enter email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
      />
      {formik.touched.email && formik.errors.email ? (
        <div>{formik.errors.email}</div>
      ) : null}

      {/* Pincode */}
      <input
        id="pincode"
        placeholder="Enter pincode"
        name="pincode"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.pincode}
      />
      {formik.touched.pincode && formik.errors.pincode ? (
        <div>{formik.errors.pincode}</div>
      ) : null}

      {/* Gender Select */}
      <FormControl className="w-[20%]" required>
        <InputLabel id="demo-simple-select-label">Gender</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          name="gender" // Bind to Formik
          value={formik.values.gender} // Formik value for gender
          onChange={formik.handleChange} // Formik handle change
          onBlur={formik.handleBlur} // Formik handle blur
        >
          <MenuItem value={"male"}>MALE</MenuItem>
          <MenuItem value={"female"}>FEMALE</MenuItem>
          <MenuItem value={"other"}>OTHER</MenuItem>
        </Select>
      </FormControl>
      {formik.touched.gender && formik.errors.gender ? (
        <div>{formik.errors.gender}</div>
      ) : null}
      <FormControl sx={{ m: 1, width: 300 }}>
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
              <Checkbox checked={formik.values.hobby.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {formik.touched.hobby && formik.errors.hobby ? (
        <div>{formik.errors.hobby}</div>
      ) : null}

      {/* Submit Button */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormValidation;
