import User from "../model/user.js";
import Post from "../model/post.js";
import Comment from "../model/comment.js";

// send Total num of users & posts, only
export const sendUserDataAccId = async (req, res) => {
  //   console.log(req.params);
  const { id } = req.params;
  try {
    let userDataById = await User.findById(id);
    //   console.log("User data after populate:", userDataById); // Log after populate
    if (userDataById) {
      res
        .status(200)
        .json({ message: "send data successfully", user: userDataById });
    } else {
      res.status(203).json({ message: "user not found !" });
    }
  } catch (error) {
    console.log(
      `error while calling sendUserDataAccId API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// check admin or not !
export const checkAdminOrNot = async (req, res) => {
  try {
    let checkAdmin = await User.findOne({ email: req.user });

    if (checkAdmin.isAdmin) {
      res.status(200).json({ message: "You are admin, validation done" });
    } else {
      res.status(201).json({ message: "You are not admin !" });
    }
  } catch (error) {
    console.log(
      `error while calling checkAdminOrNot API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// verify token & user
export const sendTokenValidation = async (req, res) => {
  try {
    let checkAdmin = await User.findOne({ email: req.user });

    if (checkAdmin) {
      res.status(200).json({ message: "TOken & user valisdate" });
    } else {
      res.status(204).json({ message: "user not exists!" });
    }
  } catch (error) {
    console.log(
      `error while calling sendTokenValidation API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// send routs scc user & admin
export const sendRoutsAccToken = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.user });

    if (user) {
      if (user.isAdmin) {
        res.status(200).json({ message: "You Are admin", route: "/lists" });
      } else {
        res.status(200).json({ message: "You Are admin", route: "/" });
      }
    } else {
      res.status(204).json({ message: "user not exists!" });
    }
  } catch (error) {
    console.log(
      `error while calling sendRoutsAccToken API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// send users & post count to admin
export const sendCount = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.user });

    if (user) {
      if (user.isAdmin) {
        let userCount = await User.countDocuments();
        let postCount = await Post.countDocuments();
        console.log(`User count: ${userCount}`);
        console.log(`Post count: ${postCount}`);
        res.status(200).json({
          message: "count send successfull",
          userCount: userCount,
          postCount: postCount,
        });
      } else {
        res.status(204).json({ message: "You Are not admin", route: "/login" });
      }
    } else {
      res.status(204).json({ message: "user not exists!", route: "/login" });
    }
  } catch (error) {
    console.log(
      `error while calling sendCount API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};
