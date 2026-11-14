import React from "react";

const CustomButton = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "primary",
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-[#1A1D21] text-white font-semibold hover:bg-black";
      case "secondary":
        return "bg-white border border-[#E4E6EA] text-[#16181D] hover:bg-[#F5F6F8] hover:border-[#D5D8DE]";
      case "danger":
        return "bg-[#DC2626] text-[#16181D] hover:bg-[#B91C1C]";
      default:
        return "bg-[#1A1D21] text-white font-semibold hover:bg-black";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-full
        font-medium text-sm
        transition-all duration-300 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center
        ${getVariantClasses()}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default CustomButton;
