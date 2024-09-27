import React from "react";
import { TextField, styled, InputLabel, Select, MenuItem } from "@mui/material";

const Input = ({
  id,
  lable,
  onChange,
  value,
  name,
  type,
  className,
  required,
}) => {
  return (
    <TextField
      className={className}
      id={id}
      label={lable}
      required={required}
      variant="outlined"
      onChange={onChange}
      value={value}
      name={name}
      type={type}
    />
  );
};

export default Input;
