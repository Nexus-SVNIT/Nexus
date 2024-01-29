import { useEffect, useRef } from "react";

const QuestionBox = ({ ques, inputValue, onInputChange }) => {
  const ref = useRef();
  // useEffect(() => {
  //   const listener = () => {
  //     ref.current.style.height = "0x";
  //     ref.current.style.height = ref.current.scrollHeight + "px";
  //   };
  //   ref.current.addEventListener("input", listener);
  // }, []);
  return (
    <>
      <div className="mt-4 flex flex-col gap-2 rounded-lg  bg-white p-6  px-5 text-gray-800 md:px-10">
        <div className="flex justify-between gap-4">
          <h2 className="w-full">
            {ques.name}{" "}
            <span className="text-red-700">{!ques?.required ? "" : "*"} </span>
          </h2>
        </div>
        <div>
          <input
            value={inputValue}
            name={ques.name}
            onChange={onInputChange}
            className="h-6 w-full resize-none border-b-2 outline-none md:w-2/3"
            required
          />
        </div>
      </div>
    </>
  );
};

export default QuestionBox;
