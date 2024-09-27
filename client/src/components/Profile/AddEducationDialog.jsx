import React from "react";
import { Dialog, DialogContent } from "@mui/material";
import AddEducationSection from "./AddEducationSection";

// dialog style
const dialogStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  margin: "auto",
  Width: "70vw",
  color: "#E2E0DD",

  maxHeight: "85vh",

  //   overflow: "hidden",
  borderRadius: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#1B1F23",
};

const AddEducationDialog = ({ addEduDialog, setAddEduDialog }) => {
  return (
    <Dialog
      open={addEduDialog}
      PaperProps={{
        sx: {
          ...dialogStyle,
        },
      }}
    >
      <DialogContent>
        <div className="w-[100%]   h-[100%]">
          <AddEducationSection addEduDialog={setAddEduDialog} />
        </div>
      </DialogContent>
      <div
        className="absolute top-[20px] right-[30px] text-2xl cursor-pointer"
        onClick={() => {
          setAddEduDialog(false);
        }}
      >
        X
      </div>
    </Dialog>
  );
};

export default AddEducationDialog;
