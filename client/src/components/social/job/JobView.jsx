import React, { useState, useEffect, useContext, useRef } from "react";
import Navbar from "../Navbar";
import { AllContext } from "../../../context/UserContext";
import { useParams, useNavigate } from "react-router-dom";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AddIcon from "@mui/icons-material/Add";
import ChecklistIcon from "@mui/icons-material/Checklist";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SnakBar from "../../SnakBar.jsx";
import {
  getJobDataAccId,
  getAllJobsAcc,
  saveOrUnsaveJob,
  applyNewJob,
  sendFollowReq,
  checkJobAuthorAccJobId,
} from "../../../services/api.js";
import moment from "moment";

const JobView = () => {
  const navigate = useNavigate();
  const skillRef = useRef(null);
  const { currUserData, setIsSnakBar } = useContext(AllContext);
  const { jobId } = useParams();
  const [jobData, setJobData] = useState({});
  const [nineJobs, setNineJobs] = useState([]);
  const [snak, setSnak] = useState({ type: null, text: null });
  const [isAuthourOfJob, setIsAuthourOfJob] = useState(false);

  const getJobDataFunc = async () => {
    let res = await getJobDataAccId(jobId);
    if (res.status === 200) {
      console.log("this company data is", res.data);
      setJobData(res.data.job);
    } else if (res.status === 204) {
      console.log("this company data is", res.data);
    } else {
      console.log("somthing error");
    }
  };

  const get9Jobs = async () => {
    let res = await getAllJobsAcc({ what: "9-job" });

    if (res && res.status === 200) {
      console.log("this Jobs data is", res.data.allJobs);
      setNineJobs(res.data.allJobs);
    } else {
      console.log("somthing error");
    }
  };

  const handleSavedClick = async (id) => {
    let res = await saveOrUnsaveJob({ jobId: id });

    if (res && res.status === 200) {
      console.log(res.data.message);

      setJobData((prev) => {
        return {
          ...prev,
          savedBy: prev.savedBy.includes(currUserData?._id)
            ? prev.savedBy.filter((id) => id !== currUserData?._id)
            : [...prev.savedBy, currUserData?._id],
        };
      });
    }
  };

  const handleAppliedClick = async (id) => {
    setIsSnakBar(true);

    let res = await applyNewJob({ jobId: id });

    if (res && res.status === 200) {
      console.log(res.data.message);

      setJobData((prev) => {
        return {
          ...prev,
          applicants: prev.applicants.some(
            (id) => id.userId === currUserData && currUserData._id
          )
            ? prev.applicants.filter(
                (id) => id.userId !== currUserData && currUserData._id
              )
            : [
                ...prev.applicants,
                { userId: currUserData?._id, isRead: false },
              ],
        };
      });
      setSnak({
        type: "success",
        text: "Job Application send successfully",
      });
    }
  };

  const handleFollowClick = async (receiverId, receType) => {
    let res = await sendFollowReq({
      receiverId: receiverId,
      receverType: receType,
      senderId: currUserData && currUserData._id,
      senderType: "User",
    }); // Call the follow/unfollow API

    if (res.status === 200) {
      console.log(res.data.message);

      if (receType === "Company") {
        setJobData((prev) => ({
          ...prev,
          createdBy: {
            ...prev.createdBy,
            company: {
              ...prev.createdBy.company,
              followers: prev.createdBy.company.followers.some(
                (id) => id.id === currUserData?._id && id.type === "User"
              )
                ? prev.createdBy.company.followers.filter(
                    (id) => id.id !== currUserData?._id
                  )
                : [
                    ...prev.createdBy.company.followers,
                    { id: currUserData?._id, type: "User" },
                  ],
            },
          },
        }));
      } else {
        setJobData((prev) => ({
          // amezing
          ...prev,
          createdBy: {
            ...prev.createdBy,
            user: {
              ...prev.createdBy.user,
              followers: prev.createdBy.user.followers.some(
                (id) => id.id === currUserData?._id && id.type === "User"
              )
                ? prev.createdBy.user.followers.filter(
                    (id) => id.id !== currUserData?._id
                  )
                : [
                    ...prev.createdBy.user.followers,
                    { id: currUserData?._id, type: "User" },
                  ],
            },
          },
        }));
      }

      // Toggle the follow status in the UI
    } else {
      console.error("Error while following/unfollowing:", res.data.message);
    }
  };

  const isJobAuthorFunction = async () => {
    let res = await checkJobAuthorAccJobId(jobId);
    if (res && res.status === 200) {
      setIsAuthourOfJob(true);
    } else {
      setIsAuthourOfJob(false);
    }
  };

  useEffect(() => {
    setIsSnakBar(true);
    isJobAuthorFunction();
    getJobDataFunc();
    get9Jobs();
  }, [jobId]);

  return (
    <div className='main-overview w-[100vw] bg-[#F4F2EE] min-h-[100vh]'>
      <div className='main-overview-wrapper max-w-[100vw] overflow-x-hidden'>
        <Navbar />
        {snak.type && <SnakBar type={snak.type} text={snak.text} />}

        <div className='main-display w-[80vw] min-h-[100vh] h-[90vh] m-auto mt-[55px] p-4'>
          <div className='w-[70%] border-2 relative border-gray-400 bg-white  border-opacity-40 rounded-md'>
            <div className='p-4 pb-0'>
              {isAuthourOfJob && (
                <div className='absolute top-2 right-2'>
                  <IconButton
                    onClick={() => navigate(`/job/edit/${jobData?._id}`)}
                    className='p-1'
                  >
                    <EditIcon className='text-blue-700' />
                  </IconButton>
                </div>
              )}

              <div
                onClick={() =>
                  navigate(
                    `/company/${jobData && jobData.createdBy?.company._id}`
                  )
                }
                className='flex space-x-4 cursor-pointer w-[50% ] items-center'
              >
                <img
                  src={
                    (jobData && jobData.createdBy?.company.profilePicture) ||
                    "/blank.png"
                  }
                  className='max-w-[30px] rounded-sm max-h-[30px] min-w-[50px] min-h-[50px]'
                  alt=''
                />
                <p className='font-semibold text-sm hover:underline'>
                  {(jobData && jobData.createdBy?.company.name) ||
                    "company name"}
                </p>
              </div>
            </div>
            <div className='p-4 pb-0'>
              <p className='text-2xl font-semibold'>
                {jobData && jobData.title && jobData.title}
              </p>
              <p className='text-sm mt-2 text-gray-500'>
                {jobData && jobData.location},{" "}
                <span className='text-green-700 font-semibold'>
                  {moment(
                    jobData && jobData.createdAt && jobData.createdAt
                  ).fromNow()}
                </span>{" "}
                ,
                {(jobData &&
                  jobData.applicants?.length > 0 &&
                  jobData.applicants.length) ||
                  " 0"}{" "}
                applicants
              </p>
              <div className='text-sm mt-2 flex space-x-4 items-center'>
                <BusinessCenterIcon fontSize='large' />
                <div className='pl-1 pr-1 bg-green-200 text-sm rounded-md flex items-center justify-center min-w-[100px] text-center'>
                  <p>{jobData && jobData.workplace && jobData.workplace}</p>
                </div>
                <div className='pl-1 pr-1 bg-green-200 text-sm rounded-md flex items-center justify-center min-w-[100px] text-center'>
                  <p>{jobData && jobData.jobType && jobData.jobType}</p>
                </div>
              </div>
            </div>
            <div className='p-4 pb-0 flex relative top-[-10px] items-center gap-4'>
              <ChecklistIcon fontSize='large' />
              <p
                className='hover:underline cursor-pointer'
                onClick={() => {
                  skillRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "nearest",
                  });
                }}
              >
                {
                  currUserData?.skills?.filter((val) =>
                    jobData?.skills?.includes(val)
                  ).length
                }{" "}
                of {jobData?.skills?.length} skills match your profile - you may
                be a good fit
              </p>
            </div>
            <div className='p-4 gap-4 pb-0 flex mb-4 items-center'>
              <button
                onClick={() => {
                  setIsSnakBar(true);
                  if (
                    jobData &&
                    jobData.applicants?.some(
                      (id) => id.userId === currUserData?._id
                    )
                  ) {
                    console.log("already applied");
                    setSnak({
                      type: "error",
                      text: "You have already applied for this job",
                    });
                    return;
                  }
                  if (
                    jobData &&
                    jobData.createdBy?.user._id === currUserData?._id
                  ) {
                    setSnak({
                      type: "error",
                      text: "You can not apply in your job",
                    });
                    return;
                  }
                  handleAppliedClick(jobData._id);
                }}
                className='bg-blue-700 text-white font-semibold py-2 border-[3px] border-blue-700 hover:border-blue-800 px-4 rounded-full hover:bg-blue-800'
              >
                {jobData &&
                jobData.applicants?.some(
                  (id) => id.userId === currUserData?._id
                )
                  ? "Applied"
                  : "Easy Apply"}
              </button>
              <button
                onClick={() => {
                  handleSavedClick(jobData._id);
                }}
                className='bg-transparent text-blue-700 border-[3px] border-blue-700 font-semibold py-2 px-4 rounded-full hover:bg-blue-100'
              >
                {jobData && jobData.savedBy?.includes(currUserData?._id)
                  ? "Saved"
                  : "Save"}
              </button>
            </div>
          </div>
          <div className='w-[70%] mt-4 border-2 border-gray-400 bg-white  border-opacity-40 rounded-md'>
            <div className='p-4'>
              <p className='text-xl font-semibold'>About the job</p>
            </div>
            <div className='p-4 pt-0 '>
              <p ref={skillRef} className=' font-semibold'>
                Skills{" "}
              </p>
              <ul className='list-disc opacity-80 pl-4 ml-4'>
                {jobData &&
                  jobData.skills &&
                  jobData.skills.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
              <p className=' font-semibold mt-2'>Description</p>
              <pre
                name=''
                className='mt-1 w-full pr-4 whitespace-normal break-words ml-4 opacity-80 '
                readOnly
                id=''
              >
                {jobData && jobData.description && jobData.description}
              </pre>
              <p className=' font-semibold mt-2'>Salary</p>
              <p className='opacity-80 ml-4'>
                {jobData && jobData.salary && jobData.salary}$/year
              </p>
            </div>
          </div>
          <div className='w-[50%] mt-4 border-2 border-gray-400 bg-white  border-opacity-40 rounded-md'>
            <div className='p-4'>
              <p className='text-xl font-semibold'> About the recruiter</p>
            </div>
            <div className='p-4 pt-0 flex items-center gap-3 '>
              <div>
                <img
                  src={
                    (jobData && jobData.createdBy?.user.profilePicture) ||
                    "/blank.png"
                  }
                  className='min-w-[75px] max-w-[75px] rounded-full min-h-[75px] max-h-[75px]'
                  alt=''
                />
              </div>
              <div
                className='cursor-pointer min-w-[300px]'
                onClick={() => {
                  navigate(`/user/${jobData && jobData.createdBy?.user._id}`);
                }}
              >
                <p className='font-semibold hover:underline'>
                  {jobData && jobData.createdBy?.user.name}
                </p>
                <p>
                  {(jobData &&
                    jobData.createdBy?.user.heading &&
                    jobData.createdBy?.user.heading) ||
                    jobData.createdBy?.user.role ||
                    jobData.createdBy?.user.city}
                </p>
              </div>
              <div>
                <button
                  onClick={() => {
                    handleFollowClick(jobData?.createdBy?.user._id, "User");
                  }}
                  className='bg-blue-700 text-white mt-2 ml-6 font-semibold py-2 border-[3px] border-blue-700 hover:border-blue-800 px-4 rounded-full hover:bg-blue-800'
                >
                  <span className='flex items-center gap-1'>
                    {jobData &&
                      !jobData.createdBy?.user.followers?.some(
                        (id) =>
                          id.id === currUserData?._id && id.type === "User"
                      ) && <AddIcon sx={{ fontSize: 20 }} />}{" "}
                    {jobData &&
                    jobData.createdBy?.user.followers?.some(
                      (id) => id.id === currUserData?._id && id.type === "User"
                    )
                      ? "Following"
                      : "Follow"}
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className='w-[50%] mt-4 border-2 border-gray-400 bg-white  border-opacity-40 rounded-md'>
            <div className='p-4'>
              <p className='text-xl font-semibold'> About the Company</p>
            </div>
            <div className='p-4 pt-0 flex items-center gap-3 '>
              <div>
                <img
                  src={
                    (jobData && jobData.createdBy?.company.profilePicture) ||
                    "/blank.png"
                  }
                  className='min-w-[75px] max-w-[75px] rounded-full min-h-[75px] max-h-[75px]'
                  alt=''
                />
              </div>
              <div
                className='cursor-pointer min-w-[300px]'
                onClick={() => {
                  navigate(
                    `/company/${jobData && jobData.createdBy?.company._id}`
                  );
                }}
              >
                <p className='font-semibold hover:underline'>
                  {jobData && jobData.createdBy?.company.name}
                </p>
                <p className='opacity-60 hover:underline'>
                  {jobData && jobData.createdBy?.company.followers.length}{" "}
                  followers
                </p>
              </div>
              <div>
                <button
                  onClick={() => {
                    handleFollowClick(
                      jobData?.createdBy?.company._id,
                      "Company"
                    );
                  }}
                  className='bg-blue-700 text-white mt-2 ml-6 font-semibold py-2 border-[3px] border-blue-700 hover:border-blue-800 px-4 rounded-full hover:bg-blue-800'
                >
                  <span className='flex items-center gap-1'>
                    {jobData &&
                      !jobData.createdBy?.company.followers?.some(
                        (id) =>
                          id.id === currUserData?._id && id.type === "User"
                      ) && <AddIcon sx={{ fontSize: 20 }} />}
                    {jobData &&
                    jobData.createdBy?.company.followers?.some(
                      (id) => id.id === currUserData?._id && id.type === "User"
                    )
                      ? "Following"
                      : "Follow"}
                  </span>
                </button>
              </div>
            </div>
            <div className='w-[100%] pt-0 p-4'>
              <pre
                name=''
                className='w-[100%] mt-1 ml-4 opacity-80 h-auto text-wrap'
                readOnly
                id=''
              >
                {jobData && jobData.createdBy?.company.description}
              </pre>
            </div>
          </div>
          <div className='w-[70%] mt-4'>
            <div className='p-4'>
              <p className='text-xl font-semibold'> More jobs for you</p>
            </div>
            <div className='p- pt-0 flex w-[100%]  items-center'>
              <div className='flex gap-4 flex-wrap'>
                {nineJobs &&
                  nineJobs.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        console.log(item._id);
                        window.location.href = `/job/view/${item._id}`;
                      }}
                      className='p-4 cursor-pointer  border-2 border-gray-400 bg-white  border-opacity-40 min-w-[30%] rounded-md '
                    >
                      <div>
                        <img
                          src={
                            item.createdBy?.company.profilePicture ||
                            "/blank.png"
                          }
                          className='min-w-[75px] max-w-[75px] rounded-sm min-h-[75px] max-h-[75px]'
                          alt=''
                        />
                      </div>
                      <div>
                        <p className='font-semibold hover:underline mt-2 text-blue-700 text-xl'>
                          {item.title}
                        </p>
                        <p className='text-sm'>
                          {item.createdBy?.company.name}
                        </p>
                        <p className='opacity-90'>
                          {item.location} <span>({item.workplace})</span>
                        </p>
                        <p className='text-sm opacity-50'>
                          {moment(item.createdAt).fromNow()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div>
            <div className='flex mt-3 justify-start mb-10'>
              <button
                onClick={() => {
                  navigate("/jobs");
                }}
                className='bg-blue-700 text-white mt-2  font-semibold py-2 border-[3px] border-blue-700 hover:border-blue-800 px-4 rounded-full hover:bg-blue-800'
              >
                See more jobs like this
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobView;
