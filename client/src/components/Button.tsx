import React from "react";
import { ButtonAtt } from "../types";

const Button: React.FC<ButtonAtt> = ({ label, onClick }) => {
  return (
    <button className="btn btn-active btn-primary w-1/2" onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
