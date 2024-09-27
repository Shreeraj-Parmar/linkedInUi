import React from "react";

const Button = ({ className, onClick, lable, type }) => {
  return (
    <button className={className} onClick={onClick} type={type}>
      {lable}
    </button>
  );
};

export default Button;
