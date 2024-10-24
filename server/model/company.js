import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Company name
  city: { type: String, required: true }, // Company city
  state: { type: String, required: true }, // Company state
  country: { type: String, required: true }, // Company country
  industry: { type: String, required: true }, // Company industry
  description: { type: String, required: false }, // Company description
  profilePicture: {
    type: String,
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  followers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Users who follow this user
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
