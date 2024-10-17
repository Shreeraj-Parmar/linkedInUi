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
  const [previewUrl, setPreviewUrl] = useState([]); // for image preview
  const [postFile, setPostFile] = useState([]);
  const [postText, setPostText] = useState("");
  const [generatedfileName, setGeneratedFileName] = useState([]);
  const [generatedURL, setGeneratedURL] = useState([]);
  const postPhotoRef = useRef();

  const handlePostFileClick = () => {
    postPhotoRef.current.click();
    console.log("clicked", previewUrl);
    console.log("postFile", postFile);
  };

  const handlePostFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array

    setPostFile((prevFiles) => [...prevFiles, ...files]); // Append new files to the existing array
    const previews = files.map((file) => URL.createObjectURL(file)); // Generate previews for all new files
    setPreviewUrl((prevUrls) => [...prevUrls, ...previews]);
  };

  const handlePostSubmit = async () => {
    if (postText === "" && postFile.length === 0) {
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
      return;
    }

    let uploadedUrls = []; // Array to store uploaded file URLs

    if (postFile.length > 0) {
      for (const file of postFile) {
        let res = await getURLForPOST({ fileType: file.type });
        if (res.status === 200) {
          const nameOfFile = res.data.fileName;

          let resOfAWS = await uploadFileAWS({
            uploadURL: res.data.url,
            postFile: file,
            fileType: file.type,
          });

          if (resOfAWS.status === 200) {
            const bucket = import.meta.env.VITE_AWS_S3_BUCKET_NAME;
            const region = import.meta.env.VITE_AWS_REGION;
            const permanentUrlForPost = `https://${bucket}.s3.${region}.amazonaws.com/PostPicture/${nameOfFile}`;
            uploadedUrls.push({
              url: permanentUrlForPost,
              fileType: file.type,
            }); // Store the uploaded URL
          } else {
            toast.error("Error while uploading image!");
          }
        }
      }

      console.log("total uploaded urls", uploadedUrls);

      // save post in db
      let res = await savePostData({
        text: postText,
        mediaUrls: uploadedUrls,
      });

      if (res.status === 200) {
        console.log("post saved successfully");
        let newPost = {
          text: postText,
          mediaUrls: uploadedUrls,
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

        setPostFile([]);
        setPreviewUrl([]);
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
    setPostFile([]);
    setPreviewUrl([]);
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

          {postFile && (
            <div className='previews flex gap-2  justify-start p-2 items-center flex-wrap'>
              {previewUrl.map((url, index) => (
                <div
                  key={index}
                  className={`relative border-2 border-gray-400 border-opacity-40  animate-fadeIn  rounded-md preview-post`}
                  id={`preview-${index}`}
                >
                  {postFile[index].type.startsWith("video/") ? (
                    <video
                      src={url}
                      controls
                      className='w-[118px] h-[120px] rounded-md '
                    />
                  ) : (
                    <img
                      src={url}
                      alt='preview'
                      className='w-[118px] h-[120px] rounded-md preview-post'
                    />
                  )}
                  <CloseIcon
                    onClick={() => {
                      let updatedFiles = postFile.filter((_, i) => i !== index);
                      setTimeout(() => {
                        setPostFile(updatedFiles);
                        setPreviewUrl((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }, 500);
                    }}
                    fontSize='small'
                    className='absolute top-[-9px]  right-[-8px] hover:text-[#e74c3c] text-[#ffffff] bg-[#4f4f4f] rounded-full cursor-pointer'
                  />
                </div>
              ))}
            </div>
          )}
          <AddPhotoAlternateIcon
            className=' cursor-pointer text-blue-400'
            fontSize='large'
            onClick={() => {
              handlePostFileClick();
            }}
          />

          <div className='profile-file-form'>
            <input
              type='file'
              multiple // Enable multiple file selection
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
            className='bg-[#4eacff] text-black p-2 mr-3 mb-3 hover:bg-[#2c618f] rounded-md'
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
          setPostFile([]);
          setPreviewUrl([]);
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
