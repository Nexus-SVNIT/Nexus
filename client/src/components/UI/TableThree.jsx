import { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import Error from "../Error/Error";
import Loader from "../Loader/Loader";

const TableThree = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const token = localStorage.getItem("core-token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/forms/get-responses/65b3b26107c28e11c75973d9`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Attach token to Authorization header
            },
          }
        );
        setData(response.data); // Update state with the response data
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        setError(error); // Set error if there is any issue with the request
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchData();
  }, [token]); // Runs when `token` changes

  if (error) return <Error />;
  if (loading)
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Loader />
      </div>
    );

  const responses = data?.responses || [{}];
  const keys = responses && Object.keys(responses[0]);

  return (
    <div className="border-stroke shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 rounded-sm border bg-white px-5 pb-2.5 pt-6 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Form Responses({responses.length ?? 0})
      </h4>
      <div className="max-h-[50vh] max-w-full overflow-scroll overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4 text-left">
              {keys.map((key) => (
                <th
                  key={key}
                  className="min-w-[200px] px-4 py-4 font-medium text-black xl:pl-11 dark:text-white"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responses.map((el, index) => (
              <tr key={index}>
                {keys.map((key) => (
                  <td
                    key={key}
                    className="dark:border-strokedark border-b border-[#eee] px-4 py-5 pl-9 xl:pl-11"
                  >
                    <p className="text-sm">{el[key]}</p>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableThree;
