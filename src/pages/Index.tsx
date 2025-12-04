import { SearchBar } from "@/components/SearchBar";
import { CategorySection } from "@/components/CategorySection";

import { Sparkles, Film, Package, Wrench, Gamepad2, Music, GraduationCap, Download, BookOpen, Image, Cloud, Tv, FolderOpen, LogIn, User, Cat } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { bookmarks, auth } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import heroBg from "@/assets/hero-bg.jpg";
import { useToast } from "@/hooks/use-toast";

interface BookmarkFolder {
  id?: number;
  name: string;
  links: Array<{
    title: string;
    url: string;
    icon?: string;
  }>;
}

const Index = () => {
  const [userFolders, setUserFolders] = useState<BookmarkFolder[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [wallpaper, setWallpaper] = useState<string>('');
  const [uiSettings, setUiSettings] = useState<any>(null);
  const [poetry, setPoetry] = useState<string>('');
  const [poetryLoading, setPoetryLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // 本地诗词库作为备选
  const localPoetry = [
    '海内存知己，天涯若比邻',
    '春眠不觉晓，处处闻啼鸟',
    '床前明月光，疑是地上霜',
    '举头望明月，低头思故乡',
    '窗含西岭千秋雪，门泊东吴万里船',
    '两个黄鹂鸣翠柳，一行白鹭上青天',
    '欲穷千里目，更上一层楼',
    '会当凌绝顶，一览众山小',
    '随风潜入夜，润物细无声',
    '野火烧不尽，春风吹又生',
    '不知细叶谁裁出，二月春风似剪刀',
    '等闲识得东风面，万紫千红总是春',
    '竹外桃花三两枝，春江水暖鸭先知',
    '接天莲叶无穷碧，映日荷花别样红',
    '停车坐爱枫林晚，霜叶红于二月花',
    '千山鸟飞绝，万径人踪灭',
    '孤舟蓑笠翁，独钓寒江雪',
    '采菊东篱下，悠然见南山',
    '明月松间照，清泉石上流',
    '空山新雨后，天气晚来秋',
  ];

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
    setWallpaper(currentUser?.wallpaper || '');
    if (currentUser?.ui_settings) {
      setUiSettings(currentUser.ui_settings);
    }

    if (currentUser) {
      fetchUserBookmarks();
    } else {
      setLoading(false);
    }

    // 获取随机诗词
    fetchPoetry();
  }, []);

  const fetchPoetry = async () => {
    try {
      // 使用今日诗词API
      const response = await fetch('https://v1.jinrishici.com/all.json');
      const data = await response.json();
      if (data && data.content) {
        setPoetry(data.content);
      } else {
        // API返回数据格式不对，使用本地随机诗词
        const randomIndex = Math.floor(Math.random() * localPoetry.length);
        setPoetry(localPoetry[randomIndex]);
      }
    } catch (error) {
      // API调用失败，使用本地随机诗词
      console.log('诗词API调用失败，使用本地诗词库');
      const randomIndex = Math.floor(Math.random() * localPoetry.length);
      setPoetry(localPoetry[randomIndex]);
    } finally {
      setPoetryLoading(false);
    }
  };

  const fetchUserBookmarks = async () => {
    try {
      const response = await bookmarks.getAll();
      setUserFolders(response.data);
    } catch (error) {
      console.error("获取书签失败", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = async (categoryId: number, link: any) => {
    try {
      await bookmarks.addLink(categoryId, link);
      toast({ title: "添加成功" });
      fetchUserBookmarks();
    } catch (error) {
      console.error("添加链接失败", error);
      toast({ title: "添加失败", variant: "destructive" });
    }
  };

  const handleDeleteLink = async (link: any) => {
    if (!link.id) return;
    if (!window.confirm(`确定要删除链接 "${link.title}" 吗？`)) return;

    try {
      await bookmarks.deleteLink(link.id);
      toast({ title: "删除成功" });
      fetchUserBookmarks();
    } catch (error) {
      console.error("删除链接失败", error);
      toast({ title: "删除失败", variant: "destructive" });
    }
  };

  // 默认数据 (仅在未登录或无数据时显示)
  const defaultAiLinks = [
    { title: "ChatGPT免费", url: "https://chatgpt.com", icon: "🤖" },
    { title: "Claude", url: "https://claude.ai", icon: "🎯" },
    { title: "Midjourney", url: "https://midjourney.com", icon: "🎨" },
    { title: "文心一言", url: "https://yiyan.baidu.com", icon: "💬" },
    { title: "通义千问", url: "https://tongyi.aliyun.com", icon: "🌟" },
    { title: "Poe", url: "https://poe.com", icon: "💡" },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${getImageUrl(wallpaper) || heroBg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="pt-8 pb-8 px-8 flex justify-between items-start">
          <div className="flex-1 text-center">
            <h1 className="text-5xl font-bold text-white mb-3 text-shadow">iLinks</h1>
            {!poetryLoading && poetry && (
              <p className="text-white/80 text-lg text-shadow animate-in fade-in duration-500">
                {poetry}
              </p>
            )}
          </div>

          <div className="absolute right-8 top-8">
            {user ? (
              <Link to="/admin">
                <Button variant="ghost" className="bg-transparent text-white/80 hover:text-white hover:bg-white/10 border-none">
                  <Cat className="h-4 w-4 mr-2" />
                  管理后台
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <LogIn className="h-4 w-4 mr-2" />
                  登录/注册
                </Button>
              </Link>
            )}
          </div>
        </header>

        {/* Search Bar */}
        <div className="px-4 mb-12">
          <SearchBar styleSettings={uiSettings?.searchBar} />
        </div>

        {/* User Tabs */}


        {/* Categories */}
        <div className="container mx-auto px-4 pb-20 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {user && userFolders.map((folder: any, index) => (
              <CategorySection
                key={`user-${folder.id || index}`}
                title={folder.name}
                links={folder.links}
                icon={<Cat className="h-4 w-4 text-white/60" />}
                styleSettings={uiSettings?.category}
                isEditable={true}
                showDelete={false}
                onAddLink={(link) => handleAddLink(folder.id, link)}
                onDeleteLink={handleDeleteLink}
              />
            ))}

            {/* 如果未登录，显示默认分类示例 */}
            {!user && (
              <>
                <CategorySection
                  title="AI (示例)"
                  links={defaultAiLinks}
                  icon={<Sparkles className="h-4 w-4 text-white/90" />}
                />
                <div className="col-span-full text-center py-8">
                  <p className="text-white/60">登录后可创建属于您自己的书签主页</p>
                </div>
              </>
            )}

            {/* 如果已登录但没有数据 */}
            {user && userFolders.length === 0 && !loading && (
              <div className="col-span-full text-center py-12">
                <p className="text-white/60 mb-4">暂无书签</p>
                <Link to="/admin">
                  <Button variant="secondary">去导入书签</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pb-8 text-white/60 text-sm">
        </footer>
      </div>
    </div>
  );
};

export default Index;
