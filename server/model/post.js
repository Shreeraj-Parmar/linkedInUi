import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  createdBy: {
    type: {
      type: String,
      enum: ["User", "Company"], // Specifies if the post is by a user or company
      required: true,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "createdBy.type", // Dynamically reference either 'User' or 'Company' model
    },
  },
  text: { type: String, required: false }, // Post content text
  mediaUrls: [
    {
      url: { type: String },
      fileType: { type: String },
      // Can be 'image' or 'video'
    },
    { _id: false },
  ], // URLs of media files (images, videos) - e.g., from AWS S3
  likeCount: { type: Number, default: 0 }, // Count of likes
  likedBy: [
    {
      type: {
        type: String,
        enum: ["User", "Company"], // Specifies if the liker is a user or company
        required: true,
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "likedBy.type", // Dynamically reference 'User' or 'Company'
      },
      _id: false,
    },
  ],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Array of comment IDs referencing Comment model
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the post was created
  updatedAt: { type: Date, default: Date.now }, // Timestamp for last update
});

const Post = mongoose.model("Post", postSchema);

export default Post;
