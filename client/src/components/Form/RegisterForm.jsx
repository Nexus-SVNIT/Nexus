import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionBox from "./QuestionBox";
import Loader from "../Loader/Loader";
import { toast } from "react-hot-toast";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import HeadTags from "../HeadTags/HeadTags";

const RegisterForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    desc: "",
    deadline: "",
    formFields: [],
    responseCount: 0,
  });
  const [formResponse, setFormResponse] = useState({});

  const handleInputChange = (e) => {
    setFormResponse({ ...formResponse, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setLoading(true);
    try {
      fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/forms/submit/${params.formId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formResponse),
        },
      )
        .then((res) => {
          if (res.ok) {
            setFormResponse({});
            toast.success("Your Response Collected Successfully!");
            navigate("/forms");
          } else {
            toast.error("Please Try Again.");
          }
        })
        .catch((e) => toast.error("Something Went Wrong.Please Try Again"))
        .finally((e) => setLoading(false));
    } catch (error) {
      toast.error("Something Went Wrong.Please Try Again");
    }
  };

  useEffect(() => {
    const fetchFormData = () => {
      fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/forms/${params.formId}`)
        .then((res) => res.json())
        .then((form) => {
          setFormData(form);
          form.formFields.map((field) => {
            formResponse[field.name] = "";
            setFormResponse({ ...formResponse });
            return null;
          });
        })
        .catch((e) => {
          console.log(e);
          alert("Something Went Wrong.");
        })
        .finally(() => setLoading(false));
    };
    fetchFormData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (loading)
    return (
      <div>
        <ScrollToTop />
        <div className="flex h-[75vh] w-full flex-col items-center justify-center gap-4 text-lg">
          <Loader />
          <h4>
            {Object.keys(formResponse).length
              ? "Submitting Your Form Response . "
              : "Loading Form Details"}
          </h4>
          <h3>Please Wait ...</h3>
        </div>
      </div>
    );
  return (
    <div className="relative flex  w-screen flex-col justify-center">
      {!loading && (
        <HeadTags
          title={`Register for ${formData.name}`}
          metaDescription={formData.desc}
        />
      )}
      <h3 className=" mb-4 mt-10 text-center text-2xl md:text-3xl">
        Register For Event
      </h3>
      <div className="mx-auto mb-48 h-full min-h-screen w-[90%] rounded-xl md:w-[60%]">
        <div className="flex flex-col gap-2 rounded-lg  border border-t-[.5rem] border-blue-800 bg-white p-4 md:p-6">
          <p className="px-2 py-2 text-2xl text-black md:px-4 md:text-4xl">
            {formData.name}
          </p>
          <p className="text-md px-4 text-slate-500 md:py-2">{formData.desc}</p>
        </div>

        {formData.formFields.map((ques, i) => (
          <QuestionBox
            key={i}
            ques={ques}
            inputValue={formResponse[ques.name] ?? ""}
            onInputChange={handleInputChange}
          />
        ))}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="my-4 w-full cursor-pointer rounded-md bg-blue-500 p-4 px-6 text-white hover:bg-blue-600 active:bg-transparent active:text-blue-800"
            disabled={loading}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
