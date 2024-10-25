import React from "react";

const EditMenu = ({ setEditCompanyMenu, editCompanyMenu }) => {
  return (
    <div className='menu-company flex-row'>
      <div
        onClick={() => {
          setEditCompanyMenu("info");
        }}
        className={` ${
          editCompanyMenu === "info" &&
          "border-l-4 border-green-700  text-green-700 pl-3"
        } menu-btn-wrapper p-4 hover:bg-[#F3F3F3] font-semibold text-[#444444] cursor-pointer text-[17px]`}
      >
        <p>Page Info</p>
      </div>
      <div
        onClick={() => {
          setEditCompanyMenu("overview");
        }}
        className={` ${
          editCompanyMenu === "overview" &&
          "border-l-4 border-green-700 text-green-700 pl-3"
        } menu-btn-wrapper p-4  hover:bg-[#F3F3F3] font-semibold text-[#444444] cursor-pointer text-[17px]`}
      >
        <p>Overview</p>
      </div>
      <div
        onClick={() => {
          setEditCompanyMenu("workplace");
        }}
        className={` ${
          editCompanyMenu === "workplace" &&
          "border-l-4 border-green-700 text-green-700 pl-3"
        } menu-btn-wrapper p-4 hover:bg-[#F3F3F3] font-semibold text-[#444444] cursor-pointer text-[17px]`}
      >
        <p>Workplace</p>
      </div>

      <div className='p-4'>
        <hr />
      </div>
      <div
        onClick={() => {
          setEditCompanyMenu("location");
        }}
        className={` ${
          editCompanyMenu === "location" &&
          "border-l-4 border-green-700 text-green-700 pl-3"
        } menu-btn-wrapper p-4 hover:bg-[#F3F3F3] font-semibold text-[#444444] cursor-pointer text-[17px]`}
      >
        <p>Location</p>
      </div>
    </div>
  );
};

export default EditMenu;
