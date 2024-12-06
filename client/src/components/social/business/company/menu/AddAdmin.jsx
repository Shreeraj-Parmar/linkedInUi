import React, { useState } from "react";
import { Dialog } from "@mui/material";
import Loader from "../../../../Loader/Loader.jsx";
import SnakBar from "../../../../SnakBar.jsx";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "../../../../../utils/debounce.js";
import { useParams } from "react-router-dom";
import {
  searchUserForAdmin,
  addAdminOfCompany,
} from "../../../../../services/api.js";

const dialogStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  margin: "auto",
  minWidth: "50vw",
  color: "#000",

  maxHeight: "82vh",

  //   overflow: "hidden",
  borderRadius: "5px",
  display: "flex",
  backgroundColor: "#fff",
};

const AddAdmin = ({ addAdminDialog, setAddadminDialog, setAllAdmins }) => {
  const [snak, setSnak] = useState({ type: null, text: null });
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const companyId = useParams();
  console.log("id is", companyId);

  const handleChange = debounce(async (event) => {
    const value = event.target.value;
    setSelectedUser(null);

    console.log(value);

    if (value) {
      const searchResults = await searchUserForAdmin(value);
      setResults(searchResults.data);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, 300);

  const hadleAddAdmin = async (id) => {
    let res = await addAdminOfCompany({
      companyId: companyId.companyId,
      userId: id,
    });
    if (res.status === 200) {
      setAllAdmins((prev) => [...prev, selectedUser]);
      setAddadminDialog(false);
    }
  };

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
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
              onChange={handleChange}
            />
          </div>
          <div className='mt-2'>
            {results && results.length > 0 ? (
              results.map((user) => {
                return (
                  <div
                    key={user._id}
                    onClick={() => {
                      setSelectedUser(user);
                    }}
                    className={`p-1 ${
                      selectedUser &&
                      selectedUser._id === user._id &&
                      "bg-[hsl(0,100%,93%)]"
                    } pl-4 flex space-x-3 cursor-pointer hover:bg-[hsl(0,100%,93%)] rounded-md `}
                  >
                    <div className='w-[%]'>
                      <img
                        src={
                          (user.profilePicture && user.profilePicture) ||
                          "/blank.png"
                        }
                        alt=''
                        className='min-w-[60px] min-h-[60px] max-h-[60px] max-w-[60px] rounded-full'
                      />
                    </div>
                    <div>
                      <p>{user.name}</p>
                      <p className='text-sm relative bottom-1'>
                        {(user.heading && user.heading) ||
                          (user.role && user.role) ||
                          user.city}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>
                <p>Please Search name Of user</p>
              </div>
            )}
          </div>
          <div className='flex mt-2 justify-end'>
            <button
              className={` text-[#fff] p-2 px-4 rounded-full font-semibold justify-self-end transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#004182] focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-white  ${
                selectedUser ? "bg-blue-700" : "bg-[#918e8e]"
              }`}
              style={{ width: "fit-content" }}
              disabled={!selectedUser}
              onClick={() => {
                hadleAddAdmin(selectedUser._id);
              }}
            >
              Add as admin
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddAdmin;
