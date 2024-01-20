import React from "react";
import { VscBracketError } from "react-icons/vsc";

const Error = () => {
  const currentUrl = window.location.pathname + window.location.search;
  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <div className="flex h-1/2 w-3/4 flex-col items-center justify-center rounded-lg  px-10 md:w-1/3">
        <h1 className="text-5xl text-red-900">Oops...</h1>
        <VscBracketError className="h-[10rem] w-[10rem] text-red-900" />

        <p className="text-center text-lg text-red-900">
          Something Went Wrong. <br />
          <button
            className="mt-8 bg-blue-500 p-2 text-black active:bg-transparent active:text-blue-700"
            onClick={(e) => window.location.reload()}
          >
            Try Again
          </button>
        </p>
      </div>
    </div>
  );
};

export default Error;
