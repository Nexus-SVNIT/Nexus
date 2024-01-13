import React, { useState } from "react";
import QuestionBox from "./QuestionBox";

const CreateForm = () => {
  const [currSelectedQuestion, setCurrSelectedQuestion] = useState(0);
  const [questions, setQuestions] = useState([
    {
      questionText: "Linkedin Link",
      questionType: "text",
      required: true,
    },
    {
      questionText: "Github Link",
      questionType: "text",
      required: true,
    },
    {
      questionText: "Instagram Link",
      questionType: "text",
      required: true,
    },
  ]);
  const [inputValues, setInputValues] = useState(Array(questions.length).fill(""));

  const handleInputChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const handleSubmit = () => {
    console.log("Input Values:", inputValues);
    const newInputValues = Array(questions.length).fill("");
    setInputValues(newInputValues);
  };

  return (
    <div className="flex w-screen flex-col justify-center">
      <h3 className="mb-4 mt-10 text-center text-3xl">Registration Form</h3>
      <div className="mx-auto mb-48 h-full min-h-screen  w-[80%] rounded-xl md:w-[60%]">
        <div className="flex flex-col gap-2 rounded-lg border  border-t-[.5rem] border-blue-800 bg-white p-6 px-10">
          <p className="px-4 py-2 text-4xl text-black">Event Name</p>
          <p className="px-4 py-2 text-xl text-slate-500">
            This is demo form description. add your own form description to
            provide more details of your event.
          </p>
        </div>

        {questions.map((ques, i) => (
          <QuestionBox
            ques={ques}
            index={i}
            setCurrSelectedQuestion={setCurrSelectedQuestion}
            inputValue={inputValues[i]}
            onInputChange={handleInputChange}
          />
        ))}
        <div className="flex justify-center">
          <button onClick={handleSubmit} className="my-4 bg-blue-500 text-white p-2 rounded-md cursor-pointer">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
