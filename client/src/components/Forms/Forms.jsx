import React, { useState, useEffect } from "react";
import Title from "../Title/Title";
import FormCard from "./FormCard";
import { useQuery } from "@tanstack/react-query";
import Error from "../Error/Error";
import CircularProgress from "@mui/joy/CircularProgress";
import Loader from "../Loader/Loader";
import HeadTags from "../HeadTags/HeadTags";

const Forms = () => {
  const {
    isPending: loading,
    error,
    data: forms,
  } = useQuery({
    queryKey: ["formData"],
    queryFn: () =>
      fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/forms/`).then((res) =>
        res.json(),
      ),
  });
  if (error) return <Error />;
  if (loading)
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <HeadTags title={"Loading Forms - Nexus NIT Surat"} />
        <Loader />
      </div>
    );
  if (!forms || forms.length === 0) {
    return <div className="text-center">No forms available</div>;
  }
  if (forms && !loading) {
    const currentDate = new Date();
    const updatedForms = forms.map((form) => {
      const [day, month, year] = form.deadline.split("-").map(Number);

      const deadlineDate = new Date(year, month - 1, day);
      if (deadlineDate >= currentDate) {
        form.status = "Active";
      } else {
        form.status = "InActive";
      }
      return form;
    });
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
