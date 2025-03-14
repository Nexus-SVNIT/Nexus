import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = ({ placeholder, onChange, initialValue = "" }) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <FaSearch className="absolute left-3 text-gray-400 z-10" />
        <input
          type="text"
          value={initialValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 py-2 pl-10 pr-12 text-white outline-none focus:ring-2 focus:ring-blue-500"
        />
        {initialValue && (
          <button
            onClick={handleClear}
            className="transition-colors z-10 ml-5 bg-zinc-500/20 hover:bg-zinc-500/50 rounded-full p-3 flex items-center justify-center"
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
