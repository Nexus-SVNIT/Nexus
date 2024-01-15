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
    <div className=" mx-auto overflow-x-hidden bg-[#111] transition-all delay-300">
      <div className=" flex flex-col items-center justify-center h-screen">
        <Three />
        <div className="relative z-10 my-8 mt-8 flex w-fit max-w-7xl justify-between md:px-4">
          <div className="flex w-fit flex-col items-center justify-center gap-8">
            <h1 className="nexus_gradient flex items-center justify-center text-center text-[6rem] md:text-[8rem] ">
              NEXUS
            </h1>
            <p className="w-[75%] text-center text-[1.25rem] sm:w-3/4 md:w-[28rem] md:text-[1.5rem] ">
              A community for the students of Computer Science and Engineering
              NIT Surat.
            </p>
            <p className="w-[80%] text-center text-[1rem] text-gray-400 sm:w-10/12 md:w-[24rem] ">
              We foster engagement with students from all years to create a
              connected and inclusive learning community.
            </p>
            <Button to={"#terminal"} isButton={false}>
              Explore More
            </Button>
          </div>
        </div>
      </div>
      <label id="terminal" />
      <div className="mx-auto mt-24 w-full sm:mt-60 md:mt-24 z-100">
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
