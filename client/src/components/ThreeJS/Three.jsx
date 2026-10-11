import React from "react";

const Three = () => {
  return (
    <div
      className="l-page l-page--white"
      data-id="hyper_space"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        maxWidth: "100vw",
        height: "100%",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      <canvas
        className="p-canvas-webgl"
        id="canvas-webgl"
        style={{
          display: "block",
          maxWidth: "100vw",
          maxHeight: "100vh",
        }}
      />
    </div>
  );
};

export default Three;
