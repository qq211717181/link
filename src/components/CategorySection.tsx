import { ExternalLink, X } from "lucide-react";
import { useState } from "react";

interface Link {
  title: string;
  url: string;
  icon?: string;
}

interface CategorySectionProps {
  title: string;
  links: Link[];
  icon?: React.ReactNode;
}

export const CategorySection = ({ title, links, icon }: CategorySectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="glass-card rounded-xl p-5 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-bold text-white text-shadow">{title}</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <X className={`h-4 w-4 text-white/70 transition-transform duration-300 ${isExpanded ? 'rotate-0' : 'rotate-45'}`} />
        </button>
      </div>
      
      {isExpanded && (
        <div className="grid grid-cols-3 gap-2">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-white/10 transition-all duration-200"
            >
              {link.icon && (
                <span className="text-sm flex-shrink-0">{link.icon}</span>
              )}
              <span className="text-xs text-white/80 group-hover:text-white truncate">
                {link.title}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
