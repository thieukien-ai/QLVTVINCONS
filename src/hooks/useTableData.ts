import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useTableData<T extends { id?: string | number; ID?: string | number }>(
  action: string,
  fetchFn: () => Promise<T[]>,
  saveFn: (data: Partial<T>) => Promise<any>
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  // 1. Tải dữ liệu ban đầu
  const loadData = useCallback(async (useCache = true) => {
    if (useCache) {
      const cached = api.getLocalCache<T[]>(action);
      if (cached) {
        setData(cached);
        setLoading(false);
      }
    }

    try {
      const remoteData = await fetchFn();
      setData(remoteData);
    } catch (error) {
      console.error(`Error fetching ${action}:`, error);
    } finally {
      setLoading(false);
    }
  }, [action, fetchFn]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Ghi log thao tác vào cache (csv-like logs)
  const logAction = (op: 'CREATE' | 'UPDATE' | 'DELETE', item: any) => {
    const logKey = `vincons_logs_${action}`;
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp},${op},${item.ID || item.id || 'NEW'}\n`;
    
    const existingLogs = localStorage.getItem(logKey) || 'timestamp,operation,item_id\n';
    localStorage.setItem(logKey, existingLogs + logEntry);
  };

  // 2. Chỉnh sửa tạm thời trên Memory (Offline state)
  const updateOffline = (updatedItem: T) => {
    logAction((updatedItem.ID || updatedItem.id) ? 'UPDATE' : 'CREATE', updatedItem);
    setData(prev => {
      const id = updatedItem.ID || updatedItem.id;
      const idx = prev.findIndex(item => (item.ID || item.id) === id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = updatedItem;
        return next;
      }
      return [updatedItem, ...prev];
    });
    setIsDirty(true);
  };

  // 3. Hoàn tác (Tải lại từ cache LocalStorage và xóa log phiên hiện tại)
  const undo = () => {
    const cached = api.getLocalCache<T[]>(action);
    if (cached) {
      setData(cached);
      setIsDirty(false);
      localStorage.removeItem(`vincons_logs_${action}`);
    } else {
      loadData(false);
    }
  };

  // 4. Lưu thực sự lên Server
  const commit = async (item: T) => {
    try {
      await saveFn(item);
      logAction('COMMIT', item);
      setIsDirty(false);
      // Xóa log sau khi commit thành công
      localStorage.removeItem(`vincons_logs_${action}`);
      await loadData(false);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return { 
    data, 
    setData,
    loading, 
    isDirty, 
    updateOffline, 
    undo, 
    commit, 
    refresh: () => loadData(false) 
  };
}
