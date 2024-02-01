import { useQuery } from "@tanstack/react-query";
import Error from "../Error/Error";
import Loader from "../Loader/Loader";
import Button from "../Button/Button";

const CardTwo = () => {
  const {
    isPending: loading,
    error,
    data,
  } = useQuery({
    queryKey: ["all-forms"],
    queryFn: () =>
      fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/forms/all`).then((res) =>
        res.json(),
      ),
  });
  if (error) return <Error />;
  if (loading)
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="border-stroke px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark flex flex-wrap gap-4 rounded-sm border bg-white py-6 ">
      {data &&
        data.length &&
        data?.map((form) => (
          <div
            key={form._id}
            className="flex w-[24rem] min-w-[20rem] flex-col gap-2 rounded-md bg-slate-200 p-6 text-black"
          >
            <div className="flex justify-between font-semibold">
              <div>
                <h2 className="line-clamp-2 w-4/5 text-lg font-bold md:text-xl">
                  {form.name}
                </h2>
                <p className="font-mono text-xs font-medium  text-gray-400 md:text-sm">
                  {form.type}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-6 font-semibold md:my-2 md:flex-row">
              <div className="text-sm font-bold md:text-base">
                Deadline : {form.deadline}
              </div>
              <div className="font-mono text-xs text-green-800 md:text-lg">
                {form.responseCount}+ Registered
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-6">
              <Button
                className="w-full rounded-md border border-blue-700 bg-blue-700 px-4 py-2 text-sm font-semibold text-white outline-none"
                isButton={true}
                variant="primary"
                to={`/register/${form._id}`}
                isDisabled={form.status === "InActive"}
              >
                {form.publish ? "UnPublish" : "Publish"}
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
};
const FormCard = ({ form }) => {
  return (
    <div className="flex w-[24rem] min-w-[20rem] flex-col gap-2 rounded-md bg-slate-200 p-6 text-black">
      <div className="flex justify-between font-semibold">
        <div>
          <h2 className="line-clamp-2 w-4/5 text-lg font-bold md:text-xl">
            {form.name}
          </h2>
          <p className="font-mono text-xs font-medium  text-gray-400 md:text-sm">
            {form.type}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center justify-between gap-2 font-semibold md:my-2 md:flex-row">
        <div className="text-sm font-bold md:text-base">
          Deadline : {form.deadline}
        </div>
        <div className="font-mono text-xs text-green-800 md:text-lg">
          {form.responseCount}+ Registered
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-6">
        <Button
          className="w-full rounded-md border border-blue-700 bg-blue-700 px-4 py-2 text-sm font-semibold text-white outline-none"
          isButton={true}
          variant="primary"
          to={`/register/${form._id}`}
          isDisabled={form.status === "InActive"}
        >
          {form.publish ? "UnPublish" : "Publish"}
        </Button>
      </div>
    </div>
  );
};
export default CardTwo;
