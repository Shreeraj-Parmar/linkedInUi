import React, { useState, useEffect, useContext } from "react";
import Navbar from "../Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from "./../../Loader/Loader.jsx";
import { AllContext } from "../../../context/UserContext";
import { postNewJob } from "../../../services/api.js";
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
  const { setIsSnakBar, setLoading, selectCompanyForJob, currUserData } =
    useContext(AllContext);
  const navigate = useNavigate();
  const [skillDialog, setSkillDialog] = useState(false);
  const [snak, setSnak] = useState({ type: null, text: null });

  // formik
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      workplace: "Office",
      salary: 20000,
      location: "",
      skills: ["JavaScript", "React"],
      jobType: "Full Time",
      createdBy: {
        user: currUserData && currUserData._id, // User ID who is creating the job
        company: selectCompanyForJob && selectCompanyForJob._id, // Company ID on behalf of which the job is created
      },
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Job title is required"),
      description: Yup.string()
        .min(50, "Job description should be at least 50 characters")
        .max(1000, "Job description should not be more than 1000 characters")
        .required("Job description is required"),

      salary: Yup.number().required("Salary Must be in Number & required"),
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
      // createdBy: Yup.object().shape({
      //   user: Yup.string().required("User ID is required"),
      //   company: Yup.string().required("Company ID is required"),
      // }),
    }),
    onSubmit: async (values) => {
      setIsSnakBar(true);
      setLoading(true);
      // Handle form submission, e.g., send data to the server
      console.log("Form submitted with values:", values);

      let res = await postNewJob(values);
      if (res.status === 200) {
        setSnak({ type: "success", text: `${res.data.message}` });
        formik.resetForm();
      } else {
        setSnak({ type: "error", text: `${res.data.message}` });
      }

      setTimeout(() => {
        setLoading(false);
        navigate(`/job/view/${res.data.jobId}`);
      }, 2000);
    },
  });

  return (
    <div className='main-overview w-[100vw] bg-[#F4F2EE]  min-h-[100vh]'>
      <div className='main-overview-wrapper max-w-[100vw] overflow-x-hidden'>
        <Navbar />
        {snak.type && <SnakBar type={snak.type} text={snak.text} />}
        <Loader />

        <div className='main-display w-[80vw] min-h-[100vh] h-[90vh] m-auto mt-[55px] p-4'>
          <div className='border-2 border-gray-400 bg-white mb-2 p-2 rounded-md w-[78.5%] border-opacity-40'>
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
                  <div className='inpss relative cursor-not-allowed w-[50%]'>
                    <inputLabel className='text-[#000]'>
                      Company
                      <span className='text-blue-600 font-semibold'> *</span>
                    </inputLabel>
                    <input
                      className={
                        "border-2  bg-white cursor-not-allowed border-black pl-12 mt-[3px] border-opacity-70 placeholder:text-[#908282] rounded-sm w-[100%] text-black h-[35px] p-3"
                      }
                      id='createdBy.company'
                      value={selectCompanyForJob?.name}
                      name='createdBy.company'
                      readOnly
                      type='text'
                      label='createdBy.company'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <img
                      src={selectCompanyForJob?.profilePicture || "/blank.png"}
                      className='absolute cursor-not-allowed max-w-[30px] min-w-[30px] min-h-[33px] shadow-md max-h-[33px] top-[28px] left-[1px] border'
                      alt=''
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
                      <Select
                        labelId='jobType-label'
                        id='jobType-select'
                        value={formik.values.jobType}
                        name='jobType'
                        className='text-black rounded-sm'
                        onChange={formik.handleChange}
                      >
                        {jobTypeArr.map((ind, index) => (
                          <MenuItem key={index} value={ind}>
                            {ind}
                          </MenuItem>
                        ))}
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
                      WorkPlace
                      <span className='text-blue-600 font-semibold'> *</span>
                    </inputLabel>
                    <FormControl
                      sx={{ marginTop: 1, minWidth: "100%", border: "none" }}
                      size='small'
                    >
                      <Select
                        labelId='workplace-label'
                        id='workplace-select'
                        value={formik.values.workplace}
                        name='workplace'
                        className='text-black rounded-sm'
                        onChange={formik.handleChange}
                      >
                        {workPlaceArr.map((ind, index) => (
                          <MenuItem key={index} value={ind}>
                            {ind}
                          </MenuItem>
                        ))}
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
                    <inputLabel className='text-[#707070]'>
                      Salary{" "}
                      <span className='text-blue-600 font-semibold'> *</span>
                    </inputLabel>
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
                  {formik.values.skills?.map((skill, index) => {
                    return (
                      <div
                        // type='button'
                        key={index}
                        onClick={() => {
                          if (formik.values.skills.length > 0) {
                            formik.setFieldValue(
                              "skills",
                              formik.values.skills.filter((s) => s !== skill)
                            );
                          }
                        }}
                        className=' p-2 flex max-h-[35px] min-h-[35px] items-center space-x-1 pl-3 pr-3 rounded-full font-semibold  text-white bg-green-700'
                      >
                        <p>{skill}</p>
                        <CloseIcon fontSize='medium' className='text-white' />
                      </div>
                    );
                  })}
                  <button
                    type='button' //  nessasory to write .............//.....//..
                    onClick={() => setSkillDialog(true)}
                    disabled={formik.values.skills.length >= 10}
                    className=' p-2 flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed space-x-1 pl-3 pr-3 rounded-full font-semibold  text-black border-2 border-black'
                  >
                    Add Skill
                  </button>
                  <SkillAddDialog
                    setformikValues={formik.setFieldValue}
                    formikSkill={formik.values.skills}
                    setSkillDialog={setSkillDialog}
                    skillDialog={skillDialog}
                    skillOptions={skillOptions}
                  />
                </div>
              </div>

              <div className='formik-err'>
                {formik.touched.skills && formik.errors.skills && (
                  <div className='text-red-500'>{formik.errors.skills}</div>
                )}
              </div>
              <div
                className='p-4
                flex justify-end items-center '
              >
                <button
                  onClick={formik.handleSubmit}
                  type='submit'
                  disabled={!formik.dirty && !formik.isValid}
                  className='mt-5    disabled:bg-[#c9c9c9]   cursor-pointer  px-6 py-2.5 bg-[#0A66C2] text-white font-medium text-xs leading-tight uppercase rounded-full  shadow-md hover:bg-[#025682] hover:shadow-lg focus:bg-[#025682] focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#025682] active:bg-[#025682] active:shadow-lg transition duration-150 ease-in-out'
                >
                  Post a Job
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
