import React from "react";

const QuestionBox = ({ ques, inputValue, onInputChange, isUser }) => {
  const { questionText, required, questionType, options } = ques;
  const fieldName = questionText || "Field";

  return (
    <div className="text-graydark mt-4 flex flex-col gap-2 rounded-lg bg-white p-6 px-5 md:px-10">
      <div className="flex justify-between gap-4">
        <label htmlFor={fieldName} className="w-full text-lg font-medium">
          {fieldName}
          {required && <span className="text-red-700"> *</span>}
        </label>
      </div>
      <div>
        {/* Render different input types based on questionType */}
        {questionType === "text" && (
          <textarea
            id={fieldName}
            value={inputValue}
            name={fieldName}
            onChange={onInputChange}
            className={`h-12 py-5 w-full resize-none border-b-2 outline-none md:w-2/3 ${isUser ? "uppercase" : ""}`}
            required={required}
            placeholder={`Enter your response to ${fieldName.toLowerCase()}`}
            pattern={isUser ? "(I|U)\\d{2}(CS|AI)\\d{3}" : undefined}
          />
        )}

        {questionType === "checkbox" && options && (
          <div className="flex flex-col gap-2">
            {options.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={fieldName}
                  value={option}
                  checked={inputValue.includes(option)}
                  onChange={(e) => {
                    const updatedValue = e.target.checked
                      ? [...inputValue, option]
                      : inputValue.filter((val) => val !== option);
                    onInputChange({ target: { name: fieldName, value: updatedValue } });
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        )}

        {questionType === "dropdown" && options && (
          <select
            id={fieldName}
            value={inputValue}
            name={fieldName}
            onChange={onInputChange}
            required={required}
            className="h-6 w-full resize-none border-b-2 outline-none md:w-2/3"
          >
            <option value="" disabled>
              Select an option
            </option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default QuestionBox;
