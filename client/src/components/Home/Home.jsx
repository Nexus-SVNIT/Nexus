import React, { useEffect, useState, Suspense, lazy } from "react";
import Button from "../Button/Button";
import Counter from "../Counter/Counter";
import HeadTags from "../HeadTags/HeadTags";
import Contributors from "../Contributors/Contributors";

// Lazy load heavy components
const Three = lazy(() => import("../ThreeJS/Three"));
const Terminal = lazy(() => import("../Terminal/Terminal"));
const FAQs = lazy(() => import("../FAQs/FAQs"));
const WhatPeopleThinkAboutUS = lazy(() => import("../WhatPeopleThinkAboutUs/WhatPeopleThinkAboutUS"));

const Home = () => {

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "./SpaceParticlesMain.js";
    document.body.appendChild(script);
  }, []);

  return (
    <div className="relative mx-auto overflow-x-hidden transition-all delay-300">
      <HeadTags
        title={"Home | Nexus - NIT Surat"}
        description={
          "A community for the students of Computer Science and Engineering and Artificial Intelligence NIT Surat."
        }
      />

      {/* ─── Hero Section ─── */}
      <div className="flex h-screen flex-col items-center">
        <Suspense fallback={<div className="h-full w-full bg-black/50" />}>
          <Three />
        </Suspense>
        <div className="relative z-10 my-8 mt-8 flex w-fit max-w-7xl justify-between md:px-4">
          <div className="mt-10 flex w-fit flex-col items-center justify-center gap-6 md:mt-4">
            <h1 
              data-text="NEXUS" 
              className="cyberpunk-glitch max-auto flex items-center justify-center text-[6rem] md:text-[8rem] font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(0,255,249,0.3)]"
            >
              NEXUS
            </h1>
            <p className="w-[75%] font-mono text-center text-lg leading-relaxed text-blue-100 sm:w-3/4 md:w-[28rem] md:text-xl">
              A community for the students of Computer Science and Engineering
              and Artificial Intelligence NIT Surat.
            </p>
            <p className="w-[80%] font-mono text-center text-sm leading-relaxed text-cyan-400/80 sm:w-10/12 md:w-[24rem] md:text-base">
              We foster engagement with students from all years to create a
              connected and inclusive learning community.
            </p>
            <Button to={"#terminal"} isButton={false}>
              Explore More
            </Button>
          </div>
        </div>
        <div className="relative z-[1000] mt-4">
          <Counter />
        </div>
      </div>

      {/* ─── Subtle Section Divider ─── */}
      <div className="mx-auto my-4 h-px w-3/4 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      {/* ─── Terminal Section ─── */}
      <div
        className="z-[1000] mx-auto mt-4 w-full sm:mt-12 md:mt-8 min-h-[50vh]"
        id="terminal"
      >
        <Suspense fallback={
          <div className="mx-auto flex h-[50vh] w-[90%] md:w-[70vw] animate-pulse flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-700/50 bg-zinc-900/50 shadow-2xl">
            <div className="flex h-10 w-full items-center gap-2 border-b border-zinc-700/50 px-6">
              <div className="h-3 w-3 rounded-full bg-zinc-700"></div>
              <div className="h-3 w-3 rounded-full bg-zinc-700"></div>
              <div className="h-3 w-3 rounded-full bg-zinc-700"></div>
            </div>
            <div className="flex-1 flex w-full items-center justify-center">
              <span className="text-gray-500 font-mono text-sm">Loading Terminal Environment...</span>
            </div>
          </div>
        }>
          <Terminal />
        </Suspense>
      </div>

      {/* ─── Section Divider ─── */}
      <div className="mx-auto my-16 h-px w-3/4 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      {/* ─── FAQ Section ─── */}
      <div className="faq-section relative my-32 w-full min-h-[50vh]">
        <Suspense fallback={<div className="mx-auto h-[60vh] w-3/4 animate-pulse rounded-2xl bg-zinc-900/50" />}>
          <FAQs />
        </Suspense>
      </div>

      {/* ─── Section Divider ─── */}
      <div className="mx-auto my-16 h-px w-3/4 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      {/* ─── Testimonials Section ─── */}
      <div className="relative my-32 w-full min-h-[50vh]">
        <Suspense fallback={<div className="mx-auto h-[40vh] w-[90%] animate-pulse rounded-2xl bg-zinc-900/50" />}>
          <WhatPeopleThinkAboutUS />
        </Suspense>
      </div>

      {/* ─── Contributors Section ─── */}
      <div className="p-6">
        <Contributors />
      </div>
      
    </div>
  );
};

export default Home;
