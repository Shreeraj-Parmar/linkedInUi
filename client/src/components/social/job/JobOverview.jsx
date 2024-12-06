import React, { useState, useContext } from "react";
import Navbar from "../Navbar";
import { AllContext } from "../../../context/UserContext";
import ChooseCompanyDialog from "./ChooseCompanyDialog";
import JobMarket from "./JobMarket";
import SavedJobs from "./SavedJobs";
import PostedJobs from "./PostedJobs";
import SnakBar from "../../SnakBar";

const Overview = () => {
  const [jobMenu, setJobMenu] = useState("marketplace");
  const {
    currUserData,
    setIsSnakBar,
    selectCompanyForJob,
    setSelectCompanyForJob,
  } = useContext(AllContext);
  const [selectCompanyDialog, setSelectCompanyDialog] = useState(false);
  const [snak, setSnak] = useState({ type: null, text: null });

  return (
    <div className='main-overview w-[100vw] bg-[#F4F2EE] min-h-[100vh]'>
      <div className='main-overview-wrapper max-w-[100vw] overflow-x-hidden'>
        <Navbar />
        {snak.type && <SnakBar type={snak.type} text={snak.text} />}

        <ChooseCompanyDialog
          setSelectCompanyDialog={setSelectCompanyDialog}
          selectCompanyDialog={selectCompanyDialog}
          currUserData={currUserData}
          selectCompanyForJob={selectCompanyForJob}
          setSelectCompanyForJob={setSelectCompanyForJob}
        />
        <div className='main-display w-[80vw] min-h-[100vh] max-h-[100vh]  h-[90vh] m-auto mt-[55px] p-4'>
          <div className='flex gap-4'>
            <div className='job-left bg-white max-w-[20%] max-h-[29vh] rounded-md border-2 border-gray-400 border-opacity-40 font-semibold min-w-[20%]'>
              <div
                onClick={() => {
                  setJobMenu("marketplace");
                }}
                className={`p-3 pl-5 ${
                  jobMenu === "marketplace" &&
                  "border-l-4 border-green-700 pl-[16px] "
                } mt-2 cursor-pointer hover:bg-[#F3F3F3]`}
              >
                <p>Job Marketplace</p>
              </div>
              <div
                onClick={() => {
                  setJobMenu("saved");
                }}
                className={`cursor-pointer ${
                  jobMenu === "saved" &&
                  "border-l-4 border-green-700 pl-[16px] "
                } p-3 pl-5 hover:bg-[#F3F3F3]`}
              >
                <p>Saved Jobs</p>
              </div>
              <div
                onClick={() => {
                  setJobMenu("post");
                }}
                className={`cursor-pointer ${
                  jobMenu === "post" && "border-l-4 border-green-700 pl-[16px] "
                } p-3 pl-5 hover:bg-[#F3F3F3]`}
              >
                <p>Posted Jobs</p>
              </div>
              <div
                onClick={() => {
                  setIsSnakBar(true);
                  if (currUserData?.company?.length > 0) {
                    setSelectCompanyDialog(true);
                  } else {
                    setSnak({
                      type: "error",
                      text: "At least one company is required to post job",
                    });
                  }
                }}
                className={`mb-2 cursor-pointer  p-3 pl-5 hover:bg-[#F3F3F3]`}
              >
                <p>Create New Job</p>
              </div>
            </div>

            <div className='job-right bg-white border-2 border-gray-400 border-opacity-40 min-h-[70vh]  max-h-[90vh] rounded-md min-w-[60%]'>
              {jobMenu === "marketplace" && (
                <JobMarket currUserData={currUserData} />
              )}
              {jobMenu === "saved" && <SavedJobs currUserData={currUserData} />}
              {jobMenu === "post" && <PostedJobs currUserData={currUserData} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
