import React from "react";

import { Dialog, DialogContent } from "@mui/material";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";

const dialogStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  margin: "auto",
  width: "35vw",
  color: "#000",

  maxHeight: "40vh",

  //   overflow: "hidden",
  borderRadius: "8px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#F4F2EE",
};

const ChangeAs = ({
  setActAs,
  changeAsDialog,
  setChangeAsDialog,
  currUserData,
}) => {
  const handleClick = (type, id) => {
    setActAs({ type: type, id: id });
    setChangeAsDialog(false);
  };

  return (
    <Dialog
      open={changeAsDialog}
      onClose={() => setChangeAsDialog(false)}
      PaperProps={{
        sx: {
          ...dialogStyle,
        },
      }}
    >
      <div className=' w-[100%] relative h-[100%]'>
        <div className='p-3 border-b-2 border-gray-400 border-opacity-40'>
          <p className='text-[#272727] font-semibold'>Choose Account</p>
        </div>

        <IconButton
          style={{ position: "absolute", right: 10, top: 5 }}
          onClick={() => setChangeAsDialog(false)}
        >
          <CloseIcon className='text-[#272727]' />
        </IconButton>

        <div
          onClick={() => handleClick("user", currUserData?._id)}
          className='flex hover:bg-[#DBDBDC] border-b-2 border-gray-400 border-opacity-40 cursor-pointer rounded-md p-2 items-center space-x-2'
        >
          <div>
            <img
              src={currUserData?.profilePicture || "/blank.png"}
              className='w-[60px] rounded-full h-[60px]'
              alt=''
            />
          </div>
          <div>
            <p className=' font-semibold text-[16px]'> {currUserData?.name}</p>
          </div>
          <p className='text-[#8e8e8e]'>As user</p>
        </div>
        {currUserData &&
          currUserData.company &&
          currUserData.company.length > 0 &&
          currUserData.company.map((com) => {
            return (
              <div
                key={com._id}
                onClick={() => handleClick("company", com._id)}
                className='flex items-center border-b-2 border-gray-400 border-opacity-40 cursor-pointer rounded-md p-2    hover:bg-[#DBDBDC] space-x-2'
              >
                <div>
                  <img
                    src={com.profilePicture || "/blank.png"}
                    alt=''
                    className='w-[60px] rounded-full h-[60px]'
                  />
                </div>
                <div>
                  <p className=' font-semibold text-[16px]'>{com.name}</p>
                </div>
                <p className='text-[#8e8e8e]'>As company</p>
              </div>
            );
          })}
      </div>
    </Dialog>
  );
};

export default ChangeAs;
