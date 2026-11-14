import React from "react";
const heading = (props) => {
  return (
    <div className="flex justify-between items-center w-full">
      <p className="font-display font-semibold text-2xl md:text-3xl tracking-tight text-[#16181D] border-l-4 border-[#FFB020] pl-3">
        {props.title}
      </p>
    </div>
  );
};

export default heading;
