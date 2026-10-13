import { useState, useEffect } from 'react';
import type { Table, TableStatus } from '@/types';
import { MOCK_TABLES } from '@/constants/mockData';

const TABLES_KEY = 'smartserve_tables';

function loadTables(): Table[] {
  try {
    const raw = localStorage.getItem(TABLES_KEY);
    return raw ? JSON.parse(raw) : MOCK_TABLES;
  } catch {
    return MOCK_TABLES;
  }
}

function saveTables(tables: Table[]) {
  localStorage.setItem(TABLES_KEY, JSON.stringify(tables));
}

export function useTables() {
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    setTables(loadTables());
  }, []);

  const updateTableStatus = (tableId: string, status: TableStatus, extra?: Partial<Table>) => {
    setTables(prev => {
      const updated = prev.map(t =>
        t.id === tableId ? { ...t, status, ...extra } : t
      );
      saveTables(updated);
      return updated;
    });
  };

  const resetTable = (tableId: string) => {
    setTables(prev => {
      const updated = prev.map(t =>
        t.id === tableId
          ? { id: t.id, number: t.number, capacity: t.capacity, status: 'available' as TableStatus }
          : t
      );
      saveTables(updated);
      return updated;
    });
  };

  return { tables, updateTableStatus, resetTable };
}
