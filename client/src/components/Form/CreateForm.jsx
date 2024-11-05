import React, { useState } from "react";

const CreateForm = () => {
  const token = localStorage.getItem("core-token");
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    deadline: "",
    WaLink: "",
  });
  const [questions, setQuestions] = useState([]);
  const [inputValues, setInputValues] = useState([]);
  const [enableTeams, setEnableTeams] = useState(false);
  const [teamSize, setTeamSize] = useState("");

  const handleInputChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        questionType: "text",
        required: false,
      },
    ]);
    setInputValues([...inputValues, ""]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    const updatedInputValues = inputValues.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    setInputValues(updatedInputValues);
  };

  const handleQuestionChange = (index, key, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][key] = value;
    setQuestions(updatedQuestions);
  };

  const handleFormSubmit = async () => {
    if (
      !formData.name ||
      !formData.desc ||
      !formData.deadline ||
      !formData.WaLink
    ) {
      console.log(
        "Form title, description, deadline, and WhatsApp link are required.",
      );
      return;
    }

    const formObject = {
      name: formData.name,
      desc: formData.desc,
      deadline: formData.deadline,
      WaLink: formData.WaLink,
      formFields: questions,
      enableTeams: enableTeams,
      teamSize: enableTeams ? teamSize : null,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/forms/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formObject),
        },
      );

      if (response.ok) {
        console.log("Form created successfully");
        setFormData({ name: "", desc: "", deadline: "", WaLink: "" });
        setQuestions([]);
        setInputValues([]);
        setEnableTeams(false);
        setTeamSize("");
      } else {
        console.error("Error creating form");
      }
    } catch (error) {
      console.error("Network error", error);
    }
  };

  return (
    <div className="flex w-screen flex-col justify-center">
      <h3 className="mb-4 mt-10 text-center text-3xl">
        Admin - Create New Form
      </h3>
      <div className="mx-auto mb-48 h-full min-h-screen w-[80%] rounded-xl md:w-[60%]">
        <div className="flex flex-col gap-2 rounded-lg border border-t-[.5rem] border-blue-800 bg-white p-6 px-10">
          <input
            type="text"
            placeholder="Form Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="rounded-lg border px-4 py-2 text-2xl text-black"
          />
          <textarea
            placeholder="Form Description"
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            className="text-md rounded-lg border px-4 py-2 text-slate-500"
          />
          <input
            type="date"
            placeholder="Deadline"
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
            }
            className="rounded-lg border px-4 py-2 text-lg text-black"
          />
          <input
            type="text"
            placeholder="WhatsApp Group Link"
            value={formData.WaLink}
            onChange={(e) =>
              setFormData({ ...formData, WaLink: e.target.value })
            }
            className="rounded-lg border px-4 py-2 text-lg text-black"
          />
        </div>

        {questions.map((ques, i) => (
          <div key={i} className="my-4 flex flex-col gap-2 rounded-lg border px-4 py-2">
            <input
              type="text"
              placeholder="Question Text"
              value={ques.questionText}
              onChange={(e) => handleQuestionChange(i, "questionText", e.target.value)}
              className="rounded-lg border px-4 py-2 text-lg font-semibold"
            />
            <select
              value={ques.questionType}
              onChange={(e) => handleQuestionChange(i, "questionType", e.target.value)}
              className="rounded-lg border px-4 py-2"
            >
              <option value="text">Text</option>
              <option value="checkbox">Checkbox</option>
              <option value="dropdown">Dropdown</option>
            </select>
            <div className="flex items-center gap-2">
              <label>Required:</label>
              <input
                type="checkbox"
                checked={ques.required}
                onChange={(e) => handleQuestionChange(i, "required", e.target.checked)}
              />
            </div>
            <button
              onClick={() => removeQuestion(i)}
              className="mt-2 cursor-pointer rounded-md bg-red-500 p-2 text-white"
            >
              Remove Question
            </button>
          </div>
        ))}

        <button onClick={addNewQuestion} className="my-4 rounded-md bg-green-500 p-2 text-white">
          Add Question
        </button>

        <div className="my-4 flex items-center gap-2">
          <label>Enable Teams:</label>
          <input
            type="checkbox"
            checked={enableTeams}
            onChange={(e) => setEnableTeams(e.target.checked)}
          />
        </div>

        {enableTeams && (
          <div className="my-4">
            <input
              type="number"
              placeholder="Enter Team Size"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="rounded-lg border px-4 py-2 text-lg text-black"
            />
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleFormSubmit}
            className="rounded-lg bg-blue-800 p-3 text-lg font-semibold text-white"
          >
            Submit Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
