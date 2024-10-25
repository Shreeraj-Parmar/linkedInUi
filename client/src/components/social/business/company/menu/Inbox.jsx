import React from "react";

const Inbox = () => {
  return (
    <div className=' border-2 border-gray-400 min-h-[80vh] bg-white border-opacity-40 flex rounded-lg'>
      <div className=' msg-lft-company w-[35%] border-r-2 border-gray-400 border-opacity-40'>
        <div className='p-3 rounded-t-lg border-b-2 border-gray-400 bg-white border-opacity-40 '>
          <p className='font-semibold text-[#444444]'>Inbox</p>
        </div>
        <div className='p-2 '>
          <div className='flex justify-center items-center'>
            <p>No Message</p>
          </div>
        </div>
      </div>
      <div className='p-2 msg-lft-company w-[65%]'>left</div>
    </div>
  );
};

export default Inbox;
