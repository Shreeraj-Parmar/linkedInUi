import React from "react";
import UserPosts from "../../../../UserPosts";

const Posts = ({ companyDetails, setAllPost, allPost }) => {
  return (
    <div className='w-[100%]'>
      <UserPosts
        userData={companyDetails && companyDetails}
        setAllPost={setAllPost}
        allPost={allPost}
      />
    </div>
  );
};

export default Posts;
