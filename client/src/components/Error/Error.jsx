import React from "react";
import { VscBracketError } from "react-icons/vsc";

const Error = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex h-1/2 w-3/4 flex-col items-center justify-center rounded-lg bg-white/90 px-10 md:w-1/3">
        <h1 className="text-5xl text-red-900">Oops...</h1>
        <VscBracketError className="h-[10rem] w-[10rem] text-red-900" />

        <p className="text-lg text-red-900">
          Something Went Wrong. Please Try Again Later
        </p>
      </div>
    </div>
  );
};

export default Error;
