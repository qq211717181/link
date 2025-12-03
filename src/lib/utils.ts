import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 辅助函数：将相对路径转换为完整URL
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '';

  // 如果已经是完整URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // 如果是相对路径（上传的文件），添加服务器地址
  if (path.startsWith('/uploads/')) {
    const apiUrl = import.meta.env?.VITE_API_URL?.trim();
    if (apiUrl) {
      // 移除 /api 后缀
      const baseUrl = apiUrl.replace(/\/api\/?$/, '');
      return `${baseUrl}${path}`;
    }

    // 开发环境默认使用 localhost:3001
    if (typeof window !== 'undefined') {
      const { protocol, hostname } = window.location;
      return `${protocol}//${hostname}:3001${path}`;
    }

    return `http://localhost:3001${path}`;
  }

  return path;
};

