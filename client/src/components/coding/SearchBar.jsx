import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ placeholder, onChange, initialValue = "" }) => (
  <div className="relative mb-6 flex items-center justify-center">
    <div className="w-fit flex items-center justify-center bg-white rounded-full">
      <FontAwesomeIcon
        icon={faSearch}
        className="pointer-events-none left-4 text-black m-3 focus:ring focus:ring-blue-400"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={initialValue}
        onChange={(e) => onChange(e.target.value)}
        className="w-80 rounded-full py-2 pl-2 pr-4 text-sm text-black outline-none transition-shadow "
      />
    </div>
  </div>
);
export default SearchBar;
