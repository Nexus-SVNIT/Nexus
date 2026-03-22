import React from "react";

const Tabs = React.memo(({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-wrap gap-2 border-b border-zinc-700/50 pb-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
            activeTab === tab
              ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
              : "border border-transparent text-gray-400 hover:bg-zinc-800 hover:text-gray-300"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
});

export default Tabs;
