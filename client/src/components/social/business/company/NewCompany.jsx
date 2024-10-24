import React, {
  useEffect,
  useState,
  useContext,
  useLayoutEffect,
  useRef,
} from "react";
import Navbar from "../../Navbar";
import Tostify from "../../../Tostify";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from "../../../Loader/Loader.jsx";
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
import {
  uploadFileAWS,
  getPresignedURL,
  saveNewCompanyData,
} from "../../../../services/api";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import SnakBar from "../../../SnakBar";
import { AllContext } from "../../../../context/UserContext";

const dropZoneStyles = {
  border: "2px dashed #444444",
  borderRadius: "4px",
  marginTop: "7px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

// sample arr
const industryArr = [
  "Agriculture",
  "Automotive",
  "Banking",
  "Construction",
  "Education",
  "Energy",
  "Entertainment",
  "Finance",
  "Food",
  "Healthcare",
  "Hospitality",
  "Information Technology",
  "Insurance",
  "Manufacturing",
  "Marketing",
  "Media",
  "Mining",
  "Non-Profit",
  "Real Estate",
  "Retail",
  "Software",
  "Telecommunications",
  "Transportation",
  "Travel",
];

const companySizeArr = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1001-5000 employees",
  "5001-10000 employees",
  "10001+ employees",
];

const companyTypeArr = [
  "Sole Proprietorship",
  "Partnership",
  "Corporation",
  "Limited Liability Company",
  "Limited Liability Partnership",
  "Limited Partnership",
  "Limited Liability Corporation",
  "public limited company",
  "sole trader",
  "subsidiary",
  "trust",
];

