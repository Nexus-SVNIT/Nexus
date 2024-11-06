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
    token: localStorage.getItem("token"),
  });
  const [formResponse, setFormResponse] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamName, setTeamName] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormResponse((prevResponse) => ({
      ...prevResponse,
      [name]: value,
    }));
  };

  const handleTeamMemberChange = (index, value) => {
    setTeamMembers((prevMembers) => {
      const newMembers = [...prevMembers];
      newMembers[index] = value.toUpperCase();
      return newMembers;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = formData.formFields.filter((field) => field.required);
    const missingRequiredFields = requiredFields.some(
      (field) => !formResponse[field.questionText]?.trim()
    );

    if (missingRequiredFields) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    // Validate team members if team registration is enabled
    if (formData.enableTeams) {
      const missingTeamMembers = teamMembers.some((member) => !member.trim());
      if (missingTeamMembers) {
        toast.error("Please fill in all team member admission numbers.");
        return;
      }
      let flag = false;
      teamMembers.forEach((member, index) => {
        if (teamMembers.indexOf(member) !== index) {
          toast.error("Duplicate team members are not allowed.");
          flag = true;
        }
      });
      if (flag) {
        console.log("hihih")
        return;
      }
      teamMembers.map((member) => member.toUpperCase());
    }

    setLoading(true);

    // Add team members to formResponse if teams are enabled
    const submissionData = {
      ...formResponse,
      teamMembers: formData.enableTeams ? teamMembers : [],
      teamName: formData.enableTeams ? teamName : "",
    };

    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/forms/submit/${formId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(submissionData),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setFormResponse({});
          setTeamMembers([]);
          toast.success("Your Response Collected Successfully!");
          setFlag(true);
          setLink(res.WaLink);
        } else {
          handleFormError(res);
        }
      })
      .catch((e) => toast.error("Something Went Wrong. Please Try Again"))
      .finally(() => setLoading(false));
  };

  const handleFormError = (res) => {
    if (res.message === "Token is not valid") {
      toast.error("First login to register! Redirecting...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } else if (res.message === "Already Registered.") {
      toast.error("Already Registered!");
      setFormResponse({});
    } else if (res.message === "Team Name already exists.") {
      toast.error("Team Name already exists.");
    } else if (res.message.startsWith("Team member with admission number")) {
      toast.error(res.message);
    }else {
      toast.error("Unexpected error! Try again later.");
    }
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/forms/${formId}`)
      .then((res) => res.json())
      .then((form) => {
        setFormData(form);
        const initialResponse = form.formFields.reduce((acc, field) => {
          acc[field.questionText] = ""; // Initialize with empty strings
          return acc;
        }, {});
        setFormResponse(initialResponse);
        setTeamMembers(Array(form.teamSize || 0).fill(""));
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

          {formData.enableTeams && (
            <div className="team-members-section">
              <h4 className="mt-4 text-xl">Team & Team Members Details:</h4>
              <QuestionBox
              key={-1}
              ques={{ questionText: "Team Name", required: true, questionType: "text" }}
              inputValue={teamName || ""}
              onInputChange={(e) => setTeamName(e.target.value)}
            />
              {/* <input
                  key={-1}
                  type="text"
                  value={teamName || ""}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder={`Team Name`}
                  className="my-2 w-full text-black rounded-md border border-gray-300 p-2"
                  required
                /> */}
              {[...Array(formData.teamSize)].map((_, index) => (
                <QuestionBox
                key={100+index}
                ques={{ questionText: `Admission Number of Member ${index + 1}`, required: true, questionType: "text", isUser : true }}
                inputValue={teamMembers[index] || ""}
                onInputChange={(e) => handleTeamMemberChange(index, e.target.value)}
              />
              ))}
            </div>
          )}

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
