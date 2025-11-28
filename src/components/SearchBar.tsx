import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 border-none text-white"
            >
              <Search className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="glass-card-strong border-white/20">
            <DropdownMenuItem
              onClick={() => handleEngineChange("baidu")}
              className={`text-white cursor-pointer ${searchEngine === "baidu" ? "bg-white/20" : ""}`}
            >
              百度
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleEngineChange("google")}
              className={`text-white cursor-pointer ${searchEngine === "google" ? "bg-white/20" : ""}`}
            >
              谷歌
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleEngineChange("bing")}
              className={`text-white cursor-pointer ${searchEngine === "bing" ? "bg-white/20" : ""}`}
            >
              必应
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          type="text"
          placeholder={`输入可站内搜索，回车触发${SEARCH_ENGINES[searchEngine].name}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-14 pr-4 py-5 text-sm glass-card-strong border-white/15 focus-visible:ring-white/30 placeholder:text-white/50 text-white rounded-full"
        />
      </div>
    </form>
  );
};
