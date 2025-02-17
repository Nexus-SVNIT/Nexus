import React, { useEffect, useState } from "react";
import {
  Button,
  FAQs,
  Terminal,
  Three,
  WhatPeopleThinkAboutUS,
} from "../index";
import Counter from "../Counter/Counter";

const Home = () => {


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "./SpaceParticlesMain.js";
    document.body.appendChild(script);
  }, []);

  return (
    <div className="relative mx-auto overflow-x-hidden transition-all delay-300">
      <div className="flex h-screen flex-col items-center">
        <Three />
        <div className="relative z-10 my-8 mt-8 flex w-fit max-w-7xl justify-between md:px-4">
          <div className="mt-10 flex w-fit flex-col items-center justify-center gap-8 md:mt-4">
            <h1 className="nexus_gradient max-auto flex items-center justify-center text-[6rem] md:text-[8rem] ">
              NEXUS
            </h1>
            <p className="w-[75%] text-center text-[1.25rem] sm:w-3/4 md:w-[28rem] md:text-[1.5rem] ">
              A community for the students of Computer Science and Engineering
              and Artificial Intelligence NIT Surat.
            </p>
            <p className="text-gray-400 w-[80%] text-center text-[1rem] sm:w-10/12 md:w-[24rem] ">
              We foster engagement with students from all years to create a
              connected and inclusive learning community.
            </p>
            <Button to={"#terminal"} isButton={false}>
              Explore More
            </Button>
            <div className="relative bottom-12 right-4 z-[1000]">
        <Counter />
      </div>
          </div>
        </div>
      </div>

      <div
        className="z-[1000] mx-auto mt-12 w-full sm:mt-52 md:mt-24"
        id="terminal"
      >
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
