import React, { useState } from "react";

const Dropdown = ({ question, answer }) => {
  const [isShowAns, setIsShowAns] = useState(false);
  return (
    <div
      className={`max-h-[50rem] w-[90%] rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-zinc-600/50 sm:text-base md:w-3/4 md:text-lg `}
    >
      <div
        className="flex cursor-pointer items-center justify-between px-2 font-medium text-gray-200"
        onClick={(e) => setIsShowAns(!isShowAns)}
      >
        <h2 className="w-3/4">{question ?? "Your Question?"}</h2>
        <svg
          className={`h-5 w-5 text-blue-400 transition-transform duration-300 ${
            isShowAns && "rotate-180"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isShowAns ? "mt-3 max-h-[30rem] opacity-100 " : "max-h-0 opacity-0"
        }`}
      >
        <p className="border-t border-zinc-700/50 p-3 pt-4 text-gray-400 leading-relaxed">
          {answer ?? "Your answer shown here \n "}
        </p>
      </div>
    </div>
  );
};

export default Dropdown;
