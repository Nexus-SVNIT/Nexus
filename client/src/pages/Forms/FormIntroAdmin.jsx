import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function FormIntroAdmin(props) {
  const token = localStorage.getItem("core-token");
  const navigate = useNavigate();

  const [publishState, setPublishState] = useState(props.form.publish);
  const [isHidden, setIsHidden] = useState(props.form.isHidden); // State for isHidden
  const [deadline, setDeadline] = useState(props.form.deadline);

  const handleStatusChange = async () => {
    const toastId = toast.loading("Updating status...");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/forms/update-status/${props.form._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ publish: !publishState, isHidden }), // Include isHidden in the request body
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const result = await response.json();
      if (result.success) {
        setPublishState(!publishState);
        toast.success("Status updated successfully", { id: toastId });
      } else {
        console.error(result.message);
        toast.error(result.message, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating form status:", error);
      toast.error("Error updating form status", { id: toastId });
    }
  };

  const handleDeadlineChange = async () => {
    const toastId = toast.loading("Updating deadline...");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/forms/update-deadline/${props.form._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ deadline }), // Send the updated deadline
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update deadline");
      }

      const result = await response.json();
      if (result.success) {
        toast.success("Deadline updated successfully", { id: toastId });
      } else {
        console.error(result.message);
        toast.error(result.message, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating form deadline:", error);
      toast.error("Error updating form deadline", { id: toastId });
    }
  };

  const notifySubscribers = async () => {
    const toastId = toast.loading("Notifying subscribers...");
    try {
      const notifyResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/forms/notify-subscribers/${props.form._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!notifyResponse.ok) {
        console.error("Failed to notify subscribers");
        toast.error("Failed to notify subscribers", { id: toastId });
      } else {
        toast.success("Subscribers notified successfully", { id: toastId });
      }
    } catch (error) {
      console.error("Error notifying subscribers:", error);
      toast.error("Error notifying subscribers", { id: toastId });
    }
  };

  const handleIsHiddenChange = async () => {
    const toastId = toast.loading("Updating visibility...");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/forms/update-status/${props.form._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ publish: publishState, isHidden: !isHidden }), // Include isHidden in the request body
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update visibility");
      }

      const result = await response.json();
      if (result.success) {
        setIsHidden(!isHidden);
        toast.success("Visibility updated successfully", { id: toastId });
      } else {
        console.error(result.message);
        toast.error(result.message, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating visibility:", error);
      toast.error("Error updating visibility", { id: toastId });
    }
  };

  const copyFormLink = () => {
    const formLink = `${window.location.origin}/register/${props.form._id}`;
    navigator.clipboard
      .writeText(formLink)
      .then(() => {
        toast.success("Form link copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy form link: ", err);
        toast.error("Failed to copy form link");
      });
  };

  const handleEditForm = () => {
    navigate(`/core/admin/forms/edit/${props.form._id}`);
  };

  return (
    <div className="flex w-[20rem] flex-col justify-between rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:w-[22rem] md:w-[24rem]">
      <div className="flex text-lg">{props.form.name}</div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {props.form.responseCount}
          </h4>
          <span className="text-sm font-medium">Total Registration</span>
        </div>

        <span
          className="flex cursor-pointer items-center gap-1 text-sm font-medium text-meta-5"
          onClick={handleStatusChange}
        >
          Status:
          {publishState ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="40"
              height="40"
              viewBox="0 0 48 48"
            >
              <path
                fill="#c8e6c9"
                d="M36,42H12c-3.314,0-6-2.686-6-6V12c0-3.314,2.686-6,6-6h24c3.314,0,6,2.686,6,6v24C42,39.314,39.314,42,36,42z"
              ></path>
              <path
                fill="#4caf50"
                d="M34.585 14.586L21.014 28.172 15.413 22.584 12.587 25.416 21.019 33.828 37.415 17.414z"
              ></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="40"
              height="40"
              viewBox="0 0 48 48"
            >
              <path
                fill="#c8e6c9"
                d="M36,42H12c-3.3,0-6-2.7-6-6V12c0-3.3,2.7-6,6-6h24c3.3,0,6,2.7,6,6v24C42,39.3,39.3,42,36,42z"
              ></path>
            </svg>
          )}
        </span>
      </div>
      {/* Checkbox for isHidden */}
      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          id="is-hidden"
          checked={isHidden}
          onChange={handleIsHiddenChange} // Update state on checkbox change
          className="mr-2"
        />
        <label
          htmlFor="is-hidden"
          className="text-gray-700 text-sm font-medium"
        >
          Is Hidden
        </label>
      </div>
      <div className="mt-4">
        <label
          htmlFor="deadline"
          className="text-gray-700 block text-sm font-medium"
        >
          Deadline:
        </label>
        <input
          type="text"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)} // Update state as user types
          className="border-gray-300 mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <button
          onClick={handleDeadlineChange}
          className="mt-2 w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Update Deadline
        </button>
      </div>

      {/* Button for notifying subscribers */}
      <div className="mt-4">
        <button
          onClick={notifySubscribers}
          className="w-full rounded-md bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          Notify Subscribers
        </button>
      </div>

      {/* Button to copy form link */}
      <div className="mt-4">
        <button
          onClick={copyFormLink}
          className="bg-gray-500 hover:bg-gray-700 focus:ring-gray-500 w-full rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          Copy Form Link
        </button>
        {
          props.form.sheetId &&
          <button
          className="bg-gray-500 hover:bg-gray-700 focus:ring-gray-500 w-full rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          <a href={'https://docs.google.com/spreadsheets/d/'+props.form.sheetId} target="_blank">Open Google Sheet</a>
        </button>
        }
        
      </div>

      {/* Add Edit button before the last closing div */}
      <div className="mt-4">
        <button
          onClick={handleEditForm}
          className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Edit Form
        </button>
      </div>
    </div>
  );
}

export default FormIntroAdmin;
