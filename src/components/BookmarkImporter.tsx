import { Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BookmarkFolder {
    name: string;
    links: Array<{
        title: string;
        url: string;
        icon?: string;
    }>;
}

interface BookmarkImporterProps {
    onImport: (folders: BookmarkFolder[]) => void;
    onClear: () => void;
    hasImportedBookmarks: boolean;
}

export const BookmarkImporter = ({ onImport, onClear, hasImportedBookmarks }: BookmarkImporterProps) => {
    const { toast } = useToast();

    const parseBookmarkHTML = (html: string): BookmarkFolder[] => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const folders: BookmarkFolder[] = [];

        // 从 URL 提取域名并生成 favicon URL
        const getFaviconUrl = (url: string): string => {
            try {
                const urlObj = new URL(url);
                // 使用 Google 的 favicon 服务
                return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
            } catch {
                return '';
            }
        };

        // 递归查找所有书签文件夹
        const processFolder = (dtElement: Element): BookmarkFolder | null => {
            const h3 = dtElement.querySelector(':scope > H3');
            if (!h3) return null;

            const folderName = h3.textContent?.trim() || '未命名文件夹';
            const links: Array<{ title: string; url: string; icon?: string }> = [];

            // 查找该 DT 下的 DL（包含书签列表）
            const dl = dtElement.querySelector(':scope > DL');
            if (!dl) return null;

            // 查找所有直接子 DT 元素
            const childDTs = dl.querySelectorAll(':scope > DT');

            childDTs.forEach((childDT) => {
                // 检查是否是链接（包含 A 标签）
                const anchor = childDT.querySelector(':scope > A');
                if (anchor) {
                    const title = anchor.textContent?.trim() || '未命名链接';
                    const url = anchor.getAttribute('href') || '';

                    if (url) {
                        // 尝试从 ICON 属性获取图标
                        const iconAttr = anchor.getAttribute('ICON') || anchor.getAttribute('icon');
                        let icon = '';

                        // 如果有 ICON 属性且是 data URI，使用它
                        if (iconAttr && iconAttr.startsWith('data:image')) {
                            icon = iconAttr;
                        } else {
                            // 否则使用 Google favicon 服务
                            icon = getFaviconUrl(url);
                        }

                        links.push({
                            title,
                            url,
                            icon
                        });
                    }
                }
                // 如果是子文件夹（包含 H3），递归处理
                else {
                    const subFolder = processFolder(childDT);
                    if (subFolder && subFolder.links.length > 0) {
                        folders.push(subFolder);
                    }
                }
            });

            if (links.length > 0) {
                return { name: folderName, links };
            }

            return null;
        };

        // 从文档中查找所有顶级 DT 元素
        const allDTs = doc.querySelectorAll('DL > DT');

        allDTs.forEach((dt) => {
            const folder = processFolder(dt);
            if (folder) {
                folders.push(folder);
            }
        });

        return folders;
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const html = e.target?.result as string;
                const folders = parseBookmarkHTML(html);

                if (folders.length === 0) {
                    toast({
                        title: "导入失败",
                        description: "未找到有效的书签文件夹",
                        variant: "destructive",
                    });
                    return;
                }

                onImport(folders);
                toast({
                    title: "导入成功",
                    description: `成功导入 ${folders.length} 个书签文件夹`,
                });
            } catch (error) {
                console.error('解析书签文件失败:', error);
                toast({
                    title: "导入失败",
                    description: "无法解析书签文件，请确保文件格式正确",
                    variant: "destructive",
                });
            }
        };

        reader.readAsText(file);
        // 重置 input，允许重复选择同一文件
        event.target.value = '';
    };

    const handleClear = () => {
        onClear();
        toast({
            title: "清除成功",
            description: "已清除所有导入的书签",
        });
    };

    return (
        <div className="flex items-center justify-center gap-3">
            <label htmlFor="bookmark-upload">
                <Button
                    type="button"
                    variant="outline"
                    className="glass-card-strong border-white/30 text-white hover:bg-white/20 cursor-pointer"
                    onClick={() => document.getElementById('bookmark-upload')?.click()}
                >
                    <Upload className="h-4 w-4 mr-2" />
                    导入谷歌书签
                </Button>
            </label>
            <input
                id="bookmark-upload"
                type="file"
                accept=".html,.htm"
                onChange={handleFileUpload}
                className="hidden"
            />

            {hasImportedBookmarks && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="glass-card-strong border-red-500/30 text-red-400 hover:bg-red-500/20"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            清除导入的书签
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-card-strong border-white/20 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">确认清除</AlertDialogTitle>
                            <AlertDialogDescription className="text-white/70">
                                此操作将删除所有导入的书签文件夹。此操作无法撤销。
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                                取消
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleClear}
                                className="bg-red-500/80 hover:bg-red-500 text-white"
                            >
                                确认清除
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
};
