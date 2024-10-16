import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog } from "@mui/material";
import { withdrawConnectionReq } from "../../../../services/api.js";

// dialog style
const dialogStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  margin: "auto",
  width: "25vw",
  color: "#000",

  maxHeight: "26vh",

  //   overflow: "hidden",
  borderRadius: "10px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#F4F2EE",
};

const ConnectionWithdrawDialog = ({
  currId,
  setCurrId,
  isWithdrawDialogOpen,
  setIsWithdrawDialogOpen,
  setUserConnectBtns,
}) => {
  const handleWithdrawConnectionReq = async (id) => {
    let res = await withdrawConnectionReq({ userId: id });
    if (res.status === 200) {
      setUserConnectBtns((prevUserConnectBtns) => ({
        ...prevUserConnectBtns,
        [currId]: false,
      }));
      setIsWithdrawDialogOpen(false);
      setCurrId(null);
    }
  };

  return (
    <Dialog
      open={isWithdrawDialogOpen}
      PaperProps={{
        sx: {
          ...dialogStyle,
        },
      }}
    >
      <div className='w-[100%] h-[100%] '>
        <div className=' flex justify-between items-center p-4 border-b-2 border-gray-400 border-opacity-40'>
          <p className=' font-semibold text-xl'>Withdraw invitation</p>
          <button>
            <CloseIcon
              onClick={() => {
                setIsWithdrawDialogOpen(false);
              }}
            />
          </button>
        </div>
        <div className='p-2 border-b-2 border-gray-400 border-opacity-40'>
          <p>
            if you want to withdraw this connection request please click
            withdraw button below
          </p>
        </div>
        <div className='flex justify-end p-2 space-x-2'>
          <button
            className='p-2 min-w-[100px] border-2 border-[#0A66C2] text-[#0A66C2] hover:border-[#004182] hover:text-[#004182] rounded-full font-semibold '
            onClick={() => {
              setCurrId(null);
              setIsWithdrawDialogOpen(false);
            }}
          >
            Cancel
          </button>
          <button
            className='p-2  min-w-[100px] font-semibold text-[#fff] hover:bg-[#004182] rounded-full  bg-[#0a66c2]'
            onClick={() => {
              handleWithdrawConnectionReq(currId);
            }}
          >
            Withdraw
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConnectionWithdrawDialog;
