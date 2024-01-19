import React from "react";
import { IoPerson, IoLockClosed, IoNotifications } from "react-icons/io5";

const AlumniMenu = () => {
  return (
    <section className="mx-auto mb-48 mt-10 flex h-auto max-w-7xl items-center overflow-hidden rounded-md bg-blue-100/10">
      <div className="mb-10 flex w-full max-w-7xl flex-col items-center justify-center px-10 py-6">
        <h4 className="mb-6 text-xl font-bold">Alumni Information</h4>
        <div className="flex flex-col items-center justify-center p-4 md:flex-row">
          <div className="md:w-1/3">
            <img
              src={"https://xsgames.co/randomusers/avatar.php?g=male"}
              alt="profile"
              className="h-52 w-52 rounded-full object-cover object-center lg:h-72 lg:w-72"
            />
          </div>
          <div className="mt-10 flex  flex-wrap gap-8 md:mt-0 md:w-2/3 md:gap-0">
            {[
              "Name",
              "E-Mail",
              "Admission Number",
              "Current Role",
              "Mobile Number",
              "Year",
              "LinkedIn",
              "Instagram",
              "Facebook",
              "Twitter",
            ].map((field) => (
              <div
                key={field}
                className="m-4 flex w-full flex-col gap-2 md:w-fit"
              >
                <label htmlFor={field} className="uppercase">
                  {field}
                </label>
                <p className="w-4/5 text-[.5rem] text-gray-400">
                  This Information Will Not Shared to Other.
                </p>
                <input
                  type="text"
                  id={field}
                  name={field}
                  className="w-full border-b border-blue-600 bg-transparent outline-none md:w-[20rem]"
                />
              </div>
            ))}
          </div>
        </div>
        <button className="mt-10 bg-blue-600 px-8 py-4 hover:bg-blue-700">
          Submit Your Details
        </button>
      </div>
    </section>
  );
};

export default AlumniMenu;
