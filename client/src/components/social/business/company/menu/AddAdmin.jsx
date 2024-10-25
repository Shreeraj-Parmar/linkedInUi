import React, { useState } from "react";
import { Dialog } from "@mui/material";
import Loader from "../../../../Loader/Loader.jsx";
import SnakBar from "../../../../SnakBar.jsx";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

const dialogStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  margin: "auto",
  minWidth: "50vw",
  color: "#000",

  maxHeight: "80vh",

  //   overflow: "hidden",
  borderRadius: "5px",
  display: "flex",
  backgroundColor: "#fff",
};

const AddAdmin = ({ addAdminDialog, setAddadminDialog }) => {
  const [snak, setSnak] = useState({ type: null, text: null });

  return (
    <Dialog
      open={addAdminDialog}
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
          <p className=' font-semibold text-xl opacity-70'>
            Search & Add Admins
          </p>
        </div>
        <IconButton
          onClick={() => {
            setAddadminDialog(false);
          }}
          className='absolute top-[10px] left-[93%]  text-2xl cursor-pointer'
        >
          <CloseIcon className='text-[#000]' fontSize='medium' />
        </IconButton>
        <div className='mt-3 p-4 '>
          <div className='flex items-center bg-white  border-2 border-gray-400 border-opacity-40 rounded-md px-3 py-2 w-full'>
            <SearchIcon className='text-[#000]' fontSize='medium' />
            <input
              type='text'
              className='w-full px-2 py-1 outline-none'
              placeholder='Search Name'
            />
          </div>
          <div className='mt-2'>
            <ul className='max-h-[200px] overflow-y-auto'>
              <li className='px-2 py-1 border-b-2 border-gray-400 border-opacity-40 cursor-pointer hover:bg-gray-200'>
                abc@gmail.com
              </li>
              <li className='px-2 py-1 border-b-2 border-gray-400 border-opacity-40 cursor-pointer hover:bg-gray-200'>
                xyz@gmail.com
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddAdmin;
