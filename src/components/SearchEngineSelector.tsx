import { cn } from "@/lib/utils";

// 定义搜索引擎类型
export type SearchEngine = {
    name: string;
    url: string;
    icon?: React.ReactNode;
    id: string;
};

// 只保留三个主要搜索引擎
const ENGINES: SearchEngine[] = [
    { id: "baidu", name: "百度", url: "https://www.baidu.com/s?wd=" },
    { id: "bing", name: "必应", url: "https://www.bing.com/search?q=" },
    { id: "google", name: "谷歌", url: "https://www.google.com/search?q=" },
];

interface SearchEngineSelectorProps {
    currentEngine: SearchEngine;
    onSelect: (engine: SearchEngine) => void;
}

export const SearchEngineSelector = ({ currentEngine, onSelect }: SearchEngineSelectorProps) => {
    return (
        <div className="w-auto p-4 glass-card-strong rounded-xl border border-white/20 shadow-2xl backdrop-blur-xl bg-black/40">
            {/* Engines Grid */}
            <div className="flex gap-3">
                {ENGINES.map((engine) => (
                    <button
                        key={engine.id}
                        onClick={() => onSelect(engine)}
                        className={cn(
                            "flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 border min-w-[100px]",
                            currentEngine.id === engine.id
                                ? "bg-blue-600/80 text-white border-blue-500/50 shadow-lg shadow-blue-500/20"
                                : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
                        )}
                    >
                        {engine.name}
                    </button>
                ))}
            </div>
        </div>
    );
};
