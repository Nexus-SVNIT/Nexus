import React from "react";

const Dropdown = ({ label, options, value, onChange, disabled }) => {
  return (
    <div className="flex flex-col">
      <label className="text-gray-400 mb-1.5 text-sm font-medium">{label}</label>
      <select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-lg border border-zinc-700/50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 ${
          disabled ? "bg-zinc-800/30 text-gray-600 cursor-not-allowed" : "bg-zinc-800/50 text-gray-200 cursor-pointer"
        }`}
      >
        {options.map((opt) => (
          <option key={opt} className="bg-zinc-900">{opt}</option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
