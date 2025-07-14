import React from "react";

const RatingLegend = ({ platform }) => {
  const getLegendItems = () => {
    switch (platform) {
      case "codeforces":
        return [
          // { color: 'rose', label: 'Grandmaster (≥2400)' },
          // { color: 'amber', label: 'International Master (≥2300)' },
          { color: "yellow", label: "Master (≥2100)" },
          { color: "violet", label: "Candidate Master (≥1900)" },
          { color: "blue", label: "Expert (≥1600)" },
          { color: "cyan", label: "Specialist (≥1400)" },
          { color: "emerald", label: "Pupil (≥1200)" },
          { color: "zinc", label: "Newbie (<1200)" },
        ];
      case "leetcode":
        return [
          // { color: "rose", label: "Elite (≥2800)" },
          // { color: "amber", label: "Expert (≥2400)" },
          { color: "yellow", label: "Advanced (≥2000)" },
          { color: "violet", label: "Intermediate (≥1600)" },
          { color: "emerald", label: "Beginner (<1600)" },
        ];
      case "codechef":
        return [
          { color: "rose", label: "7★ (≥2500)" },
          { color: "amber", label: "6★ (≥2200)" },
          { color: "yellow", label: "5★ (≥2000)" },
          { color: "violet", label: "4★ (≥1800)" },
          { color: "cyan", label: "3★ (≥1600)" },
          { color: "emerald", label: "2★ (≥1400)" },
          { color: "zinc", label: "1★ (<1400)" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="mb-4 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <h3 className="mb-4 text-lg font-semibold text-blue-400">
        Rating Legend
      </h3>
      <div className="xs:grid-cols-2 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {getLegendItems().map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 p-1.5">
            <div
              className={`h-4 w-4 rounded-full border border-${color}-400 bg-${color}-500/20 flex-shrink-0 shadow-sm`}
            ></div>
            <span className="text-gray-300 whitespace-nowrap text-xs sm:text-sm">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingLegend;
