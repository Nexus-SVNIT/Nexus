import React from "react";

function PlateformButtons({ handlePlatformChange, activePlatform }) {
  const platforms = [
    { id: "codeforces", label: "Codeforces" },
    { id: "leetcode", label: "LeetCode" },
    { id: "codechef", label: "CodeChef" },
  ];

  return (
    <div className="mb-4 mt-2 flex w-full justify-center">
      <div className="inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-black/40 p-1.5 shadow-2xl backdrop-blur-xl">
        {platforms.map((platform) => {
          const isActive = activePlatform === platform.id;
          return (
            <button
              key={platform.id}
              onClick={() => handlePlatformChange(platform.id)}
              className={`
                relative px-6 py-2.5 text-sm md:text-base font-medium rounded-xl
                transition-all duration-300 ease-in-out
                ${
                  isActive
                    ? "text-white bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }
              `}
            >
              <span className="relative z-10">{platform.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PlateformButtons;
