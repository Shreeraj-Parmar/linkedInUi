import React, { useState } from "react";
import { Dialog } from "@mui/material";
import Loader from "../../../../Loader/Loader.jsx";
import SnakBar from "../../../../SnakBar.jsx";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditMenu from "./EditMenu.jsx";
import EditRight from "./EditRight.jsx";

const dialogStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  margin: "auto",
  minWidth: "50vw",
  color: "#000",
  maxHeight: "86vh",
  borderRadius: "8px",
  display: "flex",
  backgroundColor: "#fff",
};

const EditCompany = ({ setEditCompanyDialog, editCompanyDialog }) => {
  const [snak, setSnak] = useState({ type: null, text: null });
  const [checkBox, setCheckBox] = useState(false);
  const [editCompanyMenu, setEditCompanyMenu] = useState(false);
  return (
    <Dialog
      open={editCompanyDialog}
      PaperProps={{
        sx: {
          ...dialogStyle,
        },
      }}
    >
      <Loader />
      {snak.type && <SnakBar type={snak.type} text={snak.text} />}
      <div className='w-[100%]   h-[100%]'>
        <div className='header-edit fixed p-4 bg-[#fff] rounded-t-lg flex justify-start items-center w-[50%] border-b-2 border-gray-400 border-opacity-40>'>
          <p className=' font-semibold text-xl opacity-70'>Edit</p>
        </div>
        <IconButton
          onClick={() => {
            setEditCompanyDialog(false);
          }}
          className='absolute top-[10px] left-[93%]  text-2xl cursor-pointer'
        >
          <CloseIcon className='text-[#000]' fontSize='medium' />
        </IconButton>
        <div className='wrapper min-h-[70vh] max-h-[70%]  mt-5 border-b-2 border-gray-400 border-opacity-80 flex'>
          <div className='left-dia w-[30%] border-r-2 border-gray-400 border-opacity-80'>
            <EditMenu
              setEditCompanyMenu={setEditCompanyMenu}
              editCompanyMenu={editCompanyMenu}
            />
          </div>
          <div className='right-dia w-[70%]  overflow-y-scroll'>
            <EditRight
              setEditCompanyMenu={setEditCompanyMenu}
              editCompanyMenu={editCompanyMenu}
            />
          </div>
        </div>
        <div className='action-buttons   z-50 flex justify-end  items-center mt-2 mr-5 '>
          <button
            onClick={() => {
              // handle save action
            }}
            className='flex items-center fixed bottom-[60px] space-x-2 bg-[#0a66c2] text-[#fff] px-4 py-2 rounded-full hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:ring-offset-2 transition duration-300 ease-in-out'
          >
            <span>Save</span>
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default EditCompany;
