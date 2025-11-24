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
    <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xl font-bold text-white text-shadow">{title}</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className={`h-5 w-5 text-white transition-transform duration-300 ${isExpanded ? 'rotate-0' : 'rotate-45'}`} />
        </button>
      </div>
      
      {isExpanded && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 transition-all duration-200"
            >
              {link.icon && (
                <span className="text-lg flex-shrink-0">{link.icon}</span>
              )}
              <span className="text-sm text-white/90 group-hover:text-white truncate flex-1">
                {link.title}
              </span>
              <ExternalLink className="h-3 w-3 text-white/50 group-hover:text-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
