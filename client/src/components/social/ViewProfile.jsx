import React, { useEffect, useState, useContext } from "react";

import { AllContext } from "../../context/UserContext";
import { getUserData } from "../../services/api.js";
import AddEducationDialog from "../Profile/AddEducationDialog.jsx";

const ViewProfile = () => {
  const { currUserData, setCurrUserData } = useContext(AllContext);
  const [addEduDialog, setAddEduDialog] = useState(false);
  useEffect(() => {
    const getData = async () => {
      let res = await getUserData();
      console.log(res.data);
      setCurrUserData(res.data.user);
    };
    getData();
  }, [addEduDialog]);

  return (
    <div className="view-profile-wrapper p-5">
      <div className="view-profile">
        <div className="view-profile-image flex justify-center">
          <img
            src={currUserData ? currUserData.profilePicture : "/upload.png"}
            alt="profile picture"
            className="w-[10%] h-[50%]"
          />
        </div>
        <div>
          <p className="text-center">
            {currUserData ? currUserData.name : "Your Name"}
          </p>
        </div>
        <div className="add-education flex justify-end">
          <button
            className="bg-slate-600 text-yellow-100 p-2 rounded-md"
            onClick={() => setAddEduDialog(true)}
          >
            add education
          </button>

          <AddEducationDialog
            addEduDialog={addEduDialog}
            setAddEduDialog={setAddEduDialog}
          />
        </div>
        <div className="flex w-[100%]">
          <div className="other-details w-[40%]">
            {currUserData && (
              <>
                <p className="font-semibold">Some Details</p>
                <div>
                  <p>Mobile: {currUserData.mobile}</p>
                  <p>City: {currUserData.city}</p>
                  <p>Country: {currUserData.country}</p>
                  <p>State: {currUserData.state}</p>
                </div>
              </>
            )}
          </div>
          <div className="show-education w-[60%] ">
            <p className=" font-semibold">Education</p>
            {currUserData ? (
              currUserData.education.map((edu, index) => {
                return (
                  <div
                    className="edus border border-black mt-2 w-1/3 p-2"
                    key={index}
                  >
                    <p className="">{edu.school}</p>
                    <p className="text-[#6c6c6c] text-sm">{edu.degree}</p>
                    <p className="text-[#6c6c6c] text-sm">
                      {edu.startDate.year}-{edu.endDate.year}
                    </p>
                  </div>
                );
              })
            ) : (
              <div>please add education</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
