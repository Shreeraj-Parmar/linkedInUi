import React from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

const PageInfo = ({ formik }) => {
  return (
    <div className='p-4 w-[100%]'>
      <div className=' '>
        <p>Logo</p>
      </div>
      <div className='mt-2 relative'>
        <img
          src='/blank.png'
          className='w-[90px] h-[90px] rounded-sm shadow-sm border-2 border-gray-400 border-opacity-40'
          alt=''
        />

        <div className='absolute bottom-[-10px] left-[75px]'>
          <IconButton
            size='small'
            style={{
              backgroundColor: "white",
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            <EditIcon fontSize='small' />
          </IconButton>
        </div>
      </div>
      <div className='mt-3 w-[100%]'>
        <div className='inpss'>
          <inputLabel className='text-[#000]'>
            Name <span className='text-blue-600 font-semibold'>*</span>
          </inputLabel>
          <input
            className={
              "border-2  bg-white border-black mt-[3px] border-opacity-70 placeholder:text-[#908282] rounded-sm w-[100%] text-black h-[30px] p-3"
            }
            id='name'
            value={formik.values.name}
            name='name'
            type='text'
            label='name'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div className='formik-err'>
            {formik.touched.name && formik.errors.name && (
              <div className='text-red-500'>{formik.errors.name}</div>
            )}
          </div>
        </div>
        <div className='inpss mt-3'>
          <inputLabel className='text-[#000]'>heading</inputLabel>
          <textarea
            className={
              "border-2  bg-white border-black mt-[3px] border-opacity-70  placeholder:text-[#908282] rounded-sm w-[100%] text-black h-auto  p-3"
            }
            id='heading'
            value={formik.values.heading}
            name='heading'
            type='text'
            rows={3}
            label='heading'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          ></textarea>
          <p className='text-sm text-[#7c7676]'>
            This is a heading for your company.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageInfo;
