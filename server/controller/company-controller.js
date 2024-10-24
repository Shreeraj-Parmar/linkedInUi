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
