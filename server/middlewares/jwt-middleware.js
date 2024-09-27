import jwt from "jsonwebtoken";
import User from "../model/user.js";

const jwtMiddle = async (req, res, next) => {
  console.log("req headeers", req.headers.authorization);
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  console.log("token is :", token);
  if (!token) {
    return res.status(204).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    console.log("decode info is ", decoded);
    req.user = decoded.user; // Attach the user to the request object
    let findUser = await User.findOne({ email: req.user });
    // console.log("finded user with token is",findUser);
    req._id = findUser._id;
    console.log(`req user is ${req.user} & its id is ${req._id}`);
    next(); // Move to the next middleware or route handler
  } catch (err) {
    console.error(err.message);
    res.status(204).json({ message: "Token is not valid" });
  }
};

export default jwtMiddle;
