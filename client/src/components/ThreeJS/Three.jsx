import React from "react";

const Three = () => {
  return (
    <div
      class="l-page l-page--white"
      data-id="hyper_space"
      style={{
        position: "absolute", // or 'fixed'
        top: 0,
        zIndex: 1, // Ensure this is lower than the main content
      }}
    >
      <canvas class="p-canvas-webgl " id="canvas-webgl"></canvas>
    </div>
  );
};

export default Three;
