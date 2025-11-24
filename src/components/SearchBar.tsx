import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, '_blank');
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
        <Input
          type="text"
          placeholder="输入词站内搜索，回车键或百度"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-14 pr-5 py-7 text-base glass-card-strong border-white/20 focus-visible:ring-white/30 placeholder:text-white/50 text-white rounded-full shadow-lg"
        />
      </div>
    </form>
  );
};
