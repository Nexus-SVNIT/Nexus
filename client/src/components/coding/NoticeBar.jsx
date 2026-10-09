import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

function NoticeBar() {
  return (
    <div className="mx-4 flex w-fit items-center justify-center gap-3.5 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-3.5 px-5 shadow-lg backdrop-blur-md md:mx-auto">
      <FaInfoCircle size={32} className="h-auto text-amber-400 flex-shrink-0" />
      <p className="w-[90%] text-xs text-zinc-200 md:w-full md:text-sm">
        If you registered but did not get your coding profile data here in the leaderboard, go to the{" "}
        <Link
          to="/profile"
          className="font-semibold text-blue-400 underline underline-offset-4 hover:text-blue-300"
        >
          Profile Page
        </Link>{" "}
        and turn on "Share Your Coding Profile".
        <br />
        It may take up to <span className="font-bold text-amber-300">24 hours</span> to reflect your data here.
      </p>
    </div>
  );
}

export default NoticeBar;
