import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

type SearchEngine = "baidu" | "google" | "bing";

const SEARCH_ENGINES = {
  baidu: { name: "百度", url: "https://www.baidu.com/s?wd=" },
  google: { name: "谷歌", url: "https://www.google.com/search?q=" },
  bing: { name: "必应", url: "https://www.bing.com/search?q=" },
};

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchEngine, setSearchEngine] = useState<SearchEngine>("baidu");

  useEffect(() => {
    const saved = localStorage.getItem("searchEngine") as SearchEngine;
    if (saved && SEARCH_ENGINES[saved]) {
      setSearchEngine(saved);
    }
  }, []);

  const handleEngineChange = (value: SearchEngine) => {
    setSearchEngine(value);
    localStorage.setItem("searchEngine", value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const url = SEARCH_ENGINES[searchEngine].url + encodeURIComponent(searchTerm);
      window.open(url, '_blank');
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
          <Input
            type="text"
            placeholder={`输入关键词，回车使用${SEARCH_ENGINES[searchEngine].name}搜索`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-14 pr-5 py-7 text-base glass-card-strong border-white/20 focus-visible:ring-white/30 placeholder:text-white/50 text-white rounded-full shadow-lg"
          />
        </div>
        <Select value={searchEngine} onValueChange={handleEngineChange}>
          <SelectTrigger className="w-[120px] glass-card-strong border-white/20 text-white py-7 rounded-full shadow-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="baidu">百度</SelectItem>
            <SelectItem value="google">谷歌</SelectItem>
            <SelectItem value="bing">必应</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </form>
  );
};
