import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import HeadTags from "../HeadTags/HeadTags";
import Loader from "../Loader/Loader";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import QuestionBox from "./QuestionBox";

const RegisterForm = () => {
  const { formId } = useParams();
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(false);
  const [link, setLink] = useState("");  
  const [formData, setFormData] = useState({
    _id: formId,
    name: "",
    desc: "",
    deadline: "",
    formFields: [],
    responseCount: 0,
  });
  const [formResponse, setFormResponse] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormResponse((prevResponse) => ({
      ...prevResponse,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.values(formResponse).some(value => value.trim() === "")) {
      toast.error("Please fill in all the fields.");
      return;
    }

    setLoading(true);

    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/forms/submit/${formId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formResponse),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setFormResponse({});
          toast.success("Your Response Collected Successfully!");
          setFlag(true);
          setLink(res.WaLink);
        } else {
          toast.error(res.message);
        }
      })
      .catch((e) => toast.error("Something Went Wrong. Please Try Again"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/forms/${formId}`)
      .then((res) => res.json())
      .then((form) => {
        setFormData(form);
        const initialResponse = form.formFields.reduce((acc, field) => {
          acc[field.questionText] = ""; // Initialize formResponse with empty strings
          return acc;
        }, {});
        setFormResponse(initialResponse);
      })
      .catch((e) => {
        console.error(e);
        alert("Something Went Wrong.");
      })
      .finally(() => setLoading(false));
  }, [formId]);

  if (loading)
    return (
      <div>
        <ScrollToTop />
        <div className="flex h-[75vh] w-full flex-col items-center justify-center gap-4 text-lg">
          <Loader />
          <h4>Loading Form Details...</h4>
          <h3>Please Wait...</h3>
        </div>
      </div>
    );

  return (
    <div className="relative flex w-screen flex-col justify-center">
      <HeadTags
        title={`Register for ${formData.name || "Event"}`}
        description={formData.desc}
      />
      <h3 className="mb-4 mt-10 text-center text-2xl md:text-3xl">
        Register For Event
      </h3>
      {flag ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
          <h4 className="text-lg font-bold">Thank you for registering!</h4>
          <p className="text-md text-blue-500">
            <a href={link} target="_blank" rel="noopener noreferrer">
              Click here to join the WhatsApp group
            </a>
          </p>
        </div>
      ) : (
        <form
          className="mx-auto mb-48 h-full min-h-screen w-[90%] rounded-xl md:w-[60%]"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2 rounded-lg border border-t-[.5rem] border-blue-800 bg-white p-4 md:p-6">
            <p className="px-2 py-2 text-2xl text-black md:px-4 md:text-4xl">
              {formData.name}
            </p>
            <p className="text-md px-4 text-slate-500 md:py-2">{formData.desc}</p>
          </div>

          {formData.formFields.map((ques, i) => (
            <QuestionBox
              key={i}
              ques={ques}
              inputValue={formResponse[ques.questionText] || ""}
              onInputChange={handleInputChange}
            />
          ))}
          <div className="flex justify-center">
            <button
              type="submit"
              className="my-4 w-full cursor-pointer rounded-md bg-blue-500 p-4 px-6 text-white hover:bg-blue-600 active:bg-transparent active:text-blue-800"
              disabled={loading}
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegisterForm;
