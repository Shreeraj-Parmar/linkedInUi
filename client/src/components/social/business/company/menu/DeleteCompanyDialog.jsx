import React, { useState } from "react";
import { Dialog } from "@mui/material";
import Loader from "../../../../Loader/Loader.jsx";
import SnakBar from "../../../../SnakBar.jsx";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

const dialogStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  margin: "auto",
  minWidth: "50vw",
  color: "#000",

  maxHeight: "37vh",

  //   overflow: "hidden",
  borderRadius: "8px",
  display: "flex",
  backgroundColor: "#F4F2EE",
};

const DeleteCompanyDialog = ({
  deleteCompanyDialog,
  setDeleteCompanyDialog,
  setLoading,
}) => {
  const [snak, setSnak] = useState({ type: null, text: null });
  const [checkBox, setCheckBox] = useState(false);

  return (
    <Dialog
      open={deleteCompanyDialog}
      PaperProps={{
        sx: {
          ...dialogStyle,
        },
      }}
    >
      <Loader />
      {snak.type && <SnakBar type={snak.type} text={snak.text} />}
      <div className='w-[100%]   h-[100%]'>
        <div className='header-edit fixed p-3 bg-[#fff] rounded-t-lg flex justify-start items-center w-[50%] border-b-2 border-gray-400 border-opacity-40>'>
          <p className=' font-semibold text-xl opacity-70'>Delete Page</p>
        </div>
        <IconButton
          onClick={() => {
            setCheckBox(false);

            setDeleteCompanyDialog(false);
          }}
          className='absolute top-[10px] left-[93%]  text-2xl cursor-pointer'
        >
          <CloseIcon className='text-[#000]' fontSize='medium' />
        </IconButton>
        <div className='mt-3 p-4 '>
          <p className=' font-semibold text-xl'>We’re sorry to see you go</p>
          <p className='text-[#444444] mt-2'>
            Deactivating will remove the page entirely from In. Once
            deactivated, you and other admins will no longer have access to the
            Page
          </p>
        </div>
        <div
          onClick={() => setCheckBox(!checkBox)}
          className='flex items-center  pl-4 cursor-pointer'
        >
          <input
            type='checkbox'
            className='mr-2 w-[30px] h-[30px]'
            checked={checkBox}
            onChange={() => setCheckBox(!checkBox)}
          />
          <p className='text-[#444444]'>
            I acknowledge that deleting my Page is permanent and can't be
            undone.
          </p>
        </div>
        <div className='flex justify-end p-4'>
          <button
            className={` text-[#fff] p-2 px-4 rounded-full font-semibold justify-self-end transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#004182] focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-white  ${
              checkBox ? "bg-blue-700" : "bg-[#918e8e]"
            }`}
            style={{ width: "fit-content" }}
            disabled={!checkBox}
          >
            Delete Page
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteCompanyDialog;
