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
      <div className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden pb-16 pt-24 md:pb-24 md:pt-32">
        {/* Background Animation Canvas */}
        <Suspense fallback={<div className="absolute inset-0 z-0 bg-black/50" />}>
          <div className="absolute inset-0 z-0 h-full w-full opacity-80 mix-blend-screen">
            <Three />
          </div>
        </Suspense>
        
        {/* Responsive Content Container */}
        <div className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center text-center px-6 sm:px-8">
          
          <h1 
            className="mb-4 bg-[linear-gradient(to_right,#3b82f6,#22d3ee,#4ade80,#facc15,#f97316)] bg-clip-text text-transparent drop-shadow-sm text-[5.5rem] leading-[1.1] sm:mb-6 sm:text-[7rem] md:text-[8.5rem] lg:text-[10rem] font-serif tracking-normal"
          >
            NEXUS
          </h1>
          
          <p className="mb-6 mx-auto max-w-[22rem] font-sans text-base leading-relaxed text-zinc-200 sm:mb-8 sm:max-w-2xl sm:text-xl lg:text-2xl sm:leading-loose">
            A community for the students of Computer Science and Engineering
            and Artificial Intelligence NIT Surat.
          </p>
          
          <p className="mb-8 mx-auto max-w-[20rem] font-sans text-sm leading-relaxed text-zinc-400 sm:mb-10 sm:max-w-xl sm:text-base lg:text-lg">
            We foster engagement with students from all years to create a
            connected and inclusive learning community.
          </p>
          
          <div className="mt-4 flex w-full items-center justify-center sm:w-auto">
            <Button to={"#terminal"} isButton={false} className="w-full sm:w-auto px-10 py-3.5 text-lg font-semibold tracking-wide">
              Explore More
            </Button>
          </div>
          
        </div>
        
        {/* Visitor Counter component correctly layered */}
        <div className="relative z-20 mt-12 flex w-full justify-center px-4 sm:mt-16 md:mt-20">
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
