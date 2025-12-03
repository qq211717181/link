import axios from 'axios';

const stripTrailingSlash = (url: string) => url.replace(/\/+$/, '');

const resolveApiBaseUrl = () => {
    const envUrl = import.meta.env?.VITE_API_URL?.trim();
    if (envUrl) {
        return stripTrailingSlash(envUrl);
    }

    if (typeof window !== 'undefined') {
        const { origin } = window.location;
        return `${stripTrailingSlash(origin)}/api`;
    }

    return 'http://localhost:3001/api';
};

const API_URL = resolveApiBaseUrl();

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器：添加 Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 响应拦截器：处理 401 错误
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // 可以选择重定向到登录页，或者由组件处理
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const auth = {
    login: (data: any) => api.post('/auth/login', data),
    register: (data: any) => api.post('/auth/register', data),
    getUserInfo: () => api.get('/auth/me'),
    uploadWallpaper: (file: File) => {
        const formData = new FormData();
        formData.append('wallpaper', file);
        return api.post('/auth/wallpaper/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    updateWallpaper: (wallpaper: string) => api.put('/auth/wallpaper', { wallpaper }),
    updateUiSettings: (settings: any) => api.put('/auth/ui-settings', { ui_settings: settings }),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};

export const bookmarks = {
    getAll: () => api.get('/bookmarks'),
    createCategory: (data: any) => api.post('/bookmarks/categories', data),
    updateCategory: (id: number, data: any) => api.put(`/bookmarks/categories/${id}`, data),
    deleteCategory: (id: number) => api.delete(`/bookmarks/categories/${id}`),
    importBookmarks: (data: any) => api.post('/bookmarks/import', data),
    addLink: (categoryId: number, data: any) => api.post(`/bookmarks/categories/${categoryId}/links`, data),
    updateLink: (id: number, data: any) => api.put(`/bookmarks/links/${id}`, data),
    deleteLink: (id: number) => api.delete(`/bookmarks/links/${id}`),
    reorderCategories: (categories: any[]) => api.put('/bookmarks/categories/reorder', { categories }),
    deleteAll: () => api.delete('/bookmarks/all'),
};

export default api;
