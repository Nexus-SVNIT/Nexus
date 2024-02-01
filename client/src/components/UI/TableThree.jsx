import { useQuery } from "@tanstack/react-query";
import Error from "../Error/Error";
import Loader from "../Loader/Loader";

const TableThree = () => {
  const {
    isPending: loading,
    error,
    data,
  } = useQuery({
    queryKey: ["responses"],
    queryFn: () =>
      fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/forms/get-responses/65b3b26107c28e11c75973d9`,
      ).then((res) => res.json()),
  });
  if (error) return <Error />;
  if (loading)
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Loader />
      </div>
    );
  console.log(data);

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
                <th className="min-w-[200px] px-4 py-4 font-medium text-black xl:pl-11 dark:text-white">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responses.map((el) => (
              <tr key={el}>
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
