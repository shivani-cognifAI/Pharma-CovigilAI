import React from "react";
import { IButtonProp } from "../helper/common.modal";

const Button = ({
  buttonType,
  customClasses,
  buttonText,
  onClick,
  disabled = false,
}: IButtonProp) => {
  return (
    <React.Fragment>
      <button
        type={buttonType}
        className={`${customClasses} ${
          disabled ? "cursor-not-allowed " : "cursor-pointer"
        } text-center font-bold justify-center text-sm text-white rounded shadow-sm font-Montserrat focus:outline-none leading-6`}
        onClick={onClick}
        disabled={disabled}
      >
        {buttonText}
      </button>
    </React.Fragment>
  );
};

export default Button;
