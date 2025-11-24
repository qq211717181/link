import { User, Heart, Clock } from "lucide-react";

const users = [
  "黑灰若山", "国科大科研", "青柠柚子", "小明", "Shy", 
  "球哥", "以西", "小帅", "ChatGPT", "YYDS", "文学"
];

export const UserTabs = () => {
  return (
    <div className="flex items-center justify-center gap-2 mb-6 flex-wrap px-4">
      <button className="px-3 py-1.5 glass-card rounded-md text-xs text-white/90 hover:bg-white/15 transition-all duration-200">
        首页
      </button>
      
      {users.map((user, index) => (
        <button
          key={index}
          className="px-3 py-1.5 glass-card rounded-md text-xs text-white/80 hover:bg-white/15 hover:text-white/95 transition-all duration-200"
        >
          {user}
        </button>
      ))}
    </div>
  );
};
