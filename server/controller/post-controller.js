import Post from "../model/post.js";
import User from "../model/user.js";
import Comment from "../model/comment.js";
import mongoose from "mongoose";

// save post into DB
export const savePostDataIntoDB = async (req, res) => {
  console.log("this is media urls", req.body.mediaUrls);

  try {
    let mediaUrls = [];

    // Check if mediaUrls exists and assign it
    if (req.body.mediaUrls && req.body.mediaUrls.length > 0) {
      mediaUrls = req.body.mediaUrls.map(({ url, fileType }) => ({
        url,
        fileType,
      }));
    }

    let newPost = new Post({
      user: req._id,
      text: req.body.text,
      mediaUrls: mediaUrls, // Now using the correctly scoped mediaUrls
    });

    // Save the post to the database
    let savedPost = await newPost.save();
    console.log("saved post in db is", savedPost);

    // If post is saved successfully, update the user's posts array
    if (savedPost) {
      await User.findByIdAndUpdate(
        req._id,
        { $push: { posts: savedPost._id } },
        { new: true }
      );

      res
        .status(200)
        .json({ message: "post saved successfully", postId: savedPost._id });
    } else {
      res.status(201).json({ message: "error while saving post" });
    }
  } catch (error) {
    console.log(
      `error while calling savePostDataIntoDB API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// send all post to frontend
export const sendAllPosts = async (req, res) => {
  // Extract page and limit from the request query parameters
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

  try {
    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate the number of posts to skip
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch posts with pagination
    let allPosts = await Post.find()
      .populate("user", "name city profilePicture") // Populate user information
      .sort({ createdAt: -1 }) // Sort by creation date, latest first
      .skip(skip) // Skip the posts according to pagination
      .limit(limitNumber); // Limit the number of posts fetched

    // Get the total number of posts for further use (like checking if there are more posts)
    // const totalPosts = await Post.countDocuments();

    // Return posts and information about pagination
    res.status(200).json({ allPosts });
  } catch (error) {
    console.log(
      `Error while calling sendAllPosts API & error is: ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// update like count in db
export const updateLike = async (req, res) => {
  // console.log(req.body);
  let { postId, likeStatus, whoLiked } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post.likedBy.includes(whoLiked)) {
      // Add user to likes array if not already liked
      post.likedBy.push(whoLiked);
    } else {
      // Remove user from likes array if user already liked the post
      post.likedBy = post.likedBy.filter((id) => id.toString() !== whoLiked);
    }
    post.likeCount = post.likedBy.length;

    let finalRes = await post.save();
    let FinalLikeStatus = finalRes.likedBy.includes(whoLiked);
    console.log(finalRes);
    if (finalRes) {
      res.status(200).json({
        success: true,
        message: "Like status updated",
        FinalLikeStatus: FinalLikeStatus,
      });
    } else {
      res
        .status(201)
        .json({ success: false, message: "Like status not updated !!!!!" });
    }
  } catch (error) {
    console.log(
      `error while calling updateLike API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// save comment into DB
export const saveCommentIntoDB = async (req, res) => {
  // console.log(req.body);
  let { postId, whoCommented, text } = req.body;
  try {
    const newComment = new Comment({
      user: whoCommented,
      text: text,
      post: postId,
    });
    let savedComment = await newComment.save();
    console.log(savedComment);
    if (savedComment) {
      await Post.findByIdAndUpdate(
        postId,
        { $push: { comments: savedComment._id } }, // Push new comment ID
        { new: true } // Return the updated document
      );
      res.status(200).json({ success: true, message: "Comment Added" });
    } else {
      res.status(201).json({
        success: false,
        message: "Somthing Error Wile Adding Comment !!!!!",
      });
    }
  } catch (error) {
    console.log(
      `error while calling saveCommentIntoDB API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// send all comments acc post
export const sendCommentAccPost = async (req, res) => {
  // console.log(req.query);
  try {
    let commentsList = await Comment.find({ post: req.query.postId }).populate(
      "user",
      "name city profilePicture"
    );
    if (commentsList) {
      res.status(200).json({ commentsList });
    } else {
      res.status(201).json({
        success: false,
        message: "Somthing Error Wile sending Comment !!!!!",
      });
    }
  } catch (error) {
    console.log(
      `error while calling sendCommentAccPost API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// send comment counts

export const sendCommentCount = async (req, res) => {
  try {
    let allCommentCount = await Post.find({}, { _id: 1, comments: 1 });

    if (allCommentCount) {
      res.status(200).json({ allCommentCount });
    } else {
      res.status(201).json({
        success: false,
        message: "Somthing Error Wile sending Comment count!!!!!",
      });
    }
  } catch (error) {
    console.log(
      `error while calling sendCommentCount API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// update post
export const updatePostDataInDB = async (req, res) => {
  let { postId, text, mediaUrls } = req.body;
  try {
    const post = await Post.findById(postId);
    if (post.user.toString() !== req._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "you are not authorized to update this post",
      });
    }
    post.text = text;
    post.mediaUrls = mediaUrls;
    let finalRes = await post.save();
    console.log("updated pppost is here", finalRes);
    if (finalRes) {
      res.status(200).json({ success: true, message: "Post Updated" });
    } else {
      res
        .status(201)
        .json({ success: false, message: "Post not Updated !!!!!" });
    }
  } catch (error) {
    console.log(
      `error while calling updatePostDataInDB API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendAllPostsAccUser = async (req, res) => {
  // Extract page and limit from the request query parameters
  const { page = 1, limit = 10, userid } = req.query; // Default to page 1 and limit 10 if not provided
  console.log("req queary is for post acc user", req.query);
  try {
    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate the number of posts to skip
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch posts with pagination
    let allPosts = await Post.find({ user: userid })
      .populate("user", "name city profilePicture") // Populate user information
      .sort({ createdAt: -1 }) // Sort by creation date, latest first
      .skip(skip) // Skip the posts according to pagination
      .limit(limitNumber); // Limit the number of posts fetched

    // Get the total number of posts for further use (like checking if there are more posts)
    // const totalPosts = await Post.countDocuments();

    // Return posts and information about pagination
    // console.log("all posts is for user perticular", allPosts);
    res.status(200).json({ allPosts });
  } catch (error) {
    console.log(
      `Error while calling sendAllPostsAccUser API & error is: ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};
