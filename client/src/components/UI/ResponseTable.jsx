import { useState, useEffect } from "react";
import axios from "axios";
import Error from "../Error/Error";
import Loader from "../Loader/Loader";
import * as XLSX from "xlsx"; // Import XLSX library

const ResponseTable = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [selectedFields, setSelectedFields] = useState({
    fullName: true,
    branch: false,
    mobileNumber: false,
    instituteEmail: false,
    personalEmail: false,
    linkedInProfile: false,
    githubProfile: false,
    leetcodeProfile: false,
    codeforcesProfile: false,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("core-token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/forms/get-responses/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token, id]);

  if (error) return <Error />;
  if (loading)
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Loader />
      </div>
    );

  const responses = data?.responses || [];
  const formSpecificKeys = Object.keys(responses[0] || {}).filter(
    (key) => key !== "user"
  );

  // Mandatory and ordered fields
  const orderedMandatoryFields = [
    "admissionNumber",
    "fullName",
    "branch",
    "mobileNumber",
  ];
  for (const field of orderedMandatoryFields) {
    selectedFields[field] = true;
  }

  const handleCheckboxChange = (field) => {
    setSelectedFields((prevFields) => ({
      ...prevFields,
      [field]: !prevFields[field],
    }));
  };

  // Function to filter responses based on the search query
  const filteredResponses = responses.filter((response) => {
    const user = response.user || {};
    return (
      Object.keys(selectedFields).some((field) =>
        selectedFields[field] &&
        user[field]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      formSpecificKeys.some((key) =>
        response[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  // Function to download the table data as an Excel file
  const downloadExcel = () => {
    const exportData = filteredResponses.map((response) => {
      const user = response.user || {};
      const row = {};
      // Include mandatory fields
      orderedMandatoryFields.forEach((field) => {
        row[field] = user[field] || "N/A";
      });
      // Include form-specific keys
      formSpecificKeys.forEach((key) => {
        row[key] = response[key] || "N/A";
      });
      // Include selected additional fields
      Object.keys(selectedFields).forEach(
        (field) => !orderedMandatoryFields.includes(field) && selectedFields[field] && (row[field] = user[field] || "N/A")
      );
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");
    XLSX.writeFile(workbook, "form_responses.xlsx");
  };

  return (
    <div className="border-stroke shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 rounded-sm border bg-white px-5 pb-2.5 pt-6 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Form Responses ({filteredResponses.length})
      </h4>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded-md p-2 text-black"
        /><button 
        onClick={()=>{setSearchQuery("")}} 
        className="mb-4 bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Clear
      </button>
      </div>

      {/* Checkbox filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        {Object.keys(selectedFields).map((field) => (
          <label key={field} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedFields[field]}
              onChange={() => handleCheckboxChange(field)}
              className="mr-2"
            />
            {field}
          </label>
        ))}
      </div>

      {/* Download button */}
      <button 
        onClick={downloadExcel} 
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Download as Excel
      </button>

      <div className="max-h-[70vh] max-w-full overflow-scroll">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4 text-left">
              {/* Mandatory fields in specified order */}
              {orderedMandatoryFields.map((field) => (
                <th
                  key={field}
                  className="min-w-[200px] px-4 py-4 font-medium text-black xl:pl-11 dark:text-white"
                >
                  {field}
                </th>
              ))}
              {/* Form-specific fields */}
              {formSpecificKeys.map((key) => (
                <th
                  key={key}
                  className="min-w-[200px] px-4 py-4 font-medium text-black xl:pl-11 dark:text-white"
                >
                  {key}
                </th>
              ))}
              {/* Additional user fields based on checkbox selections */}
              {Object.keys(selectedFields).map(
                (field) =>
                  !orderedMandatoryFields.includes(field) &&
                  selectedFields[field] && (
                    <th
                      key={field}
                      className="min-w-[200px] px-4 py-4 font-medium text-black xl:pl-11 dark:text-white"
                    >
                      {field}
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredResponses.map((response, index) => (
              <tr key={index}>
                {/* Mandatory fields */}
                {orderedMandatoryFields.map((field) => (
                  <td
                    key={field}
                    className="dark:border-strokedark border-b border-[#eee] px-4 py-5 pl-9 xl:pl-11"
                  >
                    <p className="text-sm">
                      {response.user ? response.user[field] : "N/A"}
                    </p>
                  </td>
                ))}
                {/* Form-specific data */}
                {formSpecificKeys.map((key) => (
                  <td
                    key={key}
                    className="dark:border-strokedark border-b border-[#eee] px-4 py-5 pl-9 xl:pl-11"
                  >
                    <p className="text-sm">{response[key]}</p>
                  </td>
                ))}
                {/* Additional selected user fields */}
                {Object.keys(selectedFields).map(
                  (field) =>
                    !orderedMandatoryFields.includes(field) &&
                    selectedFields[field] && (
                      <td
                        key={field}
                        className="dark:border-strokedark border-b border-[#eee] px-4 py-5 pl-9 xl:pl-11"
                      >
                        <p className="text-sm">
                          {response.user ? response.user[field] : "N/A"}
                        </p>
                      </td>
                    )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ResponseTable;
