import React, { useState, useEffect } from "react";
import { getAllJobsAcc, saveOrUnsaveJob } from "../../../services/api.js";
import IconButton from "@mui/material/IconButton";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useNavigate } from "react-router-dom";
const JobMarket = ({ currUserData }) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [jobList, setJobList] = useState([]);
  const [saveStatus, setSaveStatus] = useState({});
  const navigate = useNavigate();

  const getAllJobFunc = async () => {
    if (!hasMore) return;

    let res = await getAllJobsAcc({ what: "all", page });

    if (res && res.status === 200) {
      console.log("this Jobs data is", res.data.allJobs);
      const jobs = res.data.allJobs;
      let statusOfSaveorNot = {};

      jobs.forEach((job) => {
        statusOfSaveorNot[job._id] = job.savedBy?.includes(
          currUserData && currUserData._id
        );
      });
      setSaveStatus((prev) => {
        return { ...prev, ...statusOfSaveorNot };
      });

      console.log("this is status", statusOfSaveorNot);

      setJobList((prev) => [...prev, ...jobs]);

      if (jobs.length < 7) {
        setHasMore(false);
      }
    } else {
      console.log("somthing error");
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
      // If user is near the bottom of the list, load more notifications
      setPage((prevPage) => prevPage + 1); // Move to the next page
    }
  };

  const handleSavedClick = async (id) => {
    let res = await saveOrUnsaveJob({ jobId: id });

    if (res && res.status === 200) {
      console.log(res.data.message);

      setSaveStatus((prev) => {
        return { ...prev, [id]: !prev[id] };
      });
    }
  };

  useEffect(() => {
    getAllJobFunc();
  }, [page]);
  return (
    <>
      <div className='p-2  text-xl border-b-2 border-gray-400 border-opacity-40'>
        <p>Top jobs For you</p>
      </div>
      <div
        onScroll={handleScroll}
        className='flex-row justify-center   overflow-y-scroll max-h-[90%] h-[90%] min-h-[90%]   items-center'
      >
        {jobList &&
          jobList.length > 0 &&
          jobList.map((job) => (
            <div
              key={job._id}
              className='w-[100%] flex items-center cursor-pointer justify-between hover:bg-gray-200  p-5 '
            >
              <div
                className='flex gap-4 '
                onClick={() => {
                  navigate(`/job/view/${job._id}`);
                }}
              >
                <div className=''>
                  <img
                    src={job.createdBy?.company?.profilePicture || "/blank.png"}
                    className='min-w-[70px] rounded-sm max-w-[70px] min-h-[70px] max-h-[70px]'
                    alt=''
                  />
                </div>
                <div className='relative top-[-7px]'>
                  <p className='font-semibold text-xl text-blue-700 hover:underline'>
                    {job.title}
                  </p>
                  <p>{job.createdBy?.company?.name}</p>
                  <p className=' text-gray-500'>
                    {job.location} ({job.workplace})
                  </p>
                  <p>{job.salary}</p>
                  <p className='text-green-700'>
                    {job.applicants?.length || "0"} applicants
                  </p>
                </div>
              </div>
              <div
                className='relative top-[-25px]'
                onClick={() => {
                  handleSavedClick(job._id);
                }}
              >
                {saveStatus && saveStatus[job._id] ? (
                  <IconButton>
                    <BookmarkIcon className='text-blue-700' />
                  </IconButton>
                ) : (
                  <IconButton>
                    <BookmarkBorderIcon />
                  </IconButton>
                )}
              </div>
            </div>
          ))}
        {jobList && jobList.length === 0 && (
          <div className='flex justify-center min-h-[100%] items-center'>
            <img
              src='no-data.jpg'
              className='min-w-[300px] max-w-[300px] min-h-[300px] max-h-[300px]'
              alt=''
            />
          </div>
        )}
      </div>
    </>
  );
};

export default JobMarket;
