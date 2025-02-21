import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("core-token");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    deadline: "",
    WaLink: "",
    fileUploadEnabled: false,
    posterImageDriveId: "",
    extraLinkName: "",
    extraLink: "",
    isHidden: false,
  });

  const [questions, setQuestions] = useState([]);
  const [enableTeams, setEnableTeams] = useState(false);
  const [teamSize, setTeamSize] = useState("");
  const [receivePayment, setReceivePayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: 0,
    qrCodeUrl: "",
  });

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/forms/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch form");
        
        const data = await response.json();
        setFormData({
          name: data.name,
          desc: data.desc,
          deadline: data.deadline,
          WaLink: data.WaLink,
          fileUploadEnabled: data.fileUploadEnabled,
          posterImageDriveId: data.posterImageDriveId || "",
          extraLinkName: data.extraLinkName || "",
          extraLink: data.extraLink || "",
          isHidden: data.isHidden,
        });
        setQuestions(data.formFields || []);
        setEnableTeams(data.enableTeams || false);
        setTeamSize(data.teamSize || "");
        setReceivePayment(data.receivePayment || false);
        setPaymentDetails({
          amount: data.amount || 0,
          qrCodeUrl: data.qrCodeUrl || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching form:", error);
        toast.error("Error loading form");
        navigate("/core/admin/forms/all");
      }
    };

    fetchForm();
  }, [id, token, navigate]);

  const handleFormSubmit = async () => {
    if (!formData.name || !formData.desc || !formData.deadline || !formData.WaLink) {
      toast.error("All required fields must be filled");
      return;
    }

    const formObject = {
      name: formData.name,
      desc: formData.desc,
      deadline: formData.deadline,
      WaLink: formData.WaLink,
      formFields: questions,
      enableTeams,
      teamSize: enableTeams ? teamSize : null,
      fileUploadEnabled: formData.fileUploadEnabled,
      receivePayment,
      amount: receivePayment ? paymentDetails.amount : 0,
      qrCodeUrl: receivePayment ? paymentDetails.qrCodeUrl : null,
      posterImageDriveId: formData.posterImageDriveId,
      extraLinkName: formData.extraLinkName,
      extraLink: formData.extraLink,
      isHidden: formData.isHidden,
    };

    const toastId = toast.loading("Updating form...");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/forms/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formObject),
        }
      );

      if (response.ok) {
        toast.success("Form updated successfully", { id: toastId });
        navigate("/core/admin/forms/all");
      } else {
        throw new Error("Failed to update form");
      }
    } catch (error) {
      console.error("Error updating form:", error);
      toast.error("Error updating form", { id: toastId });
    }
  };

  const handleInputChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        questionType: "text",
        required: false,
        options: [],
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (index, key, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][key] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options = [
      ...(updatedQuestions[index].options || []),
      "",
    ];
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = updatedQuestions[
      questionIndex
    ].options.filter((_, i) => i !== optionIndex);
    setQuestions(updatedQuestions);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      [{ direction: 'rtl' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  const formats = [
    'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'script',
    'blockquote', 'code-block', 'color', 'background', 'list', 'bullet',
    'indent', 'align', 'direction', 'link', 'image', 'video'
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex w-full flex-col justify-center">
      <h3 className="mb-4 mt-10 text-center text-3xl">
        Edit Form
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
          <div className="editor-container mb-24">
            <ReactQuill
              theme="snow"
              value={formData.desc}
              onChange={(content) => setFormData({ ...formData, desc: content })}
              modules={modules}
              formats={formats}
              placeholder="Form Description"
              className="h-48 rounded-lg text-slate-500"
            />
          </div>
          <input
            type="text"
            placeholder="Poster Image Drive ID"
            value={formData.posterImageDriveId}
            onChange={(e) => setFormData({ ...formData, posterImageDriveId: e.target.value })}
            className="rounded-lg border px-4 py-2 text-lg text-black mt-10"
          />
          <input
            type="text"
            placeholder="Extra Link Name"
            value={formData.extraLinkName}
            onChange={(e) => setFormData({ ...formData, extraLinkName: e.target.value })}
            className="rounded-lg border px-4 py-2 text-lg text-black"
          />
          {formData.extraLinkName && (
            <input
              type="text"
              placeholder="Extra Link"
              value={formData.extraLink}
              onChange={(e) => setFormData({ ...formData, extraLink: e.target.value })}
              className="rounded-lg border px-4 py-2 text-lg text-black"
            />
          )}
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            className="rounded-lg border px-4 py-2 text-lg text-black"
          />
          <input
            type="text"
            placeholder="WhatsApp Group Link"
            value={formData.WaLink}
            onChange={(e) => setFormData({ ...formData, WaLink: e.target.value })}
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
            {["checkbox", "dropdown"].includes(ques.questionType) && (
              <div className="mt-2 flex flex-col gap-2">
                {ques.options?.map((option, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Option ${j + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(i, j, e.target.value)}
                      className="rounded-lg border px-4 py-2 text-lg"
                    />
                    <button
                      onClick={() => handleRemoveOption(i, j)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddOption(i)}
                  className="mt-2 text-blue-500"
                >
                  Add Option
                </button>
              </div>
            )}
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

        <button
          onClick={addNewQuestion}
          className="my-4 rounded-md bg-green-500 p-2 text-white"
        >
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

        <div className="my-4 flex items-center gap-2">
          <label>Is Hidden:</label>
          <input
            type="checkbox"
            checked={formData.isHidden}
            onChange={(e) => setFormData({ ...formData, isHidden: e.target.checked })}
          />
        </div>

        <div className="my-4 flex items-center gap-2">
          <label>Enable File Upload:</label>
          <input
            type="checkbox"
            checked={formData.fileUploadEnabled}
            onChange={(e) => setFormData({ ...formData, fileUploadEnabled: e.target.checked })}
          />
        </div>

        {enableTeams && (
          <div className="my-4">
            <input
              type="number"
              placeholder="Team Size"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="rounded-lg border px-4 py-2 text-lg text-black"
            />
          </div>
        )}

        <div className="my-4 flex items-center gap-2">
          <label>Receive Payment:</label>
          <input
            type="checkbox"
            checked={receivePayment}
            onChange={(e) => setReceivePayment(e.target.checked)}
          />
        </div>

        {receivePayment && (
          <div className="my-4">
            <input
              type="number"
              placeholder="Amount"
              value={paymentDetails.amount}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, amount: e.target.value })}
              className="rounded-lg border px-4 py-2 text-lg text-black"
            />
            <input
              type="text"
              placeholder="QR Code URL"
              value={paymentDetails.qrCodeUrl}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, qrCodeUrl: e.target.value })}
              className="rounded-lg border px-4 py-2 text-lg text-black"
            />
          </div>
        )}

        <button
          onClick={handleFormSubmit}
          className="mt-6 w-full rounded-lg bg-blue-500 py-2 text-lg text-white"
        >
          Update Form
        </button>
      </div>
      <style jsx>{`
        .editor-container {
          min-height: 200px;
          margin-bottom: 20px;
        }
        .ql-container {
          min-height: 150px;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        .ql-picker-options {
          width: fit-content;
          min-width: 150px;
        }
      `}</style>
    </div>
  );
};

export default EditForm;
