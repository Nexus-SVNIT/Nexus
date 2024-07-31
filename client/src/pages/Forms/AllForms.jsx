import { useQuery } from "@tanstack/react-query";
import React from "react";
import Error from "../../components/Error/Error";
import Loader from "../../components/Loader/Loader";
import FormIntroAdmin from "./FormIntroAdmin";

const AllForms = () => {
  const {
    isLoading: loading,  // Correctly use isLoading instead of isPending
    error,
    data = [],  // Default data to an empty array if undefined
  } = useQuery({
    queryKey: ["forms"],  // Update queryKey to match our API endpoint
    queryFn: async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/forms/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch forms");
        }
        return response.json();  // Directly return the JSON data
      } catch (error) {
        console.error(error);
        throw error;  // Rethrow error to be caught by react-query
      }
    },
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
      {data.map((form) => (
        <FormIntroAdmin key={form._id} form={form} />
      ))}
    </div>
  );
};

export default AllForms;
