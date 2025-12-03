import React from "react";

const Dropdown = ({ label, options, value, onChange, disabled }) => {
  return (
    <div className="flex flex-col">
      <label className="text-gray-600 mb-1 text-sm font-medium">{label}</label>
      <select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`border rounded-lg px-3 py-2 ${
          disabled ? "bg-gray-200" : "bg-white"
        }`}
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
