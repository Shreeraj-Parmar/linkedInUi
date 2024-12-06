import React from "react";
import {
  Dialog,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  OutlinedInput,
  Button,
  styled,
} from "@mui/material";
import {
  companyTypeArr,
  industryArr,
  companySizeArr,
} from "../../../../../../utils/somearr.js";

const Overview = ({ formik }) => {
  return (
    <div className='p-4 w-[100%] '>
      <div className='inpss mt-3'>
        <inputLabel className='text-[#000]'>Description</inputLabel>
        <textarea
          className={
            "border-2  bg-white border-black mt-[3px] border-opacity-70  placeholder:text-[#908282] rounded-sm w-[100%] text-black h-auto  p-3"
          }
          id='description'
          value={formik.values.description}
          name='description'
          type='text'
          rows={3}
          label='description'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        ></textarea>
        <p className='text-sm text-[#7c7676]'>
          This is a Description for your company.
        </p>
      </div>
      <div className='inpss mt-3'>
        <inputLabel className='text-[#000]'>Website</inputLabel>
        <input
          className={
            "border-2  bg-white border-black mt-[3px] border-opacity-70  placeholder:text-[#908282] rounded-sm w-[100%] text-black h-[30px] p-3"
          }
          id='website'
          value={formik.values.website}
          name='website'
          placeholder='Begin with http:// or https://'
          type='text'
          label='website'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <p className='text-sm text-[#7c7676]'>
          This is a link to your external website
        </p>
        <div className='formik-err'>
          {formik.touched.website && formik.errors.website && (
            <div className='text-red-500'>{formik.errors.website}</div>
          )}
        </div>
      </div>
      <div className='form-group company-details mt-5 bg-white rounded-sm p-2 border-2 border-gray-400 border-opacity-40'>
        <div className='p-2'>
          <p className='text-blue-600 font-semibold'>Company Details</p>
        </div>
        <div className='p-2 company-inputs'>
          <div className='inpss'>
            <inputLabel className='text-[#000]'>
              Indusrty
              <span className='text-blue-600 font-semibold'> *</span>
            </inputLabel>
            <FormControl
              sx={{ m: 1, minWidth: "97%", border: "none" }}
              size='small'
            >
              <InputLabel id='demo-select-small-label text-sm'>
                industry
              </InputLabel>
              <Select
                labelId='demo-select-small-label'
                id='demo-select-small'
                value={formik.values.industry}
                label='Age'
                name='industry'
                input={<OutlinedInput label='Industry' />}
                className='text-black rounded-sm'
                onChange={formik.handleChange}
              >
                {industryArr.map((ind, index) => {
                  return (
                    <MenuItem key={index} value={ind}>
                      {ind}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <div className='formik-err'>
              {formik.touched.industry && formik.errors.industry && (
                <div className='text-red-500'>{formik.errors.industry}</div>
              )}
            </div>
          </div>
          <div className='inpss'>
            <inputLabel className='text-[#000]'>
              Company Size
              <span className='text-blue-600 font-semibold'> *</span>
            </inputLabel>
            <FormControl
              sx={{ m: 1, minWidth: "97%" }}
              variant='outlined'
              size='small'
            >
              <InputLabel id='demo-select-small-label text-sm'>
                Company Size
              </InputLabel>
              <Select
                labelId='demo-select-small-label'
                id='demo-select-small'
                value={formik.values.companySize}
                label='Age'
                name='companySize'
                input={<OutlinedInput label='company Size ' />}
                className='text-black'
                onChange={formik.handleChange}
              >
                {companySizeArr.map((ind, index) => {
                  return (
                    <MenuItem key={index} value={ind}>
                      {ind}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <div className='formik-err'>
              {formik.touched.companySize && formik.errors.companySize && (
                <div className='text-red-500'>{formik.errors.companySize}</div>
              )}
            </div>
          </div>
          <div className='inpss'>
            <inputLabel className='text-[#000]'>
              Company Type
              <span className='text-blue-600 font-semibold'> *</span>
            </inputLabel>
            <FormControl sx={{ m: 1, minWidth: "97%" }} size='small'>
              <InputLabel id='demo-select-small-label text-sm'>
                companyType
              </InputLabel>
              <Select
                labelId='demo-select-small-label'
                id='demo-select-small'
                value={formik.values.companyType}
                label='Age'
                name='companyType'
                input={<OutlinedInput label='Company Type' />}
                className='text-black'
                onChange={formik.handleChange}
              >
                {companyTypeArr.map((ind, index) => {
                  return (
                    <MenuItem key={index} value={ind}>
                      {ind}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <div className='formik-err'>
              {formik.touched.companyType && formik.errors.companyType && (
                <div className='text-red-500'>{formik.errors.companyType}</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='inpss mt-6  '>
        <inputLabel className='text-[#000]'>Mobile</inputLabel>
        <input
          className={
            "border-2  bg-white border-black mt-[3px] border-opacity-70  placeholder:text-[#908282] rounded-sm w-[100%] text-black h-[30px] p-3"
          }
          id='mobile'
          value={formik.values.mobile}
          name='mobile'
          type='number'
          label='description'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <div className='formik-err'>
          {formik.touched.mobile && formik.errors.mobile && (
            <div className='text-red-500'>{formik.errors.mobile}</div>
          )}
        </div>
      </div>
      <div className='inpss mt-3 '>
        <inputLabel className='text-[#000]'>Founded In</inputLabel>
        <input
          className={
            "border-2  bg-white border-black mt-[3px] block border-opacity-70  placeholder:text-[#908282] rounded-sm w-[50%] text-black h-[30px] p-3"
          }
          id='foundedIn'
          value={formik.values.foundedIn}
          name='foundedIn'
          type='number'
          label='foundedIn'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
    </div>
  );
};

export default Overview;
