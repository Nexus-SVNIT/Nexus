import React, { useState } from "react";

const QuestionBox = ({ ques, index, inputValue, onInputChange }) => {
  // const [isOpen, setIsOpen] = useState(open);
  return (
    <>
      <div className="mt-4 flex flex-col gap-2 rounded-lg  bg-white p-6  px-10 text-gray-800">
        <div className="flex justify-between gap-4">
          <h2 className="w-full">
            {ques.questionText}{" "}
            <span className="text-red-700">{ques.required ? "*" : ""} </span>
          </h2>
        </div>
        <div>
          <input
            value={inputValue}
            onChange={(e) => onInputChange(index, e.target.value)}
            className="w-2/3 resize border-b-2 outline-none"
          />
        </div>
      </div>
    </>
  );
};

export default QuestionBox;
