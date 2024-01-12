import React, { useState } from "react";
import QuestionBox from "./QuestionBox";

const CreateForm = () => {
  const [currSelectedQuestion, setCurrSelectedQuestion] = useState(0);
  const [questions, setQuestions] = useState([
    {
      questionText: "1. Describe Your Question here ? .",
      questionType: "text",
      options: [],
      open: false,
      required: true,
    },
  ]);
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "1. Describe Your Question here ? .",
        questionType: "text",
        options: [],
        open: false,
        required: true,
      },
    ]);
  };

  return (
    <div className="flex w-screen flex-col justify-center">
      <h3 className="mb-4 mt-10 text-center text-3xl">Registration Form</h3>
      <div className="mx-auto mb-48 h-full min-h-screen  w-[80%] rounded-xl md:w-[60%]">
        <div className="flex flex-col gap-2 rounded-lg border  border-t-[.5rem] border-blue-800 bg-white p-6 px-10">
          <input
            type="text"
            placeholder="Registration Form"
            className="rounded-sm px-4 py-2 text-4xl text-black outline-none"
          />
          <textarea
            type="text"
            placeholder="This is demo form description. add your own form description to provide more details of your event."
            className=" rounded-sm px-4 py-2 text-xl text-black outline-none "
            rows={2}
          />
        </div>

        {questions.map((ques, i) => (
          <QuestionBox
            key={i}
            ques={ques}
            index={i}
            open={i === currSelectedQuestion}
            setCurrSelectedQuestion={setCurrSelectedQuestion}
            addQuestion={setQuestions}
          />
        ))}
      </div>
    </div>
  );
};

export default CreateForm;
