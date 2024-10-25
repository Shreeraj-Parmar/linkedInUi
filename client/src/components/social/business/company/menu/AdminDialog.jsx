import React, { useState } from "react";
import { Dialog } from "@mui/material";
import Loader from "../../../../Loader/Loader.jsx";
import SnakBar from "../../../../SnakBar.jsx";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AddAdmin from "./AddAdmin.jsx";

const dialogStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  margin: "auto",
  minWidth: "50vw",
  color: "#000",

  maxHeight: "55vh",

  //   overflow: "hidden",
  borderRadius: "8px",
  display: "flex",
  backgroundColor: "#fff",
};

const AdminDialog = ({ setAdminDialog, adminDialog, setLoading }) => {
  const [snak, setSnak] = useState({ type: null, text: null });
  const [addAdminDialog, setAddadminDialog] = useState(false);
  return (
    <Dialog
      open={adminDialog}
      PaperProps={{
        sx: {
          ...dialogStyle,
        },
      }}
    >
      <Loader />
      <AddAdmin
        setAddadminDialog={setAddadminDialog}
        addAdminDialog={addAdminDialog}
      />
      {snak.type && <SnakBar type={snak.type} text={snak.text} />}
      <div className='w-[100%]   h-[100%]'>
        <div className='header-edit fixed p-3 bg-[#fff] rounded-t-lg flex justify-start items-center w-[50%] border-b-2 border-gray-400 border-opacity-40>'>
          <p className=' font-semibold text-xl opacity-70'>Manage admins</p>
        </div>
        <IconButton
          onClick={() => setAdminDialog(false)}
          className='absolute top-[10px] left-[93%]  text-2xl cursor-pointer'
        >
          <CloseIcon className='text-[#000]' fontSize='medium' />
        </IconButton>
        <div className='flex p-4 mt-1 border-b-2 border-gray-400 border-opacity-40 justify-between items-center'>
          <div className='w-[70%]'>
            <p>
              All Page admins have access to admin view. Add admin to contol
              page
            </p>
          </div>

          <button
            onClick={() => setAddadminDialog(true)}
            className='mt-2 flex w-[150px] items-center space-x-2 bg-[#0a66c2] text-[#fff] px-4 py-2 rounded-full hover:bg-[#0a66c2] hover:text-[#fff] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:ring-offset-2 focus:ring-offset-white'
          >
            <AddIcon className='text-[#fff]' />
            <p>Add admin</p>
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default AdminDialog;
