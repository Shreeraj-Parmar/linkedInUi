import mongoose from "mongoose";

const ConnectDB = async () => {
  const ATLAS = `mongodb://localhost:27017/iih-test-01`;

  try {
    await mongoose.connect(ATLAS);
    console.log("MongoDB connected successfully on LocalServer");
  } catch (error) {
    console.error(
      "error while connecting database & error is : ",
      error.message
    );
  }
};

export default ConnectDB;
