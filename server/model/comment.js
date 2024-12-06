import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
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
  text: { type: String, required: true }, // Comment text
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
