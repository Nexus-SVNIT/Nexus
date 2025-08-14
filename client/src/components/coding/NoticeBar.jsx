import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

function NoticeBar() {
  return (
    <div className="mx-2 flex w-fit items-center justify-center gap-3 rounded-md bg-yellow-400/25 p-2 px-4 md:mx-auto ">
      <FaInfoCircle size={42} className="h-auto text-yellow-500" />
      <p className="w-[90%] text-xs text-white/80 md:w-full md:text-base">
        If you registered but did not get your coding profile data here in
        leaderboard, then go to
        <Link
          to="/profile"
          className="mx-1 font-bold text-blue-500  underline underline-offset-4"
        >
          Profile Page
        </Link>
        and turn on "Share Your Coding Profile" feature.
        <br />
        It may take upto <span className="font-bold italic">24 hours</span> to
        reflect your data here.
      </p>
    </div>
  );
}

export default NoticeBar;
