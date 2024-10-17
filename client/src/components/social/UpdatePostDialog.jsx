import React, { useEffect, useState, useContext, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Tostify from "../Tostify.jsx";
import { toast } from "react-toastify";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { Dialog } from "@mui/material";
import { getURLForPOST, uploadFileAWS } from "../../services/api.js";

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

const UpdatePostDialog = ({
  updatePostDialog,
  setAllPost,
  setUpdatePostDialog,

  setSelectedPostForUpdate,
  selectedPostForUpdate,
}) => {
  const [previewUrl, setPreviewUrl] = useState([]); // for image preview
  const [postFile, setPostFile] = useState([]);
  const [postText, setPostText] = useState(selectedPostForUpdate.text);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const postPhotoRef = useRef();
  useEffect(() => {
    const UrlFromPost = selectedPostForUpdate.mediaUrls.map((media) => {
      return {
        url: media.url,
        fileType: media.fileType,
      };
    });
    setUploadedUrls(UrlFromPost);
    // const PreviewSet = selectedPostForUpdate.mediaUrls.map((media) => {
    //   return media.url;
    // });
    setPreviewUrl(UrlFromPost);
    console.log("url from post is", UrlFromPost);
    return () => {};
  }, []);

  const handlePostFileClick = () => {
    postPhotoRef.current.click();
    console.log("clicked", previewUrl);
    console.log("postFile", postFile);
    console.log("uploadedUrls", uploadedUrls);
  };

  const handlePostFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array

    setPostFile((prevFiles) => [...prevFiles, ...files]); // Append new files to the existing array
    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      fileType: file.type,
    })); // Generate previews for all new files
    setPreviewUrl((prevUrls) => [...prevUrls, ...previews]);
  };

  const handlePostSubmit = async () => {
    if (postText === "" && previewUrl.length === 0) {
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

    let newUrls = []; // Array to store uploaded file URLs

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
            newUrls.push({
              url: permanentUrlForPost,
              fileType: file.type,
            }); // Store the uploaded URL
          } else {
            toast.error("Error while uploading image!");
          }
        }
      }

      console.log("total New urls", newUrls);

      let newUploadUrl = [...uploadedUrls, ...newUrls];
      setUploadedUrls(newUploadUrl);

      console.log("new upload in mongo url is", newUploadUrl);

      // save post in db
      //   let res = await savePostData({
      //     text: postText,
      //     mediaUrls: uploadedUrls,
      //   });

      //   if (res.status === 200) {
      //     console.log("post saved successfully");
      //     let newPost = {
      //       text: postText,
      //       mediaUrls: uploadedUrls,
      //       _id: res.data.postId,
      //       comments: [],
      //       likeCount: 0,
      //       likedBy: [],
      //       createdAt: Date.now(),
      //       updatedAt: Date.now(),
      //       user: {
      //         _id: currUserData._id,
      //         name: currUserData.name,
      //         profilePicture: currUserData.profilePicture || imgUrl,
      //         city: currUserData.city,
      //       },
      //     };
      //     console.log("new post is here", newPost);
      //     setAllPost((prev) => [newPost, ...prev]);
      //     setPostText("");
      //     setPostFile(null);
      //   } else {
      //     toast.error(`Error While Uploading IMAGE . !`, {
      //       position: "top-right",
      //       autoClose: 4000,
      //       hideProgressBar: false,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       progress: undefined,
      //       theme: "light",
      //     });
      //     console.log("error while generating url");

      setPostFile([]);
      setPreviewUrl([]);
      setPostText("");
      //   }
    } else {
      console.log("new upload in mongo url is", uploadedUrls);
      //   let res = await savePostData({
      //     text: postText,
      //   });
      //   if (res.status === 200) {
      //     let newPost = {
      //       text: postText,
      //       _id: res.data.postId,
      //       comments: [],
      //       likeCount: 0,
      //       likedBy: [],
      //       createdAt: Date.now(),
      //       updatedAt: Date.now(),
      //       user: {
      //         _id: currUserData._id,
      //         name: currUserData.name,
      //         profilePicture: currUserData.profilePicture || imgUrl,
      //         city: currUserData.city,
      //       },
      //     };

      //     setAllPost((prev) => [newPost, ...prev]);
      //     console.log("post saved successfully");
      //   } else {
      //     console.log("error while generating url");
      //   }
    }

    setPostFile([]);
    setPreviewUrl([]);
  };

  return (
    <Dialog
      open={updatePostDialog}
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
              {previewUrl.map((pre, index) => (
                <div
                  key={index}
                  className={`relative border-2 border-gray-400 border-opacity-40  animate-fadeIn  rounded-md preview-post`}
                  id={`preview-${index}`}
                >
                  {previewUrl[index].fileType === "video/mp4" ? (
                    <video
                      src={pre.url}
                      controls
                      className='w-[118px] h-[120px] rounded-md '
                    />
                  ) : (
                    <img
                      src={pre.url}
                      alt='preview'
                      className='w-[118px] h-[120px] rounded-md preview-post'
                    />
                  )}
                  <CloseIcon
                    onClick={() => {
                      let availablefile = postFile.find(
                        (obj) => obj.find((file) => file.url) === pre.url
                      );
                      let updatedFiles = postFile.filter(
                        (_, i) => i !== postFile[index]
                      );

                      setPostFile(updatedFiles);
                      setPreviewUrl((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                      setUploadedUrls((prev) =>
                        prev.filter((obj) => obj.url !== pre.url)
                      );
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
            Update
          </button>
        </div>
      </div>

      <div
        className='absolute top-[20px] right-[30px] text-2xl cursor-pointer'
        onClick={() => {
          setPostFile([]);
          setPreviewUrl([]);
          setUpdatePostDialog(false);
        }}
      >
        <CloseIcon />
      </div>
    </Dialog>
  );
};

export default UpdatePostDialog;
