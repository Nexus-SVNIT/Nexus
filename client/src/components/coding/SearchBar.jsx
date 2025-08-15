import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = ({ placeholder, onChange, initialValue = "" }) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  // Using useCallback to maintain function reference
  const handleClear = useCallback(() => {
    setInputValue('');
    setDebouncedValue('');
    onChange('');
  }, [onChange]);

  const handleChange = useCallback((value) => {
    setInputValue(value);
  }, []);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Only trigger onChange when debounced value changes
  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <FaSearch className="absolute left-3 text-gray-400 z-10" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 py-2 pl-10 pr-10 text-white outline-none focus:ring-2 focus:ring-blue-500"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="-ml-8 text-gray-400 hover:text-gray-300 z-10 cursor-pointer"
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
