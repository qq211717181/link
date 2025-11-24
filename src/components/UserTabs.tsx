import { User, Heart, Clock } from "lucide-react";

const users = [
  "黑灰若山", "国科大科研", "青柠柚子", "小明", "Shy", 
  "球哥", "以西", "小帅", "ChatGPT", "YYDS", "文学"
];

export const UserTabs = () => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8 flex-wrap px-4">
      <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-full">
        <Clock className="h-4 w-4 text-white/80" />
        <span className="text-sm text-white/90">我的足迹</span>
      </div>
      
      {users.map((user, index) => (
        <button
          key={index}
          className="px-4 py-2 glass-card rounded-full text-sm text-white/90 hover:bg-white/20 transition-all duration-200 hover:scale-105"
        >
          {user}
        </button>
      ))}
    </div>
  );
};
