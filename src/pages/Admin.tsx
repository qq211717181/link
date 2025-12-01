import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { bookmarks, auth } from "@/lib/api";
import { BookmarkImporter } from "@/components/BookmarkImporter";
import { CategorySection } from "@/components/CategorySection";
import { LogOut, Home, FolderOpen, Trash2, Image as ImageIcon } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface BookmarkFolder {
    name: string;
    links: Array<{
        title: string;
        url: string;
        icon?: string;
    }>;
}

const Admin = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [wallpaper, setWallpaper] = useState<string>('');
    const [wallpaperInput, setWallpaperInput] = useState<string>('');
    const navigate = useNavigate();
    const { toast } = useToast();
    const user = auth.getCurrentUser();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookmarks();
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await auth.getUserInfo();
            setWallpaper(response.data.wallpaper || '');
            setWallpaperInput(response.data.wallpaper || '');
        } catch (error) {
            console.error("获取用户信息失败", error);
        }
    };

    const fetchBookmarks = async () => {
        try {
            const response = await bookmarks.getAll();
            setCategories(response.data);
        } catch (error) {
            console.error("获取书签失败", error);
            toast({
                title: "获取数据失败",
                description: "无法加载书签数据",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (folders: BookmarkFolder[]) => {
        try {
            const importData = folders.map(folder => ({
                name: folder.name,
                links: folder.links
            }));

            await bookmarks.importBookmarks({ categories: importData });

            toast({
                title: "导入成功",
                description: `成功导入 ${folders.length} 个文件夹`,
            });

            fetchBookmarks();
        } catch (error) {
            console.error("导入失败", error);
            toast({
                title: "导入失败",
                description: "服务器处理请求时出错",
                variant: "destructive",
            });
        }
    };

    const handleClear = async () => {
        if (!window.confirm("警告：这将清空您的所有分类和书签数据，且无法恢复！\n\n确定要继续吗？")) {
            return;
        }

        try {
            await bookmarks.deleteAll();
            setCategories([]);
            toast({
                title: "数据已清空",
                description: "所有分类和书签已删除",
            });
        } catch (error) {
            console.error("清空失败", error);
            toast({
                title: "操作失败",
                description: "清空数据时出现错误",
                variant: "destructive",
            });
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!window.confirm("确定要删除这个分类吗？")) return;

        try {
            await bookmarks.deleteCategory(id);
            setCategories(categories.filter(c => c.id !== id));
            toast({
                title: "删除成功",
            });
        } catch (error) {
            toast({
                title: "删除失败",
                variant: "destructive",
            });
        }
    };

    const handleLogout = () => {
        auth.logout();
        navigate('/login');
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newCategories = [...categories];
        const draggedItem = newCategories[draggedIndex];
        newCategories.splice(draggedIndex, 1);
        newCategories.splice(index, 0, draggedItem);

        setCategories(newCategories);
        setDraggedIndex(index);
    };

    const handleDragEnd = async () => {
        setDraggedIndex(null);
        try {
            const categoriesToUpdate = categories.map((c, index) => ({
                id: c.id,
                position: index
            }));
            await bookmarks.reorderCategories(categoriesToUpdate);
        } catch (error) {
            console.error("更新顺序失败", error);
            toast({
                title: "更新顺序失败",
                variant: "destructive",
            });
        }
    };

    const handleAddLink = async (categoryId: number, link: any) => {
        try {
            await bookmarks.addLink(categoryId, link);
            toast({ title: "添加成功" });
            fetchBookmarks();
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
            fetchBookmarks();
        } catch (error) {
            console.error("删除链接失败", error);
            toast({ title: "删除失败", variant: "destructive" });
        }
    };

    const handleWallpaperSave = async () => {
        try {
            await auth.updateWallpaper(wallpaperInput);
            setWallpaper(wallpaperInput);

            const currentUser = auth.getCurrentUser();
            if (currentUser) {
                localStorage.setItem('user', JSON.stringify({
                    ...currentUser,
                    wallpaper: wallpaperInput
                }));
            }

            toast({ title: "壁纸更新成功" });
        } catch (error) {
            console.error("更新壁纸失败", error);
            toast({ title: "更新壁纸失败", variant: "destructive" });
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">加载中...</div>;
    }

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed relative"
            style={{ backgroundImage: `url(${wallpaper || heroBg})` }}
        >
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-10 container mx-auto px-4 py-8">
                <header className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-white">后台管理</h1>
                        <span className="text-white/60">欢迎, {user?.username}</span>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/">
                            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                                <Home className="h-4 w-4 mr-2" />
                                返回首页
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            onClick={handleLogout}
                            className="bg-red-500/80 hover:bg-red-600"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            退出登录
                        </Button>
                    </div>
                </header>

                {/* Wallpaper Settings */}
                <div className="glass-card rounded-xl p-8 mb-12">
                    <h2 className="text-xl font-bold text-white mb-6">壁纸设置</h2>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-sm text-white/80 mb-2 block">壁纸图片 URL</label>
                            <Input
                                value={wallpaperInput}
                                onChange={(e) => setWallpaperInput(e.target.value)}
                                placeholder="https://example.com/wallpaper.jpg"
                                className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                            />
                        </div>
                        <Button
                            onClick={handleWallpaperSave}
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                        >
                            <ImageIcon className="h-4 w-4 mr-2" />
                            保存壁纸
                        </Button>
                    </div>
                    <p className="text-white/50 text-sm mt-3">提示：输入图片 URL 后点击保存，主页和管理页将使用新壁纸。留空则使用默认壁纸。</p>
                </div>

                {/* Import and Actions Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="md:col-span-2 glass-card rounded-xl p-8">
                        <h2 className="text-xl font-bold text-white mb-6">书签导入</h2>
                        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-lg bg-white/5">
                            <p className="text-white/70 mb-6 text-center">
                                导入 Chrome/Edge 书签 HTML 文件。导入的书签将显示在您的个人主页上。
                            </p>
                            <BookmarkImporter
                                onImport={handleImport}
                                onClear={() => { }} // BookmarkImporter 自带的清空只是清空预览，这里不需要传递
                                hasImportedBookmarks={false}
                            />
                        </div>
                    </div>

                    <div className="glass-card rounded-xl p-8 flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-4">数据管理</h2>
                            <p className="text-white/60 text-sm mb-6">
                                这里的操作将影响您的所有书签数据，请谨慎操作。
                            </p>
                        </div>

                        <Button
                            variant="destructive"
                            onClick={handleClear}
                            className="w-full bg-red-500/20 hover:bg-red-500/40 text-red-100 border border-red-500/50"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            清空所有数据
                        </Button>
                    </div>
                </div>

                {/* Manage Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white mb-6">分类管理 (可拖拽排序)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category, index) => (
                            <div
                                key={category.id}
                                className={`relative group transition-all duration-200 ${draggedIndex === index ? 'opacity-50 scale-95' : 'opacity-100'
                                    }`}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                            >
                                <CategorySection
                                    title={category.name}
                                    links={category.links}
                                    icon={<FolderOpen className="h-4 w-4 text-white/90" />}
                                    isDraggable={true}
                                    isEditable={true}
                                    onAddLink={(link) => handleAddLink(category.id, link)}
                                    onDeleteLink={(link) => handleDeleteLink(link)}
                                />
                                <button
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="absolute top-5 right-14 p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    title="删除分类"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <div className="col-span-full text-center py-12 text-white/40">
                                暂无书签数据，请导入或添加
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
