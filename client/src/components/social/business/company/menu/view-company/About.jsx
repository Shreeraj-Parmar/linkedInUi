import React from "react";

const About = ({ companyDetails }) => {
  return (
    <div className='border-2 p-4 border-gray-400 w-[60%] rounded-md bg-white border-opacity-40'>
      <div>
        <p className='text-3xl'>Overview</p>
      </div>
      <div className='mt-2'>
        <pre className='text-wrap'>
          {companyDetails && companyDetails.description}
        </pre>
        <p className='font-semibold text-xl mt-3'>Website</p>
        <p
          className={`${
            companyDetails?.website ? "text-blue-700  cursor-pointer" : ""
          }`}
        >
          {(companyDetails && companyDetails.website) || "N/A"}
        </p>
        <p className='font-semibold text-xl mt-3'>Phone</p>
        <p>{(companyDetails && companyDetails.mobile) || "N/A"}</p>
        <p className='font-semibold text-xl mt-3'>Industry</p>
        <p>{companyDetails && companyDetails.industry}</p>
        <p className='font-semibold text-xl mt-3'>Company size</p>
        <p>{companyDetails && companyDetails.companySize}</p>
        <p className='font-semibold text-xl mt-3'>Company type</p>
        <p>{companyDetails && companyDetails.companyType}</p>
        <p className='font-semibold text-xl mt-3'>Founded</p>
        <p>{(companyDetails && companyDetails.foundedIn) || "N/A"}</p>
        <p className='font-semibold text-xl mt-3'>Location</p>
        <p>
          {companyDetails && companyDetails.city},{" "}
          {companyDetails && companyDetails.state},{" "}
          {companyDetails && companyDetails.country}
        </p>
      </div>
    </div>
  );
};

export default About;
