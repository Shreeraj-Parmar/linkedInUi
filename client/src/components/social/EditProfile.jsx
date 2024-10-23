import React, { useEffect, useContext, useState } from "react";
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
} from "@mui/material";

import { updateUserProfile } from "../../services/api.js";

import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import IconButton from "@mui/material/IconButton";

import * as Yup from "yup"; // Import Yup for validation

// dialog styles
const dialogStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  margin: "auto",
  minWidth: "50vw",
  color: "#000",

  maxHeight: "82vh",

  //   overflow: "hidden",
  borderRadius: "8px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
};

// skils arr
const skillOptions = [
  // AWS-related skills
  "AWS EC2",
  "AWS Lambda",
  "AWS S3",
  "AWS CloudFormation",
  "AWS RDS",
  "AWS DynamoDB",
  "AWS CloudFront",
  "AWS Route 53",
  "AWS IAM",
  "AWS Elastic Beanstalk",

  // AI-related skills
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing (NLP)",
  "Computer Vision",
  "TensorFlow",
  "PyTorch",
  "Reinforcement Learning",
  "Artificial Intelligence",
  "Data Science",
  "Neural Networks",

  // Cybersecurity-related skills
  "Penetration Testing",
  "Network Security",
  "Ethical Hacking",
  "Incident Response",
  "Cryptography",
  "Vulnerability Assessment",
  "Security Information and Event Management (SIEM)",
  "Firewall Management",
  "Security Auditing",
  "Cyber Threat Intelligence",

  // Web development skills
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Express.js",
  "Next.js",
  "GraphQL",
  "TypeScript",
  "RESTful API",
  "HTML & CSS",

  // Business-related skills
  "Project Management",
  "Agile Methodologies",
  "Business Strategy",
  "Digital Marketing",
  "Product Management",
  "Financial Analysis",
  "Market Research",
  "Leadership",
  "Business Development",
  "Salesforce",
];

