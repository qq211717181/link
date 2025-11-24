import { SearchBar } from "@/components/SearchBar";
import { CategorySection } from "@/components/CategorySection";
import { UserTabs } from "@/components/UserTabs";
import { Sparkles, Film, Package, Wrench, Gamepad2, Music, GraduationCap } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const aiLinks = [
    { title: "ChatGPT免费", url: "https://chatgpt.com", icon: "🤖" },
    { title: "Claude", url: "https://claude.ai", icon: "🎯" },
    { title: "Midjourney", url: "https://midjourney.com", icon: "🎨" },
    { title: "文心一言", url: "https://yiyan.baidu.com", icon: "💬" },
    { title: "通义千问", url: "https://tongyi.aliyun.com", icon: "🌟" },
  ];

  const movieLinks = [
    { title: "追剧猫", url: "https://www.zhuijumao.com", icon: "🐱" },
    { title: "新视觉影院", url: "https://www.6080yy3.com", icon: "🎬" },
    { title: "皮皮影视", url: "https://www.pipitv.com", icon: "📺" },
    { title: "看片狂人", url: "https://www.kpkuang.com", icon: "🎭" },
    { title: "低端影视", url: "https://ddys.tv", icon: "🎪" },
    { title: "555电影", url: "https://www.555dy.vip", icon: "🎞️" },
    { title: "人人影视", url: "https://www.rrys.tv", icon: "👥" },
    { title: "HDmoli", url: "https://www.hdmoli.com", icon: "🎥" },
  ];

  const resourceLinks = [
    { title: "福利吧", url: "https://fuliba2023.net", icon: "🎁" },
    { title: "吾爱破解", url: "https://www.52pojie.cn", icon: "🔓" },
    { title: "阿虚同学的储物间", url: "https://axutongxue.com", icon: "📦" },
    { title: "咖喱君的资源库", url: "https://kaliju.com", icon: "📚" },
    { title: "telegram中文搜索", url: "https://www.sssoou.com", icon: "📱" },
  ];

  const toolLinks = [
    { title: "Kindle漫画", url: "https://volmoe.com", icon: "📖" },
    { title: "在线工具", url: "https://tool.lu", icon: "🛠️" },
    { title: "ACGE软件", url: "https://www.aacgge.com", icon: "💾" },
    { title: "天空动漫", url: "https://www.tkdm.net", icon: "🎌" },
    { title: "423Down", url: "https://www.423down.com", icon: "⬇️" },
    { title: "MacWk软件", url: "https://macwk.com", icon: "🍎" },
  ];

  const gameLinks = [
    { title: "Steam游戏", url: "https://store.steampowered.com", icon: "🎮" },
    { title: "游侠网", url: "https://www.ali213.net", icon: "⚔️" },
    { title: "3DM", url: "https://www.3dmgame.com", icon: "🎯" },
    { title: "小黑盒", url: "https://www.xiaoheihe.cn", icon: "📦" },
  ];

  const musicLinks = [
    { title: "QQ音乐", url: "https://y.qq.com", icon: "🎵" },
    { title: "网易云音乐", url: "https://music.163.com", icon: "🎶" },
    { title: "酷狗音乐", url: "https://www.kugou.com", icon: "🎸" },
  ];

  const studyLinks = [
    { title: "B站课程", url: "https://www.bilibili.com", icon: "📺" },
    { title: "慕课网", url: "https://www.imooc.com", icon: "💻" },
    { title: "CSDN", url: "https://www.csdn.net", icon: "👨‍💻" },
    { title: "GitHub", url: "https://github.com", icon: "🐙" },
    { title: "Stack Overflow", url: "https://stackoverflow.com", icon: "📚" },
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="pt-12 pb-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-3 text-shadow">iLinks</h1>
          <p className="text-white/80 text-lg text-shadow">海内存知己，天涯若比邻</p>
        </header>

        {/* Search Bar */}
        <div className="px-4 mb-12">
          <SearchBar />
        </div>

        {/* User Tabs */}
        <UserTabs />

        {/* Categories */}
        <div className="container mx-auto px-4 pb-20 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CategorySection 
              title="AI" 
              links={aiLinks} 
              icon={<Sparkles className="h-4 w-4 text-white/90" />}
            />
            
            <CategorySection 
              title="电影电视" 
              links={movieLinks}
              icon={<Film className="h-4 w-4 text-white/90" />}
            />
            
            <CategorySection 
              title="综合资源" 
              links={resourceLinks}
              icon={<Package className="h-4 w-4 text-white/90" />}
            />
            
            <CategorySection 
              title="工具" 
              links={toolLinks}
              icon={<Wrench className="h-4 w-4 text-white/90" />}
            />
            
            <CategorySection 
              title="游戏" 
              links={gameLinks}
              icon={<Gamepad2 className="h-4 w-4 text-white/90" />}
            />
            
            <CategorySection 
              title="娱乐" 
              links={musicLinks}
              icon={<Music className="h-4 w-4 text-white/90" />}
            />
            
            <CategorySection 
              title="学习" 
              links={studyLinks}
              icon={<GraduationCap className="h-4 w-4 text-white/90" />}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pb-8 text-white/60 text-sm">
          <p>近期服务器迁移，如遇访问受限请联系</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
