import { useState, useEffect } from "react";
import axios from "axios";
import Error from "../../components/Error/Error";
import Loader from "../../components/Loader/Loader";
import * as XLSX from "xlsx";

const ResponseTable = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [selectedFields, setSelectedFields] = useState({
    admissionNumber: false,
    fullName: false,
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
        console.log(error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token, id]);

  const orderedMandatoryFields = ['admissionNumber', 'fullName', 'branch', 'mobileNumber'];
  for(let i=0; i<orderedMandatoryFields.length; i++){
    selectedFields[orderedMandatoryFields[i]] = true;
  }

  if (error) return <Error />;
  if (loading)
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Loader />
      </div>
    );

  const responses = data?.responses || [];
  const formSpecificKeys = Object.keys(responses[0] || {}).filter(
    (key) => key !== "user" && key !== "teamMembers"
  );

  const handleCheckboxChange = (field) => {
    setSelectedFields((prevFields) => ({
      ...prevFields,
      [field]: !prevFields[field],
    }));
  };

  const filteredResponses = responses.filter((response) => {
    const teamMembers = response.teamMembers || [];
    const user = response.user || {};

    const searchWithinFields = (item) => 
      Object.keys(selectedFields).some(
        (field) =>
          selectedFields[field] &&
          item[field]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      ) || formSpecificKeys.some(
        (key) =>
          response[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );

    return data.enableTeams
      ? teamMembers.some(searchWithinFields)
      : searchWithinFields(user);
  });

  const downloadExcel = () => {
    const exportData = filteredResponses.flatMap((response) => {
      const teamMembers = response.teamMembers || [];
      const user = response.user || {};

      const mapFields = (item) => {
        const row = {};
        orderedMandatoryFields.forEach((field) => {
          row[field] = item[field] || "N/A";
        });
        formSpecificKeys.forEach((key) => {
          row[key] = response[key] || "N/A";
        });
        Object.keys(selectedFields).forEach(
          (field) =>
            !orderedMandatoryFields.includes(field) &&
            selectedFields[field] &&
            (row[field] = item[field] || "N/A")
        );
        return row;
      };

      return data.enableTeams ? teamMembers.map(mapFields) : [mapFields(user)];
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");
    XLSX.writeFile(workbook, "form_responses.xlsx");
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Form Responses ({filteredResponses.length})
      </h4>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-md border p-2 text-black"
        />
        <button
          onClick={() => setSearchQuery("")}
          className="mb-4 rounded-md bg-red-500 px-4 py-2 text-white"
        >
          Clear
        </button>
      </div>
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

      <button
        onClick={downloadExcel}
        className="mb-4 rounded-md bg-blue-500 px-4 py-2 text-white"
      >
        Download as Excel
      </button>

      <div className="max-h-[70vh] max-w-full overflow-scroll">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {orderedMandatoryFields.map((field) => (
                <th key={field} className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  {field}
                </th>
              ))}
              {formSpecificKeys.map((key) => (
                <th key={key} className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  {key}
                </th>
              ))}
              {Object.keys(selectedFields).map(
                (field) =>
                  !orderedMandatoryFields.includes(field) &&
                  selectedFields[field] && (
                    <th key={field} className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                      {field}
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredResponses.map((response, index) => {
              const renderRow = (item) => (
                <tr key={`${index}-${item._id || item.admissionNumber}`}>
                  {orderedMandatoryFields.map((field) => (
                    <td key={field} className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                      <p className="text-sm">{item[field] || "N/A"}</p>
                    </td>
                  ))}
                  {formSpecificKeys.map((key) => (
                    <td key={key} className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                      <p className="text-sm">{response[key] || "N/A"}</p>
                    </td>
                  ))}
                  {Object.keys(selectedFields).map(
                    (field) =>
                      !orderedMandatoryFields.includes(field) &&
                      selectedFields[field] && (
                        <td key={field} className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                          <p className="text-sm">{item[field] || "N/A"}</p>
                        </td>
                      )
                  )}
                </tr>
              );

              return data.enableTeams
                ? response.teamMembers.map(renderRow)
                : renderRow(response.user || response);
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponseTable;
