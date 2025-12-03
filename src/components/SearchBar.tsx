import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { SearchEngineSelector, SearchEngine } from "./SearchEngineSelector";

const DEFAULT_ENGINE: SearchEngine = { id: "bing", name: "必应", url: "https://www.bing.com/search?q=" };

interface SearchBarProps {
  styleSettings?: {
    maxWidth?: number;
    paddingY?: number;
    borderRadius?: number;
    blur?: number;
    opacity?: number;
  };
}

export const SearchBar = ({ styleSettings }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchEngine, setSearchEngine] = useState<SearchEngine>(DEFAULT_ENGINE);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("searchEngine");
    if (saved) {
      try {
        setSearchEngine(JSON.parse(saved));
      } catch (e) {
        setSearchEngine(DEFAULT_ENGINE);
      }
    }

    // 点击外部关闭选择器
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsSelectorOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEngineSelect = (engine: SearchEngine) => {
    setSearchEngine(engine);
    localStorage.setItem("searchEngine", JSON.stringify(engine));
    setIsSelectorOpen(false);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      const url = searchEngine.url + encodeURIComponent(searchTerm);
      window.open(url, '_blank');
    }
  };

  return (
    <div
      className="w-full mx-auto relative transition-all duration-300"
      ref={containerRef}
      style={{ maxWidth: styleSettings?.maxWidth ? `${styleSettings.maxWidth}px` : '48rem' }}
    >
      <form onSubmit={handleSearch}>
        <div className="relative flex items-center">
          {/* 左侧图标/选择器触发器 */}
          <Button
            type="button"
            size="icon"
            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-transparent hover:bg-white/10 border-none text-white shadow-none transition-colors flex items-center justify-center"
          >
            <span className="text-sm font-bold opacity-90">{searchEngine.name}</span>
          </Button>

          {/* 搜索输入框 */}
          <div className="relative flex-1 group">
            <Input
              type="text"
              placeholder={`输入可站内搜索，回车触发${searchEngine.name}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-14 text-base border-white/10 focus-visible:ring-0 focus-visible:border-white/20 placeholder:text-white/60 text-white shadow-lg transition-all duration-300"
              style={{
                paddingTop: styleSettings?.paddingY ? `${styleSettings.paddingY}px` : '1.75rem',
                paddingBottom: styleSettings?.paddingY ? `${styleSettings.paddingY}px` : '1.75rem',
                borderRadius: styleSettings?.borderRadius !== undefined ? `${styleSettings.borderRadius}px` : '9999px',
                background: `linear-gradient(90deg, rgba(255, 255, 255, ${(styleSettings?.opacity ?? 15) / 100}) 0%, rgba(255, 255, 255, ${(styleSettings?.opacity ?? 10) / 100}) 100%)`,
                backdropFilter: `blur(${styleSettings?.blur ?? 12}px)`,
                WebkitBackdropFilter: `blur(${styleSettings?.blur ?? 12}px)`,
              }}
            />
            {/* 悬停时的光晕效果 */}
            <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>

          {/* 右侧搜索按钮 */}
          <Button
            type="submit"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-transparent hover:bg-white/10 border-none text-white shadow-none transition-colors z-20 flex items-center justify-center"
          >
            <Search className="h-7 w-7 opacity-90" strokeWidth={2.5} />
          </Button>
        </div>
      </form>

      {/* 搜索引擎选择器弹出层 */}
      {isSelectorOpen && (
        <div className="absolute top-full left-0 mt-4 z-50 animate-in fade-in zoom-in-95 duration-200">
          <SearchEngineSelector
            currentEngine={searchEngine}
            onSelect={handleEngineSelect}
          />
        </div>
      )}
    </div>
  );
};
