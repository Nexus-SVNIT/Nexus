import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBar = ({ placeholder, onChange, value }) => {
  const handleClear = () => {
    onChange('');
  };

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <FaSearch className="absolute left-3 text-gray-400 z-10" />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 py-2 pl-10 pr-10 text-white outline-none focus:ring-2 focus:ring-blue-500"
        />
        {value && (
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
