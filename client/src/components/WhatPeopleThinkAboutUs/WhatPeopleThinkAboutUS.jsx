import React from "react";
import Title from "../Title/Title";
import Testimonial from "./Testimonial";

const WhatPeopleThinkAboutUS = () => {
  return (
    <div className="mx-auto my-10 mb-20 flex h-full max-w-7xl flex-col items-center justify-center  ">
      <Title>What People Think About Us</Title>
      <div className="mt-10 flex w-full flex-wrap justify-evenly gap-10">
        <Testimonial
          text={
            "Nexus has successfully cultivated a spirit of collaboration and excellence within our CSE & AI community. The events are not just about coding; they're about building lasting connections and preparing us for the dynamic world of technology"
          }
          author={"Martin Prajapati , Batch 2025 "}
        />
        <Testimonial
          text={
            "Nexus has been a game-changer for me at SVNIT. The coding competitions not only sharpened my technical skills but also connected me with a supportive community. It's more than a cell; it's a family."
          }
          author={" Raj , Batch 2026 "}
        />
      </div>
    </div>
  );
};

export default WhatPeopleThinkAboutUS;
