import React from 'react';

const RatingLegend = ({ platform }) => {
  const getLegendItems = () => {
    switch (platform) {
      case 'codeforces':
        return [
          { color: 'rose', label: 'Legendary Grandmaster (≥2400)' },
          { color: 'amber', label: 'International Grandmaster (≥2100)' },
          { color: 'yellow', label: 'Grandmaster (≥1900)' },
          { color: 'violet', label: 'Master (≥1600)' },
          { color: 'cyan', label: 'Expert (≥1400)' },
          { color: 'emerald', label: 'Specialist (≥1200)' },
          { color: 'zinc', label: 'Newbie (<1200)' }
        ];
      case 'leetcode':
        return [
          { color: 'rose', label: 'Elite (≥2800)' },
          { color: 'amber', label: 'Expert (≥2400)' },
          { color: 'yellow', label: 'Advanced (≥2000)' },
          { color: 'violet', label: 'Intermediate (≥1600)' },
          { color: 'emerald', label: 'Beginner (<1600)' }
        ];
      case 'codechef':
        return [
          { color: 'rose', label: '7★ (≥2500)' },
          { color: 'amber', label: '6★ (≥2200)' },
          { color: 'yellow', label: '5★ (≥2000)' },
          { color: 'violet', label: '4★ (≥1800)' },
          { color: 'cyan', label: '3★ (≥1600)' },
          { color: 'emerald', label: '2★ (≥1400)' },
          { color: 'zinc', label: '1★ (<1400)' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="mb-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
      <h3 className="text-lg font-semibold mb-4 text-blue-400">Rating Legend</h3>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {getLegendItems().map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 p-1.5">
            <div className={`w-4 h-4 rounded-full border border-${color}-400 bg-${color}-500/20 shadow-sm flex-shrink-0`}></div>
            <span className="text-xs sm:text-sm text-gray-300 whitespace-nowrap">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingLegend;
