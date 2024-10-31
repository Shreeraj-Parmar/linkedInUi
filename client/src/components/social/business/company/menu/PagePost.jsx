import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import UserPosts from "../../../UserPosts";
import PostDialog from "../../../../../Post Compo/PostDialog";
import { AllContext } from "../../../../../context/UserContext";

const PagePost = ({ companyDetails }) => {
  const companyId = useParams();
  const { setActAs } = useContext(AllContext);
  const [postDialog, setPostDialog] = useState(false);
  const [allPost, setAllPost] = useState([]);
  const [showAllMedia, setShowAllMedia] = useState();
  return (
    <div className='w-[70.5%]'>
      <PostDialog
        setPostDialog={setPostDialog}
        setShowAllMedia={setShowAllMedia}
        setAllPost={setAllPost}
        allPost={allPost}
        postDialog={postDialog}
      />
      <div className='p-2  border-2 border-gray-400  bg-white border-opacity-40 rounded-lg'>
        <div
          className={`write-post-wrapper  p-2 h-[100%] space-x-3 flex justify-center items-center `}
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
            className={`write-post-right w-[85%] p-5 h-[50px] border border-[#DBDBDC] rounded-full flex justify-start items-center hover:bg-[#DBDBDC] hover:bg-opacity-10 cursor-pointer ${" border border-black border-opacity-50 shadow-sm hover:bg-[#cecece]"}`}
            onClick={() => {
              setActAs({ type: "company", id: companyId.companyId });
              setPostDialog(true);
            }}
          >
            <p className='write-post-btn'>Start to Write Post</p>
          </div>
        </div>
      </div>
      {/* posts here */}
      <UserPosts
        userData={companyDetails && companyDetails}
        setAllPost={setAllPost}
        allPost={allPost}
      />
    </div>
  );
};

export default PagePost;
