import React from "react";

const PagePost = ({ companyDetails }) => {
  return (
    <div className='w-[70.5%]'>
      <div className='p-2 border-2 border-gray-400  bg-white border-opacity-40 rounded-lg'>
        <div
          className={`write-post-wrapper p-2 h-[100%] space-x-3 flex justify-center items-center `}
        >
          <div className='write-post-left w-[10%]'>
            <img
              src={
                (companyDetails && companyDetails.profilePicture) ||
                "/blank.png"
              }
              alt='your profile picture'
              className='rounded-md shadow-sm border border-gray-400 border-opacity-40 min-w-[60px] max-w-[60px] min-h-[60px] max-h-[60px]'
            />
          </div>
          <div
            className={`write-post-right w-[90%] p-5 h-[50px] border border-[#DBDBDC] rounded-full flex justify-start items-center hover:bg-[#DBDBDC] hover:bg-opacity-10 cursor-pointer ${" border border-black border-opacity-50 shadow-sm hover:bg-[#cecece]"}`}
            onClick={() => {}}
          >
            <p className='write-post-btn'>Start to Write Post</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagePost;
