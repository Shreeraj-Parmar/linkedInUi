import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import input from "../Reusable Components/input";
import { Select, MenuItem, FormControl } from "@mui/material";
import { sendEDUDetails } from "../../services/api.js";

// AddEducationSection component
const AddEducationSection = ({ addEduDialog }) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formik = useFormik({
    initialValues: {
      school: "",
      university: "",
      grade: "",
      degree: "",
      description: "",
      startDate: {
        month: "",
        year: "",
      },
      endDate: {
        month: "",
        year: "",
      },
    },
    validationSchema: Yup.object({
      school: Yup.string().required("School is required"),
      university: Yup.string().required("University is required"),
      grade: Yup.string(),
      degree: Yup.string().required("Degree is required"),
      description: Yup.string(),
      startDate: Yup.object().shape({
        month: Yup.string()
          .required("Start month is required")
          .oneOf(months, "Invalid month"),
        year: Yup.number()
          .required("Start year is required")
          .min(1900, "Year must be 1900 or later")
          .max(new Date().getFullYear(), "Year cannot be in the future"),
      }),
      endDate: Yup.object().shape({
        month: Yup.string()
          .required("End month is required")
          .oneOf(months, "Invalid month"),
        year: Yup.number()
          .required("End year is required")
          .min(1900, "Year must be 1900 or later")
          .max(new Date().getFullYear(), "Year cannot be in the future"),
      }),
    }),
    onSubmit: async (values) => {
      console.log(values);
      let res = await sendEDUDetails(values);
      if (res.status === 200) {
        addEduDialog(false);
        alert("Education added Succesfully");
      } else {
        alert("somthing error to add education details");
      }
      formik.resetForm();
    },
  });

  return (
    <div className="flex justify-center ">
      <div
        className="edu-wrapper p-4  w-[100%]"
        style={{
          // Adjust height as needed
          overflowY: "auto", // This enables vertical scrolling
        }}
      >
        <div className="">
          <h3 className="font-semibold mb-2 text-xl">Add Education</h3>
          <hr />
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="mt-5 w-[100%]">
            <inputLabel>Enter School Name</inputLabel>
            <input
              className={
                "border border-[#fff] bg-[#1B1F23] placeholder:text-[#000] rounded-md w-[100%] p-3"
              }
              id="school"
              value={formik.values.school}
              name="school"
              type="text"
              label="School"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />{" "}
            <div className="formik-err">
              {formik.touched.school && formik.errors.school && (
                <div className="text-red-500">{formik.errors.school}</div>
              )}
            </div>
          </div>

          <div>
            <inputLabel>Enter university Name</inputLabel>

            <input
              className={
                "border border-[#fff] bg-[#1B1F23] placeholder:text-[#000] rounded-md w-[100%] p-3"
              }
              id="university"
              value={formik.values.university}
              name="university"
              type="text"
              label="University"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div>
              {formik.touched.university && formik.errors.university && (
                <div className="text-red-500">{formik.errors.university}</div>
              )}
            </div>
          </div>

          <div>
            <inputLabel>Enter Grade</inputLabel>

            <input
              className={
                "border border-[#fff] bg-[#1B1F23] placeholder:text-[#000] rounded-md w-[100%] p-3"
              }
              id="grade"
              value={formik.values.grade}
              name="grade"
              type="text"
              label="Grade"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <div>
            <inputLabel>Enter degree</inputLabel>

            <input
              className={
                "border border-[#fff] bg-[#1B1F23] placeholder:text-[#000] rounded-md w-[100%] p-3"
              }
              id="degree"
              value={formik.values.degree}
              name="degree"
              type="text"
              label="Degree"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div>
              {formik.touched.degree && formik.errors.degree && (
                <div className="text-red-500">{formik.errors.degree}</div>
              )}
            </div>
          </div>
          <div>
            <inputLabel>Enter Description</inputLabel>

            <textarea
              className={
                "border border-[#fff] bg-[#1B1F23] placeholder:text-[#000] rounded-md w-[100%] p-3"
              }
              id="description"
              value={formik.values.description}
              name="description"
              type="text"
              label="Description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="start-date-month flex w-[100%] space-x-2 justify-center">
            <div className="w-[50%]">
              <FormControl className="w-[100%]">
                <inputLabel>Start Month</inputLabel>

                <Select
                  name="startDate.month"
                  className={"border border-[#fff] bg-[#1B1F23]  rounded-md "}
                  value={formik.values.startDate.month}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  sx={{ height: "49px", color: "white" }}
                >
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div>
                {formik.touched.startDate?.month &&
                  formik.errors.startDate?.month && (
                    <div className="text-red-500">
                      {formik.errors.startDate.month}
                    </div>
                  )}
              </div>
            </div>
            <div className="w-[50%]">
              <inputLabel>Start Year</inputLabel>
              <input
                className={
                  "border border-[#fff] bg-[#1B1F23] placeholder:text-[#000] rounded-md w-[100%] p-3"
                }
                id="startDate.year"
                value={formik.values.startDate.year}
                name="startDate.year"
                type="number"
                label="Start Year"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div>
                {formik.touched.startDate?.year &&
                  formik.errors.startDate?.year && (
                    <div className="text-red-500">
                      {formik.errors.startDate.year}
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="end-date-month flex space-x-2 w-[100%] justify-center">
            <div className="w-[50%]">
              <FormControl fullWidth className=" text-white">
                <inputLabel>End Month</inputLabel>

                <Select
                  name="endDate.month"
                  className={
                    "border border-[#fff] bg-[#1B1F23]rounded-md  text-white   "
                  }
                  value={formik.values.endDate.month}
                  onChange={formik.handleChange}
                  sx={{ height: "49px", color: "white" }}
                  onBlur={formik.handleBlur}
                >
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div>
                {formik.touched.endDate?.month &&
                  formik.errors.endDate?.month && (
                    <div className="text-red-500">
                      {formik.errors.endDate.month}
                    </div>
                  )}
              </div>
            </div>

            <div className="w-[50%]">
              <inputLabel>End Month</inputLabel>
              <input
                className={
                  "border border-[#fff] bg-[#1B1F23] placeholder:text-[#000] rounded-md w-[100%] p-3"
                }
                id="endDate.year"
                value={formik.values.endDate.year}
                name="endDate.year"
                type="number"
                label="End Year"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div>
                {formik.touched.endDate?.year &&
                  formik.errors.endDate?.year && (
                    <div className="text-red-500">
                      {formik.errors.endDate.year}
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="p-2 bg-[#aad6ff] rounded-md mt-2 text-black"
            >
              Add Education
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEducationSection;
