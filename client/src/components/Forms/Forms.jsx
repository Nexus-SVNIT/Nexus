import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import Error from "../Error/Error";
import HeadTags from "../HeadTags/HeadTags";
import Loader from "../Loader/Loader";
import Title from "../Title/Title";
import FormCard from "./FormCard";
import increamentCounter from "../../libs/increamentCounter";
import MaintenancePage from "../Error/MaintenancePage";
import { Helmet } from "react-helmet";

const Forms = () => {
  useEffect(() => {
    increamentCounter();
  });
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

  if (isLoading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <HeadTags title={"Loading Forms - Nexus NIT Surat"} />
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <MaintenancePage />;
  }

  if (!forms || forms.length === 0) {
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

  // Filter out forms that are not active or inactive
  const { activeForms, inactiveForms } = forms.reduce(
    (acc, form) => {
      if (form.status === "Active") {
        acc.activeForms.push(form);
      } else {
        acc.inactiveForms.push(form);
      }
      return acc;
    },
    { activeForms: [], inactiveForms: [] }
  );

  activeForms.reverse();
  inactiveForms.reverse();
  
  return (
    <div className="relative mx-auto mb-20 max-w-7xl space-y-8 pb-12">
      <HeadTags
        title={"Forms - Nexus NIT Surat"}
        description={
          "Forms for various events and activities conducted by Nexus NIT Surat."
        }
        keywords={
          "Nexus NIT Surat, Forms, Events, Activities, Nexus Events, Nexus Activities"
        }
      />
      <Title>Forms</Title>

      {/* Display active forms */}
      <h2 className="text-center text-2xl font-semibold">Active Forms</h2>
      {
          activeForms.length === 0 ? (
            <div className="text-center text-gray-500 text-lg">
              No active forms available at the moment
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-12 px-20">
              {activeForms.map((form) => (
                <FormCard key={form._id} form={form} />
              ))}
            </div>
          )
      }

      {/* Display inactive forms */}
      <h2 className="text-center text-2xl font-semibold">Inactive Forms</h2>
      {inactiveForms.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No inactive forms available at the moment
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-12 px-20">
          {inactiveForms.map((form) => (
            <FormCard key={form._id} form={form} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Forms;
