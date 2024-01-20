import React from "react";
import { IoPerson, IoLockClosed, IoNotifications } from "react-icons/io5";

const AlumniMenu = () => {
  return (
    <section className="mx-auto mb-48 mt-10 flex h-auto max-w-5xl items-center overflow-hidden rounded-md bg-blue-100/10">
      <div className="mb-10 flex w-full max-w-5xl flex-col items-center justify-center px-10 py-6">
        <h4 className="mb-6 text-xl font-bold">Alumni Information</h4>
        <div className="flex flex-col items-center justify-center p-2">
          <div className="flex w-full items-center justify-center">
            <img
              src={"https://xsgames.co/randomusers/avatar.php?g=male"}
              alt="profile"
              className="h-48 w-48 rounded-full object-cover object-center lg:h-52 lg:w-52"
            />
          </div>
          <div className="mx-auto mt-8  flex flex-wrap items-center justify-center gap-8">
            {[
              "Name",
              "E-Mail",
              "Current Role",
              "Mobile Number",
              "Passing Year",
              "LinkedIn",
              "Instagram",
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
