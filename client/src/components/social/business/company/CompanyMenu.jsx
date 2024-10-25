import React from "react";

const CompanyMenu = ({ setCompanyMenu, companyMenu }) => {
  return (
    <div className='menu-company flex-row'>
      <div
        onClick={() => {
          setCompanyMenu("dashboard");
        }}
        className={` ${
          companyMenu === "dashboard" &&
          "border-l-4 border-green-700  text-green-700 pl-3"
        } menu-btn-wrapper p-4 hover:bg-[#F3F3F3] font-semibold text-[#444444] cursor-pointer text-[17px]`}
      >
        <p>Dashboard</p>
      </div>
      <div
        onClick={() => {
          setCompanyMenu("posts");
        }}
        className={` ${
          companyMenu === "posts" &&
          "border-l-4 border-green-700 text-green-700 pl-3"
        } menu-btn-wrapper p-4  hover:bg-[#F3F3F3] font-semibold text-[#444444] cursor-pointer text-[17px]`}
      >
        <p>Page Post</p>
      </div>
      <div
        onClick={() => {
          setCompanyMenu("applications");
        }}
        className={` ${
          companyMenu === "applications" &&
          "border-l-4 border-green-700 text-green-700 pl-3"
        } menu-btn-wrapper p-4 hover:bg-[#F3F3F3] font-semibold text-[#444444] cursor-pointer text-[17px]`}
      >
        <p>Job Applications</p>
      </div>
      <div
        onClick={() => {
          setCompanyMenu("followers");
        }}
        className={` ${
          companyMenu === "followers" &&
          "border-l-4 border-green-700 text-green-700 pl-3"
        } menu-btn-wrapper p-4 hover:bg-[#F3F3F3] font-semibold text-[#444444] cursor-pointer text-[17px]`}
      >
        <p>Followers</p>
      </div>
      <div
        onClick={() => {
          setCompanyMenu("inbox");
        }}
        className={` ${
          companyMenu === "inbox" &&
          "border-l-4 border-green-700 text-green-700 pl-3"
        } menu-btn-wrapper p-4 hover:bg-[#F3F3F3] font-semibold text-[#444444] cursor-pointer text-[17px]`}
      >
        <p>Inbox</p>
      </div>
      <div
        onClick={() => {
          //open dialog
        }}
        className={`  menu-btn-wrapper p-4 hover:bg-[#F3F3F3] font-semibold text-[#444444] cursor-pointer text-[17px]`}
      >
        <p>Edit Page</p>
      </div>
      <div className='p-4'>
        <hr />
      </div>
      <div
        onClick={() => {
          setCompanyMenu("setting");
        }}
        className={` ${
          companyMenu === "setting" &&
          "border-l-4 border-green-700 text-green-700 pl-3"
        } menu-btn-wrapper p-4 hover:bg-[#F3F3F3] font-semibold text-[#444444] cursor-pointer text-[17px]`}
      >
        <p>Setting</p>
      </div>
    </div>
  );
};

export default CompanyMenu;
