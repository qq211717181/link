import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, PlayCircle, Music, Share2, GraduationCap, HardDrive, Coffee } from "lucide-react";

// 定义搜索引擎类型
export type SearchEngine = {
    name: string;
    url: string;
    icon?: React.ReactNode;
    id: string;
};

// 定义分类数据
const CATEGORIES = [
    { id: "search", name: "搜索引擎", icon: <Search className="w-4 h-4" /> },
    { id: "video", name: "视频", icon: <PlayCircle className="w-4 h-4" /> },
    { id: "music", name: "音乐", icon: <Music className="w-4 h-4" /> },
    { id: "social", name: "社交", icon: <Share2 className="w-4 h-4" /> },
    { id: "academic", name: "学术", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "resource", name: "资源", icon: <HardDrive className="w-4 h-4" /> },
    { id: "life", name: "生活", icon: <Coffee className="w-4 h-4" /> },
];

// 定义每个分类下的引擎
const ENGINES: Record<string, SearchEngine[]> = {
    search: [
        { id: "baidu", name: "百度", url: "https://www.baidu.com/s?wd=" },
        { id: "bing", name: "必应", url: "https://www.bing.com/search?q=" },
        { id: "google", name: "谷歌", url: "https://www.google.com/search?q=" },
        { id: "fsou", name: "F搜", url: "https://fsoufsou.com/search?q=" },
        { id: "sogou", name: "搜狗", url: "https://www.sogou.com/web?query=" },
        { id: "360", name: "360", url: "https://www.so.com/s?q=" },
        { id: "toutiao", name: "头条", url: "https://so.toutiao.com/search?dvpf=pc&keyword=" },
    ],
    video: [
        { id: "bilibili", name: "B站", url: "https://search.bilibili.com/all?keyword=" },
        { id: "youtube", name: "YouTube", url: "https://www.youtube.com/results?search_query=" },
        { id: "douyin", name: "抖音", url: "https://www.douyin.com/search/" },
    ],
    music: [
        { id: "netease", name: "网易云", url: "https://music.163.com/#/search/m/?s=" },
        { id: "qqmusic", name: "QQ音乐", url: "https://y.qq.com/n/ryqq/search?w=" },
    ],
    social: [
        { id: "weibo", name: "微博", url: "https://s.weibo.com/weibo?q=" },
        { id: "zhihu", name: "知乎", url: "https://www.zhihu.com/search?type=content&q=" },
        { id: "twitter", name: "Twitter", url: "https://twitter.com/search?q=" },
    ],
    academic: [
        { id: "cnki", name: "知网", url: "https://kns.cnki.net/kns8/defaultresult/index?kwd=" },
        { id: "scholar", name: "学术", url: "https://scholar.google.com/scholar?q=" },
    ],
    resource: [
        { id: "github", name: "GitHub", url: "https://github.com/search?q=" },
        { id: "csdn", name: "CSDN", url: "https://so.csdn.net/so/search?q=" },
    ],
    life: [
        { id: "taobao", name: "淘宝", url: "https://s.taobao.com/search?q=" },
        { id: "jd", name: "京东", url: "https://search.jd.com/Search?keyword=" },
        { id: "douban", name: "豆瓣", url: "https://www.douban.com/search?q=" },
    ],
};

interface SearchEngineSelectorProps {
    currentEngine: SearchEngine;
    onSelect: (engine: SearchEngine) => void;
}

export const SearchEngineSelector = ({ currentEngine, onSelect }: SearchEngineSelectorProps) => {
    const [activeTab, setActiveTab] = useState("search");

    return (
        <div className="w-[600px] p-4 glass-card-strong rounded-xl border border-white/20 shadow-2xl backdrop-blur-xl bg-black/40">
            {/* Tabs Navigation */}
            <div className="flex items-center gap-1 mb-4 border-b border-white/10 pb-2 overflow-x-auto scrollbar-hide">
                {CATEGORIES.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setActiveTab(category.id)}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap flex items-center gap-2",
                            activeTab === category.id
                                ? "text-white bg-white/10 shadow-sm"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {/* {category.icon} */}
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Engines Grid */}
            <div className="grid grid-cols-4 gap-3">
                {ENGINES[activeTab]?.map((engine) => (
                    <button
                        key={engine.id}
                        onClick={() => onSelect(engine)}
                        className={cn(
                            "flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 border",
                            currentEngine.id === engine.id
                                ? "bg-blue-600/80 text-white border-blue-500/50 shadow-lg shadow-blue-500/20"
                                : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
                        )}
                    >
                        {/* 这里可以添加图标逻辑，目前使用文字 */}
                        {engine.name}
                    </button>
                ))}
            </div>
        </div>
    );
};
