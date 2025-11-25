import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "./ui/Button";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [search, setSearch] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(search.trim());
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(search.trim());
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-lg items-center rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10"
    >
      <input
        value={search}
        onChange={handleChange}
        type="text"
        placeholder="Search users..."
        className="flex-1 bg-transparent px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none"
      />
      <Button
        type="submit"
        size="sm"
        className="rounded-full p-2"
      >
        <Search size={18} />
      </Button>
    </form>
  );
};

export default SearchBar;
