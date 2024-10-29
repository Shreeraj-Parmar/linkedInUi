import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  name: { type: String, required: true }, // Company name

  mobile: { type: Number },
  workPlace: {
    type: String,
    enum: ["Work from Home", "Office", "Remote", "Hybrid"],
  },
  foundedIn: { type: Number },
  city: { type: String, required: true }, // Company city
  state: { type: String, required: true }, // Company state
  country: { type: String, required: true }, // Company country
  industry: { type: String, required: true }, // Company industry
  description: { type: String, required: false }, // Company description
  heading: { type: String, required: false }, // Company heading
  companySize: { type: String, required: true }, // Company size
  companyType: { type: String, required: true }, // Company type
  profilePicture: {
    type: String,
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  followers: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "followers.type", // Dynamically reference either 'User' or 'Company'
      },
      type: {
        type: String,
        enum: ["User", "Company"], // Specifies if the follower is a user or a company
        required: true,
      },
    },
  ],
  following: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "following.type", // Dynamically reference either 'User' or 'Company'
      },
      type: {
        type: String,
        enum: ["User", "Company"], // Specifies if the follower is a user or a company
        required: true,
      },
    },
  ],

  applications: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The user reference
      isRead: { type: Boolean, default: false }, // New isRead field
    }, // Users who sent a connection request
  ],
  website: { type: String, required: false }, // Company website
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the company was created
  updatedAt: { type: Date, default: Date.now }, // Timestamp for last update
});

const Company = mongoose.model("Company", companySchema);

export default Company;
