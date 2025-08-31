import { useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";

interface SearchBarProps {
  onSearch: (query: string) => void;  // parent decides what happens
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch}) => {
  const [search, setSearch] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Prevent default submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(search.trim());
  };

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(search.trim());
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Trigger onSearch when debounced query changes
  useEffect(() => {
   
      onSearch(debouncedQuery);
    // 
  }, [debouncedQuery]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full max-w-lg mx-auto border border-gray-300 rounded-full px-3 py-2 bg-white shadow-sm"
    >
      <input
        value={search}
        onChange={handleChange}
        type="text"
        placeholder="Search..."
        className="flex-1 outline-none bg-transparent text-gray-700 px-2"
      />
      <button
        type="submit"
        className="flex items-center justify-center p-2 bg-blue-900 hover:bg-blue-800 rounded-full text-white transition-colors"
        aria-label="Search"
      >
        <BiSearchAlt2 className="w-5 h-5" />
      </button>
    </form>
  );
};

export default SearchBar;
