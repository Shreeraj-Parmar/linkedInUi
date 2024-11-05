import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [String],
    salary: { type: String },
    location: { type: String },
    skills: [
      {
        type: String,
      },
    ],
    jobType: {
      type: String,
      enum: [
        "Full Time",
        "Part Time",
        "Contract",
        "FreeLance",
        "Internship",
        "Volunteer",
        "Other",
      ],
      required: true,
    },
    workplace: {
      type: String,
      enum: ["Work from Home", "Office", "Remote", "Hybrid"],
      required: true,
    },
    createdBy: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
      },
    },
    applicants: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        isRead: { type: Boolean, default: false },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
