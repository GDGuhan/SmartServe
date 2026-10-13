export type UserRole = 'admin' | 'staff' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  reservedBy?: string;
  reservedAt?: string;
  currentOrderId?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  customerId?: string;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  estimatedTime?: number;
}

export type MenuCategory = 'starters' | 'mains' | 'desserts' | 'beverages' | 'specials';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  available: boolean;
  preparationTime: number;
  calories?: number;
  tags?: string[];
  rating?: number;
}

export interface Feedback {
  id: string;
  orderId?: string;
  tableNumber?: number;
  customerName: string;
  rating: number;
  foodRating: number;
  serviceRating: number;
  ambianceRating: number;
  comment: string;
  createdAt: string;
}

export interface WasteEntry {
  id: string;
  date: string;
  item: string;
  quantity: number;
  unit: string;
  reason: string;
  cost: number;
}

export interface Reservation {
  id: string;
  tableId: string;
  tableNumber: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  partySize: number;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
}
