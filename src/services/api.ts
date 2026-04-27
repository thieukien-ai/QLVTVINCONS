import { DashboardData, Order, Project, Material, OptimizationIssue, User, Permission } from '../types';

const API_URL = (import.meta as any).env.VITE_API_URL || '';

async function request<T>(action: string, method: 'GET' | 'POST' = 'GET', data?: any): Promise<T> {
  const url = new URL(API_URL);
  if (method === 'GET') {
    url.searchParams.append('action', action);
  }

  const options: RequestInit = {
    method,
    mode: 'cors',
  };

  if (method === 'POST') {
    options.body = JSON.stringify({ action, data });
  }

  const response = await fetch(url.toString(), options);
  if (!response.ok) throw new Error('API request failed');
  return response.json();
}

export const api = {
  getDashboard: () => request<DashboardData>('getDashboard'),
  getOrders: () => request<Order[]>('getOrders'),
  saveOrder: (data: Partial<Order>) => request<any>('saveOrder', 'POST', data),
  getProjects: () => request<Project[]>('getProjects'),
  saveProject: (data: Partial<Project>) => request<any>('saveProject', 'POST', data),
  getCategories: () => request<Material[]>('getCategories'),
  saveCategory: (data: Partial<Material>) => request<any>('saveCategory', 'POST', data),
  getIssues: () => request<OptimizationIssue[]>('getIssues'),
  saveIssue: (data: Partial<OptimizationIssue>) => request<any>('saveIssue', 'POST', data),
  getUsers: () => request<User[]>('getUsers'),
  getPermissions: () => request<Permission[]>('getPermissions'),
};
