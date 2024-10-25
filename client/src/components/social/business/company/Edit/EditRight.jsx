import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PageInfo from "./menu/PageInfo";
import Location from "./menu/Location";
import WorkPlace from "./menu/WorkPlace";
import Overview from "./menu/Overview";

const EditRight = ({ setEditCompanyMenu, editCompanyMenu }) => {
  // formic logic
  const formik = useFormik({
    initialValues: {
      name: "",
      city: "",
      state: "",
      country: "",
      companySize: "",
      companyType: "",
      industry: "",
      profilePicture: "",
      heading: "",
      description: "",
      mobile: "",
      foundedIn: "",
      workPlace: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("name is required"),
      city: Yup.string().required("city is required"),
      state: Yup.string().required("state is required"),
      country: Yup.string().required("country is required"),
      industry: Yup.string().required("industry is required"),
      companySize: Yup.string().required("company size is required"),
      companyType: Yup.string().required("company type is required"),
    }),
    onSubmit: async (values) => {
      console.log(values); // Log the values here
    },
  });

  return (
    <div className='w-[90%]  '>
      <form onSubmit={formik.handleSubmit}>
        {editCompanyMenu === "info" && <PageInfo formik={formik} />}
        {editCompanyMenu === "location" && <Location formik={formik} />}
        {editCompanyMenu === "workplace" && <WorkPlace formik={formik} />}
        {editCompanyMenu === "overview" && <Overview formik={formik} />}
      </form>
    </div>
  );
};

export default EditRight;
