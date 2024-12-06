import React from "react";

const Location = ({ formik }) => {
  return (
    <div className='p-2'>
      <div className='mt-4'>
        <p className='text-[#000] opacity-70 font-semibold text-xl'>Location</p>
      </div>
      <div className='p-2 company-inputs'>
        <div className='inpss '>
          <inputLabel className='text-[#000]'>
            city
            <span className='text-blue-600 font-semibold'> *</span>
          </inputLabel>
          <input
            className={
              "border-2  bg-white border-black mt-[3px] border-opacity-70 placeholder:text-[#908282] rounded-sm w-[100%] text-black h-[30px] p-3"
            }
            id='city'
            value={formik.values.city}
            name='city'
            placeholder="Enter company's city"
            type='text'
            label='city'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div className='formik-err'>
            {formik.touched.city && formik.errors.city && (
              <div className='text-red-500'>{formik.errors.city}</div>
            )}
          </div>
        </div>
        <div className='inpss mt-3'>
          <inputLabel className='text-[#000]'>
            State
            <span className='text-blue-600 font-semibold'> *</span>
          </inputLabel>
          <input
            className={
              "border-2  bg-white border-black mt-[3px] border-opacity-70 placeholder:text-[#908282] rounded-sm w-[100%] text-black h-[30px] p-3"
            }
            id='state'
            value={formik.values.state}
            name='state'
            type='text'
            placeholder="Enter company's state"
            label='state'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div className='formik-err'>
            {formik.touched.state && formik.errors.state && (
              <div className='text-red-500'>{formik.errors.state}</div>
            )}
          </div>
        </div>
        <div className='inpss mt-3'>
          <inputLabel className='text-[#000]'>
            Country <span className='text-blue-600 font-semibold'> *</span>
          </inputLabel>
          <input
            className={
              "border-2  bg-white border-black mt-[3px] border-opacity-70  placeholder:text-[#908282] rounded-sm w-[100%] text-black h-[30px] p-3"
            }
            id='country'
            value={formik.values.country}
            name='country'
            placeholder="Enter company's country"
            type='text'
            label='country'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div className='formik-err'>
            {formik.touched.country && formik.errors.country && (
              <div className='text-red-500'>{formik.errors.country}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
