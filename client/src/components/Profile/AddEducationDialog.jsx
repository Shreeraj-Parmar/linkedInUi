import React from "react";
import { Dialog, DialogContent } from "@mui/material";
import AddEducationSection from "./AddEducationSection";
import CloseIcon from "@mui/icons-material/Close";

// dialog style
const dialogStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  margin: "auto",
  Width: "70vw",
  color: "#000",
  padding: "30px",

  maxHeight: "90vh",

  //   overflow: "hidden",
  borderRadius: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#F4F2EE",
};

const AddEducationDialog = ({
  addEduDialog,
  setAddEduDialog,
  setAllEducation,
}) => {
  return (
    <Dialog
      open={addEduDialog}
      PaperProps={{
        sx: {
          ...dialogStyle,
        },
      }}
    >
      <div className='w-[100%]   h-[100%]'>
        <AddEducationSection
          setAllEducation={setAllEducation}
          addEduDialog={setAddEduDialog}
        />
      </div>

      <div
        className='absolute top-[20px] right-[30px] text-2xl cursor-pointer'
        onClick={() => {
          setAddEduDialog(false);
        }}
      >
        <CloseIcon />
      </div>
    </Dialog>
  );
};

export default AddEducationDialog;
