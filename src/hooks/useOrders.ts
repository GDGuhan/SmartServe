import { useState, useEffect } from 'react';
import type { Order, OrderStatus } from '@/types';
import { MOCK_ORDERS } from '@/constants/mockData';
import { generateId } from '@/lib/utils';

const ORDERS_KEY = 'smartserve_orders';

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : MOCK_ORDERS;
  } catch {
    return MOCK_ORDERS;
  }
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => {
      const updated = prev.map(o =>
        o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
      );
      saveOrders(updated);
      return updated;
    });
  };

  const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...order,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders(prev => {
      const updated = [newOrder, ...prev];
      saveOrders(updated);
      return updated;
    });
    return newOrder;
  };

  const cancelOrder = (orderId: string) => updateOrderStatus(orderId, 'cancelled');

  return { orders, updateOrderStatus, addOrder, cancelOrder };
}