// main comonent here
const EditProfile = ({
  currUserData,
  setEditProfildialog,
  editProfildialog,
  setProfileData,
  setAddEduDialog,
}) => {
  const [personName, setPersonName] = useState([]);

  // Handle the change in skills (Select component)
  const handleSkillsChange = (event) => {
    const { value } = event.target;
    setPersonName(typeof value === "string" ? value.split(",") : value);
    formik.setFieldValue("skills", value); // Update Formik's skills value
  };

  // formik here
  const formik = useFormik({
    initialValues: {
      name: currUserData && currUserData.name,

      state: currUserData && currUserData.state && currUserData.state,
      heading: currUserData && currUserData.heading && currUserData.heading,
      country: currUserData && currUserData.country && currUserData.country,
      city: currUserData && currUserData.city && currUserData.city,
      link: currUserData && currUserData.link && currUserData.link,
      linkText: currUserData && currUserData.linkText && currUserData.linkText,
      about: currUserData && currUserData.about && currUserData.about,
      skills:
        (currUserData &&
          currUserData.skills &&
          currUserData.skills[0] &&
          currUserData.skills) ||
        [],

      role: currUserData && currUserData.role && currUserData.role,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("name is required"),
      city: Yup.string().required("city is required"),
      country: Yup.string().required("country is required"),
      state: Yup.string().required("state is required"),
    }),
    onSubmit: async (values) => {
      console.log(values); // Log the values here

      let res = await updateUserProfile(values);
      if (res.status === 200) {
        setProfileData((prev) => ({
          ...prev,
          name: values.name,
          city: values.city,
          country: values.country,
          heading: values.heading,
          link: values.link,
          linkText: values.linkText,
          about: values.about,
          skills: values.skills,
          role: values.role,
          state: values.state,
        }));
        console.log("profile updated");
        setEditProfildialog(false);
      } else {
        alert("something error to update profile");
      }
    },
  });

  return (
    <Dialog
      open={editProfildialog}
      PaperProps={{
        sx: {
          ...dialogStyle,
        },
      }}
    >
      <div className='w-[100%]   h-[100%]'>
        <div className='header-edit fixed p-3 bg-[#fff] rounded-t-lg flex justify-start items-center w-[50%] border-b-2 border-gray-400 border-opacity-40>'>
          <p className=' font-semibold text-2xl opacity-70'>Edit Profile</p>
        </div>
        <IconButton
          onClick={() => setEditProfildialog(false)}
          className='absolute top-[10px] left-[93%]  text-2xl cursor-pointer'
        >
          <CloseIcon className='text-[#000]' fontSize='medium' />
        </IconButton>
        <div className='down-wr p-4 overflow-auto border-gray-400  border-b-2 max-h-[84%]'>
          <form onSubmit={formik.handleSubmit}>
            <div className='name-edit mt-5'>
              <div className='inp-edit '>
                <inputLabel className='text-[#908282]'>Enter Name</inputLabel>
                <input
                  className={
                    "border  bg-white border-black mt-[3px] border-opacity-40 placeholder:text-[#908282] rounded-md w-[100%] text-black h-[40px] p-3"
                  }
                  id='name'
                  value={formik.values.name}
                  name='name'
                  type='text'
                  label='name'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <div className='formik-err'>
                  {formik.touched.name && formik.errors.name && (
                    <div className='text-red-500'>{formik.errors.name}</div>
                  )}
                </div>
              </div>
              <div className='inp-edit mt-4'>
                <inputLabel className='text-[#908282]'>
                  Enter Your Role
                </inputLabel>
                <input
                  className={
                    "border  bg-white border-black mt-[3px] border-opacity-40 placeholder:text-[#908282] rounded-md w-[100%] text-black h-[40px] p-3"
                  }
                  id='role'
                  value={formik.values.role}
                  name='role'
                  type='text'
                  label='role'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <div className='formik-err'>
                  {formik.touched.role && formik.errors.role && (
                    <div className='text-red-500'>{formik.errors.role}</div>
                  )}
                </div>
              </div>
              <div className='mt-4'>
                <p className='text-[#000] opacity-70 font-semibold text-xl'>
                  Location
                </p>
              </div>
              <div className='inp-edit mt-2'>
                <inputLabel className='text-[#908282]'>
                  Country/Region
                </inputLabel>
                <input
                  className={
                    "border  bg-white border-black mt-[3px] border-opacity-40 placeholder:text-[#908282] rounded-md w-[100%] text-black h-[40px] p-3"
                  }
                  id='country'
                  value={formik.values.country}
                  name='country'
                  type='text'
                  label='country'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <div className='formik-err'>
                  {formik.touched.country && formik.errors.country && (
                    <div className='text-red-500'>{formik.errors.country}</div>
                  )}
                </div>
              </div>
              <div className='inp-edit mt-5'>
                <inputLabel className='text-[#908282] '>City</inputLabel>
                <input
                  className={
                    "border  bg-white border-black mt-[3px] border-opacity-40 placeholder:text-[#908282] rounded-md w-[100%] text-black h-[40px] p-3"
                  }
                  id='city'
                  value={formik.values.city}
                  name='city'
                  type='text'
                  label='city'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <div className='formik-err'>
                  {formik.touched.city && formik.errors.city && (
                    <div className='text-red-500'>{formik.errors.city}</div>
                  )}
                </div>
              </div>
              <div className='inp-edit mt-5'>
                <inputLabel className='text-[#908282] '>state</inputLabel>
                <input
                  className={
                    "border  bg-white border-black mt-[3px] border-opacity-40 placeholder:text-[#908282] rounded-md w-[100%] text-black h-[40px] p-3"
                  }
                  id='state'
                  value={formik.values.state}
                  name='state'
                  type='text'
                  label='state'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <div className='formik-err'>
                  {formik.touched.state && formik.errors.state && (
                    <div className='text-red-500'>{formik.errors.state}</div>
                  )}
                </div>
              </div>
              <div className='mt-4'>
                <p className='text-[#000] opacity-70 font-semibold text-xl'>
                  About
                </p>
              </div>
              <div className='inp-edit mt-5'>
                <inputLabel className='text-[#908282] '>about me</inputLabel>
                <textarea
                  className={
                    "border  bg-white border-black mt-[3px] border-opacity-40 placeholder:text-[#908282] rounded-md w-[100%] text-black   p-3"
                  }
                  id='about'
                  value={formik.values.about}
                  name='about'
                  rows={5}
                  type='text'
                  label='about'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                ></textarea>
                <div className='formik-err'>
                  {formik.touched.about && formik.errors.about && (
                    <div className='text-red-500'>{formik.errors.about}</div>
                  )}
                </div>
              </div>
              <div className='inp-edit mt-5'>
                <inputLabel className='text-[#908282] '>Heading</inputLabel>
                <textarea
                  className={
                    "border  bg-white border-black mt-[3px] border-opacity-40 placeholder:text-[#908282] rounded-md w-[100%] text-black   p-3"
                  }
                  id='heading'
                  value={formik.values.heading}
                  name='heading'
                  rows={2}
                  type='text'
                  label='heading'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                ></textarea>
                <div className='formik-err'>
                  {formik.touched.heading && formik.errors.heading && (
                    <div className='text-red-500'>{formik.errors.heading}</div>
                  )}
                </div>
              </div>
              <div className='mt-4'>
                <p className='text-[#000] opacity-70 font-semibold text-xl'>
                  Skills
                </p>
              </div>
              <div className='inp-edit mt-5'>
                <FormControl sx={{ m: 1, width: "98%" }}>
                  <InputLabel id='skills-label'>Skills</InputLabel>
                  <Select
                    labelId='skills-label'
                    id='skills'
                    multiple
                    value={formik.values.skills}
                    onChange={handleSkillsChange}
                    input={
                      <OutlinedInput id='select-multiple-chip' label='Skills' />
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {skillOptions.map((skill) => (
                      <MenuItem key={skill} value={skill}>
                        {skill}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div className='formik-err'>
                  {formik.touched.skills && formik.errors.skills && (
                    <div className='text-red-500'>{formik.errors.skills}</div>
                  )}
                </div>
              </div>
              <div className='mt-4'>
                <p className='text-[#000] opacity-70 font-semibold text-xl'>
                  Education
                </p>
              </div>
              <div className='p-2'>
                <button
                  onClick={() => {
                    setAddEduDialog(true);
                  }}
                  className=' p-2 pl-4 pr-4 font-semibold border-2 rounded-full border-[#0A66C4] text-[#0A66C4]  hover:border-[#004182] hover:text-[#004182]'
                >
                  Add education
                </button>
              </div>
              <div className='mt-4'>
                <p className='text-[#000] opacity-70 font-semibold text-xl'>
                  Website
                </p>
              </div>
              <div className='inp-edit mt-5'>
                <inputLabel className='text-[#908282] '>link</inputLabel>
                <input
                  className={
                    "border  bg-white border-black mt-[3px] border-opacity-40 placeholder:text-[#908282] rounded-md w-[100%] text-black h-[40px] p-3"
                  }
                  id='link'
                  value={formik.values.link}
                  name='link'
                  type='text'
                  label='link'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <div className='formik-err'>
                  {formik.touched.city && formik.errors.link && (
                    <div className='text-red-500'>{formik.errors.link}</div>
                  )}
                </div>
              </div>
              <div className='inp-edit mt-5'>
                <inputLabel className='text-[#908282] '>link Text</inputLabel>
                <input
                  className={
                    "border  bg-white border-black mt-[3px] border-opacity-40 placeholder:text-[#908282] rounded-md w-[100%] text-black h-[40px] p-3"
                  }
                  id='linkText'
                  value={formik.values.linkText}
                  name='linkText'
                  type='text'
                  label='linkText'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <div className='formik-err'>
                  {formik.touched.city && formik.errors.linkText && (
                    <div className='text-red-500'>{formik.errors.linkText}</div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className='flex justify-end p-2 items-center    '>
          <button
            onClick={() => {
              formik.handleSubmit();
            }}
            className='bg-[#0a66c2] text-[#fff] font-semibold hover:text-[#fff] hover:bg-[#004182] rounded-full w-[70px] h-[40px] '
          >
            Save
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default EditProfile;
