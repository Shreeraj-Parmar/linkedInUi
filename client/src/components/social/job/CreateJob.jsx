import React, { useState, useEffect, useContext } from "react";
import Navbar from "../Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from "./../../Loader/Loader.jsx";
import { AllContext } from "../../../context/UserContext";
import SnakBar from "../../SnakBar.jsx";
import { skillOptions } from "./../../../utils/somearr.js";
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
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SkillAddDialog from "./SkillAddDialog.jsx";

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

const workPlaceArr = ["Work from Home", "Office", "Remote", "Hybrid"];

const CreateJob = () => {
  const { setIsSnakBar, setLoading } = useContext(AllContext);
  const [skillArr, setSkillArr] = useState(["JavaScript", "React"]);
  const [skillDialog, setSkillDialog] = useState(false);
  const [snak, setSnak] = useState({ type: null, text: null });

  // formik
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      workplace: "",
      requirements: [],
      salary: "",
      location: "",
      skills: skillArr,
      jobType: "",
      createdBy: {
        user: "", // User ID who is creating the job
        company: "", // Company ID on behalf of which the job is created
      },
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Job title is required"),
      description: Yup.string()
        .min(50, "Job description should be at least 50 characters")
        .max(1000, "Job description should not be more than 1000 characters")
        .required("Job description is required"),
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
      workplace: Yup.string()
        .oneOf(
          ["Work from Home", "Office", "Remote", "Hybrid"],
          "Invalid Workplace type"
        )
        .required("WorkPlace type is required"),
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
        {snak.type && <SnakBar type={snak.type} text={snak.text} />}

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
                    <inputLabel className='text-[#000]'>
                      WorkPlace Type
                      <span className='text-blue-600 font-semibold'> *</span>
                    </inputLabel>
                    <FormControl
                      sx={{ marginTop: 1, minWidth: "100%", border: "none" }}
                      size='small'
                    >
                      <InputLabel id='demo-select-small-label text-sm'>
                        WorkPlace Type
                      </InputLabel>
                      <Select
                        labelId='demo-select-small-label'
                        id='demo-select-small'
                        value={formik.values.workplace}
                        label='Age'
                        name='workplace'
                        input={<OutlinedInput label='WorkPlace Type' />}
                        className='text-black rounded-sm'
                        onChange={formik.handleChange}
                      >
                        {workPlaceArr.map((ind, index) => {
                          return (
                            <MenuItem key={index} value={ind}>
                              {ind}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <div className='formik-err'>
                      {formik.touched.workplace && formik.errors.workplace && (
                        <div className='text-red-500'>
                          {formik.errors.workplace}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='location--salary mt-4 flex space-x-4 items-center'>
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
                  <div className='inpss w-[50%]'>
                    <inputLabel className='text-[#707070]'>Salary</inputLabel>
                    <input
                      className={
                        "border-2  bg-white border-black mt-[3px] border-opacity-70 placeholder:text-[#908282] rounded-sm w-[100%] text-black h-[35px] p-3"
                      }
                      id='createdBy.company'
                      value={formik.values.salary}
                      name='salary'
                      type='number'
                      label='salary'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <div className='formik-err'>
                      {formik.touched.salary && formik.errors.salary && (
                        <div className='text-red-500'>
                          {formik.errors.salary}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='p-2 mt-4'>
                <p className='text-blue-600 text-xl font-semibold'>
                  Description
                  <span> *</span>
                </p>
              </div>
              <div className='p-2 '>
                <div className='inpss '>
                  <textarea
                    className={
                      "border-2  bg-white border-black mt-[3px] border-opacity-70 placeholder:text-[#908282] rounded-sm w-[100%] text-black h-auto p-3"
                    }
                    id='createdBy.company'
                    value={formik.values.description}
                    name='description'
                    type='number'
                    rows={20}
                    cols={50}
                    placeholder="Enter company's description"
                    label='description'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  ></textarea>
                  <div className='formik-err'>
                    {formik.touched.description &&
                      formik.errors.description && (
                        <div className='text-red-500'>
                          {formik.errors.description}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className='p-2 mt-4'>
                <p className='text-blue-600 text-xl font-semibold'>
                  Skills
                  <span> *</span>
                </p>
              </div>
              <div className='p-2 '>
                <p>
                  Add skill keywords (max 10) to make your job more visible to
                  the right candidates.
                </p>
                <div className='flex gap-1 items-center    mt-2 flex-wrap'>
                  {skillArr.map((skill, index) => {
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          if (skillArr.length > 0) {
                            setSkillArr(
                              skillArr.filter((item) => item !== skill)
                            );
                          }
                        }}
                        className=' p-2 flex max-h-[35px] min-h-[35px] items-center space-x-1 pl-3 pr-3 rounded-full font-semibold  text-white bg-green-700'
                      >
                        <p>{skill}</p>
                        <CloseIcon fontSize='medium' className='text-white' />
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setSkillDialog(true)}
                    className=' p-2 flex items-center space-x-1 pl-3 pr-3 rounded-full font-semibold  text-black border-2 border-black'
                  >
                    Add Skill
                  </button>
                  <SkillAddDialog
                    setSkillArr={setSkillArr}
                    skillArr={skillArr}
                    setSkillDialog={setSkillDialog}
                    skillDialog={skillDialog}
                    skillOptions={skillOptions}
                  />
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
