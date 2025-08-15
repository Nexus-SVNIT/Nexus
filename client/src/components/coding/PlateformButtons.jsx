import React from "react";

function PlateformButtons({ handlePlatformChange, activePlatform }) {
  const getPlatformColor = (platform) => {
    return activePlatform === platform
      ? "bg-blue-600 hover:bg-blue-500"
      : "bg-white/10 hover:bg-white/20";
  };
  return (
    <div className="mb-8 flex flex-wrap justify-center gap-4">
      <button
        onClick={() => handlePlatformChange("codeforces")}
        className={`rounded-lg px-3 py-2 font-semibold transition-colors md:px-4 md:py-2 ${getPlatformColor(
          "codeforces",
        )} hover:bg-blue-500`}
      >
        Codeforces
      </button>
      <button
        onClick={() => handlePlatformChange("leetcode")}
        className={`rounded-lg px-3 py-2 font-semibold transition-colors md:px-4 md:py-2 ${getPlatformColor(
          "leetcode",
        )} hover:bg-blue-500`}
      >
        LeetCode
      </button>
      <button
        onClick={() => handlePlatformChange("codechef")}
        className={`rounded-lg px-3 py-2 font-semibold transition-colors md:px-4 md:py-2 ${getPlatformColor(
          "codechef",
        )} hover:bg-blue-500`}
      >
        CodeChef
      </button>
    </div>
  );
}

export default PlateformButtons;
