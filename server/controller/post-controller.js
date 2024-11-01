import Post from "../model/post.js";
import User from "../model/user.js";
import Company from "../model/company.js"; // Adjust the path as necessary

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

    // Create a new post with the createdBy structure
    let newPost = new Post({
      createdBy: {
        type: req.body.createdBy.type, // 'User' or 'Company'
        id: req.body.createdBy.id, // user or company ID
      },
      text: req.body.text,
      mediaUrls: mediaUrls,
    });

    // Save the post to the database
    let savedPost = await newPost.save();
    console.log("saved post in db is", savedPost);

    // If post is saved successfully, update the user's or company's posts array
    if (savedPost) {
      // Update the respective user's posts array
      if (req.body.createdBy.type === "User") {
        await User.findByIdAndUpdate(
          req.body.createdBy.id, // user ID from createdBy
          { $push: { posts: savedPost._id } },
          { new: true }
        );
      } else if (req.body.createdBy.type === "Company") {
        await Company.findByIdAndUpdate(
          req.body.createdBy.id, // company ID from createdBy
          { $push: { posts: savedPost._id } },
          { new: true }
        );
      }

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

    // Fetch posts with pagination, populating the createdBy field
    let allPosts = await Post.find()
      .populate({
        path: "createdBy.id", // Use the dynamic reference
        select: "name city role followers heading profilePicture", // Specify fields to return
      })
      .sort({ createdAt: -1 }) // Sort by creation date, latest first
      .skip(skip) // Skip the posts according to pagination
      .limit(limitNumber); // Limit the number of posts fetched

    // Get the total number of posts for further use (like checking if there are more posts)
    const totalPosts = await Post.countDocuments();

    // Return posts and information about pagination
    res
      .status(200)
      .json({ allPosts, totalPosts, page: pageNumber, limit: limitNumber });
  } catch (error) {
    console.log(
      `Error while calling sendAllPosts API & error is: ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// update like count in db
export const updateLike = async (req, res) => {
  let { postId, whoLiked, type } = req.body;

  console.log(req.body);

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Create the liker object based on whether it's a user or company
    const liker = {
      type: type, // Set type based on isCompany
      id: whoLiked, // ID of the user or company
    };

    // Check if the liker is already in the likedBy array
    if (
      !post.likedBy.some(
        (like) => like.id.toString() === whoLiked && like.type === liker.type
      )
    ) {
      // Add user/company to likes array if not already liked
      post.likedBy.push(liker);
    } else {
      // Remove user/company from likes array if already liked
      post.likedBy = post.likedBy.filter(
        (like) => !(like.id.toString() === whoLiked && like.type === liker.type)
      );
    }

    post.likeCount = post.likedBy.length; // Update the like count

    let finalRes = await post.save();
    let FinalLikeStatus = finalRes.likedBy.some(
      (like) => like.id.toString() === whoLiked && like.type === liker.type
    );

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
      `Error while calling updateLike API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// save comment into DB
export const saveCommentIntoDB = async (req, res) => {
  // console.log(req.body);
  let { postId, whoCommented, text, type } = req.body;
  try {
    let userIs = {
      type: type, // Set type based on isCompany
      id: whoCommented, // ID of the user or company
    };

    const newComment = new Comment({
      createdBy: userIs,
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
    let commentsList = await Comment.find({ post: req.query.postId }).populate({
      path: "createdBy.id", // Use the dynamic reference
      select: "name city profilePicture", // Specify fields to return
    });
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
  console.log(req.body);
  let { postId, text, mediaUrls, who, createdId } = req.body;

  let whoIs = who || createdId;
  try {
    const post = await Post.findById(postId);
    if (post.createdBy.id.toString() !== whoIs.toString()) {
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
    let allPosts = await Post.find({ "createdBy.id": userid })
      .populate("createdBy.id", "name city profilePicture") // Populate user information
      .sort({ createdAt: -1 }) // Sort by creation date, latest first
      .skip(skip) // Skip the posts according to pagination
      .limit(limitNumber); // Limit the number of posts fetched

    res.status(200).json({ allPosts });
  } catch (error) {
    console.log(
      `Error while calling sendAllPostsAccUser API & error is: ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};
