import React, { useRef, useState, useContext } from "react";

import { Dialog, DialogContent } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { getURLForPOST, uploadFileAWS, savePostData } from "../services/api.js";
import CloseIcon from "@mui/icons-material/Close";
import { AllContext } from "../context/UserContext.jsx";
import SnakBar from "../components/SnakBar.jsx";
import Loader from "../components/Loader/Loader.jsx";
import { useParams } from "react-router-dom";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import IconButton from "@mui/material/IconButton";
import ChangeAs from "./ChangeAs.jsx";
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

  maxHeight: "80vh",

  //   overflow: "hidden",
  borderRadius: "8px",
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

  setShowAllMedia,
}) => {
  const {
    setLoading,
    currUserData,
    setIsSnakBar,
    actAs,
    setActAs,
    changeAsDialog,
    setChangeAsDialog,
  } = useContext(AllContext);
  const [previewUrl, setPreviewUrl] = useState([]); // for image preview
  const [postFile, setPostFile] = useState([]);
  const [postText, setPostText] = useState("");
  const [generatedfileName, setGeneratedFileName] = useState([]);
  const [generatedURL, setGeneratedURL] = useState([]);
  const [snak, setSnak] = useState({ type: null, text: null });
  const { companyId } = useParams();

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
    setLoading(true);

    if (postText === "" && postFile.length === 0) {
      setSnak({
        type: "error",
        text: "Please write something or select a photo!",
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
            });
          } else {
            setSnak({
              type: "error",
              text: "Error uploading image",
            });
            return;
          }
        }
      }

      console.log("Uploaded URLs:", uploadedUrls);
    }

    // Create post data object based on `actAs` context
    const postData = {
      text: postText,
      mediaUrls: uploadedUrls,
      createdBy: {
        type: actAs.type === "user" ? "User" : "Company",
        id: actAs.id,
      },
    };

    // Save post in the database
    let res = await savePostData(postData);

    if (res.status === 200) {
      const newPost = {
        ...postData,
        _id: res.data.postId,
        comments: [],
        likeCount: 0,
        likedBy: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        createdBy: {
          id: {
            _id: actAs.id,
            name:
              actAs.type === "user"
                ? currUserData.name
                : currUserData.company.find((comp) => comp._id === actAs.id)
                    ?.name,
            profilePicture:
              actAs.type === "user"
                ? currUserData.profilePicture || imgUrl || "/blank.png"
                : currUserData.company.find((comp) => comp._id === actAs.id)
                    ?.profilePicture || "/blank.png",
            city:
              actAs.type === "user"
                ? currUserData.city
                : currUserData.company.find((comp) => comp._id === actAs.id)
                    ?.city,
            followers:
              actAs.type === "user"
                ? currUserData.followers
                : currUserData.company.find((comp) => comp._id === actAs.id)
                    ?.followers,
          },
        },
      };

      console.log(newPost);

      setAllPost((prev) => [newPost, ...prev]);
      setShowAllMedia((prev) => ({ ...prev, [res.data.postId]: false }));
      setSnak({ type: "success", text: "Post uploaded successfully" });
      resetPostFields();
    } else {
      setSnak({ type: "error", text: "Error saving post" });
      resetPostFields();
    }
  };

  const resetPostFields = () => {
    setPostFile([]);
    setPreviewUrl([]);
    setPostText("");
    setTimeout(() => {
      setLoading(false);
      setPostDialog(false);
    }, 1500);
    setIsSnakBar(true);
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
      <Loader />
      {snak.type && <SnakBar type={snak.type} text={snak.text} />}
      <ChangeAs
        setActAs={setActAs}
        setChangeAsDialog={setChangeAsDialog}
        changeAsDialog={changeAsDialog}
        currUserData={currUserData}
      />
      <div className='w-[100%] p-5 mt-[5%] h-[100%]'>
        <p className='text-2xl'> Post As</p>
        <div className='p-4 flex space-x-2 max-w-[80%] justify-start hover:bg-[#DBDBDC] rounded-md cursor-pointer items-center'>
          {actAs.type === "user" && (
            <>
              <div>
                <img
                  src={imgUrl || "/blank.png"}
                  className='w-[60px] shadow-md rounded-full h-[60px]'
                  alt=''
                />
              </div>
              <div className='min-w-[100px]'>
                <p> {currUserData?.name}</p>
              </div>
            </>
          )}

          {actAs.type === "company" && (
            <>
              <div>
                <img
                  src={
                    (currUserData &&
                      currUserData.company &&
                      currUserData.company.find((comp) => comp._id === actAs.id)
                        ?.profilePicture) ||
                    "/blank.png"
                  }
                  className='w-[60px] shadow-md rounded-full h-[60px]'
                  alt=''
                />
              </div>
              <div className='min-w-[100px]'>
                <p>
                  {currUserData &&
                    currUserData.company &&
                    currUserData.company.find((comp) => comp._id === actAs.id)
                      ?.name}
                </p>
              </div>
            </>
          )}

          {currUserData &&
            currUserData.company &&
            currUserData.company.length > 0 &&
            !companyId && (
              <div>
                <button
                  onClick={() => {
                    setChangeAsDialog(true);
                  }}
                  className='p-2 flex justify-center items-center min-w-[160px] bg-[#0A66C2] text-white hover:bg-[#004182] focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full font-semibold  space-x-1'
                >
                  <SwapHorizIcon />
                  <p>Switch Account</p>
                </button>
              </div>
            )}
        </div>
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
            className='bg-[#0A66C2] text-white p-2 mr-3 mb-3 hover:bg-[#004182] rounded-md font-semibold'
            onClick={() => {
              handlePostSubmit();
            }}
          >
            Post
          </button>
        </div>
      </div>

      <div
        className='absolute top-[15px] right-[20px] text-2xl cursor-pointer'
        onClick={() => {
          setPostFile([]);
          setPreviewUrl([]);
          setPostText("");
          setPostDialog(false);
        }}
      >
        <IconButton>
          <CloseIcon />
        </IconButton>
      </div>
    </Dialog>
  );
};

export default PostDialog;
