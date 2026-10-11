import React from "react";

// Check WebGL support once at module level
const supportsWebGL = (() => {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
})();

const Three = () => {
  if (!supportsWebGL) return null;

  return (
    <div
      className="l-page l-page--white"
      data-id="hyper_space"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        maxWidth: "100vw",
        maxHeight: "100vh",
        overflow: "hidden",
        zIndex: 1,
        contain: "strict",
      }}
    >
      <canvas
        className="p-canvas-webgl"
        id="canvas-webgl"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          maxWidth: "100vw",
          maxHeight: "100vh",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default Three;
