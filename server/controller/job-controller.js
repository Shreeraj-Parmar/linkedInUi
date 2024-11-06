import Company from "../model/company.js";
import User from "../model/user.js";
import Job from "../model/job.js";

// create new job
export const saveNewJob = async (req, res) => {
  console.log("req.body", req.body);
  try {
    const searchUser = await User.findById(req._id).select("company");
    console.log("searchUser", searchUser);

    if (
      searchUser &&
      searchUser.company?.length === 0 &&
      searchUser._id.toString() !== req.body.createdBy.user
    ) {
      return res.status(201).json({ message: "You are not authorized" });
    } else if (
      !searchUser.company.some(
        (company) => company.toString() === req.body.createdBy.company
      )
    ) {
      return res.status(201).json({ message: "You are not authorized" });
    } else {
      const newJob = new Job(req.body);
      let result = await newJob.save();
      console.log("job result", result);
      res.status(200).json({ message: "Job created successfully" });
    }
  } catch (error) {
    console.log(
      `error while calling saveNewJob API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// send all jobs according what , what can be "all" or "posted" or "saved"
export const sendAllJobsAccWhat = async (req, res) => {
  const { what, page, limit } = req.query;
  try {
    if (what === "all") {
      let allJobs = await Job.find({ "createdBy.user": { $ne: req._id } })
        .populate("createdBy.company", "name profilePicture salary applicants")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("title location workplace savedBy");
      res.status(200).json({ allJobs });
    } else if (what === "posted") {
      let allJobs = await Job.find({ "createdBy.user": req._id })
        .populate("createdBy.company", "name profilePicture salary applicants")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("title location workplace");
      res.status(200).json({ allJobs });
    } else if (what === "saved") {
      let allJobs = await Job.find({ savedBy: req._id })
        .populate("createdBy.company", "name profilePicture salary applicants")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("title location workplace savedBy");
      res.status(200).json({ allJobs });
    }
  } catch (error) {
    console.log(
      `error while calling sendAllJobsAccWhat API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// save or unsaved job
export const saveOrUnsaveJobInDB = async (req, res) => {
  const { jobId } = req.body;
  try {
    let job = await Job.findById(jobId).select("savedBy");
    if (job) {
      let isSaved = job.savedBy.includes(req._id);
      if (isSaved) {
        job.savedBy = job.savedBy.filter(
          (id) => id.toString() !== req._id.toString()
        );
      } else {
        job.savedBy.push(req._id);
      }
      await job.save();
      res
        .status(200)
        .json({ message: `Job ${isSaved ? "unsaved" : "saved"} successfully` });
    } else {
      res.status(201).json({ message: "Job not found" });
    }
  } catch (error) {
    console.log(
      `error while calling saveOrUnsaveJobInDB API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};
