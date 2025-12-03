import { X, Plus, Trash2, GripVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Link {
  id?: number;
  title: string;
  url: string;
  icon?: string;
}

interface CategorySectionProps {
  title: string;
  links: Link[];
  icon?: React.ReactNode;
  isDraggable?: boolean;
  isEditable?: boolean;
  onAddLink?: (link: Link) => void;
  onDeleteLink?: (link: Link) => void;
  styleSettings?: {
    borderRadius?: number;
    blur?: number;
    opacity?: number;
  };
}

export const CategorySection = ({
  title,
  links,
  icon,
  isDraggable = false,
  isEditable = false,
  onAddLink,
  onDeleteLink,
  styleSettings
}: CategorySectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [categoryLinks, setCategoryLinks] = useState<Link[]>(links);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkIcon, setNewLinkIcon] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sync links prop with local state
  useEffect(() => {
    setCategoryLinks(links);
  }, [links]);

  const handleAddLink = () => {
    if (newLinkTitle && newLinkUrl) {
      const newLink = {
        title: newLinkTitle,
        url: newLinkUrl,
        icon: newLinkIcon || "🔗"
      };

      if (onAddLink) {
        onAddLink(newLink);
      } else {
        setCategoryLinks([...categoryLinks, newLink]);
      }

      setNewLinkTitle("");
      setNewLinkUrl("");
      setNewLinkIcon("");
      setIsDialogOpen(false);
    }
  };

  const handleDeleteLink = (link: Link, index: number) => {
    if (onDeleteLink) {
      onDeleteLink(link);
    } else {
      setCategoryLinks(categoryLinks.filter((_, i) => i !== index));
    }
  };

  return (
    <div
      className="glass-card p-5 transition-all duration-300"
      style={{
        borderRadius: styleSettings?.borderRadius !== undefined ? `${styleSettings.borderRadius}px` : '0.75rem',
        background: `linear-gradient(135deg, rgba(255, 255, 255, ${(styleSettings?.opacity ?? 10) / 100}) 0%, rgba(255, 255, 255, ${(styleSettings?.opacity ?? 5) / 100}) 100%)`,
        backdropFilter: `blur(${styleSettings?.blur ?? 12}px)`,
        WebkitBackdropFilter: `blur(${styleSettings?.blur ?? 12}px)`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isDraggable && (
            <GripVertical className="h-4 w-4 text-white/50 cursor-move" />
          )}
          {icon}
          <h2 className="text-lg font-bold text-white text-shadow">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditable && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="添加标签"
                >
                  <Plus className="h-4 w-4 text-white/70" />
                </button>
              </DialogTrigger>
              <DialogContent className="glass-card-strong border-white/20 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">添加新标签</DialogTitle>
                  <DialogDescription className="text-white/60">
                    为 {title} 分类添加一个新的链接标签
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm text-white/80">标签名称</label>
                    <Input
                      value={newLinkTitle}
                      onChange={(e) => setNewLinkTitle(e.target.value)}
                      placeholder="输入标签名称"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/80">链接地址</label>
                    <Input
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/80">图标 (emoji)</label>
                    <Input
                      value={newLinkIcon}
                      onChange={(e) => setNewLinkIcon(e.target.value)}
                      placeholder="🔗"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAddLink}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    添加
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="折叠/展开"
          >
            <X className={`h-4 w-4 text-white/70 transition-transform duration-300 ${isExpanded ? 'rotate-0' : 'rotate-45'}`} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-3 gap-2">
          {categoryLinks.map((link, index) => (
            <div
              key={index}
              className="group relative flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-white/10 transition-all duration-200"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 flex-1 min-w-0"
              >
                {link.icon && (
                  <>
                    {link.icon.startsWith('http') || link.icon.startsWith('data:image') ? (
                      <img
                        src={link.icon}
                        alt=""
                        className="w-4 h-4 flex-shrink-0 rounded"
                        onError={(e) => {
                          // 如果图片加载失败，显示默认图标
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-sm flex-shrink-0">{link.icon}</span>
                    )}
                  </>
                )}
                <span className="text-xs text-white/80 group-hover:text-white truncate">
                  {link.title}
                </span>
              </a>
              {isEditable && (
                <button
                  onClick={() => handleDeleteLink(link, index)}
                  className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-0.5 hover:bg-red-500/20 rounded transition-all"
                  title="删除标签"
                >
                  <Trash2 className="h-3 w-3 text-red-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
