import React from "react";

const Testimonial = ({ text, author }) => {
  return (
    <div className="group mx-4 flex h-[16rem] w-[28rem] flex-col items-center justify-center rounded-xl border border-zinc-700/30 bg-zinc-800/40 px-10 leading-8 text-white backdrop-blur-md transition-all duration-300 hover:border-blue-500/30 hover:bg-zinc-800/60 md:mx-10 md:h-[20rem] md:w-[30rem]">
      <svg className="mb-4 h-8 w-8 text-blue-500/30" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
      <p className="line-clamp-5 text-center text-sm font-light leading-relaxed text-gray-300 md:text-base">
        {text}
      </p>
      <h2 className="mt-4 rounded-sm border-t-2 border-blue-500/50 pt-2 text-sm font-medium text-blue-400 md:text-base">
        {author}
      </h2>
    </div>
  );
};

export default Testimonial;
