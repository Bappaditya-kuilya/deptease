import React from "react";

const NoData = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full my-20 rounded-2xl border border-[#E4E6EA] bg-white p-10 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
      <img
        src="/assets/empty.svg"
        alt="No data"
        className="w-64 h-64 opacity-80"
      />
      <p className="text-[#6E7178] text-sm font-medium mt-2">
        {title || "No data found"}
      </p>
    </div>
  );
};

export default NoData;
