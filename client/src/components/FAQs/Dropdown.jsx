import React, { useState } from "react";

const Dropdown = ({ question, answer }) => {
  const [isShowAns, setIsShowAns] = useState(false);
  return (
    <div
      className={`max-h-[50rem] w-[90%] rounded-md bg-gray-400/25 p-4  transition-all duration-300 sm:text-base md:w-3/4 md:text-lg `}
    >
      <div
        className="flex cursor-pointer items-center justify-between px-2 font-semibold "
        onClick={(e) => setIsShowAns(!isShowAns)}
      >
        <h2 className="w-3/4">{question ?? "Your Question?"}</h2>
        <img
          src="/assets/down_arrow.svg"
          alt="DownArrow"
          className={`h-4 w-4 transition duration-300 ${
            isShowAns && "rotate-180"
          }`}
        />
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isShowAns ? "max-h-[30rem] opacity-100 " : "max-h-0 opacity-0"
        }`}
      >
        <p className="p-2 text-gray-400">
          {answer ?? "Your answer shown here \n "}
        </p>
      </div>
    </div>
  );
};

export default Dropdown;
