import React from "react";

const Tabs = React.memo(({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-wrap gap-2 border-b pb-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            activeTab === tab
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
});

export default Tabs;
