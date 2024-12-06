import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";

const workPlaceArr = ["Work from Home", "Office", "Remote", "Hybrid"];

const WorkPlace = ({ formik }) => {
  return (
    <div className='p-2'>
      <div className='inpss'>
        <inputLabel className='text-[#000]'>
          Workplace
          <span className='text-blue-600 font-semibold'> *</span>
        </inputLabel>
        <FormControl
          sx={{ m: 1, minWidth: "97%", border: "none" }}
          size='small'
        >
          <InputLabel id='demo-select-small-label text-sm'>
            Workplace
          </InputLabel>
          <Select
            labelId='demo-select-small-label'
            id='demo-select-small'
            value={formik.values.workPlace}
            label='workPlace'
            name='workPlace'
            input={<OutlinedInput label='Workplace' />}
            className='text-black rounded-sm'
            onChange={formik.handleChange}
          >
            {workPlaceArr.map((ind, index) => {
              return (
                <MenuItem key={index} value={ind}>
                  {ind}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <div className='formik-err'>
          {formik.touched.workPlace && formik.errors.workPlace && (
            <div className='text-red-500'>{formik.errors.workPlace}</div>
          )}
        </div>
      </div>
      <div className='bg-[#f8fafd] mt-5 p-2 rounded-md'>
        <div className='p-2'>
          <p className='text-[#444444] font-semibold opacity-70'>Office</p>
          <p
            className='text-sm text-[#444444] 
 opacity-70'
          >
            This is the address of the company.
          </p>
        </div>
        <div className='p-2'>
          <p className='text-[#444444] font-semibold opacity-70'>
            Work From home
          </p>
          <p
            className='text-sm text-[#444444] 
 opacity-70'
          >
            Employee Flexible Choise
          </p>
        </div>
        <div className='p-2'>
          <p className='text-[#444444] font-semibold opacity-70'>Remote</p>
          <p
            className='text-sm text-[#444444] 
 opacity-70 '
          >
            Company Flexible Choise
          </p>
        </div>
        <div className='p-2'>
          <p className='text-[#444444] font-semibold opacity-70'>Hybrid</p>
          <p
            className='text-sm text-[#444444] 
 opacity-70'
          >
            It Can Be Anything At Anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkPlace;
