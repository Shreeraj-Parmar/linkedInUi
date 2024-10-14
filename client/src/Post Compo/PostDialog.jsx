import React, { useRef, useState, useEffect } from "react";

import { Dialog, DialogContent } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { getURLForPOST, uploadFileAWS, savePostData } from "../services/api.js";
import CloseIcon from "@mui/icons-material/Close";
import Tostify from "../components/Tostify.jsx";
import { toast } from "react-toastify";

// dialog style
const dialogStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  margin: "auto",
  Width: "70vw",
  color: "#000",

  maxHeight: "55vh",

  //   overflow: "hidden",
  borderRadius: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#F4F2EE",
};

const PostDialog = ({
  setPostDialog,
  postDialog,
  setAllPost,
  imgUrl,
  currUserData,
}) => {
  const [previewUrl, setPreviewUrl] = useState(null); // for image preview
  const [postFile, setPostFile] = useState(null);
  const [postText, setPostText] = useState("");
  const [generatedfileName, setGeneratedFileName] = useState(null);
  const [generatedURL, setGeneratedURL] = useState(null);
  const postPhotoRef = useRef();

  const handlePostFileClick = () => {
    postPhotoRef.current.click();
  };

  const handlePostFileChange = (e) => {
    const file = e.target.files[0];
    setPostFile(file);
    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handlePostSubmit = async () => {
    if (postText === "" && !postFile) {
      toast.error(`Please Write Somthing Or Select Photo. !`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    if (postFile) {
      let res = await getURLForPOST({ fileType: postFile.type });
      if (res.status === 200) {
        setGeneratedFileName(res.data.fileName);
        console.log(res.data.url);
        const nameOfFile = res.data.fileName;
        // upload in aws

        let resOfAWS = await uploadFileAWS({
          uploadURL: res.data.url,
          postFile,
          fileType: postFile.type,
        });
        if (resOfAWS.status === 200) {
          console.log("uploaded");
          const bukket = import.meta.env.VITE_AWS_S3_BUCKET_NAME;
          const region = import.meta.env.VITE_AWS_REGION;
          const permanentUrlForPost = `https://${bukket}.s3.${region}.amazonaws.com/PostPicture/${nameOfFile}`;
          console.log(permanentUrlForPost);

          // save post in db
          let res = await savePostData({
            text: postText,
            url: permanentUrlForPost,
          });

          if (res.status === 200) {
            console.log("post saved successfully");
            let newPost = {
              text: postText,
              url: permanentUrlForPost,
              _id: res.data.postId,
              comments: [],
              likeCount: 0,
              likedBy: [],
              createdAt: Date.now(),
              updatedAt: Date.now(),
              user: {
                _id: currUserData._id,
                name: currUserData.name,
                profilePicture: currUserData.profilePicture || imgUrl,
                city: currUserData.city,
              },
            };
            console.log("new post is here", newPost);
            setAllPost((prev) => [newPost, ...prev]);
            setPostText("");
            setPostFile(null);
          }
        } else {
          toast.error(`Error While Uploading IMAGE . !`, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          console.log("error while generating url");
        }
        setPostFile(null);
        setPostText("");
      }
    } else {
      let res = await savePostData({
        text: postText,
      });
      if (res.status === 200) {
        let newPost = {
          text: postText,
          _id: res.data.postId,
          comments: [],
          likeCount: 0,
          likedBy: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          user: {
            _id: currUserData._id,
            name: currUserData.name,
            profilePicture: currUserData.profilePicture || imgUrl,
            city: currUserData.city,
          },
        };

        setAllPost((prev) => [newPost, ...prev]);
        console.log("post saved successfully");
      } else {
        console.log("error while generating url");
      }
    }
    setPostDialog(false);
    setPostText("");
  };

  return (
    <Dialog
      open={postDialog}
      PaperProps={{
        sx: {
          ...dialogStyle,
        },
      }}
    >
      <div className='w-[100%] p-5 mt-[5%] h-[100%]'>
        <Tostify />
        <div className='p-4 '>
          <div>
            <textarea
              name='post'
              onChange={(e) => {
                setPostText(e.target.value);
              }}
              rows={6}
              value={postText}
              className=' text-xl text-black w-[100%] bg-white border-2 border-gray-400 border-opacity-80 rounded-md p-2'
              placeholder='What Do You Want To Talk About?'
              id='post'
            ></textarea>
          </div>

          {postFile ? (
            <img src={previewUrl} alt='image preview' className='w-[10%]' />
          ) : (
            <AddPhotoAlternateIcon
              className=' cursor-pointer text-blue-400'
              onClick={() => {
                handlePostFileClick();
              }}
            />
          )}
          <div className='profile-file-form'>
            <input
              type='file'
              name=''
              id=''
              ref={postPhotoRef}
              onChange={(e) => {
                handlePostFileChange(e);
              }}
            />
          </div>
        </div>
        <div className='flex justify-end'>
          <button
            className='bg-[#4eacff] text-black p-2 mr-3 rounded-md'
            onClick={() => {
              handlePostSubmit();
            }}
          >
            post
          </button>
        </div>
      </div>

      <div
        className='absolute top-[20px] right-[30px] text-2xl cursor-pointer'
        onClick={() => {
          setPostFile(null);
          setPostText("");
          setPostDialog(false);
        }}
      >
        <CloseIcon />
      </div>
    </Dialog>
  );
};

export default PostDialog;
