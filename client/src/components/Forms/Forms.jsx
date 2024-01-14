import React, { useState } from "react";
import Title from "../Title/Title";
import FormCard from "./FormCard";

const Forms = () => {
  const [forms, setForms] = useState([
    {
      _id: 2,
      title: "Nexus Team Information",
      type: "General Information",
      deadline: "2024-12-31",
      status: "Active",
      startsFrom: "2024-01-01",
      participants: 0,
    },
    {
      _id: 1,
      title: "Fiesta Team",
      type: "Sport Event",
      deadline: "2024-12-31",
      status: "InActive",
      startsFrom: "2024-01-01",
      participants: 0,
    },
    {
      _id: 3,
      title: "WebWonder Team",
      type: "Web Development",
      deadline: "2024-12-31",
      status: "InActive",
      startsFrom: "2024-01-01",
      participants: 0,
    },
    {
      _id: 4,
      title: "CodeSprint",
      type: "Coding Event",
      deadline: "Every Sunday",
      status: "Recurring",
      startsFrom: "2024-01-01",
      participants: 0,
    },
  ]);
  return (
    <div className="relative mx-auto mb-20 max-w-7xl space-y-8 pb-12">
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
