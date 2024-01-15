import React, { useEffect } from "react";
import {
  Button,
  FAQs,
  Terminal,
  WhatPeopleThinkAboutUS,
  Three,
} from "../index";

const Home = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "./SpaceParticlesMain.js";
    document.body.appendChild(script);
  }, []);
  return (
    <div className="z-10 mx-auto overflow-x-hidden bg-[#111] transition-all delay-300">
      <div className="">
        <Three />
        <div className="relative z-10 w-fit my-8 mt-8 flex max-w-7xl justify-between md:px-4">
          <div className="mt-4 flex  w-fit flex-1 flex-col gap-12 text-white md:items-start md:justify-start md:gap-10 md:px-5">
            <h1 className="nexus_gradient flex items-center justify-center text-[6rem] md:justify-start ">
              NEXUS
            </h1>
            <p className="w-[90%] text-center text-[1.25rem] sm:w-3/4 md:w-[24rem] md:text-start">
              A community for the students of Computer Science and Engineering
              NIT Surat.
            </p>
            <p className="w-[90%] text-center text-[1.25rem] text-gray-400 sm:w-10/12 md:w-[28rem] md:text-start">
              We foster engagement with students from all years to create a
              connected and inclusive learning community.
            </p>
            <Button href={"#terminal"}>Explore More</Button>
          </div>
          {/* <div className="relative z-0 hidden pt-6 md:flex lg:flex-1">
            <div className="bg-screen-gradient my-12 ">
              <img
                className="absolute left-[20rem] top-2 h-40 w-80 brightness-75 drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] "
                src="/assets/learning.png"
                alt=""
              />
              <img
                className="absolute left-[10rem] top-[12rem] h-40 w-80 brightness-75 drop-shadow-[0_35px_35px_rgba(0,0,0,0.45)]"
                src="/assets/coding.png"
                alt=""
              />
              <img
                className="absolute -bottom-8 left-[20rem] h-40 w-80 brightness-75 drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]"
                src="/assets/play.png"
                alt=""
              />
            </div>
          </div> */}
        </div>
      </div>
      <label id="terminal" />
      <div className="mx-auto my-48 w-full">
        <Terminal />
      </div>
      <div className="faq-section relative my-48 w-full ">
        <FAQs />
      </div>
      <div className="relative my-48 w-full ">
        <WhatPeopleThinkAboutUS />
      </div>
    </div>
  );
};

export default Home;
