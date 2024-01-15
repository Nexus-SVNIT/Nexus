import React from "react";

const Testimonial = ({ text, author }) => {
  return (
    <div className="bg-testimonials mx-4 flex h-[15rem] w-[28rem] flex-col items-center justify-center rounded-xl object-contain px-10 leading-8 text-white backdrop-blur-md md:mx-10 md:h-[20rem] md:w-[30rem]">
      <p className=" line-clamp-5 text-center text-sm font-thin md:text-base">
        {text}
      </p>
      <h2 className="mt-2 rounded-sm border-t-4 border-[#3586ff] text-sm md:text-base">
        {author}
      </h2>
    </div>
  );
};

export default Testimonial;
