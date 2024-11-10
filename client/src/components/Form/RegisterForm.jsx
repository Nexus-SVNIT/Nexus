import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import HeadTags from "../HeadTags/HeadTags";
import Loader from "../Loader/Loader";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import QuestionBox from "./QuestionBox";
import axios from "axios";
import { Navigate } from "react-router-dom";

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
    receivePayment: false,
    amount: 0,
    qrCodeUrl: "",
  });
  const [formResponse, setFormResponse] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamName, setTeamName] = useState("");
<<<<<<< HEAD
  const [files, setFiles] = useState(null);
  const [gotoLogin, setGotoLogin] = useState(false);
=======
  const [file, setFile] = useState(null);  // Changed to 'file' for singular
  const [Payments, setPayments] = useState({
    paymentId: "",
    screenshotUrl: "",
  });
>>>>>>> 5c3ac612ea74151f5316a979aabfbcf429aea0eb

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

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPayments((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

<<<<<<< HEAD
    // Validate required fields
    const requiredFields = formData.formFields.filter(
      (field) => field.required,
    );
    const missingRequiredFields = requiredFields.some(
      (field) => !formResponse[field.questionText]?.trim(),
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
        return;
      }
      teamMembers.map((member) => member.toUpperCase());
    }

    if (formData.fileUploadEnabled && !files) {
      toast.error("Please upload the required file.");
=======
    // Ensure token is present
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to submit the form.");
>>>>>>> 5c3ac612ea74151f5316a979aabfbcf429aea0eb
      return;
    }

    setLoading(true);

    const submissionData = {
      ...formResponse,
      teamMembers: formData.enableTeams ? teamMembers : [],
      teamName: formData.enableTeams ? teamName : "",
      Payments,
    };
<<<<<<< HEAD

    const finalResponse = new FormData();

=======

    const finalResponse = new FormData();
>>>>>>> 5c3ac612ea74151f5316a979aabfbcf429aea0eb
    for (const key in submissionData) {
      finalResponse.append(key, JSON.stringify(submissionData[key]));
    }

<<<<<<< HEAD
    if (files) {
      finalResponse.append("file", files);
    }

    const token = localStorage.getItem("token");
    console.log(finalResponse, submissionData);
    await axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/forms/submit/${formId}`,
        finalResponse,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      )
=======
    if (file) {
      finalResponse.append("file", file);
    }

    await axios
      .post(`${process.env.REACT_APP_BACKEND_BASE_URL}/forms/submit/${formId}`, finalResponse, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
>>>>>>> 5c3ac612ea74151f5316a979aabfbcf429aea0eb
      .then((res) => {
        if (res.data.success === true) {
          setFlag(true);
          setLink(res.data.WaLink);
        } else {
          handleFormError(res.data);
        }
      })
      .catch((e) => {
        handleFormError(e.response.data);
      })
      .finally(() => setLoading(false));
  };

  const handleFormError = (res) => {
<<<<<<< HEAD
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
    } else if (res.message.startsWith("Team member with admission number")) {
      toast.error(res.message);
    } else {
      toast.error("Unexpected error! Try again later.");
    }
=======
    // Error handling logic, you can add specific messages here
    toast.error(res.message || "Form submission failed.");
>>>>>>> 5c3ac612ea74151f5316a979aabfbcf429aea0eb
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
        toast.error("Something went wrong. Please try again later.");
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

  if (gotoLogin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="relative flex w-screen flex-col justify-center">
      <HeadTags
        title={`Register for ${formData.name || "Event"}`}
        description={formData.desc}
      />
      <h3 className="mb-4 mt-10 text-center text-2xl md:text-3xl">Register For Event</h3>
      {flag ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-4">
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
<<<<<<< HEAD
            <p className="px-2 py-2 text-2xl text-black md:px-4 md:text-4xl">
              {formData.name}
            </p>
            <p className="text-md px-4 text-slate-500 md:py-2">
              {formData.desc}
            </p>
=======
            <p className="px-2 py-2 text-2xl text-black md:px-4 md:text-4xl">{formData.name}</p>
            <p className="text-md px-4 text-slate-500 md:py-2">{formData.desc}</p>
>>>>>>> 5c3ac612ea74151f5316a979aabfbcf429aea0eb
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
<<<<<<< HEAD
                ques={{
                  questionText: "Team Name",
                  required: true,
                  questionType: "text",
                }}
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
=======
                ques={{ questionText: "Team Name", required: true, questionType: "text" }}
                inputValue={teamName || ""}
                onInputChange={(e) => setTeamName(e.target.value)}
              />
>>>>>>> 5c3ac612ea74151f5316a979aabfbcf429aea0eb
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
<<<<<<< HEAD
                  onInputChange={(e) =>
                    handleTeamMemberChange(index, e.target.value)
                  }
=======
                  onInputChange={(e) => handleTeamMemberChange(index, e.target.value)}
>>>>>>> 5c3ac612ea74151f5316a979aabfbcf429aea0eb
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
<<<<<<< HEAD
                onChange={(e) => setFiles(e.target.files[0])}
                className="border-gray-300 my-2 w-full rounded-md border p-2 text-black"
=======
                onChange={(e) => setFile(e.target.files[0])}
                className="my-2 w-full text-black rounded-md border border-gray-300 p-2"
>>>>>>> 5c3ac612ea74151f5316a979aabfbcf429aea0eb
                required
              />
            </div>
          )}

          {formData.receivePayment && (
            <div className="payment-section mt-4">
              <h4 className="text-xl">Payment Details:</h4>
              <p className="text-md">Amount: ₹{formData.amount}</p>
              {formData.qrCodeUrl && (
                <div className="payment-qr-code mt-4 text-center">
                  <img src={formData.qrCodeUrl} alt="Payment QR Code" className="max-w-[200px]" />
                </div>
              )}
              <input
                type="text"
                name="paymentId"
                placeholder="Enter Payment ID"
                className="mt-2 w-full p-2 border border-gray-300 rounded-md"
                onChange={handlePaymentChange}
              />
              <input
                type="text"
                name="screenshotUrl"
                placeholder="Enter Screenshot URL"
                className="mt-2 w-full p-2 border border-gray-300 rounded-md"
                onChange={handlePaymentChange}
              />
            </div>
          )}

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg"
            disabled={loading}
          >
            Submit Form
          </button>
        </form>
      )}
    </div>
  );
};

export default RegisterForm;
