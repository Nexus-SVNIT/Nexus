import React from "react";
import { Button } from "../index";
import { FaShareSquare } from "react-icons/fa";
const FormCard = ({ form }) => {
  return (
    <div className="flex w-2/5 min-w-[20rem] flex-col gap-2 rounded-md bg-white/90 p-6 text-black">
      <div className="flex justify-between font-semibold">
        <div>
          <h2 className="text-xl font-bold md:text-2xl">{form.title}</h2>
          <p className="font-mono text-xs font-medium  text-gray-400 md:text-sm">
            {form.type}
          </p>
        </div>

        <div>
          <button
            className="rounded-md border-none  px-4 py-2 text-xs text-blue-700 outline-none md:text-sm"
            isButton={true}
            title="Share This Form"
          >
            <FaShareSquare size={20} />
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-2 font-semibold md:my-2 md:flex-row">
        <div className="text-sm font-bold md:text-base">
          Deadline : {form.deadline}
        </div>
        <div className="font-mono text-xs text-gray-800 md:text-base ">
          Status:{" "}
          <span
            className={`${
              form.status === "Active" ? "text-green-800" : "text-amber-800"
            }`}
          >
            {form.status}
          </span>
        </div>
      </div>
      <div className="flex items-center  justify-between font-semibold md:my-2 md:flex-row md:gap-6">
        <div className="w-fit rounded-full bg-gray-400 px-2 py-2 text-xs font-bold text-white md:px-4 md:text-base">
          Starts {form.startsFrom}
        </div>
        <div className="font-mono text-xs text-green-800 md:text-lg">
          {form.participants}+ Participating
        </div>
      </div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-6">
        <Button
          className="w-full rounded-md border border-blue-700  bg-transparent px-4 py-2 text-sm font-semibold text-blue-700"
          isButton={true}
          variant="secondary"
        >
          More Details
        </Button>
        <Button
          className="w-full rounded-md border border-blue-700 bg-blue-700 px-4 py-2 text-sm font-semibold text-white outline-none"
          isButton={true}
          variant="primary"
          to={`/register/${form._id}`}
          isDisabled={form.status === "InActive"}
        >
          Register Now
        </Button>
      </div>
    </div>
  );
};

export default FormCard;
