import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PageInfo from "./menu/PageInfo";
import Location from "./menu/Location";
import WorkPlace from "./menu/WorkPlace";
import Overview from "./menu/Overview";
import {
  getPresignedURL,
  uploadFileAWS,
  updateCompanyData,
} from "../../../../../services/api.js";

const EditRight = ({
  setEditCompanyMenu,
  editCompanyMenu,
  companyDetails,
  setCompanyDetails,
  saveBtnRef,
  setEditCompanyDialog,
}) => {
  const [logoFile, setLogoFile] = useState(null);
  // formic logic
  const formik = useFormik({
    initialValues: {
      name: companyDetails && companyDetails.name && companyDetails.name,
      city: companyDetails && companyDetails.city && companyDetails.city,
      state: companyDetails && companyDetails.state && companyDetails.state,
      country:
        companyDetails && companyDetails.country && companyDetails.country,
      companySize:
        companyDetails &&
        companyDetails.companySize &&
        companyDetails.companySize,
      companyType:
        companyDetails &&
        companyDetails.companyType &&
        companyDetails.companyType,
      industry:
        companyDetails && companyDetails.industry && companyDetails.industry,
      profilePicture:
        companyDetails &&
        companyDetails.profilePicture &&
        companyDetails.profilePicture,
      heading:
        companyDetails && companyDetails.heading && companyDetails.heading,
      description:
        companyDetails &&
        companyDetails.description &&
        companyDetails.description,
      mobile: companyDetails && companyDetails.mobile && companyDetails.mobile,
      foundedIn:
        companyDetails && companyDetails.foundedIn && companyDetails.foundedIn,
      workPlace:
        companyDetails && companyDetails.workPlace && companyDetails.workPlace,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("name is required"),
      city: Yup.string().required("city is required"),
      state: Yup.string().required("state is required"),
      country: Yup.string().required("country is required"),
      industry: Yup.string().required("industry is required"),
      companySize: Yup.string().required("company size is required"),
      companyType: Yup.string().required("company type is required"),
      mobile: Yup.string().matches(
        /^[0-9]{10}$/,
        "Mobile number must be exactly 10 digits"
      ),
    }),
    onSubmit: async (values) => {
      console.log(values); // Log the values here
      // aws uploads
      if (logoFile) {
        let generatedURlResponse = await getPresignedURL({
          fileType: logoFile.type,
        }); // Get the presigned URL from backend
        console.log("generated url", generatedURlResponse.data.url);
        // setUploadURL(generatedURlResponse.data.url);
        let fileName = generatedURlResponse.data.fileName;
        console.log("file name is ", fileName);
        // console.log(uploadURL);  // return null

        let resFromAWS = await uploadFileAWS({
          uploadURL: generatedURlResponse.data.url,
          postFile: logoFile,
          fileType: logoFile.type,
        }); // Upload the file to S3 using presigned URL
        console.log(resFromAWS);
        if (resFromAWS.status === 200) {
          console.log("done");
          const bukket = import.meta.env.VITE_AWS_S3_BUCKET_NAME;
          const region = import.meta.env.VITE_AWS_REGION;
          const permanentUrl = `https://${bukket}.s3.${region}.amazonaws.com/ProfilePicture/${fileName}`;
          if (permanentUrl) {
            values.profilePicture = permanentUrl;
          }
        }
      }

      // update api

      let resOfUpdate = await updateCompanyData({
        ...values,
        companyId: companyDetails._id,
      });
      if (resOfUpdate.status === 200) {
        setCompanyDetails((prev) => ({
          ...prev,
          ...values,
        }));
        setEditCompanyDialog(false);
      }
    },
  });

  return (
    <div className='w-[90%]  '>
      <form onSubmit={formik.handleSubmit}>
        {editCompanyMenu === "info" && (
          <PageInfo
            formik={formik}
            logoFile={logoFile}
            setLogoFile={setLogoFile}
          />
        )}
        {editCompanyMenu === "location" && <Location formik={formik} />}
        {editCompanyMenu === "workplace" && <WorkPlace formik={formik} />}
        {editCompanyMenu === "overview" && <Overview formik={formik} />}
        <div className='diplay-none'>
          <button ref={saveBtnRef}>savebtnRefButton</button>
        </div>
      </form>
    </div>
  );
};

export default EditRight;
