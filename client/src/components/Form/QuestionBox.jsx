import React from "react";

const QuestionBox = ({ ques, inputValue, onInputChange }) => {
  // Use ques.questionText for the field label
  const fieldName = ques.questionText || "Field";
  const inputType = ques.questionType || "text"; // Default to text input if type is not specified

  return (
    <div className="text-graydark mt-4 flex flex-col gap-2 rounded-lg bg-white p-6 px-5 md:px-10">
      <div className="flex justify-between gap-4">
        <label htmlFor={fieldName} className="w-full text-lg font-medium">
          {fieldName}
          {ques.required && <span className="text-red-700"> *</span>}
        </label>
      </div>
      <div>
        <input
          id={fieldName}
          value={inputValue}
          name={fieldName}
          onChange={onInputChange}
          className="h-6 w-full resize-none border-b-2 outline-none md:w-2/3"
          required={ques.required}
          placeholder={`Enter your ${fieldName.toLowerCase()}`}
          type={inputType} // Use the correct input type
        />
      </div>
    </div>
  );
};

export default QuestionBox;
