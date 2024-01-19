import React from "react";

const Three = () => {
  return (
    <div
      className="l-page l-page--white"
      data-id="hyper_space"
      style={{
        position: "absolute",
        top: 0,
        zIndex: 1,
      }}
    >
      <canvas className="p-canvas-webgl " id="canvas-webgl"></canvas>
    </div>
  );
};

export default Three;
