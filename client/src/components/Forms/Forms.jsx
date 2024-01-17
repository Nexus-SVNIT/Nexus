import React, { useState, useEffect } from "react";
import Title from "../Title/Title";
import FormCard from "./FormCard";
import { useQuery } from "@tanstack/react-query";
import Error from "../Error/Error";
import CircularProgress from "@mui/joy/CircularProgress";

const Forms = () => {
<<<<<<< Updated upstream
  // const {
  //   isPending: loading,
  //   error,
  //   forms,
  // } = useQuery({
  //   queryKey: ["formsData"],
  //   queryFn: () =>
  //     fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/member`).then((res) =>
  //       res.json(),
  //     ),
  // });
  
  // console.log(forms);
  // if (error) return <Error />;
  // if (loading)
  //   return (
  //     <div className="flex h-[70vh] w-full items-center justify-center">
  //       <CircularProgress color="primary" />
  //     </div>
  //   );
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
=======
  const {
    isPending: loading,
    error,
    data:forms,
  } = useQuery({
    queryKey: ["formData"],
    queryFn: () =>
      fetch(`https://nexus-backend.up.railway.app/forms/`).then((res) =>
        res.json(),
      ),
  });
  if (error) return <Error />;
  if (loading)
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <CircularProgress color="primary" />
      </div>
    );
  if (!forms || forms.length === 0) {
    return <div className="text-center">No forms available</div>;
  }
  if (forms && !loading) {
    const currentDate = new Date();
    const updatedForms = forms.map((form) => {
      const [day, month, year] = form.deadline.split('-').map(Number);

      const deadlineDate = new Date(year, month - 1, day);
      if (deadlineDate >= currentDate) {
        form.status = 'Active';
      } else {
        form.status = 'InActive';
      }
      return form;
    });
  }
  console.log(forms);
  // const [forms, setForms] = useState([
  //   {
  //     _id: 2,
  //     title: "Nexus Team Information",
  //     type: "General Information",
  //     deadline: "2024-12-31",
  //     status: "Active",
  //     startsFrom: "2024-01-01",
  //     participants: 0,
  //   },
  //   {
  //     _id: 1,
  //     title: "Fiesta Team",
  //     type: "Sport Event",
  //     deadline: "2024-12-31",
  //     status: "InActive",
  //     startsFrom: "2024-01-01",
  //     participants: 0,
  //   },
  //   {
  //     _id: 3,
  //     title: "WebWonder Team",
  //     type: "Web Development",
  //     deadline: "2024-12-31",
  //     status: "InActive",
  //     startsFrom: "2024-01-01",
  //     participants: 0,
  //   },
  //   {
  //     _id: 4,
  //     title: "CodeSprint",
  //     type: "Coding Event",
  //     deadline: "Every Sunday",
  //     status: "Recurring",
  //     startsFrom: "2024-01-01",
  //     participants: 0,
  //   },
  // ]);
>>>>>>> Stashed changes
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
