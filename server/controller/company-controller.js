import Company from "../model/company.js";
import User from "../model/user.js";

export const saveNewCompanyInDB = async (req, res) => {
  console.log("req.body", req.body);
  try {
    const newCompany = await Company.create({ ...req.body, user: req._id });

    let updateUser = await User.findByIdAndUpdate(
      { _id: req._id },
      { $push: { company: newCompany._id } },
      { new: true }
    );

    if (newCompany && updateUser) {
      res.status(200).json({ success: true, message: "Company Added" });
    }
  } catch (error) {
    console.log(
      `error while calling saveNewCompanyInDB API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get data og company via admin:

export const getDataViaAdmin = async (req, res) => {
  const { companyId } = req.params;
  try {
    let company = await Company.findById(companyId).populate({
      path: "user",
      select: "name profilePicture city role heading",
    });

    if (!company) {
      return res.status(400).json({ message: "Company not available" });
    }

    // Check if userId exists in the company's admins array
    const isAdmin = company.user.some((user) => user._id.equals(req._id));

    if (!isAdmin) {
      return res
        .status(204)
        .json({ message: "Access denied. User is not an admin." });
    }

    if (isAdmin) {
      res.status(200).json({ message: "success", allData: company });
    } else {
      res.status(400).json({ message: "Company not available" });
    }
  } catch (error) {
    console.log(
      `error while calling getDataViaAdmin API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get data without admin

export const sendCompanyDataAccID = async (req, res) => {
  const { companyId } = req.params;
  try {
    let company = await Company.findById(companyId).populate({
      path: "user",
      select: "name profilePicture followers city role heading",
    });

    if (!company) {
      return res.status(400).json({ message: "Company not available" });
    }

    if (company) {
      res.status(200).json({ message: "success", allData: company });
    } else {
      res.status(400).json({ message: "Company not available" });
    }
  } catch (error) {
    console.log(
      `error while calling sendCompanyDataAccID API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// update company

export const updateCompanyInDB = async (req, res) => {
  // const { companyId } = req.body;
  // console.log(req.body);
  try {
    const { companyId } = req.body;
    console.log("companyId:", companyId);
    console.log("update data:", req.body);
    await Company.findByIdAndUpdate(req.body.companyId, req.body, {
      new: true,
    });

    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(
      `error while calling getDataViaAdmin API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// add company admin

export const addAdminOfCompanyInDB = async (req, res) => {
  const { companyId, userId } = req.body;
  try {
    console.log("companyId:", companyId);
    console.log("update data:", req.body);
    await Company.findByIdAndUpdate(
      companyId,
      { $push: { user: userId } },
      { new: true }
    );
    await User.findByIdAndUpdate(
      userId,
      { $push: { company: companyId } },
      { new: true }
    );
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(
      `error while calling getDataViaAdmin API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAdminFromDB = async (req, res) => {
  const data = JSON.parse(req.query.data); // Parse the data

  console.log(data);

  try {
    // Remove userId from the Company's user array
    await Company.findByIdAndUpdate(
      data.companyId,
      { $pull: { user: data.userId } },
      { new: true }
    );

    // Optionally, remove companyId from the User's company array
    await User.findByIdAndUpdate(
      data.userId,
      { $pull: { company: data.companyId } },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Admin removed from company successfully" });
  } catch (error) {
    console.log(`Error while removing admin from company: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// send followers or following list
export const sendFolllowerOrFollowingListOfCompany = async (req, res) => {
  const { what, page = 1, limit = 10, companyId } = req.query;

  try {
    // Validate the `what` parameter
    if (!["followers", "following"].includes(what)) {
      return res.status(400).json({ message: "Invalid 'what' parameter" });
    }

    // Find the company and select either followers or following based on the `what` parameter
    const company = await Company.findById(companyId).select(`${what}`);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Extract the list of followers or following
    const list = company[what] || [];

    // Separate User and Company references for efficient querying
    const userIds = list
      .filter((item) => item.type === "User")
      .map((item) => item.id);
    const companyIds = list
      .filter((item) => item.type === "Company")
      .map((item) => item.id);

    // Fetch details from User and Company collections
    const users = await User.find({ _id: { $in: userIds } })
      .select("name profilePicture city followers gender")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    const companies = await Company.find({ _id: { $in: companyIds } })
      .select("name profilePicture city followers industry")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    // Combine users and companies with the `type` field
    const modifiedList = [
      ...users.map((user) => ({
        ...user,
        type: "User",
      })),
      ...companies.map((company) => ({
        ...company,
        type: "Company",
      })),
    ];

    res.status(200).json({ list: modifiedList });
  } catch (error) {
    console.log(
      `Error while calling sendFolllowerOrFollowingListOfCompany API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};
