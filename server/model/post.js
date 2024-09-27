import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Post author
  text: { type: String, required: true }, // Post content text
  url: { type: String }, // URLs of media files (images, videos) - e.g., from AWS S3
  likeCount: { type: Number, default: 0 }, // Count of likes
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of users who liked the post
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Array of comment IDs referencing Comment model
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the post was created
  updatedAt: { type: Date, default: Date.now }, // Timestamp for last update
});

const Post = mongoose.model("Post", postSchema);

export default Post;