const NewCompany = () => {
  const { setIsSnakBar, setLoading } = useContext(AllContext);
  const navigate = useNavigate();
  const inpFileRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [snak, setSnak] = useState({ type: null, text: null });

  // formik
  const formik = useFormik({
    initialValues: {
      name: "",
      website: "",
      industry: "",
      companySize: "",
      companyType: "",
      profilePicture: "",
      heading: "",
      city: "",
      state: "",
      country: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      industry: Yup.string().required("Industry is required"),
      companySize: Yup.string().required("Company size is required"),
      companyType: Yup.string().required("Company type is required"),
      city: Yup.string().required("City is required"),
      website: Yup.string()
        .nullable()
        .test("is-url", "Website should be a valid link", (value) => {
          if (value) {
            try {
              new URL(value);
              return true;
            } catch (error) {
              return false;
            }
          }
          return true;
        }),
      state: Yup.string().required("State is required"),
      country: Yup.string().required("Country is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      console.log(values); // Log the values here
      let permanentUrl;

      if (previewImage) {
        let generatedURlResponse = await getPresignedURL({
          fileType: values.profilePicture.type,
        }); // Get the presigned URL from backend
        console.log("generated url", generatedURlResponse.data.url);
        // setUploadURL(generatedURlResponse.data.url);
        let fileName = generatedURlResponse.data.fileName;
        console.log("file name is ", fileName);
        // console.log(uploadURL);  // return null

        let resFromAWS = await uploadFileAWS({
          uploadURL: generatedURlResponse.data.url,
          postFile: values.profilePicture,
          fileType: values.profilePicture.type,
        }); // Upload the file to S3 using presigned URL
        console.log(resFromAWS);
        if (resFromAWS.status === 200) {
          console.log("done");
          const bukket = import.meta.env.VITE_AWS_S3_BUCKET_NAME;
          const region = import.meta.env.VITE_AWS_REGION;
          permanentUrl = `https://${bukket}.s3.${region}.amazonaws.com/ProfilePicture/${fileName}`;
          if (permanentUrl) {
            //real works here
            let res = await saveNewCompanyData({
              ...values,
              profilePicture: permanentUrl,
            });
            if (res.status === 200) {
              console.log("done");
              setSnak({
                type: "success",
                text: "Company created successfully!",
              });
              setTimeout(() => {
                window.location.pathname = "/profile";
              }, 2000);
            } else {
              setSnak({
                type: "error",
                text: "Something went wrong!",
              });
            }
          } else {
            setSnak({
              type: "error",
              text: "error while uploading file",
            });
          }
        }
      } else {
        console.log("no image");
        let res = await saveNewCompanyData({
          ...values,
        });
        if (res.status === 200) {
          console.log("done");
          setSnak({
            type: "success",
            text: "Company created successfully!",
          });
          setTimeout(() => {
            navigate("/profile");
          }, 2000);
        } else {
          setSnak({
            type: "error",
            text: "Something went wrong!",
          });
        }
      }

      setLoading(false);
      setIsSnakBar(true);
    },
  });

  // Handle Drag Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle Drop Event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      formik.setFieldValue("profilePicture", e.dataTransfer.files[0]);
      setPreviewImage(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };
  return (
    <div className='main-overview w-[100vw] bg-[#F4F2EE] min-h-[100vh]'>
      <div className='main-overview-wrapper max-w-[100vw] overflow-x-hidden'>
        <Navbar />
        <Tostify />
        <Loader />
        {snak.type && <SnakBar type={snak.type} text={snak.text} />}
        <div className='main-display w-[80vw] flex space-x-2  min-h-[100vh] h-fit m-auto mt-[55px] p-4'>
          <div className=' min-w-[50%]  p-2'>
            <form onSubmit={formik.handleSubmit}>
              <div className='form-group page-identity bg-white rounded-sm p-2 border-2 border-gray-400 border-opacity-40'>
                <div className='p-2'>
                  <p className='text-blue-600 font-semibold'>Page Identity</p>
                </div>
                <div className='p-2 company-inputs'>
                  <div className='inpss'>
                    <inputLabel className='text-[#000]'>
                      Name{" "}
                      <span className='text-blue-600 font-semibold'>*</span>
                    </inputLabel>
                    <input
                      className={
                        "border-2  bg-white border-black mt-[3px] border-opacity-70 placeholder:text-[#908282] rounded-sm w-[100%] text-black h-[30px] p-3"
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
                  <div className='inpss mt-3'>
                    <inputLabel className='text-[#000]'>Website</inputLabel>
                    <input
                      className={
                        "border-2  bg-white border-black mt-[3px] border-opacity-70  placeholder:text-[#908282] rounded-sm w-[100%] text-black h-[30px] p-3"
                      }
                      id='website'
                      value={formik.values.website}
                      name='website'
                      placeholder='Begin with http:// or https://'
                      type='text'
                      label='website'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <p className='text-sm text-[#7c7676]'>
                      This is a link to your external website
                    </p>
                    <div className='formik-err'>
                      {formik.touched.website && formik.errors.website && (
                        <div className='text-red-500'>
                          {formik.errors.website}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='form-group company-details mt-5 bg-white rounded-sm p-2 border-2 border-gray-400 border-opacity-40'>
                <div className='p-2'>
                  <p className='text-blue-600 font-semibold'>Company Details</p>
                </div>
                <div className='p-2 company-inputs'>
                  <div className='inpss'>
                    <inputLabel className='text-[#000]'>
                      Indusrty
                      <span className='text-blue-600 font-semibold'> *</span>
                    </inputLabel>
                    <FormControl
                      sx={{ m: 1, minWidth: "97%", border: "none" }}
                      size='small'
                    >
                      <InputLabel id='demo-select-small-label text-sm'>
                        industry
                      </InputLabel>
                      <Select
                        labelId='demo-select-small-label'
                        id='demo-select-small'
                        value={formik.values.industry}
                        label='Age'
                        name='industry'
                        input={<OutlinedInput label='Industry' />}
                        className='text-black rounded-sm'
                        onChange={formik.handleChange}
                      >
                        {industryArr.map((ind, index) => {
                          return (
                            <MenuItem key={index} value={ind}>
                              {ind}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <div className='formik-err'>
                      {formik.touched.industry && formik.errors.industry && (
                        <div className='text-red-500'>
                          {formik.errors.industry}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='inpss'>
                    <inputLabel className='text-[#000]'>
                      Company Size
                      <span className='text-blue-600 font-semibold'> *</span>
                    </inputLabel>
                    <FormControl
                      sx={{ m: 1, minWidth: "97%" }}
                      variant='outlined'
                      size='small'
                    >
                      <InputLabel id='demo-select-small-label text-sm'>
                        Company Size
                      </InputLabel>
                      <Select
                        labelId='demo-select-small-label'
                        id='demo-select-small'
                        value={formik.values.companySize}
                        label='Age'
                        name='companySize'
                        input={<OutlinedInput label='company Size ' />}
                        className='text-black'
                        onChange={formik.handleChange}
                      >
                        {companySizeArr.map((ind, index) => {
                          return (
                            <MenuItem key={index} value={ind}>
                              {ind}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <div className='formik-err'>
                      {formik.touched.companySize &&
                        formik.errors.companySize && (
                          <div className='text-red-500'>
                            {formik.errors.companySize}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className='inpss'>
                    <inputLabel className='text-[#000]'>
                      Company Type
                      <span className='text-blue-600 font-semibold'> *</span>
                    </inputLabel>
                    <FormControl sx={{ m: 1, minWidth: "97%" }} size='small'>
                      <InputLabel id='demo-select-small-label text-sm'>
                        companyType
                      </InputLabel>
                      <Select
                        labelId='demo-select-small-label'
                        id='demo-select-small'
                        value={formik.values.companyType}
                        label='Age'
                        name='companyType'
                        input={<OutlinedInput label='Company Type' />}
                        className='text-black'
                        onChange={formik.handleChange}
                      >
                        {companyTypeArr.map((ind, index) => {
                          return (
                            <MenuItem key={index} value={ind}>
                              {ind}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <div className='formik-err'>
                      {formik.touched.companyType &&
                        formik.errors.companyType && (
                          <div className='text-red-500'>
                            {formik.errors.companyType}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='form-group mt-5 Profile-Detlais bg-white rounded-sm p-2 border-2 border-gray-400 border-opacity-40'>
                <div className='p-2'>
                  <p className='text-blue-600 font-semibold'>Profile Details</p>
                </div>
                <div className='p-2 company-inputs'>
                  <div className='inpss'>
                    <inputLabel className='text-[#000]'>Logo</inputLabel>
                    <div
                      className='drop-zone'
                      style={dropZoneStyles}
                      onClick={() => inpFileRef.current.click()} // Clicking the drop zone opens the file input
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop} // Handle drop event for the drag-and-drop functionality
                    >
                      {formik.values.profilePicture ? (
                        <div className='flex justify-center items-center'>
                          <img
                            src={URL.createObjectURL(
                              formik.values.profilePicture
                            )}
                            alt='profilePicture'
                            className='w-[100px] h-[100px] rounded-full'
                          />
                        </div>
                      ) : (
                        <div>
                          <CloudUploadIcon
                            className='text-gray-400 hover:text-blue-600'
                            sx={{ fontSize: 70 }}
                          />
                          <p>
                            {dragActive
                              ? "Drop the image here"
                              : "Drag & Drop image or Click to upload"}
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      className={
                        "border-2  bg-white border-black mt-[3px] border-opacity-70 placeholder:text-[#908282] rounded-sm w-[100%] text-black h-[30px] p-3 hidden"
                      }
                      id='profilePicture'
                      name='profilePicture'
                      ref={inpFileRef}
                      type='file'
                      accept='image/*' // Ensure it only accepts image files
                      label='profilePicture'
                      onChange={(e) => {
                        formik.setFieldValue(
                          "profilePicture",
                          e.target.files[0]
                        ); // Pass the selected file to formik
                        setPreviewImage(URL.createObjectURL(e.target.files[0]));
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  <div className='inpss mt-3'>
                    <inputLabel className='text-[#000]'>heading</inputLabel>
                    <textarea
                      className={
                        "border-2  bg-white border-black mt-[3px] border-opacity-70  placeholder:text-[#908282] rounded-sm w-[100%] text-black h-auto  p-3"
                      }
                      id='heading'
                      value={formik.values.heading}
                      name='heading'
                      type='text'
                      rows={3}
                      label='heading'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    ></textarea>
                    <p className='text-sm text-[#7c7676]'>
                      This is a heading for your company.
                    </p>
                  </div>
                </div>
              </div>
              <div className='form-group mt-5 location bg-white rounded-sm p-2 border-2 border-gray-400 border-opacity-40'>
                <div className='p-2'>
                  <p className='text-blue-600 font-semibold'>Location</p>
                </div>
                <div className='p-2 company-inputs'>
                  <div className='inpss '>
                    <inputLabel className='text-[#000]'>
                      city
                      <span className='text-blue-600 font-semibold'> *</span>
                    </inputLabel>
                    <input
                      className={
                        "border-2  bg-white border-black mt-[3px] border-opacity-70 placeholder:text-[#908282] rounded-sm w-[100%] text-black h-[30px] p-3"
                      }
                      id='city'
                      value={formik.values.city}
                      name='city'
                      placeholder="Enter company's city"
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
                  <div className='inpss mt-3'>
                    <inputLabel className='text-[#000]'>
                      State
                      <span className='text-blue-600 font-semibold'> *</span>
                    </inputLabel>
                    <input
                      className={
                        "border-2  bg-white border-black mt-[3px] border-opacity-70 placeholder:text-[#908282] rounded-sm w-[100%] text-black h-[30px] p-3"
                      }
                      id='state'
                      value={formik.values.state}
                      name='state'
                      type='text'
                      placeholder="Enter company's state"
                      label='state'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <div className='formik-err'>
                      {formik.touched.state && formik.errors.state && (
                        <div className='text-red-500'>
                          {formik.errors.state}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='inpss mt-3'>
                    <inputLabel className='text-[#000]'>
                      Country{" "}
                      <span className='text-blue-600 font-semibold'> *</span>
                    </inputLabel>
                    <input
                      className={
                        "border-2  bg-white border-black mt-[3px] border-opacity-70  placeholder:text-[#908282] rounded-sm w-[100%] text-black h-[30px] p-3"
                      }
                      id='country'
                      value={formik.values.country}
                      name='country'
                      placeholder="Enter company's country"
                      type='text'
                      label='country'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <div className='formik-err'>
                      {formik.touched.country && formik.errors.country && (
                        <div className='text-red-500'>
                          {formik.errors.country}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className='mt-5 flex justify-end'>
                  <button
                    className='bg-[#0a66c2] w-[100px] h-[40px] rounded-sm text-white font-semibold'
                    type='submit'
                    onClick={formik.handleSubmit}
                  >
                    Register
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className=' min-w-[50%]  p-2'>
            <div className='w-[38%] border-2 bg-white fixed border-gray-400 border-opacity-40'>
              <div className='border-b-4 font-semibold p-2 border-gray-400 border-opacity-40 '>
                Page Preview
              </div>
              <div className='comapny  p-4 '>
                <div className='comapny-img '>
                  <img
                    src={previewImage || "/blank.png"}
                    alt=''
                    className='w-[128px] h-[128px] rounded-sm border-2 border-gray-400 border-opacity-40'
                  />
                </div>
                <div>
                  <p className=' font-semibold  text-[32px]'>
                    {formik.values.name}
                  </p>
                  <p className='  text-[16px] text-[#444444]'>
                    {formik.values.heading}
                  </p>
                  <p className='  text-[15px] text-[#8e8989]'>
                    {formik.values.industry} - {formik.values.companySize}
                  </p>
                  <p className='  text-[15px] text-[#8e8989]'>
                    located at {formik.values.city}, {formik.values.state},{" "}
                    {formik.values.country}
                  </p>
                </div>
                <div className='mt-2'>
                  <button
                    className=' bg-[#0a66c2] flex justify-center items-center space-x-1 text-white font-semibold px-4 py-2 rounded-full'
                    type='button'
                  >
                    <AddIcon sx={{ fontSize: "20px" }} />
                    Follow
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCompany;
