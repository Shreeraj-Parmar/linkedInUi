import React, { useContext } from "react";
import { AllContext } from "../context/UserContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const SnakBar = ({ type, text }) => {
  const { IsSnakBar, setIsSnakBar } = useContext(AllContext);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnakBar(false);
  };
  return (
    <div>
      <Snackbar open={IsSnakBar} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={type || "info"}
          variant='filled'
          sx={{ width: "100%" }}
        >
          {text || "Something went wrong"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SnakBar;
