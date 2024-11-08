import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllJobsAcc, deleteJob } from "../../../../../services/api.js";
import ViewApplication from "./view-company/ViewApplication.jsx";
import SnakBar from "../../../../SnakBar.jsx";
import { AllContext } from "../../../../../context/UserContext.jsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import { IconButton } from "@mui/material";
const Applications = ({ companyDetails, setCompanyMenu }) => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const { setIsSnakBar, setSelectCompanyForJob } = useContext(AllContext);

  const [jobAppDialog, setJobAppDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [jobList, setJobList] = useState([]);
  const [snak, setSnak] = useState({ type: null, text: null });

  const [selectedJob, setSelectedJob] = useState(null);

  const getAllJobFunc = async () => {
    if (!hasMore) return;

    let res = await getAllJobsAcc({
      what: "company",
      page,
      companyId: companyId,
    });

    if (res && res.status === 200) {
      console.log("this Jobs data is", res.data.allJobs);
      const jobs = res.data.allJobs;

      setJobList((prev) => [...prev, ...jobs]);

      if (jobs.length < 7) {
        setHasMore(false);
      }
    } else {
      console.log("somthing error");
    }
  };

  const deleteFunction = async (id) => {
    setIsSnakBar(true);
    let res = await deleteJob(id);
    if (res.status === 200) {
      setSnak({ type: "success", text: `${res.data.message}` });

      console.log("deleted");
      setJobList(jobList.filter((job) => job._id !== id));
    } else if (res.status === 201) {
      console.log("You are Not author To delete it");
      setSnak({ type: "error", text: `${res.data.message}` });
    } else {
      console.log("somthing error");
      setSnak({ type: "error", text: `${res.data.message}` });
    }
  };
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
      // If user is near the bottom of the list, load more notifications
      setPage((prevPage) => prevPage + 1); // Move to the next page
    }
  };
  useEffect(() => {
    getAllJobFunc();
  }, [page]);
  return (
    <div className='p-2 border-2 border-gray-400 w-[90%] bg-white border-opacity-40 rounded-lg'>
      <div className='p-2'>
        <p className=' font-semibold text-xl'>Company Jobs</p>
        <p className=' opacity-75 text-[#7e7979]'>
          See number of job applications According Company Jobs
        </p>
      </div>
      {snak.type && <SnakBar type={snak.type} text={snak.text} />}

      <ViewApplication
        companyDetails={companyDetails}
        setCompanyMenu={setCompanyMenu}
        setJobAppDialog={setJobAppDialog}
        jobAppDialog={jobAppDialog}
        setSelectedJob={setSelectedJob}
        selectedJob={selectedJob}
      />
      <div className='job-applications'>
        <div
          onScroll={handleScroll}
          className='flex-row justify-center   overflow-y-scroll max-h-[70vh]  min-h-[70vh] items-center'
        >
          {jobList &&
            jobList.length > 0 &&
            jobList.map((job) => (
              <div
                key={job._id}
                className='w-[100%] flex items-center cursor-pointer justify-between hover:bg-gray-200  p-5 '
              >
                <div className='flex gap-4 '>
                  <div
                    onClick={() => {
                      navigate(`/job/view/${job._id}`);
                    }}
                    className=''
                  >
                    <img
                      src={job.createdBy.company.profilePicture || "/blank.png"}
                      className='min-w-[70px] rounded-sm max-w-[70px] min-h-[70px] max-h-[70px]'
                      alt=''
                    />
                  </div>
                  <div
                    onClick={() => {
                      navigate(`/job/view/${job._id}`);
                    }}
                    className='relative top-[-7px] max-w-[150px]'
                  >
                    <p className='font-semibold text-xl text-blue-700 hover:underline'>
                      {job.title}
                    </p>
                    <p>{job.createdBy.company.name}</p>
                    <p className=' text-gray-500'>
                      {job.location} ({job.workplace})
                    </p>
                    <p>{job.salary}$/year</p>
                    <p className='text-green-700'>
                      {job.applicants?.length || "0"} applicants
                    </p>
                  </div>
                  <div className='relative'>
                    <div className='flex gap-3'>
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setJobAppDialog(true);
                        }}
                        aria-label='view applications'
                        className='
                          flex
                          items-center
                          bg-white
                          text-blue-700
                          border border-blue-700
                          hover:text-white
                          hover:bg-blue-700
                          focus:outline-none
                          focus:ring-2
                          focus:ring-offset-2
                          focus:ring-blue-700
                          rounded-md
                          px-4
                          py-2
                        '
                      >
                        <DescriptionIcon />
                        <p className='ml-2'>View applications</p>
                      </button>
                      <button
                        onClick={() => {
                          navigate(`/job/edit/${job._id}`);
                        }}
                        aria-label='edit job'
                        className='
                            flex
                            items-center
                            bg-white
                            text-yellow-700
                            border border-yellow-700
                            hover:text-white
                            hover:bg-yellow-700
                            focus:outline-none
                            focus:ring-2
                            focus:ring-offset-2
                            focus:ring-yellow-700
                            rounded-md
                            px-4
                            py-2
                          '
                      >
                        <EditIcon />
                        <p className='ml-2'>Edit job</p>
                      </button>
                      <button
                        onClick={() => deleteFunction(job._id)}
                        aria-label='delete job'
                        className='
                          flex
                          items-center
                          bg-white
                          text-red-700
                          border border-red-700
                          hover:text-white
                          hover:bg-red-700
                          focus:outline-none
                          focus:ring-2
                          focus:ring-offset-2
                          focus:ring-red-700
                          rounded-md
                          px-4
                          py-2
                        '
                      >
                        <DeleteIcon />
                        <p className='ml-2'>Delete job</p>
                      </button>
                    </div>
                    <div
                      onClick={() => {
                        setSelectedJob(job);
                        setJobAppDialog(true);
                      }}
                      className='absolute bottom-0 right-0  '
                    >
                      <p className='text-green-900 hover:underline font-semibold'>
                        {job.applicants?.filter((app) => app.isRead === false)
                          .length > 0 &&
                          job.applicants?.filter((app) => app.isRead === false)
                            .length}
                        {job.applicants?.filter((app) => app.isRead === false)
                          .length > 0 && " new application"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {jobList && jobList.length === 0 && (
            <>
              <div className='flex justify-center items-center'>
                <img
                  src='/no-data.jpg'
                  alt=''
                  className='min-w-[300px] mt-5 max-w-[300px] min-h-[300px] max-h-[300px]'
                />
              </div>
              <p className='mt-2 text-center'>No Any Job, Please Add Job</p>
              <div className='flex justify-center'>
                <button
                  onClick={() => {
                    setSelectCompanyForJob(companyDetails);
                    navigate("/job/new");
                  }}
                  className='
                  bg-blue-700
                  text-white
                  border border-transparent
                  hover:bg-blue-800
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  focus:ring-blue-500
                  rounded-full
                  px-4
                  py-2
                  mt-5
                '
                >
                  Create Job
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;
