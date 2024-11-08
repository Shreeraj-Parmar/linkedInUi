import React, { useState, useEffect, useContext } from "react";
import { AllContext } from "../../../context/UserContext.jsx";
import { getAllJobsAcc, deleteJob } from "../../../services/api.js";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import SnakBar from "../../SnakBar.jsx";

const PostedJobs = () => {
  const { setIsSnakBar } = useContext(AllContext);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [jobList, setJobList] = useState([]);
  const navigate = useNavigate();
  const [snak, setSnak] = useState({ type: null, text: null });

  const getAllJobFunc = async () => {
    if (!hasMore) return;

    let res = await getAllJobsAcc({ what: "posted", page });

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

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
      // If user is near the bottom of the list, load more notifications
      setPage((prevPage) => prevPage + 1); // Move to the next page
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

  useEffect(() => {
    getAllJobFunc();
  }, [page]);
  return (
    <>
      <div className='p-2  text-xl border-b-2 border-gray-400 border-opacity-40'>
        <p>Job Posted by You</p>
      </div>
      {snak.type && <SnakBar type={snak.type} text={snak.text} />}

      <div
        onScroll={handleScroll}
        className='flex-row justify-center   overflow-y-scroll max-h-[90%] h-[90%] min-h-[90%]   items-center'
      >
        {jobList &&
          jobList.length > 0 &&
          jobList.map((job) => (
            <div
              key={job._id}
              className='w-[100%] flex items-center justify-between cursor-pointer gap-4 hover:bg-gray-200  p-5 '
            >
              <div
                onClick={() => {
                  navigate(`/job/view/${job._id}`);
                }}
                className='flex min-w-[70%] items-center gap-4'
              >
                <div className=''>
                  <img
                    src={job.createdBy.company.profilePicture || "/blank.png"}
                    className='min-w-[70px] rounded-sm max-w-[70px] min-h-[70px] max-h-[70px]'
                    alt=''
                  />
                </div>
                <div className='relative top-[-7px]'>
                  <p className='font-semibold text-xl text-blue-700 hover:underline'>
                    {job.title}
                  </p>
                  <p>{job.createdBy.company.name}</p>
                  <p className=' text-gray-500'>
                    {job.location} ({job.workplace})
                  </p>
                  <p>{job.salary}</p>
                  <p className='text-green-700'>
                    {job.applicants?.length || "0"} applicants
                  </p>
                </div>
              </div>
              <div className='w-[15%]'>
                <div className='flex space-x-4'>
                  <IconButton
                    onClick={() => {
                      navigate(`/job/edit/${job._id}`);
                    }}
                  >
                    <EditIcon className='text-yellow-500' />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      deleteFunction(job._id);
                    }}
                  >
                    <DeleteIcon className='text-red-500' />
                  </IconButton>
                </div>
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

export default PostedJobs;
