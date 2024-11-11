import React from "react";

const Dashboard = ({ companyDetails, setCompanyMenu }) => {
  return (
    <div className='p-2 border-2 border-gray-400 bg-white border-opacity-40 rounded-lg'>
      <div className='p-2'>
        <p className=' font-semibold text-xl'>Track performance</p>
        <p className=' opacity-75 text-[#7e7979]'>
          Grow your page 3x faster by leveraging insights and analytics
        </p>
      </div>
      <div className='p-2 flex space-x-5  items-center'>
        <div
          onClick={() => {
            setCompanyMenu("followers");
          }}
          className='space-y-3 p-3 pl-5 lg:min-w-[200px] min-h-[130px] max-h-[130px]  border-2 border-gray-400 border-opacity-40 hover:shadow-md cursor-pointer rounded-lg'
        >
          <p className=' font-semibold text-3xl'>
            {(companyDetails &&
              companyDetails.followers &&
              companyDetails.followers.length) ||
              "0"}
          </p>
          <p className='text-blue-700 relative bottom-[5px] font-semibold'>
            Followers
          </p>
          <p className='relative bottom-[15px]'>
            {companyDetails &&
            companyDetails.followers &&
            companyDetails.followers.length === 0
              ? "N/A"
              : ""}
          </p>
        </div>
        <div
          onClick={() => {
            setCompanyMenu("followers");
          }}
          className='space-y-3 p-3 pl-5 lg:min-w-[200px] min-h-[130px] max-h-[130px] border-2 border-gray-400 border-opacity-40 hover:shadow-md cursor-pointer rounded-lg'
        >
          <p className=' font-semibold text-3xl'>
            {(companyDetails &&
              companyDetails.following &&
              companyDetails.following.length) ||
              "0"}
          </p>
          <p className='text-blue-700 relative bottom-[5px] font-semibold'>
            Following
          </p>
          <p className='relative bottom-[15px]'>
            {companyDetails &&
            companyDetails.following &&
            companyDetails.following.length === 0
              ? "N/A"
              : ""}
          </p>
        </div>
        <div
          onClick={() => {
            setCompanyMenu("posts");
          }}
          className='space-y-3 p-3 pl-5 lg:min-w-[200px] min-h-[130px] max-h-[130px] border-2 border-gray-400 border-opacity-40 hover:shadow-md cursor-pointer rounded-lg'
        >
          <p className=' font-semibold text-3xl'>
            {companyDetails &&
              companyDetails.posts &&
              companyDetails.posts.length}
          </p>
          <p className='text-blue-700 relative bottom-[5px] font-semibold'>
            Page posts
          </p>
          <p className='relative bottom-[15px]'>
            {companyDetails &&
            companyDetails.posts &&
            companyDetails.posts.length === 0
              ? "N/A"
              : ""}
          </p>
        </div>
        <div className='space-y-3 p-3 pl-5 lg:min-w-[200px] min-h-[130px] max-h-[130px] border-2 border-gray-400 border-opacity-40 hover:shadow-md cursor-pointer rounded-lg'>
          <p className=' font-semibold text-3xl'>
            {(companyDetails &&
              companyDetails.visitors &&
              companyDetails.visitors.length) ||
              "0"}
          </p>
          <p className='text-blue-700 relative bottom-[5px] font-semibold'>
            Total visitors
          </p>
          <p className='relative bottom-[15px]'>
            {companyDetails &&
            companyDetails.visitors &&
            companyDetails.visitors.length === 0
              ? "N/A"
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
