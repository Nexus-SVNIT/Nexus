import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import Error from "../Error/Error";
import HeadTags from "../HeadTags/HeadTags";
import Loader from "../Loader/Loader";
import Title from "../Title/Title";
import FormCard from "./FormCard";

const Forms = () => {
  const {
    isLoading,
    isError,
    data: forms,
  } = useQuery({
    queryKey: ["forms"],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/forms/`,
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

  if (forms && !isLoading) {
    const currentDate = new Date();

    forms.forEach((form) => {
      const [day, month, year] = form.deadline.split("-").map(Number);
      const deadlineDate = new Date(year, month - 1, day, 22, 30, 0);
      form.status = deadlineDate >= currentDate ? "Active" : "Inactive";
    });
  }

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

  return (
    <div className="relative mx-auto mb-20 max-w-7xl space-y-8 pb-12">
      <HeadTags title={"Forms - Nexus NIT Surat"} />
      <Title>Forms</Title>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-12 px-20 ">
        {forms.map((form) => (
          <FormCard key={form._id} form={form} />
        ))}
      </div>
    </div>
  );
};

export default Forms;
