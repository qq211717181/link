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
        <div className="space-y-1">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition-all duration-200"
            >
              {link.icon && (
                <span className="text-base flex-shrink-0">{link.icon}</span>
              )}
              <span className="text-sm text-white/80 group-hover:text-white flex-1">
                {link.title}
              </span>
              <ExternalLink className="h-3 w-3 text-white/40 group-hover:text-white/60 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
