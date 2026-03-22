import React from "react";
import { Link } from "react-router-dom";
import { WhatsappIcon } from "react-share";
import { Button } from "../index";

const FormCard = ({ form }) => {
  const registrationLink = window.location;

  const message = `Hey there!\n\n Exciting news! Registration for ${form.name} is now open. 
                  Be part of this incredible event by registering at: ${registrationLink}
                  Don't miss out on the opportunity - secure your spot today!`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://wa.me/?text=${encodedMessage}`;

  // Assuming you have a group link stored in form.groupLink
  const groupLink = form.groupLink || ''; // Fallback to an empty string if groupLink is not present

  return (
    <div className="group flex w-full md:w-[45%] min-w-[20rem] flex-col gap-4 rounded-xl border border-zinc-800/60 bg-zinc-900/60 p-6 md:p-8 text-zinc-300 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-900/20">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h2 className="line-clamp-2 text-xl font-bold tracking-wide text-zinc-100 md:text-2xl transition-colors duration-300 group-hover:text-white">
            {form.name}
          </h2>
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-orange-400 mt-2">
            {form.type}
          </p>
        </div>

        <div className="ml-2 flex-shrink-0">
          <Link to={whatsappLink} rel="nofollow noopener" target="_blank" className="opacity-80 transition-transform duration-300 hover:scale-110 hover:opacity-100">
            <WhatsappIcon size={32} round={true} />
          </Link>
        </div>
      </div>
      
      <div className="my-2 border-t border-zinc-800/80 pt-4 flex flex-col justify-between gap-3 text-sm font-medium md:flex-row md:items-center">
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="text-zinc-500">Deadline:</span> {form.deadline}
        </div>
        <div className="font-mono text-xs md:text-sm">
          <span className="text-zinc-500">Status: </span>
          <span
            className={`${
              form.status === "Active" ? "text-orange-400 font-bold" : "text-rose-400 font-bold"
            }`}
          >
            {form.status}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between font-semibold my-2 bg-black/40 rounded-lg p-3 border border-zinc-800/40">
        <div className={`w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${form.status === "Active" ? "bg-orange-500/10 text-orange-400 border border-orange-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700"}`}>
          {form.status === "Active" ? "Started" : "Completed"}
        </div>
        <div className="font-mono text-xs text-orange-200 md:text-sm bg-orange-950/30 px-3 py-1 rounded-full border border-orange-500/20">
          {form.responseCount} Registered
        </div>
      </div>
      
      {form.status === "Active" && (
        <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:gap-6">
          <Button
            className="w-full relative overflow-hidden rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-3 text-sm font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-500/30 outline-none"
            isButton={true}
            variant="primary"
            to={`/register/${form._id}`}  
            isDisabled={form.status === "Inactive"}
          >
            Register Now
          </Button>
        </div>
      )}
      
      {groupLink && (
        <div className="mt-4 text-center">
          <a
            href={groupLink}
            target="_blank"
            rel="nofollow noopener"
            className="text-xs font-medium text-orange-400 transition-colors hover:text-orange-300 hover:underline hover:underline-offset-4"
          >
            Join our WhatsApp Group
          </a>
        </div>
      )}
    </div>
  );
};

export default FormCard;
