import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Email is invalid"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      minlength: [10, "Mobile number must be at least 10 digits long"],
      maxlength: [15, "Mobile number cannot be more than 15 digits long"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female", "other"],
    },
    hobby: [
      {
        type: String,
        default: "N/A",
        trim: true,
      },
    ],
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      minlength: [5, "Pincode must be at least 5 characters long"],
      maxlength: [10, "Pincode cannot be more than 10 characters long"],
      trim: true,
    },
    hash: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
    },
    education: [
      {
        school: String,
        university: String,
        grade: String,
        degree: String,
        description: String,
        startDate: {
          month: String,
          year: Number,
        },
        endDate: {
          month: String,
          year: Number,
        },
      },
    ],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    followers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Users who follow this user
    ],
    following: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Users this user is following
    ],
    connections: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Mutual followers (Connections)
    ],
    connectionRequests: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The user reference
        isRead: { type: Boolean, default: false }, // New isRead field
      }, // Users who sent a connection request
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
