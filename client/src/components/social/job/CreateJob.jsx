import React, { useState, useEffect, useContext } from "react";
import Navbar from "../Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from "./../../Loader/Loader.jsx";
import { AllContext } from "../../../context/UserContext";
import {
  Dialog,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  OutlinedInput,
  Button,
  styled,
} from "@mui/material";

// job type arr
const jobTypeArr = [
  "Full Time",
  "Part Time",
  "Contract",
  "FreeLance",
  "Internship",
  "Volunteer",
  "Other",
];

const CreateJob = () => {
  const { setIsSnakBar, setLoading } = useContext(AllContext);

  // formik

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      requirements: [""],
      salary: "",
      location: "",
      skills: [""],
      jobType: "",
      createdBy: {
        user: "", // User ID who is creating the job
        company: "", // Company ID on behalf of which the job is created
      },
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Job title is required"),
      description: Yup.string().required("Job description is required"),
      requirements: Yup.array()
        .of(Yup.string())
        .min(1, "At least one requirement is required"),
      salary: Yup.string(),
      location: Yup.string(),
      skills: Yup.array()
        .of(Yup.string())
        .min(1, "At least one skill is required"),
      jobType: Yup.string()
        .oneOf(
          [
            "Full Time",
            "Part Time",
            "Contract",
            "FreeLance",
            "Internship",
            "Volunteer",
            "Other",
          ],
          "Invalid job type"
        )
        .required("Job type is required"),
      createdBy: Yup.object().shape({
        user: Yup.string().required("User ID is required"),
        company: Yup.string().required("Company ID is required"),
      }),
    }),
    onSubmit: (values) => {
      // Handle form submission, e.g., send data to the server
      console.log("Form submitted with values:", values);
    },
  });

  return (
    <div className='main-overview w-[100vw] bg-[#F4F2EE] min-h-[100vh]'>
      <div className='main-overview-wrapper max-w-[100vw] overflow-x-hidden'>
        <Navbar />
        <div className='main-display w-[80vw] min-h-[100vh] h-[90vh] m-auto mt-[55px] p-4'>
          <div className='border-2 border-gray-400 bg-white p-2 rounded-md w-[78.5%] border-opacity-40'>
            <form onSubmit={formik.handleSubmit}>
              <div className='p-2'>
                <p className='text-blue-600 text-xl font-semibold'>
                  Job Details
                  <span> *</span>
                </p>
              </div>

              <div className='job-details p-2'>
                <div className='title--Company flex space-x-4 items-center'>
                  <div className='inpss w-[50%]'>
                    <inputLabel className='text-[#000]'>
                      Job Title
                      <span className='text-blue-600 font-semibold'> *</span>
                    </inputLabel>
                    <input
                      className={
                        "border-2  bg-white border-black mt-[3px] border-opacity-70 placeholder:text-[#908282] rounded-sm w-[100%] text-black h-[35px] p-3"
                      }
                      id='title'
                      value={formik.values.title}
                      name='title'
                      type='text'
                      label='title'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <div className='formik-err'>
                      {formik.touched.title && formik.errors.title && (
                        <div className='text-red-500'>
                          {formik.errors.title}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='inpss w-[50%]'>
                    <inputLabel className='text-[#000]'>
                      Company
                      <span className='text-blue-600 font-semibold'> *</span>
                    </inputLabel>
                    <input
                      className={
                        "border-2  bg-white border-black mt-[3px] border-opacity-70 placeholder:text-[#908282] rounded-sm w-[100%] text-black h-[35px] p-3"
                      }
                      id='createdBy.company'
                      value={formik.values.createdBy.company}
                      name='createdBy.company'
                      type='text'
                      label='createdBy.company'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <div className='formik-err'>
                      {formik.touched["createdBy"]?.company &&
                        formik.errors["createdBy"]?.company && (
                          <div className='text-red-500'>
                            {formik.errors["createdBy"]?.company}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
                <div className='jobType--location mt-4 flex space-x-4 items-center'>
                  <div className='inpss w-[50%]'>
                    <inputLabel className='text-[#000]'>
                      Job Type
                      <span className='text-blue-600 font-semibold'> *</span>
                    </inputLabel>
                    <FormControl
                      sx={{ marginTop: 1, minWidth: "100%", border: "none" }}
                      size='small'
                    >
                      <InputLabel id='demo-select-small-label text-sm'>
                        Job Type
                      </InputLabel>
                      <Select
                        labelId='demo-select-small-label'
                        id='demo-select-small'
                        value={formik.values.jobType}
                        label='Age'
                        name='jobType'
                        input={<OutlinedInput label='Job Type' />}
                        className='text-black rounded-sm'
                        onChange={formik.handleChange}
                      >
                        {jobTypeArr.map((ind, index) => {
                          return (
                            <MenuItem key={index} value={ind}>
                              {ind}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <div className='formik-err'>
                      {formik.touched.jobType && formik.errors.jobType && (
                        <div className='text-red-500'>
                          {formik.errors.jobType}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='inpss w-[50%]'>
                    <inputLabel className='text-[#707070]'>
                      Location
                      <span className='text-blue-600 font-semibold'> *</span>
                    </inputLabel>
                    <input
                      className={
                        "border-2  bg-white border-black mt-[3px] border-opacity-70 placeholder:text-[#908282] rounded-sm w-[100%] text-black h-[35px] p-3"
                      }
                      id='createdBy.company'
                      value={formik.values.location}
                      name='location'
                      type='text'
                      label='loacation'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <div className='formik-err'>
                      {formik.touched.location && formik.errors.location && (
                        <div className='text-red-500'>
                          {formik.errors.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
