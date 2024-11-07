import Company from "../model/company.js";
import User from "../model/user.js";
import Job from "../model/job.js";
import { io, socketClient } from "../index.js";

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
  const { what, page = 1, limit = 7 } = req.query; // Ensure default values
  const pageNumber = parseInt(page, 7); // Parse page as an integer
  const limitNumber = parseInt(limit, 7); // Parse limit as an integer

  try {
    if (what === "all") {
      let allJobs = await Job.find({ "createdBy.user": { $ne: req._id } })
        .populate("createdBy.company", "name profilePicture")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .select("title location workplace salary applicants savedBy");
      res.status(200).json({ allJobs });
    } else if (what === "9-job") {
      let allJobs = await Job.find({ "createdBy.user": { $ne: req._id } })
        .populate("createdBy.company", "name profilePicture")
        .sort({ createdAt: -1 })
        .limit(9)
        .select("title location workplace createdAt");
      res.status(200).json({ allJobs });
    } else if (what === "company") {
      let allJobs = await Job.find({ "createdBy.company": req.query.companyId })
        .populate("createdBy.company", "name profilePicture")
        .sort({ createdAt: -1 })
        .limit(9)
        .select("title location workplace salary applicants createdAt");
      res.status(200).json({ allJobs });
    } else if (what === "posted") {
      let allJobs = await Job.find({ "createdBy.user": req._id })
        .populate("createdBy.company", "name profilePicture salary applicants")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .select("title location workplace");
      res.status(200).json({ allJobs });
    } else if (what === "saved") {
      let allJobs = await Job.find({ savedBy: req._id })
        .populate("createdBy.company", "name profilePicture salary applicants")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
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

// send job data according job id
export const sendJobDataAccId = async (req, res) => {
  const { jobId } = req.params;
  try {
    let job = await Job.findOne({ _id: jobId })
      .populate(
        "createdBy.company",
        "name profilePicture description followers location"
      )
      .populate(
        "createdBy.user",
        "name profilePicture heading role city followers"
      );

    if (job) {
      res.status(200).json({ job });
    } else {
      res.status(201).json({ message: "Job not found" });
    }
  } catch (error) {
    console.log(
      `error while calling sendJobDataAccId API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// save a new applicant in job
export const saveApplicantInJob = async (req, res) => {
  const { jobId } = req.body;
  try {
    let job = await Job.findById(jobId);
    if (job) {
      job.applicants.push({ userId: req._id, isRead: false });
      await job.save();

      io.emit(`unread_applicant_${job.createdBy.company}`, "new applicant");

      res.status(200).json({ message: "Applicant saved successfully" });
    } else {
      res.status(201).json({ message: "Job not found" });
    }
  } catch (error) {
    console.log(
      `error while calling saveApplicantInJob API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// send unreaad applications count
export const sendUnreadAppCount = async (req, res) => {
  const { companyId } = req.query;
  console.log("companyId", companyId);
  try {
    let count = await Job.countDocuments({
      "createdBy.company": companyId,
      "applicants.isRead": false,
    });
    res.status(200).json({ count });
  } catch (error) {
    console.log(
      `error while calling sendUnreadAppCount API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// send all job applications according jobid
export const sendAllAppAccJobId = async (req, res) => {
  const { jobId, page, limit } = req.query;
  try {
    let allApp = await Job.findById(jobId)
      .select("applicants")
      .populate("applicants.userId", "name profilePicture city")
      .skip((page - 1) * limit)
      .limit(limit);
    if (allApp) {
      res.status(200).json({ allApp });
    } else {
      res.status(201).json({ message: "Job not found" });
    }
  } catch (error) {
    console.log(
      `error while calling sendAllAppAccJobId API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// update all isRead : true acc jobId
export const updateIsreadInDB = async (req, res) => {
  const { jobId } = req.body;
  try {
    let job = await Job.findById(jobId);
    if (job) {
      job.applicants.forEach((app) => {
        app.isRead = true;
      });
      await job.save();
      res.status(200).json({ message: "Job applications marked as read" });
    } else {
      res.status(201).json({ message: "Job not found" });
    }
  } catch (error) {
    console.log(
      `error while calling updateIsreadInDB API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};
