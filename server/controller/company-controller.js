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

    console.log(company);

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
