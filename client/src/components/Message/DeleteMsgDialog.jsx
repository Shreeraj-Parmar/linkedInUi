import React from "react";
import { Dialog, styled } from "@mui/material";
import { deleteMsg } from "../../services/api.js";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const dialogStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  margin: "auto",
  width: "40vw",
  color: "#000",

  maxHeight: "20vh",

  //   overflow: "hidden",
  borderRadius: "7px",
  padding: "20px",
  display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  backgroundColor: "#F4F2EE",
};

const DeleteMsgDialog = ({
  setDeleteDialog,
  deleteDialog,
  messages,
  setMessages,
  currConversationId,
  setIsMultiSelectMode,
  setLastMsg,
}) => {
  const handleDeleteSelectedMsgs = async (data) => {
    let deletedMsgList = messages.filter((msg) => msg.selected);
    console.log("deleted msg list", deletedMsgList);

    let res = await deleteMsg({
      deletedMsgList: deletedMsgList,
      deleteFor: data,
    });
    if (res.status === 200) {
      console.log("message deleted");
      setMessages(messages.filter((msg) => !msg.selected));

      let newMessages = messages.filter((msg) => !msg.selected);

      setLastMsg((prevLastMsg) => ({
        ...prevLastMsg,
        [currConversationId]: newMessages[newMessages.length - 1].mediaUrl
          ? "Attechment sends"
          : newMessages[newMessages.length - 1].text,
      }));

      setIsMultiSelectMode(false);

      setDeleteDialog(false);
    }
  };
  return (
    <Dialog
      open={deleteDialog}
      PaperProps={{
        sx: {
          ...dialogStyle,
        },
      }}
    >
      <div className='delete-msg-dialog'>
        <p>Are you sure you want to delete these messages?</p>
        <div className=' flex justify-end mt-10 space-x-2'>
          <Button
            onClick={() => {
              setDeleteDialog(false);
            }}
            variant='text'
          >
            Cancle
          </Button>
          <Button
            onClick={() => {
              handleDeleteSelectedMsgs("every");
            }}
            variant='outlined'
          >
            Delete For Everyone
          </Button>
          <Button
            onClick={() => {
              handleDeleteSelectedMsgs("me");
            }}
            variant='contained'
          >
            Delete For Me
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteMsgDialog;
