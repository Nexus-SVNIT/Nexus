import React from "react";
import { VscBracketError } from "react-icons/vsc";

const Error = () => {
  const currentUrl = window.location.pathname + window.location.search;
  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <div className="flex h-1/2 w-full max-w-sm flex-col items-center justify-center rounded-lg px-10">
        <h1 className="text-5xl text-red-400">Oops...</h1>
        <VscBracketError className="h-[10rem] w-[10rem] text-red-400" />

        <p className="text-center text-lg text-red-400">
          Something Went Wrong. <br />
          <button
            className="mt-8 min-h-[44px] rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-500 transition-colors"
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
