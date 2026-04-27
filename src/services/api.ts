import { DashboardData, Order, Project, Material, OptimizationIssue, User, Permission } from '../types';

const API_URL = (import.meta as any).env.VITE_API_URL || '';

// Simple cache mechanism to speed up repeat reads
const cache: { [key: string]: { data: any, timestamp: number } } = {};
const CACHE_TTL = 15000; // 15 seconds

async function request<T>(action: string, method: 'GET' | 'POST' = 'GET', data?: any): Promise<T> {
  const url = new URL(API_URL);
  // Luôn thêm action vào URL để GAS dễ dàng nhận diện route (cả GET và POST)
  url.searchParams.append('action', action);
  // Thêm timestamp để ngăn chặn caching trên Vercel/CDN
  url.searchParams.append('_v', Date.now().toString());
  
  if (method === 'GET') {
    // Thêm các tham số từ object data vào URL searchParams
    if (data && typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
  }

  const options: RequestInit = {
    method,
    mode: 'cors',
    redirect: 'follow',
    headers: {
      'Accept': 'application/json',
    },
  };

  if (method === 'POST') {
    // Thử bọc data trong trường 'data' - một số script GAS yêu cầu cấu trúc này
    const payload = {
      action: action,
      data: data
    };
      
    options.body = JSON.stringify(payload);
    (options.headers as any)['Content-Type'] = 'text/plain;charset=utf-8';
  }

  try {
    // Không dùng cache: 'no-cache' trong options vì GAS redirect có thể lỗi với nó
    const response = await fetch(url.toString(), options);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Nội dung phản hồi không đọc được');
      throw new Error(`MÃ LỖI ${response.status}: ${response.statusText}\n${errorText}`);
    }
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(`LỖI LOGIC TỪ BACKEND: ${result.error}`);
    }
    
  // Update cache on successful GET
    if (method === 'GET') {
      cache[action] = { data: result, timestamp: Date.now() };
      
      // Lưu vào LocalStorage cho các bảng nghiệp vụ (tránh lưu User/Auth vào cache này)
      const nonSensitiveActions = ['getDashboard', 'getOrders', 'getProjects', 'getCategories', 'getIssues'];
      if (nonSensitiveActions.includes(action)) {
        localStorage.setItem(`vincons_cache_${action}`, JSON.stringify({
          data: result,
          timestamp: Date.now()
        }));
      }
    } else {
      // Clear all cache on any write to ensure data consistency
      Object.keys(cache).forEach(key => delete cache[key]);
    }
    
    return result as T;
  } catch (error: any) {
    let detailMessage = '';
    
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      detailMessage = `LỖI KẾT NỐI (NETWORK ERROR): Không thể kết nối tới ${API_URL}.
Nguyên nhân có thể do:
1. URL sai hoặc Backend chưa chạy.
2. Lỗi CORS (Backend chưa cho phép truy cập).
3. Không có internet.`;
    } else {
      detailMessage = error.message || 'Lỗi không xác định';
    }

    console.error(`[API ERROR - ${action}]:`, error);
    throw new Error(detailMessage);
  }
}

export const api = {
  getDashboard: () => request<DashboardData>('getDashboard'),
  
  getOrders: () => request<Order[]>('getOrders'),
  saveOrder: (data: Partial<Order>) => request<any>('saveOrder', 'POST', data),
  deleteOrder: (id: string) => request<any>('deleteOrder', 'POST', { id }),
  
  getProjects: () => request<Project[]>('getProjects'),
  saveProject: (data: Partial<Project>) => request<any>('saveProject', 'POST', data),
  deleteProject: (id: string) => request<any>('deleteProject', 'POST', { id }),
  
  getCategories: () => request<Material[]>('getCategories'),
  saveCategory: (data: Partial<Material>) => request<any>('saveCategory', 'POST', data),
  deleteCategory: (id: string) => request<any>('deleteCategory', 'POST', { id }),
  
  getIssues: () => request<OptimizationIssue[]>('getIssues'),
  saveIssue: (data: Partial<OptimizationIssue>) => request<any>('saveIssue', 'POST', data),
  deleteIssue: (id: string) => request<any>('deleteIssue', 'POST', { id }),
  
  getUsers: () => request<User[]>('getUsers'),
  saveUser: (data: Partial<User>) => request<any>('saveUser', 'POST', data),
  deleteUser: (id: string) => request<any>('deleteUser', 'POST', { id }),
  
  login: (credentials: { User: string, Pass?: string }) => 
    request<User>('login', 'GET', credentials),
  
  changePassword: (username: string, oldPass: string, newPass: string) => 
    request<any>('changePassword', 'POST', { username, oldPass, newPass }),
  
  getPermissions: () => request<Permission[]>('getPermissions'),

  // Lấy dữ liệu từ bộ nhớ tạm (LocalStorage)
  getLocalCache: <T>(action: string): T | null => {
    const cached = localStorage.getItem(`vincons_cache_${action}`);
    if (cached) {
      try {
        return JSON.parse(cached).data as T;
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};
