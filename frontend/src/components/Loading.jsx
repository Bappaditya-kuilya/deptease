import { AiOutlineLoading } from "react-icons/ai";

const Loading = () => {
  return (
    <div className="w-full h-[40vh] flex justify-center items-center flex-col gap-4">
      <AiOutlineLoading className="animate-spin text-[#16181D] text-4xl" />
      <p className="text-gradient text-sm font-medium tracking-wide">
        Loading
      </p>
    </div>
  );
};

export default Loading;
