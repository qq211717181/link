import { SearchBar } from "@/components/SearchBar";
import { CategorySection } from "@/components/CategorySection";
import { UserTabs } from "@/components/UserTabs";
import { Sparkles, Film, Package, Wrench, Gamepad2, Music, GraduationCap, Download, BookOpen, Image, Cloud, Heart, Tv } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const aiLinks = [
    { title: "ChatGPT免费", url: "https://chatgpt.com", icon: "🤖" },
    { title: "Claude", url: "https://claude.ai", icon: "🎯" },
    { title: "Midjourney", url: "https://midjourney.com", icon: "🎨" },
    { title: "文心一言", url: "https://yiyan.baidu.com", icon: "💬" },
    { title: "通义千问", url: "https://tongyi.aliyun.com", icon: "🌟" },
    { title: "Poe", url: "https://poe.com", icon: "💡" },
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
    { title: "独播库", url: "https://www.duboku.tv", icon: "📽️" },
    { title: "电影先生", url: "https://www.dianying.fm", icon: "🎦" },
  ];

  const resourceLinks = [
    { title: "福利吧", url: "https://fuliba2023.net", icon: "🎁" },
    { title: "吾爱破解", url: "https://www.52pojie.cn", icon: "🔓" },
    { title: "阿虚同学的储物间", url: "https://axutongxue.com", icon: "📦" },
    { title: "咖喱君的资源库", url: "https://kaliju.com", icon: "📚" },
    { title: "telegram中文搜索", url: "https://www.sssoou.com", icon: "📱" },
    { title: "不死鸟", url: "https://iao.su", icon: "🔥" },
    { title: "合集网", url: "https://www.heji.ltd", icon: "📑" },
  ];

  const toolLinks = [
    { title: "在线PS", url: "https://www.photopea.com", icon: "🎨" },
    { title: "兔2工具", url: "https://www.tool2.cn", icon: "🐰" },
    { title: "程序员工具箱", url: "https://tool.lu", icon: "🛠️" },
    { title: "表格转换", url: "https://tableconvert.com", icon: "📊" },
    { title: "临时邮箱", url: "https://temp-mail.org", icon: "📧" },
    { title: "Snapdrop", url: "https://snapdrop.net", icon: "📤" },
    { title: "奶牛快传", url: "https://cowtransfer.com", icon: "🐮" },
  ];

  const softwareLinks = [
    { title: "423Down", url: "https://www.423down.com", icon: "⬇️" },
    { title: "小众软件", url: "https://www.appinn.com", icon: "💻" },
    { title: "少数派", url: "https://sspai.com", icon: "🔧" },
    { title: "MacWk", url: "https://macwk.com", icon: "🍎" },
    { title: "果核剥壳", url: "https://www.ghxi.com", icon: "🥥" },
    { title: "Chrome插件", url: "https://www.crxsoso.com", icon: "🔌" },
  ];

  const gameLinks = [
    { title: "Steam", url: "https://store.steampowered.com", icon: "🎮" },
    { title: "游侠网", url: "https://www.ali213.net", icon: "⚔️" },
    { title: "3DM", url: "https://www.3dmgame.com", icon: "🎯" },
    { title: "小黑盒", url: "https://www.xiaoheihe.cn", icon: "📦" },
    { title: "游民星空", url: "https://www.gamersky.com", icon: "🌟" },
    { title: "小霸王", url: "https://www.yikm.net", icon: "🕹️" },
  ];

  const animeLinks = [
    { title: "樱花动漫", url: "https://www.yhdm.tv", icon: "🌸" },
    { title: "AGE动漫", url: "https://www.agemys.net", icon: "🎌" },
    { title: "风车动漫", url: "https://www.fengche.co", icon: "🎏" },
    { title: "哔哩哔哩", url: "https://www.bilibili.com", icon: "📺" },
    { title: "ACG饭团", url: "https://www.acgfantuan.com", icon: "🍙" },
    { title: "动漫岛", url: "https://www.dmdm.cc", icon: "🏝️" },
  ];

  const musicLinks = [
    { title: "Listen 1", url: "https://listen1.github.io/listen1", icon: "🎵" },
    { title: "网易云音乐", url: "https://music.163.com", icon: "🎶" },
    { title: "QQ音乐", url: "https://y.qq.com", icon: "🎸" },
    { title: "音悦台", url: "https://www.yinyuetai.com", icon: "🎤" },
    { title: "5sing", url: "https://5sing.kugou.com", icon: "🎧" },
  ];

  const bookLinks = [
    { title: "鸠摩搜书", url: "https://www.jiumodiary.com", icon: "🔍" },
    { title: "笔趣阁", url: "https://www.biquge.com", icon: "📖" },
    { title: "Z-Library", url: "https://zh.zlibrary-global.se", icon: "📚" },
    { title: "微信读书", url: "https://weread.qq.com", icon: "📱" },
    { title: "书格", url: "https://new.shuge.org", icon: "📜" },
  ];

  const studyLinks = [
    { title: "GitHub", url: "https://github.com", icon: "🐙" },
    { title: "Stack Overflow", url: "https://stackoverflow.com", icon: "📚" },
    { title: "SCI-HUB", url: "https://sci-hub.se", icon: "🔬" },
    { title: "Google镜像", url: "https://ac.scmor.com", icon: "🔎" },
    { title: "全历史", url: "https://www.allhistory.com", icon: "📜" },
    { title: "Grammarly", url: "https://www.grammarly.com", icon: "✍️" },
    { title: "DeepL翻译", url: "https://www.deepl.com", icon: "🌐" },
  ];

  const imageLinks = [
    { title: "Unsplash", url: "https://unsplash.com", icon: "📷" },
    { title: "Pexels", url: "https://www.pexels.com", icon: "🖼️" },
    { title: "必应壁纸", url: "https://www.bing.com/images", icon: "🌄" },
    { title: "极简壁纸", url: "https://bz.zzzmh.cn", icon: "🎨" },
    { title: "彼岸壁纸", url: "https://pic.netbian.com", icon: "🖥️" },
  ];

  const cloudLinks = [
    { title: "百度网盘", url: "https://pan.baidu.com", icon: "☁️" },
    { title: "阿里云盘", url: "https://www.aliyundrive.com", icon: "💾" },
    { title: "蓝奏云", url: "https://www.lanzou.com", icon: "📁" },
    { title: "奶牛快传", url: "https://cowtransfer.com", icon: "🐮" },
    { title: "文叔叔", url: "https://www.wenshushu.cn", icon: "👨" },
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
              title="软件" 
              links={softwareLinks}
              icon={<Download className="h-4 w-4 text-white/90" />}
            />
            
            <CategorySection 
              title="游戏" 
              links={gameLinks}
              icon={<Gamepad2 className="h-4 w-4 text-white/90" />}
            />

            <CategorySection 
              title="动漫" 
              links={animeLinks}
              icon={<Tv className="h-4 w-4 text-white/90" />}
            />
            
            <CategorySection 
              title="音乐" 
              links={musicLinks}
              icon={<Music className="h-4 w-4 text-white/90" />}
            />

            <CategorySection 
              title="书架" 
              links={bookLinks}
              icon={<BookOpen className="h-4 w-4 text-white/90" />}
            />
            
            <CategorySection 
              title="学习" 
              links={studyLinks}
              icon={<GraduationCap className="h-4 w-4 text-white/90" />}
            />

            <CategorySection 
              title="图片壁纸" 
              links={imageLinks}
              icon={<Image className="h-4 w-4 text-white/90" />}
            />

            <CategorySection 
              title="云盘" 
              links={cloudLinks}
              icon={<Cloud className="h-4 w-4 text-white/90" />}
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
