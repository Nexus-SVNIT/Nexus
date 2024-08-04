import { useQuery } from "@tanstack/react-query";
import React from "react";
import Error from "../Error/Error";
import HeadTags from "../HeadTags/HeadTags";
import Loader from "../Loader/Loader";
import Title from "../Title/Title";
import FormCard from "./FormCard";

const Forms = () => {
  const { isLoading, isError, data: forms } = useQuery({
    queryKey: ["forms"],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/forms/all`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch forms");
        }
        return response.json();
      } catch (error) {
        throw new Error("Failed to fetch forms");
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <HeadTags title={"Loading Forms - Nexus NIT Surat"} />
        <Loader />
      </div>
    );
  }

  if (isError || !forms || forms.length === 0) {
    return (
      <div className="flex h-screen w-screen items-center justify-center text-center">
        {isError ? <Error /> : "No forms available"}
      </div>
    );
  }

  // Assign status based on the publish field
  forms.forEach((form) => {
    form.status = form.publish ? "Active" : "Inactive";
  });

  return (
    <div className="relative mx-auto mb-20 max-w-7xl space-y-8 pb-12">
      <HeadTags title={"Forms - Nexus NIT Surat"} />
      <Title>Forms</Title>

      {/* Display active forms */}
      <h2 className="text-2xl font-semibold text-center">Active Forms</h2>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-12 px-20">
        {forms
          .filter((form) => form.status === "Active")
          .map((form) => (
            <FormCard key={form._id} form={form} />
          ))}
      </div>

      {/* Display inactive forms */}
      <h2 className="text-2xl font-semibold text-center">Inactive Forms</h2>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-12 px-20">
        {forms
          .filter((form) => form.status === "Inactive")
          .map((form) => (
            <FormCard key={form._id} form={form} />
          ))}
      </div>
    </div>
  );
};

export default Forms;
