import React, { useState, useEffect, useContext } from "react";
import { AllContext } from "../../../../context/UserContext";
import Navbar from "../../Navbar";
import Loader from "../../../Loader/Loader.jsx";
import SnakBar from "../../../SnakBar.jsx";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useParams } from "react-router-dom";
import CompanyMenu from "./CompanyMenu.jsx";
import Dashboard from "./menu/Dashboard.jsx";
import Applications from "./menu/Applications.jsx";
import PagePost from "./menu/PagePost.jsx";
import Inbox from "./menu/Inbox.jsx";
import Settings from "./menu/Setting.jsx";
import EditCompany from "./Edit/EditCompany.jsx";
import Followers from "./menu/Followers.jsx";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { getCompanyData } from "../../../../services/api.js";

const CompanyOverView = () => {
  const companyId = useParams();
  const { setLoading, setIsSnakBar } = useContext(AllContext);
  const [snak, setSnak] = useState({ type: null, text: null });
  const [companyMenu, setCompanyMenu] = useState("dashboard");
  const [editCompanyDialog, setEditCompanyDialog] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({});

  const getCompanyDataFunc = async () => {
    let res = await getCompanyData(companyId && companyId.companyId);
    if (res.status === 200) {
      console.log("this company data is", res.data);
      setCompanyDetails(res.data.allData);
    } else {
      console.log("somthing error");
    }
  };

  useEffect(() => {
    console.log("companyId;:", companyId);
    getCompanyDataFunc();
  }, []);

  return (
    <div className='main-overview w-[100vw] bg-[#F4F2EE] min-h-[100vh]'>
      <div className='main-overview-wrapper max-w-[100vw] overflow-x-hidden'>
        <Navbar />
        <Loader />
        <EditCompany
          editCompanyDialog={editCompanyDialog}
          setEditCompanyDialog={setEditCompanyDialog}
          setCompanyDetails={setCompanyDetails}
          companyDetails={companyDetails}
        />
        {snak.type && <SnakBar type={snak.type} text={snak.text} />}

        <div className='main-display w-[80vw] min-h-[100vh] h-[90vh] flex m-auto mt-[55px] p-2 space-x-3'>
          {/* Left side */}
          <div className='left-company-dash w-[25%] '>
            <div className='left-company-dash-wrapper relative bg-white border-2 border-gray-400 border-opacity-40 rounded-lg '>
              <div
                onClick={() => {
                  setEditCompanyDialog(true);
                }}
                className='absolute right-[20px] top-4'
              >
                <IconButton>
                  <EditIcon fontSize='medium' className='text-[#444444]' />
                </IconButton>
              </div>
              <div className='above-company-details p-4'>
                <div className=''>
                  <img
                    src={
                      (companyDetails &&
                        companyDetails.profilePicture &&
                        companyDetails.profilePicture) ||
                      "/blank.png"
                    }
                    className='w-[100px] h-[100px] rounded-md border-2 border-gray-400 border-opacity-40'
                    alt=''
                  />
                </div>
                <p className='text-[24px] mt-2 font-semibold'>
                  {companyDetails && companyDetails.name && companyDetails.name}
                </p>
                <p className='text-[15px]  text-[#444444] font-semibold'>
                  {companyDetails &&
                    companyDetails.followers &&
                    companyDetails.followers.length}
                </p>
                <div className='space-y-3'>
                  <button
                    type='button'
                    className='bg-[#0A66C2] text-white rounded-full px-4 py-2 flex items-center space-x-1 hover:bg-[#004182] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2 focus:ring-offset-white mt-4'
                    onClick={() => {
                      // handle button click
                    }}
                  >
                    <AddIcon />
                    <span className='duration-200 font-semibold ease-in-out transition-all'>
                      Create
                    </span>
                  </button>
                  <button
                    type='button'
                    className='outline-btn flex items-center space-x-1 p-2 pl-4 pr-4 border-2 border-gray-400 rounded-full hover:border-gray-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2 focus:ring-offset-white '
                    style={{
                      backgroundColor: "transparent",
                      boxShadow: "none",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(10,102,194,0.1)";
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      />
                    </svg>
                    <span className='text-gray-600 font-semibold'>
                      View as member
                    </span>
                  </button>
                </div>
              </div>
              <div className=' mb-4 company-menu'>
                <CompanyMenu
                  setCompanyMenu={setCompanyMenu}
                  companyMenu={companyMenu}
                  setEditCompanyDialog={setEditCompanyDialog}
                />
              </div>
            </div>
          </div>
          {/* Right side */}
          <div className='right-company-dash  w-[75%] '>
            {companyMenu === "dashboard" && <Dashboard />}
            {companyMenu === "posts" && <PagePost />}
            {companyMenu === "applications" && <Applications />}
            {companyMenu === "inbox" && <Inbox />}
            {companyMenu === "setting" && <Settings />}
            {companyMenu === "followers" && <Followers />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverView;
