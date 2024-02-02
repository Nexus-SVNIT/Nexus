import { useQuery } from "@tanstack/react-query";
import React from "react";
import Error from "../../components/Error/Error";
import Loader from "../../components/Loader/Loader";
import FormIntroAdmin from "./FormIntroAdmin";

const AllForms = () => {
  const {
    isPending: loading,
    error,
    data,
  } = useQuery({
    queryKey: ["responses"],
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
    <div className="flex flex-wrap items-center justify-center gap-8">
      {data?.map((form) => (
        <FormIntroAdmin key={form._id} form={form} />
      ))}
    </div>
  );
};

export default AllForms;
