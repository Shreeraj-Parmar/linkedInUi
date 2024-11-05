import React, { useState } from "react";
import { Dialog, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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

  maxHeight: "60vh",

  //   overflow: "hidden",
  borderRadius: "8px",
  display: "flex",
  backgroundColor: "#F4F2EE",
};

const SkillAddDialog = ({
  setSkillArr,
  skillArr,
  setSkillDialog,
  skillDialog,
  skillOptions,
}) => {
  const [inputSkill, setInputSkill] = useState("");

  return (
    <Dialog
      open={skillDialog}
      onClose={() => setSkillDialog(false)}
      PaperProps={{
        sx: {
          ...dialogStyle,
        },
      }}
    >
      <div className=''>
        <div className=' p-4 border-b-2 border-gray-400 border-opacity-70'>
          <p className='font-semibold text-xl'>Add Skill</p>
        </div>
        <div className='mt- p-4 '>
          <div className='flex items-center bg-white  border-2 border-gray-400 border-opacity-40 rounded-md px-3 py-2 w-full'>
            <SearchIcon className='text-[#000]' fontSize='medium' />
            <input
              type='text'
              className='w-full px-2 py-1 outline-none'
              placeholder='Enter Skill'
              value={inputSkill}
              onChange={(e) => setInputSkill(e.target.value)}
            />
          </div>
        </div>
        <div className='p-4 pt-0 max-h-[230px] h-[230px]  overflow-y-scroll min-h-[230px]'>
          {skillOptions
            .filter((val) => {
              if (inputSkill === "") {
                return val;
              } else if (val.toLowerCase().includes(inputSkill.toLowerCase())) {
                return val;
              }
            })
            .map((val, index) => {
              return (
                <div
                  key={index}
                  className={`flex items-center hover:bg-[#d2d2d2] bg-white  border-2 border-gray-400 border-opacity-40 rounded-md px-3 py-2 w-full mt-2 cursor-pointer ${
                    skillOptions.includes(val) && "bg-[#918e8e]"
                  }`}
                  onClick={() => {
                    setInputSkill(val);
                  }}
                >
                  {val}
                </div>
              );
            })}
        </div>

        <div className='flex mt-2 justify-end'>
          <button
            className={` text-[#fff] p-2 mr-5 px-4 rounded-full font-semibold justify-self-end transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#004182] focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-white  ${
              skillOptions.includes(inputSkill) ? "bg-blue-700" : "bg-[#918e8e]"
            }`}
            style={{ width: "fit-content" }}
            disabled={!skillOptions.includes(inputSkill)}
            onClick={() => {
              if (skillArr.includes(inputSkill)) return;
              setSkillArr([...skillArr, inputSkill]);
              setSkillDialog(false);
              setInputSkill("");
            }}
          >
            Add Skill
          </button>
        </div>
        <div
          className='absolute top-[10px] right-[20px] text-2xl cursor-pointer'
          onClick={() => {
            setSkillDialog(false);
            setInputSkill("");
          }}
        >
          <CloseIcon />
        </div>
      </div>
    </Dialog>
  );
};

export default SkillAddDialog;
