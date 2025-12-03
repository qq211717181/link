import { SearchBar } from "@/components/SearchBar";
import { CategorySection } from "@/components/CategorySection";

import { Sparkles, Film, Package, Wrench, Gamepad2, Music, GraduationCap, Download, BookOpen, Image, Cloud, Tv, FolderOpen, LogIn, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { bookmarks, auth } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import heroBg from "@/assets/hero-bg.jpg";

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
  }, []);

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
            <p className="text-white/80 text-lg text-shadow">海内存知己，天涯若比邻</p>
          </div>

          <div className="absolute right-8 top-8">
            {user ? (
              <Link to="/admin">
                <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <User className="h-4 w-4 mr-2" />
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
                icon={<FolderOpen className="h-4 w-4 text-white/90" />}
                styleSettings={uiSettings?.category}
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
