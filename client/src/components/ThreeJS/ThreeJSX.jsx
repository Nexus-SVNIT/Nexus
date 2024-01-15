import React, { useEffect } from "react";
// import './SpaceParticlesMain.js'

const ThreeJSX = () => {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];

    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag("js", new Date());

    gtag("config", "G-8KKF9Z8GTB");

    // Your Three.js initialization code (main.js) can be added here
    // Make sure to import Three.js and include your main.js logic
    const script = document.createElement("script");
    script.src = "SpaceParticlesMain.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="l-page l-page--white" data-id="hyper_space">
      <canvas className="p-canvas-webgl" id="canvas-webgl"></canvas>
    </div>
  );
};

export default ThreeJSX;
