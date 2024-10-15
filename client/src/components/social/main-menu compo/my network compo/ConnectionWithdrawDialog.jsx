import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog } from "@mui/material";

// dialog style
const dialogStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  margin: "auto",
  width: "35vw",
  color: "#000",

  maxHeight: "50vh",

  //   overflow: "hidden",
  borderRadius: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#F4F2EE",
};

const ConnectionWithdrawDialog = ({
  isWithdrawDialogOpen,
  setIsWithdrawDialogOpen,
}) => {
  return (
    <Dialog
      open={isWithdrawDialogOpen}
      PaperProps={{
        sx: {
          ...dialogStyle,
        },
      }}
    >
      <div className='w-[100%] h-[100%] border border-red-300'>
        this is dialog for with draw
      </div>
      <button>
        <CloseIcon
          onClick={() => {
            setIsWithdrawDialogOpen(false);
          }}
        />
      </button>
    </Dialog>
  );
};

export default ConnectionWithdrawDialog;
