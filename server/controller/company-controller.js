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
    let allData = await Company.findById(companyId);

    if (allData) {
      res.status(200).json({ message: "success", allData: allData });
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
