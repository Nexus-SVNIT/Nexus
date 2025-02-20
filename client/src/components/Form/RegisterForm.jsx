import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import HeadTags from "../HeadTags/HeadTags";
import Loader from "../Loader/Loader";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import QuestionBox from "./QuestionBox";
import axios from "axios";
import { Navigate } from "react-router-dom";
import parse from "html-react-parser";
import increamentCounter from "../../libs/increamentCounter";
import { FaWhatsapp } from "react-icons/fa";
import DOMPurify from 'dompurify';

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
    enableTeams: false,
    teamSize: 0,
    fileUploadEnabled: false,
    driveFolderId: "",
    posterImageDriveId: "",
    extraLinkName: "",
    extraLink: "",
  });
  const [formResponse, setFormResponse] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [files, setFiles] = useState(null);
  const [gotoLogin, setGotoLogin] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormResponse((prevResponse) => {
      const updatedResponse = { ...prevResponse, [name]: value };
      sessionStorage.setItem("formResponse", JSON.stringify(updatedResponse));
      return updatedResponse;
    });
  };

  const handleTeamMemberChange = (index, value) => {
    setTeamMembers((prevMembers) => {
      const newMembers = [...prevMembers];
      newMembers[index] = value.trim().toUpperCase();
      sessionStorage.setItem("teamMembers", JSON.stringify(newMembers));
      return newMembers;
    });
  };

  const handleTeamNameChange = (e) => {
    const value = e.target.value;
    setTeamName(value);
    sessionStorage.setItem("teamName", value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setFiles(file);
    
    // Update form response without the file
    setFormResponse((prev) => {
      const newResponse = { ...prev };
      delete newResponse.file; // Remove file from form response
      return newResponse;
    });

    // Store preview in sessionStorage if needed
    const reader = new FileReader();
    reader.onload = () => {
      sessionStorage.setItem("filePreview", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim form response fields
    const trimmedFormResponse = {};
    for (const key in formResponse) {
      if (formResponse[key]?.trim) {
        trimmedFormResponse[key] = formResponse[key].trim();
      } else {
        trimmedFormResponse[key] = formResponse[key]; // For non-string fields (like arrays or numbers)
      }
    }

    // Trim team members
    const trimmedTeamMembers = teamMembers.map((member) =>
      member.trim().toUpperCase(),
    );

    // Validate required fields
    const requiredFields = formData.formFields.filter(
      (field) => field.required,
    );
    const missingRequiredFields = requiredFields.some(
      (field) => !trimmedFormResponse[field.questionText],
    );

    if (missingRequiredFields) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    // Validate team members if team registration is enabled
    if (formData.enableTeams) {
      const missingTeamMembers = trimmedTeamMembers.some((member) => !member);
      if (missingTeamMembers) {
        toast.error("Please fill in all team member admission numbers.");
        return;
      }

      let flag = false;
      trimmedTeamMembers.forEach((member, index) => {
        if (trimmedTeamMembers.indexOf(member) !== index) {
          toast.error("Duplicate team members are not allowed.");
          flag = true;
        }
      });
      if (flag) {
        return;
      }
    }

    if (formData.fileUploadEnabled && !files) {
      toast.error("Please upload the required file.");
      return;
    }

    setLoading(true);

    // Add team members to formResponse if teams are enabled
    const submissionData = {
      ...trimmedFormResponse,
      teamMembers: formData.enableTeams ? trimmedTeamMembers : [],
      teamName: formData.enableTeams ? teamName : "",
    };

    const finalResponse = new FormData();

    // Add non-file fields
    Object.keys(submissionData).forEach(key => {
      if (key !== 'file') { // Skip the file field
        finalResponse.append(key, JSON.stringify(submissionData[key]));
      }
    });

    // Add file if exists
    if (files) {
      finalResponse.append("file", files); // Add the actual File object
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/forms/submit/${formId}`,
        finalResponse,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setFlag(true);
        setLink(response.data.WaLink);
        toast.success("Form submitted successfully!");

        // Clear storage
        sessionStorage.removeItem("formResponse");
        sessionStorage.removeItem("teamMembers");
        sessionStorage.removeItem("teamName");
        sessionStorage.removeItem("filePreview");
      } else {
        handleFormError(response.data);
      }
    } catch (error) {
      handleFormError(error.response?.data || { message: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  const handleFormError = (res) => {
    if (res.message === "Token is not valid") {
      toast.error("First login to register! Redirecting...");
      setTimeout(() => {
        setGotoLogin(true);
      }, 2000);
    } else if (res.message === "Already Registered.") {
      toast.error("Already Registered!");
      setFormResponse({});
    } else if (res.message === "Team Name already exists.") {
      toast.error("Team Name already exists.");
    } else if (res.message.startsWith("The deadline has")) {
      toast.error(res.message);
    } else if (res.message.startsWith("Team member with admission number")) {
      toast.error(res.message);
    } else if (res.message.startsWith("You are not allowed")) {
      toast.error(res.message);
    } else {
      toast.error("Unexpected error! Try again later.");
    }
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/forms/${formId}`)
      .then((res) => res.json())
      .then((form) => {
        if (!form) {
          throw new Error('Form not found');
        }
        setFormData(form);
        
        // Initialize form with empty values
        const initialResponse = form.formFields?.reduce((acc, field) => {
          acc[field.questionText] = "";
          return acc;
        }, {}) || {};

        // Load saved responses
        const savedFormResponse = JSON.parse(sessionStorage.getItem("formResponse"));
        setFormResponse(savedFormResponse || initialResponse);

        // Load team data if enabled
        if (form.enableTeams) {
          const savedTeamMembers = JSON.parse(sessionStorage.getItem("teamMembers"));
          setTeamMembers(savedTeamMembers || Array(form.teamSize || 0).fill(""));
          setTeamName(sessionStorage.getItem("teamName") || "");
        }

        // Load file preview if exists
        const savedFilePreview = sessionStorage.getItem("filePreview");
        if (savedFilePreview) {
          setFiles(null); // Clear actual file object
          // Optionally show preview if needed
        }
      })
      .catch((e) => {
        console.error(e);
        toast.error("Error loading form. Please try again later.");
      })
      .finally(() => setLoading(false));
    
    increamentCounter();
  }, [formId]);

  const sanitizeAndRenderHTML = (content) => {
    const sanitizedContent = DOMPurify.sanitize(content);
    return (
      <div 
        className="prose max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base prose-a:text-blue-600 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-ul:list-disc prose-ol:list-decimal"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    );
  };

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

  if (gotoLogin) {
    return <Navigate to="/login" />;
  }

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
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-4">
          <h4 className="text-lg font-bold mb-4">Thank you for registering!</h4>
          <div className="bg-zinc-800 rounded-lg shadow-lg p-6 flex flex-col items-center gap-4 border border-zinc-900">
            <FaWhatsapp className="text-4xl text-green-500" />
            <p className="text-center">Join our WhatsApp group to stay updated!</p>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <FaWhatsapp />
              Join WhatsApp Group
            </a>
          </div>
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
            <div className="text-md px-4 text-slate-700 md:py-2">
              {sanitizeAndRenderHTML(formData.desc)}
            </div>
            {formData.posterImageDriveId && (
              <p className="text-md px-4 text-slate-500 md:py-2 ">
                <div className="flex flex-col items-center justify-center gap-5 p-5">
                  <img
                    src={`https://lh3.googleusercontent.com/d/${formData.posterImageDriveId}`}
                    alt="Event Poster"
                    className="rounded-md object-cover object-center md:w-1/2 "
                  />
                </div>
              </p>
            )}
            {formData.extraLink && formData.extraLinkName && (
              <p className="text-md px-4 text-slate-500 md:py-2">
                <a
                  href={formData.extraLink}
                  target="_blank"
                  className="font-bold italic text-blue-700 hover:underline"
                >
                  {formData.extraLinkName}
                </a>
              </p>
            )}
            <p className="text-md px-4 text-slate-700 md:py-2">
              <strong>Deadline:</strong> {formData.deadline}
            </p>
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
                ques={{
                  questionText: "Team Name",
                  required: true,
                  questionType: "text",
                }}
                inputValue={teamName || ""}
                onInputChange={handleTeamNameChange}
              />
              {[...Array(formData.teamSize)].map((_, index) => (
                <QuestionBox
                  key={100 + index}
                  ques={{
                    questionText: `Admission Number of Member ${index + 1}`,
                    required: true,
                    questionType: "text",
                    isUser: true,
                  }}
                  inputValue={teamMembers[index] || ""}
                  onInputChange={(e) =>
                    handleTeamMemberChange(index, e.target.value)
                  }
                />
              ))}
            </div>
          )}

          {formData.fileUploadEnabled && (
            <div className="file-upload-section">
              <h4 className="mt-4 text-xl">Upload Required File:</h4>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border-gray-300 my-2 w-full rounded-md border p-2 text-black"
                required
              />
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