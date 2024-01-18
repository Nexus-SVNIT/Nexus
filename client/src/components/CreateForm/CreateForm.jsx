import React, { useState } from "react";
import QuestionBox from "./QuestionBox";

const CreateForm = () => {
  const [currSelectedQuestion, setCurrSelectedQuestion] = useState(0);
  const [formData, setFormData] = useState({
    formTitle: "Nexus Team Info",
    formDescription:
      "This form is designed for Nexus team members to share their online presence. Members can input their GitHub, Instagram, and LinkedIn links, providing a convenient way to centralize and organize team members' online profiles.",
  });
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
  const [inputValues, setInputValues] = useState(
    Array(questions.length).fill(""),
  );

  const handleInputChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const handleSubmit = async () => {
    // const resultObject = {};
    // questions.forEach((question, index) => {
    //   resultObject[question.questionText] = inputValues[index];
    // });
    // console.log(resultObject);
    // const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/forms/submit/:id`,{
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body:JSON.stringify(resultObject)
    // });
    const newInputValues = Array(questions.length).fill("");
    setInputValues(newInputValues);
  };

  return (
    <div className="flex w-screen flex-col justify-center">
      <h3 className="mb-4 mt-10 text-center text-3xl">Registration Form</h3>
      <div className="mx-auto mb-48 h-full min-h-screen  w-[80%] rounded-xl md:w-[60%]">
        <div className="flex flex-col gap-2 rounded-lg border  border-t-[.5rem] border-blue-800 bg-white p-6 px-10">
          <p className="px-4 py-2 text-4xl text-black">{formData.formTitle}</p>
          <p className="text-md px-4 py-2 text-slate-500">
            {formData.formDescription}
          </p>
        </div>

        {questions.map((ques, i) => (
          <QuestionBox
            key={i}
            ques={ques}
            index={i}
            setCurrSelectedQuestion={setCurrSelectedQuestion}
            inputValue={inputValues[i]}
            onInputChange={handleInputChange}
          />
        ))}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="my-4 cursor-pointer rounded-md bg-blue-500 p-2 text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
